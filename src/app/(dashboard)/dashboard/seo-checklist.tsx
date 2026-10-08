"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Star,
  Check,
  Clock,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { saveChecklistProgress, resolveFeedbackItem } from "./actions";

interface PrivateFeedbackItem {
  id: string;
  rating: number;
  comment: string;
  contact?: string;
  cardLabel?: string;
  timestamp: string;
  resolved?: boolean;
}

interface SeoChecklistProps {
  hasOptimalReviewUrl: boolean;
  googleReviewUrl?: string | null;
  activeCardsCount: number;
  recentScansCount: number;
  initialChecklist: Record<string, boolean>;
  privateFeedbacks: PrivateFeedbackItem[];
}

export function SeoChecklistWidget({
  hasOptimalReviewUrl,
  googleReviewUrl,
  activeCardsCount,
  recentScansCount,
  initialChecklist,
  privateFeedbacks,
}: SeoChecklistProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    gbpHours: initialChecklist.gbpHours ?? false,
    replyReviews: initialChecklist.replyReviews ?? false,
    weeklyPhotos: initialChecklist.weeklyPhotos ?? false,
    counterPlacement: initialChecklist.counterPlacement ?? false,
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<PrivateFeedbackItem[]>(privateFeedbacks);

  const toggleCheck = async (key: string) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    await saveChecklistProgress(updated);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleResolveFeedback = async (id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, resolved: true } : f))
    );
    await resolveFeedbackItem(id);
  };

  // Calculate score
  const totalItems = 6;
  let completedCount = 0;
  if (hasOptimalReviewUrl) completedCount++;
  if (activeCardsCount > 0 && recentScansCount > 0) completedCount++;
  if (checklist.gbpHours) completedCount++;
  if (checklist.replyReviews) completedCount++;
  if (checklist.weeklyPhotos) completedCount++;
  if (checklist.counterPlacement) completedCount++;

  const progressPercent = Math.round((completedCount / totalItems) * 100);

  return (
    <div className="space-y-8">
      {/* ── Local SEO Rank Accelerator ─────────────────────── */}
      <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900">
              <Sparkles size={13} className="text-neutral-950" />
              Google Maps Rank Accelerator
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-neutral-950 md:text-2xl">
              Local 3-Pack Growth Checklist
            </h2>
            <p className="mt-1 text-xs text-neutral-600">
              Proven algorithmic steps to position your business in Google Maps top 3 local recommendations.
            </p>
          </div>

          {/* Progress Circular / Bar Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-neutral-500">SEO Health Score</p>
              <p className="text-xl font-extrabold text-neutral-950">{progressPercent}%</p>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-neutral-100 flex items-center justify-center font-bold text-xs bg-neutral-50 text-neutral-950">
              {completedCount}/{totalItems}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-500 ${
              progressPercent >= 80 ? "bg-emerald-600" : "bg-neutral-950"
            }`}
          />
        </div>

        {/* ── Checklist Items ── */}
        <div className="mt-6 divide-y divide-neutral-100">
          {/* Item 1: Optimal 1-Tap Review Dialog */}
          <div className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    hasOptimalReviewUrl
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {hasOptimalReviewUrl ? <Check size={12} /> : "!"}
                </span>
                <div>
                  <p className="text-xs font-bold text-neutral-950">
                    1. 1-Tap Google Review Dialog Active
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    {hasOptimalReviewUrl
                      ? "Configured with your direct Place ID. Forces the 5-star review rating box to immediately pop open."
                      : "Not yet using direct Place ID. Customers must manually find the 'Write a Review' button."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!hasOptimalReviewUrl && (
                  <a
                    href="/dashboard/profile"
                    className="text-[11px] font-bold text-neutral-950 underline hover:text-neutral-700"
                  >
                    Fix in Profile
                  </a>
                )}
                <button
                  onClick={() => toggleExpand("item1")}
                  className="text-neutral-400 hover:text-neutral-950 p-1"
                >
                  {expandedId === "item1" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {expandedId === "item1" && (
              <div className="mt-3 pl-8 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl">
                <p>
                  <strong>Why Google cares:</strong> Direct dialog links (containing <code className="bg-neutral-200 px-1 py-0.5 rounded text-[10px]">writereview?placeid=...</code>) skip 4 clicks. This lifts in-store conversion from ~2% to ~25%, yielding the review velocity Google algorithmically uses to rank you at the top.
                </p>
              </div>
            )}
          </div>

          {/* Item 2: NFC Review Velocity */}
          <div className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    activeCardsCount > 0 && recentScansCount > 0
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {activeCardsCount > 0 && recentScansCount > 0 ? (
                    <Check size={12} />
                  ) : (
                    "2"
                  )}
                </span>
                <div>
                  <p className="text-xs font-bold text-neutral-950">
                    2. Consistent Tap Velocity (3-5 taps/week target)
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    {recentScansCount > 0
                      ? `Active! You have ${recentScansCount} taps in the last 7 days.`
                      : "Target 3-5 fresh taps every week so Google detects an active business."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleExpand("item2")}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                {expandedId === "item2" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedId === "item2" && (
              <div className="mt-3 pl-8 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl">
                <p>
                  <strong>Pro tip:</strong> 10 reviews spread over 4 weeks ranks significantly higher than 20 reviews dumped on a single day. Google rewards steady <em>review recency</em>.
                </p>
              </div>
            )}
          </div>

          {/* Item 3: Hours & Primary Category */}
          <div className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleCheck("gbpHours")}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                    checklist.gbpHours
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "border-neutral-300 hover:border-neutral-950 bg-white"
                  }`}
                >
                  {checklist.gbpHours && <Check size={12} />}
                </button>
                <div>
                  <p className="text-xs font-bold text-neutral-950">
                    3. Exact Operating Hours & Primary Category
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Ensure your Google Business Profile primary category matches customer search terms.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleExpand("item3")}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                {expandedId === "item3" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedId === "item3" && (
              <div className="mt-3 pl-8 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl">
                <p>
                  Your <strong>Primary Category</strong> dictates over 60% of Google Maps keyword matching. Choose the most specific term (e.g., &quot;Specialty Coffee Shop&quot; instead of just &quot;Store&quot;).
                </p>
              </div>
            )}
          </div>

          {/* Item 4: Reply to 100% of reviews */}
          <div className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleCheck("replyReviews")}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                    checklist.replyReviews
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "border-neutral-300 hover:border-neutral-950 bg-white"
                  }`}
                >
                  {checklist.replyReviews && <Check size={12} />}
                </button>
                <div>
                  <p className="text-xs font-bold text-neutral-950">
                    4. Reply to 100% of Customer Reviews (Within 48h)
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Google officially confirms business owner response rate is a core local ranking signal.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleExpand("item4")}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                {expandedId === "item4" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedId === "item4" && (
              <div className="mt-3 pl-8 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl">
                <p>
                  Always mention local keywords naturally in your reply (e.g. <em>&quot;Thanks for visiting our Portland bakery, Sarah! So glad you enjoyed the sourdough.&quot;</em>). Google indexes owner replies for local search keywords!
                </p>
              </div>
            )}
          </div>

          {/* Item 5: Weekly photos */}
          <div className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleCheck("weeklyPhotos")}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                    checklist.weeklyPhotos
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "border-neutral-300 hover:border-neutral-950 bg-white"
                  }`}
                >
                  {checklist.weeklyPhotos && <Check size={12} />}
                </button>
                <div>
                  <p className="text-xs font-bold text-neutral-950">
                    5. Add 2 New High-Res Photos Every 7 Days
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Profiles with weekly photos receive 42% more requests for directions on Google Maps.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleExpand("item5")}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                {expandedId === "item5" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedId === "item5" && (
              <div className="mt-3 pl-8 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl">
                <p>
                  Upload photos of your storefront, products, menu items, or happy team. Google&apos;s computer vision analyzes image contents to confirm store vitality.
                </p>
              </div>
            )}
          </div>

          {/* Item 6: Strategic Card Placement */}
          <div className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleCheck("counterPlacement")}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                    checklist.counterPlacement
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "border-neutral-300 hover:border-neutral-950 bg-white"
                  }`}
                >
                  {checklist.counterPlacement && <Check size={12} />}
                </button>
                <div>
                  <p className="text-xs font-bold text-neutral-950">
                    6. Deploy NFC Cards at High-Retention Touchpoints
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Place cards directly next to checkout registers, table numbers, or receipt folders.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleExpand("item6")}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                {expandedId === "item6" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedId === "item6" && (
              <div className="mt-3 pl-8 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl">
                <p>
                  The highest performing placements are <strong>checkout payment counters</strong> (where customers wait 15–30 seconds for receipts) and <strong>table tents</strong> (where diners relax after eating).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Smart Sentiment Review Shield Inbox ─────────────── */}
      <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-2 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950">
                Private Feedback Inbox
              </h2>
              <p className="text-xs text-neutral-500">
                Direct customer suggestions & private notes submitted directly to management.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-700">
            {feedbacks.length} {feedbacks.length === 1 ? "submission" : "submissions"}
          </span>
        </div>

        <div className="mt-4">
          {feedbacks.length === 0 ? (
            <div className="py-8 text-center">
              <ShieldCheck size={28} className="mx-auto text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-neutral-950">Private Feedback Channel Active</p>
              <p className="mt-1 text-[11px] text-neutral-500">
                No private feedback submissions yet. When customers submit a direct note to management, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition ${
                    item.resolved
                      ? "border-neutral-200/60 bg-neutral-50/50 opacity-60"
                      : "border-neutral-200 bg-[#fafaf8]"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-950">
                        {item.rating}-Star Feedback
                      </span>
                      {item.cardLabel && (
                        <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[9px] font-mono text-neutral-700">
                          {item.cardLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      {!item.resolved && (
                        <button
                          type="button"
                          onClick={() => handleResolveFeedback(item.id)}
                          className="rounded-lg bg-white border border-neutral-300 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                        >
                          Mark as Resolved
                        </button>
                      )}
                      {item.resolved && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check size={12} /> Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-neutral-800 font-medium">
                    &ldquo;{item.comment}&rdquo;
                  </p>

                  {item.contact && (
                    <div className="mt-2 text-[11px] text-neutral-500">
                      <strong>Customer contact:</strong> {item.contact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
