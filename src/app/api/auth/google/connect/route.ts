import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Verify merchant authentication via Reviome Auth.js session
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Resolve the merchant's business strictly from session identity
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user || !user.business) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 3. Validate server environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!clientId) {
    return NextResponse.json(
      { error: "Server configuration error: GOOGLE_CLIENT_ID is not configured." },
      { status: 500 }
    );
  }

  if (!nextAuthUrl) {
    return NextResponse.json(
      { error: "Server configuration error: NEXTAUTH_URL is not configured." },
      { status: 500 }
    );
  }

  // 4. Generate cryptographically secure state for CSRF mitigation
  const state = crypto.randomBytes(32).toString("hex");

  // 5. Build Google OAuth authorization URL
  const baseUrl = nextAuthUrl.replace(/\/+$/, "");
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage",
    access_type: "offline",
    prompt: "consent",
    state: state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // 6. Create redirect response and set secure, HTTP-only state cookie
  const response = NextResponse.redirect(authUrl);

  response.cookies.set("gbp_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
