"use client";

import { useState } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  User,
  ExternalLink,
} from "lucide-react";
import { resolveFeedbackItem } from "../actions";

interface PrivateFeedbackItem {
  id: string;
  rating: number;
  comment: string;
  contact?: string;
  cardLabel?: string;
  timestamp: string;
  resolved?: boolean;
}

export function FeedbackClient({
  initialFeedbacks,
}: {
  initialFeedbacks: PrivateFeedbackItem[];
}) {
  const [feedbacks, setFeedbacks] = useState<PrivateFeedbackItem[]>(initialFeedbacks);
  const [filter, setFilter] = useState<"ALL" | "UNRESOLVED" | "RESOLVED">("ALL");
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, resolved: true } : f))
    );
    try {
      await resolveFeedbackItem(id);
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  const filtered = feedbacks.filter((f) => {
    if (filter === "UNRESOLVED") return !f.resolved;
    if (filter === "RESOLVED") return !!f.resolved;
    return true;
  });

  const unresolvedCount = feedbacks.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-8">
      {/* ── Top Header ─────────────────────────────────────── */}
      <div className="border-b border-neutral-950/10 pb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 shadow-xs">
              <ShieldCheck size={13} className="text-neutral-950" />
              Direct Customer Voice
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
              Private Feedback Inbox
            </h1>
            <p className="mt-1 text-xs text-neutral-600">
              Direct notes and critiques submitted privately by customers on your NFC & QR touchpoints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-950">
              {unresolvedCount} Pending Attention
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            filter === "ALL"
              ? "bg-neutral-950 text-white"
              : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          All ({feedbacks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("UNRESOLVED")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            filter === "UNRESOLVED"
              ? "bg-neutral-950 text-white"
              : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Unresolved ({unresolvedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("RESOLVED")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            filter === "RESOLVED"
              ? "bg-neutral-950 text-white"
              : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Resolved ({feedbacks.length - unresolvedCount})
        </button>
      </div>

      {/* ── Feedback List ──────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-950">
            <MessageSquare size={22} />
          </div>
          <h3 className="mt-4 text-base font-bold text-neutral-950">
            {filter === "UNRESOLVED" ? "All Caught Up!" : "No Feedback Logged"}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-neutral-500">
            {filter === "UNRESOLVED"
              ? "All customer critiques and suggestions have been reviewed and resolved."
              : "When customers tap your NFC cards and choose 'Send Private Feedback to Merchant', their messages appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition ${
                item.resolved
                  ? "border-neutral-200 bg-[#fafaf8] opacity-75"
                  : "border-neutral-950/15 bg-white shadow-xs"
              }`}
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-1 text-amber-700 border border-amber-200">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-neutral-950">
                        {item.cardLabel || "NFC Touchpoint"}
                      </span>
                      <span className="text-[11px] text-neutral-400">•</span>
                      <span className="text-[11px] text-neutral-500">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {item.resolved ? (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          RESOLVED
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          PENDING
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-neutral-800 leading-relaxed">
                      "{item.comment}"
                    </p>

                    {item.contact && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                        <User size={12} className="text-neutral-500" />
                        <span>Customer Contact: </span>
                        <span className="font-semibold">{item.contact}</span>
                      </div>
                    )}
                  </div>
                </div>

                {!item.resolved && (
                  <button
                    type="button"
                    disabled={resolvingId === item.id}
                    onClick={() => handleResolve(item.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-900/15 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-950 shadow-xs hover:bg-neutral-50 hover:border-neutral-950"
                  >
                    <Check size={13} className="text-emerald-600" />
                    <span>{resolvingId === item.id ? "Saving..." : "Mark Resolved"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
