"use client";

import { useState } from "react";
import {
  Star,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  ShieldCheck,
  Layers,
  Send,
  Loader2,
  Plus,
} from "lucide-react";
import {
  saveReviewReply,
  generateAiReviewReply,
  addManualReview,
} from "../actions";

export interface ReviewItem {
  id: string;
  rating: number;
  reviewText: string | null;
  reviewerName: string | null;
  reviewerPhotoUrl: string | null;
  reviewDate: string;
  responseText: string | null;
  responseDate: string | null;
  responseStatus: string;
  externalReviewId: string | null;
}

interface ReviewsClientProps {
  businessName: string;
  googleReviewUrl: string | null;
  initialReviews: ReviewItem[];
}

export function ReviewsClient({
  businessName,
  googleReviewUrl,
  initialReviews,
}: ReviewsClientProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(
    initialReviews[0]?.id || null
  );

  // AI Assistant states
  const [selectedTone, setSelectedTone] = useState<
    "Professional" | "Friendly" | "Warm" | "Concise"
  >("Professional");
  const [draftReply, setDraftReply] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savingReply, setSavingReply] = useState(false);

  // Manual Review Dialog for testing
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualRating, setManualRating] = useState(5);
  const [manualText, setManualText] = useState("");
  const [submittingManual, setSubmittingManual] = useState(false);

  // Statistics calculation
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const unansweredReviews = reviews.filter(
    (r) => r.responseStatus === "UNANSWERED"
  ).length;

  // Rating distribution counts
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (filter === "UNANSWERED") return r.responseStatus === "UNANSWERED";
    if (filter === "5") return r.rating === 5;
    if (filter === "4") return r.rating === 4;
    if (filter === "3") return r.rating === 3;
    if (filter === "2") return r.rating === 2;
    if (filter === "1") return r.rating === 1;
    return true;
  });

  const activeReview = reviews.find((r) => r.id === selectedReviewId) || null;

  // Generate AI Reply handler
  const handleGenerateReply = async () => {
    if (!activeReview || !activeReview.reviewText) return;

    setIsGeneratingAi(true);
    try {
      const result = await generateAiReviewReply({
        reviewText: activeReview.reviewText,
        rating: activeReview.rating,
        reviewerName: activeReview.reviewerName || undefined,
        tone: selectedTone,
      });
      setDraftReply(result.reply);
    } catch (err) {
      console.error("AI reply error:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyReply = () => {
    if (!draftReply.trim()) return;
    navigator.clipboard.writeText(draftReply);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleSaveReply = async () => {
    if (!activeReview || !draftReply.trim()) return;

    setSavingReply(true);
    try {
      await saveReviewReply(activeReview.id, draftReply);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === activeReview.id
            ? {
                ...r,
                responseText: draftReply,
                responseDate: new Date().toISOString(),
                responseStatus: "REPLIED",
              }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSavingReply(false);
    }
  };

  const handleAddManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setSubmittingManual(true);
    try {
      const res = await addManualReview({
        reviewerName: manualName || "Google Customer",
        rating: manualRating,
        reviewText: manualText,
      });

      if (res.review) {
        const item: ReviewItem = {
          id: res.review.id,
          rating: res.review.rating,
          reviewText: res.review.reviewText,
          reviewerName: res.review.reviewerName,
          reviewerPhotoUrl: res.review.reviewerPhotoUrl,
          reviewDate: res.review.reviewDate.toISOString(),
          responseText: res.review.responseText,
          responseDate: res.review.responseDate?.toISOString() || null,
          responseStatus: res.review.responseStatus,
          externalReviewId: res.review.externalReviewId,
        };
        setReviews([item, ...reviews]);
        setSelectedReviewId(item.id);
        setShowManualModal(false);
        setManualText("");
        setManualName("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingManual(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Top Header ─────────────────────────────────────── */}
      <div className="border-b border-neutral-950/10 pb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 shadow-xs">
              <Sparkles size={13} className="text-amber-500" />
              Pro ₹449/mo Feature • Google Reputation Manager
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
              Google Reviews & AI Reply Assistant
            </h1>
            <p className="mt-1 text-xs text-neutral-600">
              Manage incoming Google reviews, monitor rating distribution, and generate authentic AI response drafts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-900/15 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 transition"
            >
              <Plus size={14} />
              <span>Add Review for Testing</span>
            </button>
            {googleReviewUrl && (
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
              >
                <span>View Google Listing</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Google Business Profile Sync Status Banner ──────── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
              <RefreshCw size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-neutral-950">
                  Google Business Profile Synchronization
                </p>
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                  Direct API Connection In Preparation
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Continuous real-time synchronization requires Google Business Profile OAuth API permissions.
                You can currently test AI review responses, review categorization, and manual review imports.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Google Business Profile OAuth API synchronization is in preparation for live multi-tenant accounts. You can test manual review imports and AI response generation below."
                )
              }
              className="rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition"
            >
              Connect Google Account
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Total Reviews
          </span>
          <p className="mt-2 text-2xl font-extrabold text-neutral-950">{totalReviews}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Logged in Reviome</p>
        </div>

        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Average Rating
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-neutral-950">
              {averageRating}
            </span>
            <div className="flex text-amber-400">
              <Star size={14} className="fill-amber-400" />
            </div>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">Out of 5 stars</p>
        </div>

        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Unanswered Reviews
          </span>
          <p className="mt-2 text-2xl font-extrabold text-neutral-950">
            {unansweredReviews}
          </p>
          <p className="mt-1 text-[11px] text-amber-700 font-medium">
            {unansweredReviews > 0 ? "Requires owner reply" : "All answered"}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            5-Star Ratio
          </span>
          <p className="mt-2 text-2xl font-extrabold text-neutral-950">
            {totalReviews > 0
              ? `${Math.round((ratingCounts[5] / totalReviews) * 100)}%`
              : "0%"}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {ratingCounts[5]} top-rated reviews
          </p>
        </div>
      </div>

      {/* ── Main Two-Column Layout: Review List & AI Detail ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (5 Cols): Review List & Filter */}
        <div className="space-y-4 lg:col-span-5">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200/80 pb-3">
            {[
              { id: "ALL", label: `All (${totalReviews})` },
              { id: "UNANSWERED", label: `Unanswered (${unansweredReviews})` },
              { id: "5", label: `5★ (${ratingCounts[5]})` },
              { id: "4", label: `4★ (${ratingCounts[4]})` },
              { id: "3", label: `3★ (${ratingCounts[3]})` },
              { id: "2", label: `2★ (${ratingCounts[2]})` },
              { id: "1", label: `1★ (${ratingCounts[1]})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                  filter === f.id
                    ? "bg-neutral-950 text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List items */}
          {filteredReviews.length === 0 ? (
            <div className="rounded-3xl border border-neutral-950/10 bg-white p-8 text-center shadow-xs">
              <Star size={24} className="mx-auto text-neutral-300" />
              <p className="mt-2 text-xs font-bold text-neutral-950">
                No reviews found
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Click "Add Review for Testing" above to add a Google review and test the AI Reply Assistant.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReviews.map((item) => {
                const isSelected = item.id === selectedReviewId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedReviewId(item.id);
                      setDraftReply(item.responseText || "");
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-neutral-950 bg-white shadow-sm ring-1 ring-neutral-950"
                        : "border-neutral-200/80 bg-[#fafaf8] hover:border-neutral-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-neutral-200 text-neutral-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-neutral-950">
                          {item.reviewerName || "Google Customer"}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.responseStatus === "REPLIED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {item.responseStatus === "REPLIED" ? "Replied" : "Unanswered"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-neutral-700 leading-relaxed">
                      {item.reviewText || "(No written text provided)"}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-neutral-500">
                      <span>
                        {new Date(item.reviewDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>Google Review</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Review Detail & AI Reply Assistant */}
        <div className="space-y-6 lg:col-span-7">
          {activeReview ? (
            <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs space-y-6">
              {/* Selected Review Header */}
              <div className="border-b border-neutral-100 pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950 font-bold text-sm">
                      {activeReview.reviewerName
                        ? activeReview.reviewerName.charAt(0).toUpperCase()
                        : "G"}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-neutral-950">
                        {activeReview.reviewerName || "Google Customer"}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < activeReview.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-neutral-200 text-neutral-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          {new Date(activeReview.reviewDate).toLocaleDateString(
                            undefined,
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      activeReview.responseStatus === "REPLIED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {activeReview.responseStatus === "REPLIED"
                      ? "✓ Replied"
                      : "Unanswered"}
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-neutral-100 bg-[#fafaf8] p-4">
                  <p className="text-xs text-neutral-800 leading-relaxed">
                    "{activeReview.reviewText || "No review commentary provided."}"
                  </p>
                </div>
              </div>

              {/* ── AI Reply Assistant Section ── */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                      AI Review Reply Assistant
                    </h3>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Authentic • Context-Aware
                  </span>
                </div>

                {/* Tone Selector */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-neutral-500 mr-1">
                    Tone:
                  </span>
                  {(
                    ["Professional", "Friendly", "Warm", "Concise"] as const
                  ).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setSelectedTone(tone)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        selectedTone === tone
                          ? "bg-neutral-950 text-white"
                          : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleGenerateReply}
                    disabled={isGeneratingAi || !activeReview.reviewText}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 transition"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-amber-400" />
                        <span>Generate Reply</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Response Textarea */}
                <div className="mt-3">
                  <textarea
                    rows={4}
                    value={draftReply}
                    onChange={(e) => setDraftReply(e.target.value)}
                    placeholder="Click 'Generate Reply' above or write your custom owner response here..."
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3.5 text-xs text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 leading-relaxed"
                  />
                </div>

                {/* Action Buttons: Copy & Save */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-neutral-500">
                    * Copy reply to paste into Google Business Profile.
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyReply}
                      disabled={!draftReply.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      {copiedSuccess ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Reply</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveReply}
                      disabled={savingReply || !draftReply.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 transition"
                    >
                      {savingReply ? "Saving..." : "Save Response"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Response Display */}
              {activeReview.responseText && (
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      Recorded Merchant Response
                    </span>
                    {activeReview.responseDate && (
                      <span className="text-[10px] font-normal text-neutral-500">
                        {new Date(activeReview.responseDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-800 leading-relaxed">
                    {activeReview.responseText}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-neutral-950/10 bg-white p-12 text-center shadow-xs">
              <MessageSquare size={28} className="mx-auto text-neutral-300" />
              <h3 className="mt-3 text-sm font-bold text-neutral-950">
                No Review Selected
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Select a review from the left column to view its details and draft an AI reply.
              </p>
            </div>
          )}

          {/* ── Review Insights Foundation ── */}
          <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Layers size={16} className="text-neutral-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                Pro Review Themes Foundation
              </h3>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Categories being prepared for sentiment theme clustering as Google reviews accumulate:
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Food & Taste",
                "Service Speed",
                "Staff Friendliness",
                "Cleanliness",
                "Value & Price",
                "Waiting Time",
                "Ambience & Vibes",
              ].map((theme) => (
                <span
                  key={theme}
                  className="rounded-full border border-neutral-200 bg-[#fafaf8] px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Add Manual Review for Testing ── */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-neutral-950">
              Add Review for Testing
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Input a genuine review from your Google profile to test the AI Reply Assistant without fabricating seed data.
            </p>

            <form onSubmit={handleAddManualSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Reviewer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Rating (Stars)
                </label>
                <div className="mt-1 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setManualRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        size={22}
                        className={
                          star <= manualRating
                            ? "fill-amber-400 text-amber-500"
                            : "fill-neutral-100 text-neutral-300"
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2">
                    {manualRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Review Commentary
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Great coffee and friendly barista, but the pastries were sold out by 4 PM."
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingManual || !manualText.trim()}
                  className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {submittingManual ? "Adding..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
