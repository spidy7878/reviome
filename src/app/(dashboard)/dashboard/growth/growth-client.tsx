"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Check,
  Zap,
  Clock,
  Camera,
  MessageSquare,
  MapPin,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Phone,
  Globe,
} from "lucide-react";
import { saveChecklistProgress, updateBusinessProfile } from "../actions";

interface GrowthClientProps {
  business: {
    id: string;
    name: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    googleReviewUrl: string | null;
    googleMapsUrl: string | null;
  };
  activeCardsCount: number;
  recentScansCount: number;
  totalScansCount: number;
  totalReviewClicks: number;
  initialChecklist: Record<string, boolean>;
}

export function GrowthClient({
  business,
  activeCardsCount,
  recentScansCount,
  totalScansCount,
  totalReviewClicks,
  initialChecklist,
}: GrowthClientProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    gbpHours: initialChecklist.gbpHours ?? false,
    replyReviews: initialChecklist.replyReviews ?? false,
    weeklyPhotos: initialChecklist.weeklyPhotos ?? false,
    counterPlacement: initialChecklist.counterPlacement ?? false,
  });

  const [placeIdInput, setPlaceIdInput] = useState("");
  const [copiedReviewUrl, setCopiedReviewUrl] = useState(false);
  const [savingPlaceId, setSavingPlaceId] = useState(false);

  const toggleCheck = async (key: string) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    await saveChecklistProgress(updated);
  };

  const hasOptimalReviewUrl = Boolean(
    business.googleReviewUrl &&
      business.googleReviewUrl.includes("writereview?placeid=")
  );

  const hasBasicInfo = Boolean(
    business.phone && business.address && business.website
  );

  // Evaluate Reviome Growth Score (0 to 100)
  // Transparent, non-deceptive evaluation based on verifiable setup & habits
  const checks = [
    {
      id: "placeId",
      title: "1-Tap Direct Google Review Trigger",
      desc: "Uses direct Place ID URL to instantly open the 5-star review modal upon tap.",
      weight: 25,
      passed: hasOptimalReviewUrl,
      category: "Review Magnet",
      actionText: "Configure Place ID",
      actionHref: "#review-tools",
    },
    {
      id: "touchpoints",
      title: "Physical Touchpoints Deployed & Active",
      desc: "At least one active NFC/QR touchpoint with tap telemetry recorded.",
      weight: 20,
      passed: activeCardsCount > 0 && totalScansCount > 0,
      category: "Customer Engagement",
      actionText: "Deploy Touchpoints",
      actionHref: "/dashboard/cards",
    },
    {
      id: "profileInfo",
      title: "Complete Local Contact Profile",
      desc: "Phone, physical address, and official website populated for local shoppers.",
      weight: 15,
      passed: hasBasicInfo,
      category: "Business Foundation",
      actionText: "Complete in Settings",
      actionHref: "/dashboard/profile",
    },
    {
      id: "gbpHours",
      title: "Accurate Google Business Hours",
      desc: "Opening hours regularly verified on Google to avoid lost walk-in customers.",
      weight: 15,
      passed: Boolean(checklist.gbpHours),
      category: "Local SEO Routine",
      toggleKey: "gbpHours",
    },
    {
      id: "replyReviews",
      title: "Active Review Response Habit",
      desc: "Replying to every positive and negative Google review within 24-48 hours.",
      weight: 15,
      passed: Boolean(checklist.replyReviews),
      category: "Customer Engagement",
      toggleKey: "replyReviews",
    },
    {
      id: "weeklyPhotos",
      title: "Weekly Fresh Photos on Google Maps",
      desc: "Uploading high-resolution store, product, or team photos every 7 days.",
      weight: 10,
      passed: Boolean(checklist.weeklyPhotos),
      category: "Visual Engagement",
      toggleKey: "weeklyPhotos",
    },
  ];

  const totalScore = checks.reduce(
    (sum, c) => (c.passed ? sum + c.weight : sum),
    0
  );

  const goodItems = checks.filter((c) => c.passed);
  const attentionItems = checks.filter((c) => !c.passed);

  const handleApplyPlaceId = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = placeIdInput.trim();
    if (!cleanId) return;

    setSavingPlaceId(true);
    const generatedUrl = `https://search.google.com/local/writereview?placeid=${cleanId}`;

    try {
      await updateBusinessProfile({
        name: business.name,
        googleReviewUrl: generatedUrl,
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPlaceId(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Top Header ─────────────────────────────────────── */}
      <div className="border-b border-neutral-950/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 shadow-xs">
          <Zap size={13} className="text-neutral-950" />
          Basic ₹199/mo Plan • Collect + Measure + Basic Growth
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
          Google Growth Hub
        </h1>
        <p className="mt-1 text-xs text-neutral-600">
          Optimize your Google review funnel, configure your direct Place ID magnet, and monitor your Reviome Growth Score.
        </p>
      </div>

      {/* ── Reviome Growth Score Card ──────────────────────── */}
      <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white font-bold text-xs">
                RG
              </span>
              <h2 className="text-xl font-bold text-neutral-950">
                Reviome Growth Score
              </h2>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Evaluates review readiness, touchpoint activity, and local business hygiene monitored through Reviome.
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-neutral-400">
              * Note: This is an internal Reviome operational checklist score, not an official Google ranking score.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-neutral-500">Overall Score</p>
              <p className="text-3xl font-extrabold text-neutral-950">
                {totalScore}
                <span className="text-base font-normal text-neutral-400">/100</span>
              </p>
            </div>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 font-bold text-base shadow-xs ${
                totalScore >= 80
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : totalScore >= 50
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-neutral-200 bg-neutral-50 text-neutral-800"
              }`}
            >
              {totalScore}%
            </div>
          </div>
        </div>

        {/* Progress meter */}
        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            style={{ width: `${totalScore}%` }}
            className={`h-full transition-all duration-500 ${
              totalScore >= 80
                ? "bg-emerald-600"
                : totalScore >= 50
                ? "bg-neutral-950"
                : "bg-amber-600"
            }`}
          />
        </div>

        {/* Breakdown: What is Good vs What Needs Attention */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* What is Good */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                What is Good ({goodItems.length})
              </h3>
            </div>
            <div className="mt-3 space-y-2">
              {goodItems.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  Complete the actions below to start improving your score.
                </p>
              ) : (
                goodItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2 rounded-xl border border-emerald-200/60 bg-white p-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-neutral-950">{item.title}</p>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      +{item.weight} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* What Needs Attention */}
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Needs Attention ({attentionItems.length})
              </h3>
            </div>
            <div className="mt-3 space-y-2">
              {attentionItems.length === 0 ? (
                <p className="text-xs text-emerald-700 font-medium">
                  Outstanding! All basic growth checklist criteria are currently satisfied.
                </p>
              ) : (
                attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2 rounded-xl border border-amber-200/60 bg-white p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-950">{item.title}</p>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{item.desc}</p>
                      <div className="mt-2">
                        {item.toggleKey ? (
                          <button
                            type="button"
                            onClick={() => toggleCheck(item.toggleKey!)}
                            className="inline-flex items-center gap-1 rounded-lg bg-neutral-950 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-neutral-800"
                          >
                            <Check size={11} />
                            <span>Mark as Done</span>
                          </button>
                        ) : item.actionHref ? (
                          <Link
                            href={item.actionHref}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-950 underline hover:text-neutral-700"
                          >
                            <span>{item.actionText}</span>
                            <ChevronRight size={12} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                      {item.weight} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Interactive Growth Habits Checklist */}
        <div className="mt-8 border-t border-neutral-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Ongoing Local SEO Habits
          </h3>
          <p className="text-xs text-neutral-600 mt-0.5">
            Check off these weekly operational habits as you complete them for your business:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => toggleCheck("gbpHours")}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                checklist.gbpHours
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-neutral-200 bg-[#fafaf8] hover:border-neutral-300"
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${
                  checklist.gbpHours
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-neutral-300 bg-white"
                }`}
              >
                {checklist.gbpHours && <Check size={12} />}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-950">Store Hours Verified</p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Hours match actual opening times on Google.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleCheck("replyReviews")}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                checklist.replyReviews
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-neutral-200 bg-[#fafaf8] hover:border-neutral-300"
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${
                  checklist.replyReviews
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-neutral-300 bg-white"
                }`}
              >
                {checklist.replyReviews && <Check size={12} />}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-950">Reviews Answered</p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  All customer reviews received a prompt owner reply.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleCheck("weeklyPhotos")}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                checklist.weeklyPhotos
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-neutral-200 bg-[#fafaf8] hover:border-neutral-300"
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${
                  checklist.weeklyPhotos
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-neutral-300 bg-white"
                }`}
              >
                {checklist.weeklyPhotos && <Check size={12} />}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-950">Weekly Photos Added</p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  New photos posted to Google Maps this week.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Section: Review Tools ──────────────────────────── */}
      <div id="review-tools" className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-amber-400">
              <Star size={16} className="fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950">
                Google Review Link Tools
              </h2>
              <p className="text-xs text-neutral-500">
                Generate the high-converting 1-tap review URL that opens the Google 5-star modal directly.
              </p>
            </div>
          </div>

          {business.googleReviewUrl && (
            <div className="flex items-center gap-2">
              <a
                href={business.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition"
              >
                <span>Test Live Modal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>

        {/* Current Review URL Display */}
        <div className="mt-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
            Active Review URL
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={business.googleReviewUrl || "No review URL configured"}
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-2.5 font-mono text-xs text-neutral-950 focus:outline-none"
            />
            {business.googleReviewUrl && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(business.googleReviewUrl!);
                  setCopiedReviewUrl(true);
                  setTimeout(() => setCopiedReviewUrl(false), 2000);
                }}
                className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-50"
              >
                {copiedReviewUrl ? "Copied!" : "Copy URL"}
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            {hasOptimalReviewUrl
              ? "✓ Optimal format detected: Customers directly see the star rating box upon tap."
              : "⚠️ Standard link: Customers must manually locate the 'Write a Review' button on Google Maps."}
          </p>
        </div>

        {/* 1-Tap Place ID Generator */}
        <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-950 text-white text-[10px] font-bold">
              ⚡
            </span>
            <h3 className="text-xs font-bold text-neutral-950">
              1-Tap Google Place ID Generator
            </h3>
          </div>
          <p className="mt-1 text-xs text-neutral-600">
            Enter your Google Place ID (e.g. <span className="font-mono text-neutral-900">ChIJN1t_tDeuEmsRUsoyG83frY4</span>) to generate the official <span className="font-mono text-neutral-900">writereview?placeid=</span> direct modal trigger.
          </p>

          <form onSubmit={handleApplyPlaceId} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Paste Google Place ID here..."
              value={placeIdInput}
              onChange={(e) => setPlaceIdInput(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-mono text-neutral-950 focus:border-neutral-950 focus:outline-none"
            />
            <button
              type="submit"
              disabled={savingPlaceId || !placeIdInput.trim()}
              className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {savingPlaceId ? "Saving..." : "Apply Place ID"}
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Need to find your Place ID?</span>
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-950 underline hover:text-neutral-700 flex items-center gap-1"
            >
              Google Place ID Finder tool ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
