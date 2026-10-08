"use client";

import { useState } from "react";
import {
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Navigation,
  ExternalLink,
  Wifi,
  Zap,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

interface BusinessData {
  name: string;
  description: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  googleMapsUrl: string | null;
  googleReviewUrl: string | null;
  socialLinks: Record<string, string>;
}

export function CardProfile({
  business,
  cardId,
}: {
  business: BusinessData;
  cardId: string;
}) {
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [showPrivateFeedback, setShowPrivateFeedback] = useState(false);

  // Private feedback form state
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const trackClick = (linkType: string, url: string) => {
    navigator.sendBeacon?.(
      `/api/track`,
      JSON.stringify({ cardId, linkType })
    );
    window.open(url, "_blank", "noopener");
  };

  const handleStarClick = (rating: number) => {
    setSelectedStars(rating);
  };

  const handlePrivateFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    setFeedbackSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          rating: selectedStars || 5,
          comment: feedbackComment,
          contact: feedbackContact,
        }),
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setFeedbackSending(false);
    }
  };

  const socialEntries = Object.entries(business.socialLinks).filter(
    ([, url]) => url
  );

  return (
    <div className="flex min-h-dvh flex-col bg-[#fafaf8] text-neutral-950 selection:bg-neutral-900 selection:text-white relative">
      {/* Subtle background grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      {/* ── Header Gradient Band ─────────────────────────── */}
      <div className="relative h-36 w-full bg-neutral-950">
        {/* Subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-30" />

        {/* Reviome branding */}
        <a
          href="/"
          className="absolute left-4 top-4 flex items-center gap-1.5 text-neutral-300 hover:text-white transition"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10">
            <Zap size={11} className="fill-white text-white" />
          </span>
          <span className="text-[11px] font-bold tracking-[-0.03em] lowercase text-white">
            reviome
          </span>
        </a>
      </div>

      {/* ── Profile Card (Overlapping Header) ────────────── */}
      <div className="relative mx-auto w-full max-w-md px-5 -mt-16">
        {/* Avatar / Logo */}
        <div className="flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-[#fafaf8] bg-neutral-950 text-white shadow-lg">
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-3xl font-bold tracking-tight">
                {business.name.charAt(0)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-neutral-950">
            {business.name}
          </h1>

          {business.description && (
            <p className="mt-2 text-center text-sm leading-relaxed text-neutral-600">
              {business.description}
            </p>
          )}
        </div>

        {/* ── Experience Rater & Feedback Options ──────────── */}
        <div className="mt-7 overflow-hidden rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-sm">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-900/10 bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-800">
              <Sparkles size={12} className="text-neutral-950" />
              Rate your experience
            </span>
            <p className="mt-2 text-xs text-neutral-600">
              Tap a star to share how your visit went (optional)
            </p>
          </div>

          {/* 5-Star Interactive Selector (Optional) */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active =
                (hoverStars !== null && star <= hoverStars) ||
                (hoverStars === null &&
                  selectedStars !== null &&
                  star <= selectedStars);

              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverStars(star)}
                  onMouseLeave={() => setHoverStars(null)}
                  onClick={() => handleStarClick(star)}
                  className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={34}
                    className={`transition-colors duration-200 ${
                      active
                        ? "fill-amber-400 text-amber-500 drop-shadow-sm"
                        : "fill-neutral-100 text-neutral-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {selectedStars !== null && (
            <p className="mt-1 text-center text-[11px] font-medium text-neutral-500">
              Rating selected: {selectedStars} of 5 stars
            </p>
          )}

          {/* ── 1. Always-Available Google Review Option (Never Hidden or Disabled) ── */}
          {business.googleReviewUrl && (
            <button
              type="button"
              onClick={() =>
                trackClick("REVIEW", business.googleReviewUrl!)
              }
              className="group mt-4 flex w-full items-center justify-between rounded-2xl bg-neutral-950 px-5 py-4 text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5 text-amber-400">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs font-semibold">Leave a Google Review</span>
              </div>
              <ChevronRight
                size={16}
                className="text-neutral-400 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}

          {/* ── 2. Always-Available Private Feedback Option (Direct to Management) ── */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowPrivateFeedback((prev) => !prev)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/80 py-3 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100 hover:border-neutral-300"
            >
              <MessageSquare size={14} className="text-neutral-600" />
              <span>
                {showPrivateFeedback
                  ? "Hide Private Feedback Form"
                  : "Send Private Feedback to Merchant"}
              </span>
            </button>

            {showPrivateFeedback && (
              <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4">
                {feedbackSubmitted ? (
                  <div className="py-3 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="mt-2 text-xs font-bold text-neutral-950">
                      Thank you for your feedback!
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-600">
                      Your message has been delivered directly to the store management.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePrivateFeedbackSubmit} className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-neutral-950">
                        Direct note to management
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-600">
                        Have a private compliment, suggestion, or concern? Send it directly to the owner:
                      </p>
                    </div>

                    <textarea
                      required
                      rows={3}
                      placeholder="Write your feedback here..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Your name & phone or email (optional, for follow-up)"
                      value={feedbackContact}
                      onChange={(e) => setFeedbackContact(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={feedbackSending || !feedbackComment.trim()}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-950 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {feedbackSending ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <span>Send to Management</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions Grid ─────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              onClick={() => trackClick("CONTACT", `tel:${business.phone}`)}
              className="flex items-center gap-3 rounded-xl border border-neutral-950/10 bg-white px-4 py-4 shadow-xs transition-all hover:border-neutral-950 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Phone size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-950">Call</p>
                <p className="truncate text-[11px] text-neutral-500">
                  {business.phone}
                </p>
              </div>
            </a>
          )}

          {business.email && (
            <a
              href={`mailto:${business.email}`}
              onClick={() =>
                trackClick("CONTACT", `mailto:${business.email}`)
              }
              className="flex items-center gap-3 rounded-xl border border-neutral-950/10 bg-white px-4 py-4 shadow-xs transition-all hover:border-neutral-950 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-950">Email</p>
                <p className="truncate text-[11px] text-neutral-500">
                  {business.email}
                </p>
              </div>
            </a>
          )}

          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackClick("WEBSITE", business.website!)
              }
              className="flex items-center gap-3 rounded-xl border border-neutral-950/10 bg-white px-4 py-4 shadow-xs transition-all hover:border-neutral-950 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Globe size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-950">
                  Website
                </p>
                <p className="truncate text-[11px] text-neutral-500">Visit</p>
              </div>
            </a>
          )}

          {business.googleMapsUrl && (
            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackClick("DIRECTIONS", business.googleMapsUrl!)
              }
              className="flex items-center gap-3 rounded-xl border border-neutral-950/10 bg-white px-4 py-4 shadow-xs transition-all hover:border-neutral-950 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                <Navigation size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-950">
                  Directions
                </p>
                <p className="truncate text-[11px] text-neutral-500">
                  Get there
                </p>
              </div>
            </a>
          )}
        </div>

        {/* ── Address ────────────────────────────────────── */}
        {business.address && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-neutral-950/10 bg-white px-4 py-4 shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-950">Address</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-neutral-600">
                {business.address}
              </p>
            </div>
          </div>
        )}

        {/* ── Social Links ───────────────────────────────── */}
        {socialEntries.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Follow us
            </p>
            <div className="flex gap-3">
              {socialEntries.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("SOCIAL", url)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-950/10 bg-white text-neutral-700 shadow-xs transition-all hover:border-neutral-950 hover:text-neutral-950 hover:shadow-sm active:scale-95"
                  title={platform}
                >
                  {platform === "instagram" && <InstagramIcon size={18} />}
                  {platform === "facebook" && <FacebookIcon size={18} />}
                  {platform === "tiktok" && (
                    <span className="text-sm font-black">T</span>
                  )}
                  {platform === "wifi" && <Wifi size={18} />}
                  {!["instagram", "facebook", "tiktok", "wifi"].includes(
                    platform
                  ) && <ExternalLink size={16} />}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="mt-10 mb-8 flex flex-col items-center gap-2 border-t border-neutral-950/10 pt-6">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold tracking-[-0.04em] text-neutral-950 transition hover:opacity-80"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded bg-neutral-950 text-white">
              <Zap size={9} className="fill-white" />
            </span>
            <span>reviome</span>
          </a>
          <p className="text-[10px] text-neutral-400 font-medium">
            Smart physical NFC touchpoints & reviews
          </p>
        </footer>
      </div>
    </div>
  );
}
