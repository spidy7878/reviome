import { db } from "@/lib/db";
import { decryptToken, encryptToken } from "@/lib/crypto";

if (typeof window !== "undefined") {
  throw new Error("google-business-profile.ts can only be used on the server.");
}

/**
 * Custom error thrown when Google returns 401 Unauthorized,
 * signaling that the access token has expired or permissions were revoked.
 */
export class GoogleAuthExpiredError extends Error {
  readonly code = "google_auth_expired";

  constructor(message = "Google authorization expired or revoked.") {
    super(message);
    this.name = "GoogleAuthExpiredError";
  }
}

/**
 * Refreshes the Google OAuth access token using the stored encrypted refresh token.
 * Updates the database record with the fresh access token, expiration date, and optional rotated refresh token.
 */
export async function refreshGoogleAccessToken(
  businessId: string,
  encryptedRefreshToken: string
): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured.");
  }

  let plainRefreshToken: string;
  try {
    plainRefreshToken = decryptToken(encryptedRefreshToken);
  } catch (err) {
    console.error("[GBP Token Refresh] Failed to decrypt refresh token:", err);
    throw new GoogleAuthExpiredError("Failed to decrypt Google refresh token. Please reconnect.");
  }

  let tokenRes: Response;
  try {
    tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: plainRefreshToken,
        grant_type: "refresh_token",
      }).toString(),
    });
  } catch (err) {
    console.error("[GBP Token Refresh] Network error during token refresh:", err);
    throw new Error("Network error connecting to Google token endpoint.");
  }

  if (!tokenRes.ok) {
    const errorDetails = await tokenRes.json().catch(() => ({}));
    console.error("[GBP Token Refresh] Google rejected refresh token:", errorDetails);
    throw new GoogleAuthExpiredError("Google authorization expired or revoked. Please reconnect.");
  }

  const tokenData: {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
  } = await tokenRes.json();

  if (!tokenData.access_token) {
    throw new GoogleAuthExpiredError("Google did not return a valid access token.");
  }

  const expiresInSeconds =
    typeof tokenData.expires_in === "number"
      ? tokenData.expires_in
      : 3600;

  const tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  const updateData: {
    googleAccessToken: string;
    googleTokenExpiresAt: Date;
    googleRefreshToken?: string;
  } = {
    googleAccessToken: tokenData.access_token,
    googleTokenExpiresAt: tokenExpiresAt,
  };

  if (tokenData.refresh_token) {
    try {
      updateData.googleRefreshToken = encryptToken(tokenData.refresh_token);
    } catch (e) {
      console.error("[GBP Token Refresh] Failed to encrypt new refresh token:", e);
    }
  }

  await db.business.update({
    where: { id: businessId },
    data: updateData,
  });

  return tokenData.access_token;
}

/**
 * Ensures a valid Google access token is available for the given business.
 * If the current token is missing or expiring within 5 minutes, it refreshes it automatically.
 */
export async function getValidGoogleAccessToken(businessId: string): Promise<string> {
  const business = await db.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiresAt: true,
    },
  });

  if (!business) {
    throw new Error("Business not found.");
  }

  if (!business.googleRefreshToken) {
    throw new GoogleAuthExpiredError("Google Business Profile is not connected or authorization is missing.");
  }

  const BUFFER_MS = 5 * 60 * 1000; // 5-minute safety buffer
  const isExpiringSoon =
    !business.googleAccessToken ||
    !business.googleTokenExpiresAt ||
    business.googleTokenExpiresAt.getTime() <= Date.now() + BUFFER_MS;

  if (!isExpiringSoon && business.googleAccessToken) {
    return business.googleAccessToken;
  }

  return await refreshGoogleAccessToken(business.id, business.googleRefreshToken);
}

export interface GoogleAccount {
  id: string;
  name: string;
  type?: string;
  role?: string;
  accountNumber?: string;
}

export interface GoogleLocation {
  id: string;
  name: string; // resource name, e.g. "locations/12345"
  title: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    regionCode?: string;
    formattedAddress?: string;
  };
  phone?: string;
  websiteUri?: string;
}

const GBP_ACCOUNT_MANAGEMENT_BASE_URL = "https://mybusinessaccountmanagement.googleapis.com/v1";
const GBP_BUSINESS_INFO_BASE_URL = "https://mybusinessbusinessinformation.googleapis.com/v1";

/**
 * Lightweight helper to execute authenticated requests to Google APIs.
 * Never logs access tokens or sensitive payloads.
 */
async function makeGoogleApiRequest<T>(url: string, accessToken: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error connecting to Google Business Profile API.");
  }

  if (response.status === 401) {
    throw new GoogleAuthExpiredError();
  }

  if (response.status === 403) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    const message = errorBody?.error?.message || "";
    if (message.includes("has not been used in project") || message.includes("is disabled")) {
      throw new Error(
        "The Google Business Profile APIs are not enabled in your Google Cloud Console project. Please enable 'My Business Account Management API' and 'My Business Business Information API' in Google Cloud Console."
      );
    }
    throw new Error(message || "Permission denied (403) by Google Business Profile API.");
  }

  if (!response.ok) {
    throw new Error(`Google Business Profile API responded with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches all Google Business Profile accounts accessible by the authenticated user.
 * GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts
 */
export async function fetchGoogleAccounts(accessToken: string): Promise<GoogleAccount[]> {
  const url = `${GBP_ACCOUNT_MANAGEMENT_BASE_URL}/accounts`;

  interface RawAccountsResponse {
    accounts?: Array<{
      name?: string; // "accounts/{accountId}"
      accountName?: string; // Display name
      type?: string;
      role?: string;
      accountNumber?: string;
    }>;
  }

  const data = await makeGoogleApiRequest<RawAccountsResponse>(url, accessToken);

  if (!data.accounts || !Array.isArray(data.accounts)) {
    return [];
  }

  return data.accounts.map((acc) => {
    const rawName = acc.name || "";
    const id = rawName.replace(/^accounts\//, "");

    return {
      id: id || rawName,
      name: acc.accountName || rawName || "Untitled Account",
      type: acc.type,
      role: acc.role,
      accountNumber: acc.accountNumber,
    };
  });
}

/**
 * Fetches locations for a specific Google Business Profile account.
 * GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations
 */
export async function fetchGoogleLocations(
  accessToken: string,
  accountId: string
): Promise<GoogleLocation[]> {
  // Normalize account resource name (e.g. "12345" -> "accounts/12345")
  const normalizedAccountName = accountId.startsWith("accounts/")
    ? accountId
    : `accounts/${accountId}`;

  const readMask = [
    "name",
    "title",
    "storefrontAddress",
    "phoneNumbers",
    "websiteUri",
  ].join(",");

  const url = `${GBP_BUSINESS_INFO_BASE_URL}/${normalizedAccountName}/locations?readMask=${encodeURIComponent(
    readMask
  )}`;

  interface RawLocationsResponse {
    locations?: Array<{
      name?: string;
      title?: string;
      storefrontAddress?: {
        addressLines?: string[];
        locality?: string;
        administrativeArea?: string;
        postalCode?: string;
        regionCode?: string;
      };
      phoneNumbers?: {
        primaryPhone?: string;
      };
      websiteUri?: string;
    }>;
  }

  const data = await makeGoogleApiRequest<RawLocationsResponse>(url, accessToken);

  if (!data.locations || !Array.isArray(data.locations)) {
    return [];
  }

  return data.locations.map((loc) => {
    const rawName = loc.name || "";
    const id = rawName.replace(/^locations\//, "");
    const addr = loc.storefrontAddress;

    let formattedAddress = "";
    if (addr) {
      const parts = [
        ...(addr.addressLines || []),
        addr.locality,
        addr.administrativeArea,
        addr.postalCode,
      ].filter(Boolean);
      formattedAddress = parts.join(", ");
    }

    return {
      id: id || rawName,
      name: rawName,
      title: loc.title || "Untitled Location",
      storefrontAddress: addr
        ? {
            addressLines: addr.addressLines || [],
            locality: addr.locality,
            administrativeArea: addr.administrativeArea,
            postalCode: addr.postalCode,
            regionCode: addr.regionCode,
            formattedAddress: formattedAddress || undefined,
          }
        : undefined,
      phone: loc.phoneNumbers?.primaryPhone,
      websiteUri: loc.websiteUri,
    };
  });
}
