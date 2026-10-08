import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  fetchGoogleAccounts,
  getValidGoogleAccessToken,
  refreshGoogleAccessToken,
  GoogleAuthExpiredError,
} from "@/lib/google-business-profile";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Verify Reviome merchant authentication
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Resolve merchant's Business strictly from session identity
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user || !user.business) {
    return NextResponse.json(
      { error: "Business not found for authenticated user" },
      { status: 404 }
    );
  }

  // 3. Obtain a valid, fresh Google access token (auto-refreshes if expired)
  let accessToken: string;
  try {
    accessToken = await getValidGoogleAccessToken(user.business.id);
  } catch (error) {
    if (error instanceof GoogleAuthExpiredError) {
      return NextResponse.json(
        {
          error: "google_auth_expired",
          message: "Google authorization expired or revoked. Please reconnect.",
        },
        { status: 401 }
      );
    }

    console.error("[GBP API] Error obtaining Google access token:", error);
    return NextResponse.json(
      { error: "Google Business Profile is not connected" },
      { status: 400 }
    );
  }

  // 4. Discover accessible Google Business Profile accounts
  try {
    let accounts;
    try {
      accounts = await fetchGoogleAccounts(accessToken);
    } catch (err) {
      // If access token was rejected by Google, attempt one-time force refresh and retry
      if (err instanceof GoogleAuthExpiredError && user.business.googleRefreshToken) {
        accessToken = await refreshGoogleAccessToken(
          user.business.id,
          user.business.googleRefreshToken
        );
        accounts = await fetchGoogleAccounts(accessToken);
      } else {
        throw err;
      }
    }

    // 5. Return only safe account metadata needed by the UI
    return NextResponse.json({
      accounts: accounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        role: acc.role,
      })),
    });
  } catch (error) {
    if (error instanceof GoogleAuthExpiredError) {
      return NextResponse.json(
        {
          error: "google_auth_expired",
          message: "Google authorization expired or revoked. Please reconnect.",
        },
        { status: 401 }
      );
    }

    // Fail safely without exposing raw Google responses or token data
    console.error("[GBP API] Error fetching accounts from Google:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Google Business Profile accounts",
      },
      { status: 502 }
    );
  }
}
