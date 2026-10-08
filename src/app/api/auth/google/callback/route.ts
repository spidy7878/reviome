import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { encryptToken } from "@/lib/crypto";

export const dynamic = "force-dynamic";

/**
 * Creates a redirect response that clears the OAuth state cookie.
 */
function createRedirectResponse(destinationUrl: string, request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(destinationUrl, request.url));
  response.cookies.set("gbp_oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

/**
 * Timing-safe comparison of two strings using SHA-256 digests
 * to prevent timing leaks without throwing on length mismatches.
 */
function timingSafeMatch(a: string, b: string): boolean {
  if (!a || !b) {
    return false;
  }
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function GET(request: NextRequest) {
  // 1. Verify Reviome authenticated session (Integration link, NOT Reviome login)
  const session = await auth();

  if (!session?.user?.id) {
    return createRedirectResponse("/login", request);
  }

  // Resolve merchant's Business strictly from authenticated session
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user || !user.business) {
    return createRedirectResponse("/login", request);
  }

  // 2. Validate Google query parameters
  const searchParams = request.nextUrl.searchParams;
  const errorParam = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (errorParam) {
    return createRedirectResponse("/dashboard/profile?google_error=denied", request);
  }

  if (!code || !state) {
    return createRedirectResponse("/dashboard/profile?google_error=invalid_request", request);
  }

  // 3. Verify OAuth state from HTTP-only cookie using timing-safe comparison
  const savedState = request.cookies.get("gbp_oauth_state")?.value;

  if (!savedState || !timingSafeMatch(savedState, state)) {
    return createRedirectResponse("/dashboard/profile?google_error=state_mismatch", request);
  }

  // 4. Validate server environment configuration
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!clientId || !clientSecret || !nextAuthUrl) {
    return createRedirectResponse("/dashboard/profile?google_error=config_error", request);
  }

  const baseUrl = nextAuthUrl.replace(/\/+$/, "");
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // 5. Exchange authorization code for tokens
  let tokenData: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
  };

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenRes.ok) {
      return createRedirectResponse("/dashboard/profile?google_error=token_exchange_failed", request);
    }

    tokenData = await tokenRes.json();
  } catch {
    return createRedirectResponse("/dashboard/profile?google_error=network_error", request);
  }

  // 6. Validate token response
  if (!tokenData.access_token) {
    return createRedirectResponse("/dashboard/profile?google_error=missing_access_token", request);
  }

  if (!tokenData.refresh_token) {
    // Google did not return a refresh token (offline access not granted)
    return createRedirectResponse("/dashboard/profile?google_error=missing_refresh_token", request);
  }

  // 7. Encrypt refresh token using AES-256-GCM
  let encryptedRefreshToken: string;
  try {
    encryptedRefreshToken = encryptToken(tokenData.refresh_token);
  } catch {
    return createRedirectResponse("/dashboard/profile?google_error=encryption_error", request);
  }

  const rawExpiresIn = tokenData.expires_in;
  const expiresInSeconds =
    typeof rawExpiresIn === "number"
      ? rawExpiresIn
      : typeof rawExpiresIn === "string"
      ? parseInt(rawExpiresIn, 10) || 3600
      : 3600;

  const tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  // 8. Save credentials to merchant's Business record
  try {
    await db.business.update({
      where: { id: user.business.id },
      data: {
        googleAccessToken: tokenData.access_token,
        googleRefreshToken: encryptedRefreshToken,
        googleTokenExpiresAt: tokenExpiresAt,
        googleConnectedAt: new Date(),
      },
    });
  } catch {
    console.error("[Google OAuth Callback] Database error saving credentials");
    return createRedirectResponse("/dashboard/profile?google_error=database_error", request);
  }

  // 9. Redirect to profile with safe success flag
  return createRedirectResponse("/dashboard/profile?google=connected", request);
}
