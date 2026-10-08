"use client";

import { useState } from "react";
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  Globe,
  Phone,
  ExternalLink,
  X,
  MapPin,
  Store,
  ArrowLeft,
  Check,
} from "lucide-react";
import { updateBusinessProfile, saveGoogleLocation } from "../actions";

interface BusinessProfileData {
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  googleMapsUrl: string | null;
  googleReviewUrl: string | null;
  socialLinks: Record<string, string>;
  slug: string;
}

interface GoogleIntegrationData {
  isConnected: boolean;
  connectedAt: string | null;
  googleAccountId?: string | null;
  googleLocationId?: string | null;
  googleLocationName?: string | null;
}

interface ProfileClientProps {
  initialData: BusinessProfileData;
  googleIntegration: GoogleIntegrationData;
  googleParam?: string;
  googleErrorParam?: string;
}

interface DiscoveredAccount {
  id: string;
  name: string;
  type?: string;
  role?: string;
}

interface DiscoveredLocation {
  id: string;
  name: string;
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

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  denied: "Google authorization was cancelled or denied.",
  invalid_request: "Invalid OAuth request received from Google.",
  state_mismatch: "Security verification failed (state mismatch). Please try again.",
  config_error: "Google integration is not properly configured on the server.",
  token_exchange_failed: "Failed to exchange authorization code with Google. Please try again.",
  network_error: "Network error occurred while connecting to Google. Please try again.",
  missing_access_token: "Google did not provide an access token.",
  missing_refresh_token:
    "Google did not provide the required offline authorization token. Please grant full permissions and try again.",
  encryption_error: "Failed to securely encrypt credentials. Please contact support.",
  database_error: "Failed to save Google connection. Please try again.",
};

function formatConnectedDate(isoString: string | null): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function ProfileClient({
  initialData,
  googleIntegration,
  googleParam,
  googleErrorParam,
}: ProfileClientProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [website, setWebsite] = useState(initialData.website || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialData.googleMapsUrl || "");
  const [googleReviewUrl, setGoogleReviewUrl] = useState(
    initialData.googleReviewUrl || ""
  );
  const [instagram, setInstagram] = useState(initialData.socialLinks.instagram || "");
  const [facebook, setFacebook] = useState(initialData.socialLinks.facebook || "");
  const [tiktok, setTiktok] = useState(initialData.socialLinks.tiktok || "");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleNoticeDismissed, setGoogleNoticeDismissed] = useState(false);

  // ── Step 11B: GBP Discovery & Selection State ──
  const [savedLocation, setSavedLocation] = useState<{
    accountId: string | null;
    locationId: string | null;
    locationName: string | null;
  }>({
    accountId: googleIntegration.googleAccountId || null,
    locationId: googleIntegration.googleLocationId || null,
    locationName: googleIntegration.googleLocationName || null,
  });

  const [isDiscovering, setIsDiscovering] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accounts, setAccounts] = useState<DiscoveredAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<DiscoveredAccount | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locations, setLocations] = useState<DiscoveredLocation[]>([]);
  const [savingLocationId, setSavingLocationId] = useState<string | null>(null);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const safeGoogleErrorMessage = googleErrorParam
    ? GOOGLE_ERROR_MESSAGES[googleErrorParam] || "Failed to connect Google Business Profile. Please try again."
    : null;

  // Fetch Accounts from /api/google-business/accounts
  const handleFindAccounts = async () => {
    setIsDiscovering(true);
    setLoadingAccounts(true);
    setDiscoveryError(null);
    setAccounts([]);
    setSelectedAccount(null);
    setLocations([]);

    try {
      const res = await fetch("/api/google-business/accounts");
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "google_auth_expired") {
          throw new Error("Your Google session has expired. Please reconnect Google Business Profile.");
        }
        throw new Error(data.error || "Failed to fetch Google Business accounts.");
      }

      setAccounts(data.accounts || []);
      if (!data.accounts || data.accounts.length === 0) {
        setDiscoveryError("No Google Business Profile accounts found for this Google user.");
      }
    } catch (err: unknown) {
      setDiscoveryError(err instanceof Error ? err.message : "Failed to load Google accounts.");
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Fetch Locations for Selected Account
  const handleSelectAccount = async (account: DiscoveredAccount) => {
    setSelectedAccount(account);
    setLoadingLocations(true);
    setDiscoveryError(null);
    setLocations([]);

    try {
      const res = await fetch(`/api/google-business/locations?accountId=${encodeURIComponent(account.id)}`);
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "google_auth_expired") {
          throw new Error("Your Google session has expired. Please reconnect Google Business Profile.");
        }
        throw new Error(data.error || "Failed to fetch locations for this account.");
      }

      setLocations(data.locations || []);
      if (!data.locations || data.locations.length === 0) {
        setDiscoveryError(`No locations found in account "${account.name}".`);
      }
    } catch (err: unknown) {
      setDiscoveryError(err instanceof Error ? err.message : "Failed to load locations.");
    } finally {
      setLoadingLocations(false);
    }
  };

  // Save Selected Location
  const handleSaveLocation = async (location: DiscoveredLocation) => {
    if (!selectedAccount) return;

    setSavingLocationId(location.id);
    setDiscoveryError(null);

    try {
      await saveGoogleLocation({
        accountId: selectedAccount.id,
        locationId: location.id,
        locationName: location.title,
      });

      setSavedLocation({
        accountId: selectedAccount.id,
        locationId: location.id,
        locationName: location.title,
      });
      setIsDiscovering(false);
      setSaveSuccessNotice(`Successfully linked location "${location.title}"!`);
      setTimeout(() => setSaveSuccessNotice(null), 5000);
    } catch (err: unknown) {
      setDiscoveryError(err instanceof Error ? err.message : "Failed to save selected location.");
    } finally {
      setSavingLocationId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await updateBusinessProfile({
        name,
        description,
        phone,
        email,
        website,
        address,
        googleMapsUrl,
        googleReviewUrl,
        socialLinks: {
          instagram,
          facebook,
          tiktok,
        },
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-950/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
          Business Profile & Review Links
        </h1>
        <p className="mt-1 text-xs text-neutral-600">
          This is the live landing screen your customers see upon tapping an NFC card.
        </p>
      </div>

      {/* Query-Based Notification Banners */}
      {!googleNoticeDismissed && (
        <>
          {googleParam === "connected" && (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span>Google Business Profile connected successfully.</span>
              </div>
              <button
                type="button"
                onClick={() => setGoogleNoticeDismissed(true)}
                className="text-emerald-600 hover:text-emerald-950 transition"
                aria-label="Dismiss notice"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {safeGoogleErrorMessage && (
            <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span>{safeGoogleErrorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setGoogleNoticeDismissed(true)}
                className="text-red-500 hover:text-red-950 transition"
                aria-label="Dismiss notice"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Location Linked Success Banner */}
      {saveSuccessNotice && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessNotice(null)}
            className="text-emerald-600 hover:text-emerald-950 transition"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Section: Google Business Profile Integration ── */}
      <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 shadow-xs">
              <GoogleIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950">
                Google Business Profile
              </h2>
              <p className="text-xs text-neutral-500">
                Direct integration with Google Business Profile for review syncing
              </p>
            </div>
          </div>

          <div>
            {!googleIntegration.isConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
                Not connected
              </span>
            ) : savedLocation.locationId ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 size={13} className="text-emerald-700" />
                Connected & Location Linked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                <CheckCircle2 size={13} className="text-blue-700" />
                Google account connected
              </span>
            )}
          </div>
        </div>

        <div className="mt-5">
          {/* Case 1: NOT Connected */}
          {!googleIntegration.isConnected && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-4.5">
              <p className="text-xs leading-relaxed text-neutral-600 max-w-lg">
                Connect your Google Business Profile to sync reviews, manage responses, and unlock Google growth features.
              </p>
              <a
                href="/api/auth/google/connect"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition whitespace-nowrap active:scale-95 shadow-xs"
              >
                <GoogleIcon className="h-3.5 w-3.5" />
                Connect Google Business Profile
              </a>
            </div>
          )}

          {/* Case 2: Connected AND Location Linked (and not currently re-discovering) */}
          {googleIntegration.isConnected && savedLocation.locationId && !isDiscovering && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Linked Location: {savedLocation.locationName || savedLocation.locationId}</span>
                  </div>
                  {googleIntegration.connectedAt && (
                    <p className="mt-1 text-[11px] text-neutral-600">
                      Connected on:{" "}
                      <span className="font-medium text-neutral-800">
                        {formatConnectedDate(googleIntegration.connectedAt)}
                      </span>
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Location ID: <code className="bg-emerald-100/70 px-1 py-0.5 rounded text-[10px] text-emerald-900">{savedLocation.locationId}</code>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFindAccounts}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition shadow-xs whitespace-nowrap"
                >
                  <Store size={13} className="text-neutral-600" />
                  Change Location
                </button>
              </div>
            </div>
          )}

          {/* Case 3: Connected but NO Location Selected (or currently in Discovery mode) */}
          {googleIntegration.isConnected && (!savedLocation.locationId || isDiscovering) && (
            <div className="space-y-4">
              {!isDiscovering ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-blue-100 bg-blue-50/40 p-4.5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-950">
                      <CheckCircle2 size={15} className="text-blue-600" />
                      <span>Google account connected</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 max-w-lg">
                      Link your Google Business location to complete the integration.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFindAccounts}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition whitespace-nowrap active:scale-95 shadow-xs"
                  >
                    <Store size={14} />
                    Find My Business Profiles
                  </button>
                </div>
              ) : (
                /* ── Interactive Discovery View ── */
                <div className="rounded-2xl border border-neutral-200 bg-[#fafaf8] p-5 space-y-4">
                  {/* Discovery Header / Nav */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80">
                    <div className="flex items-center gap-2">
                      {selectedAccount ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccount(null);
                            setLocations([]);
                            setDiscoveryError(null);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition mr-2"
                        >
                          <ArrowLeft size={13} />
                          Back to Accounts
                        </button>
                      ) : null}
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                        {selectedAccount
                          ? `Locations for "${selectedAccount.name}"`
                          : "Select Your Google Business Account"}
                      </h3>
                    </div>

                    {savedLocation.locationId && (
                      <button
                        type="button"
                        onClick={() => setIsDiscovering(false)}
                        className="text-xs text-neutral-500 hover:text-neutral-950 underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Discovery Errors */}
                  {discoveryError && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0 text-red-600" />
                        <span>{discoveryError}</span>
                      </div>
                      {(discoveryError.includes("expired") || discoveryError.includes("reconnect")) && (
                        <a
                          href="/api/auth/google/connect"
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition shrink-0 active:scale-95 shadow-xs whitespace-nowrap"
                        >
                          <GoogleIcon className="h-3 w-3" />
                          Reconnect Google
                        </a>
                      )}
                    </div>
                  )}

                  {/* Loading State: Accounts */}
                  {loadingAccounts && (
                    <div className="flex flex-col items-center justify-center py-8 text-neutral-500 gap-2">
                      <Loader2 size={20} className="animate-spin text-neutral-950" />
                      <span className="text-xs font-medium">Discovering Google Business Profile accounts...</span>
                    </div>
                  )}

                  {/* List Accounts */}
                  {!loadingAccounts && !selectedAccount && accounts.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="text-xs text-neutral-600">
                        Choose the Google Business account managing your location:
                      </p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {accounts.map((acc) => (
                          <div
                            key={acc.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs hover:border-neutral-300 transition"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-neutral-950">{acc.name}</span>
                                {acc.type && (
                                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 uppercase tracking-wide">
                                    {acc.type}
                                  </span>
                                )}
                                {acc.role && (
                                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 uppercase tracking-wide">
                                    {acc.role}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400">Account ID: {acc.id}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSelectAccount(acc)}
                              className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition active:scale-95"
                            >
                              Select
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loading State: Locations */}
                  {loadingLocations && (
                    <div className="flex flex-col items-center justify-center py-8 text-neutral-500 gap-2">
                      <Loader2 size={20} className="animate-spin text-neutral-950" />
                      <span className="text-xs font-medium">
                        Fetching locations for &quot;{selectedAccount?.name}&quot;...
                      </span>
                    </div>
                  )}

                  {/* List Locations */}
                  {!loadingLocations && selectedAccount && locations.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs text-neutral-600">
                        Select the location that corresponds to this business profile:
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {locations.map((loc) => {
                          const isSavingThis = savingLocationId === loc.id;
                          const isCurrentLinked = savedLocation.locationId === loc.id;

                          return (
                            <div
                              key={loc.id}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition shadow-xs ${
                                isCurrentLinked
                                  ? "border-emerald-300 bg-emerald-50/40"
                                  : "border-neutral-200 bg-white hover:border-neutral-300"
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-neutral-950">{loc.title}</h4>
                                  {isCurrentLinked && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                      <Check size={10} /> Currently Linked
                                    </span>
                                  )}
                                </div>

                                {loc.storefrontAddress?.formattedAddress && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                                    <MapPin size={12} className="shrink-0 text-neutral-400" />
                                    <span>{loc.storefrontAddress.formattedAddress}</span>
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
                                  {loc.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone size={11} className="text-neutral-400" />
                                      <span>{loc.phone}</span>
                                    </div>
                                  )}
                                  {loc.websiteUri && (
                                    <div className="flex items-center gap-1">
                                      <Globe size={11} className="text-neutral-400" />
                                      <a
                                        href={loc.websiteUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-700 hover:underline flex items-center gap-0.5"
                                      >
                                        <span>Website</span>
                                        <ExternalLink size={10} />
                                      </a>
                                    </div>
                                  )}
                                  <span className="text-[10px] text-neutral-400 font-mono">ID: {loc.id}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={Boolean(savingLocationId) || isCurrentLinked}
                                onClick={() => handleSaveLocation(loc)}
                                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition active:scale-95 whitespace-nowrap shadow-xs ${
                                  isCurrentLinked
                                    ? "bg-neutral-200 text-neutral-500 cursor-default"
                                    : "bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-50"
                                }`}
                              >
                                {isSavingThis ? (
                                  <>
                                    <Loader2 size={13} className="animate-spin" />
                                    Saving...
                                  </>
                                ) : isCurrentLinked ? (
                                  "Linked"
                                ) : (
                                  "Select this location"
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Status Alerts */}
        {savedSuccess && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-700" />
            Changes saved! All active NFC cards will immediately reflect your updates.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            <AlertCircle size={16} className="text-red-600" />
            {error}
          </div>
        )}

        {/* ── Section: Core Identity ── */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <Building2 size={16} />
            </div>
            <h2 className="text-base font-bold text-neutral-950">Brand Identity</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Business Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Short Description / Catchphrase
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted pastries, specialty espresso, and local vibes in Portland."
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>
          </div>
        </div>

        {/* ── Section: Review Magnet (Primary CTA) ── */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex flex-col justify-between gap-3 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-amber-400 shadow-xs">
                <Star size={14} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-950">
                  Google Review Direct Link (Primary Magnet)
                </h2>
                <p className="text-xs text-neutral-500">
                  When customers tap the card, this button launches their review modal.
                </p>
              </div>
            </div>

            {/* Validation Badge */}
            {googleReviewUrl && (
              <div className="flex items-center gap-2">
                {googleReviewUrl.includes("writereview?placeid=") ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    Optimal 1-Tap Format
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                    ⚠️ Standard Link
                  </span>
                )}

                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                >
                  <span>Test Popup</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Direct Google Review URL
            </label>
            <input
              type="url"
              placeholder="https://search.google.com/local/writereview?placeid=ChIJ..."
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 font-mono text-xs"
            />
          </div>

          {/* ── Place ID Helper / Auto-Generator Tool ── */}
          <div className="mt-5 rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-4.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-950 text-white text-[10px] font-bold">
                  ⚡
                </span>
                <p className="text-xs font-bold text-neutral-950">
                  Google Place ID Helper & 1-Tap Link Generator
                </p>
              </div>
              <a
                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 underline flex items-center gap-1"
              >
                <span>Find my Place ID on Google</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
              To force the 5-star review rating box to immediately open on customer phones, paste your Google <strong className="text-neutral-950">Place ID</strong> below (starts with <code className="bg-neutral-200 px-1 py-0.5 rounded text-[10px]">ChIJ...</code>):
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Paste Place ID here (e.g. ChIJN1t_tDeuEmsRUsoyG83frY4)"
                id="placeIdInput"
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:outline-none font-mono"
                onChange={(e) => {
                  const val = e.target.value.trim();
                  if (val.startsWith("ChIJ")) {
                    setGoogleReviewUrl(
                      `https://search.google.com/local/writereview?placeid=${val}`
                    );
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(
                    "placeIdInput"
                  ) as HTMLInputElement;
                  let val = input?.value.trim() || "";
                  if (val.includes("placeid=")) {
                    const match = val.match(/placeid=([^&]+)/);
                    if (match) val = match[1];
                  }
                  if (val) {
                    setGoogleReviewUrl(
                      `https://search.google.com/local/writereview?placeid=${val}`
                    );
                  }
                }}
                className="rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition whitespace-nowrap"
              >
                Apply 1-Tap Link
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
              <span>💡 Alternative: In Google Maps, click <strong>&quot;Share &gt; Copy link&quot;</strong> on your business page.</span>
            </div>
          </div>
        </div>

        {/* ── Section: Contact & Location ── */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <Phone size={16} />
            </div>
            <h2 className="text-base font-bold text-neutral-950">Contact & Location</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Public Email
              </label>
              <input
                type="email"
                placeholder="contact@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Official Website
              </label>
              <input
                type="url"
                placeholder="https://yourbrand.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Google Maps / Directions Link
              </label>
              <input
                type="url"
                placeholder="https://maps.google.com/?q=..."
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Physical Street Address
              </label>
              <input
                type="text"
                placeholder="123 Main St, Suite 400, Austin, TX"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>
          </div>
        </div>

        {/* ── Section: Social Media ── */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <Globe size={16} />
            </div>
            <h2 className="text-base font-bold text-neutral-950">Social Channels</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Instagram URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/yourhandle"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Facebook Page URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/yourpage"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                TikTok URL
              </label>
              <input
                type="url"
                placeholder="https://tiktok.com/@yourbrand"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 flex items-center justify-between rounded-2xl border border-neutral-950/10 bg-white/95 p-4 shadow-xl backdrop-blur-md">
          <span className="text-xs text-neutral-500">
            Remember to test your changes after saving.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60 active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Updates...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Business Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
