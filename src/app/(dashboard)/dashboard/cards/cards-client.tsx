"use client";

import { useState } from "react";
import {
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Power,
  Sparkles,
  Smartphone,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toggleCardStatus, createNewCard } from "../actions";

interface CardItem {
  id: string;
  cardId: string;
  label: string | null;
  isActive: boolean;
  createdAt: Date;
  _count: {
    scans: number;
    linkClicks: number;
  };
}

export function CardsClient({ initialCards }: { initialCards: CardItem[] }) {
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCardId, setNewCardId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);

  const handleCopy = (cardId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/c/${cardId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = async (card: CardItem) => {
    try {
      setLoadingToggle(card.id);
      await toggleCardStatus(card.id, !card.isActive);
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to toggle card status");
    } finally {
      setLoadingToggle(null);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await createNewCard({
        cardId: newCardId,
        label: newLabel,
      });

      if (res.success && res.card) {
        setCards((prev) => [
          ...prev,
          {
            ...res.card,
            _count: { scans: 0, linkClicks: 0 },
          },
        ]);
        setIsModalOpen(false);
        setNewCardId("");
        setNewLabel("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create card");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-950/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
            NFC Touchpoint Cards
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Encode these URLs to your physical NTAG213/215/216 cards or stand displays.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95"
        >
          <Plus size={16} />
          Register New Card
        </button>
      </div>

      {/* Guide Callout */}
      <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-neutral-100 p-2 text-neutral-950">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              How to write to your physical cards
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              Copy any card URL below, download the free <strong className="text-neutral-950">NFC Tools</strong> app on your iPhone or Android, tap <strong className="text-neutral-950">&quot;Write &gt; Add a record &gt; URL&quot;</strong>, and tap your physical NFC sticker or card. Any customer tap will immediately open your branded profile and track scans!
            </p>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              className="flex flex-col justify-between rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs transition hover:border-neutral-950/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-950">
                    <CreditCard size={20} />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                      card.isActive
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-neutral-200 bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {card.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-neutral-950">
                    {card.label || "NFC Card"}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500 font-mono">
                    /c/{card.cardId}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-3 text-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                      Scans
                    </span>
                    <p className="text-lg font-black text-neutral-950">
                      {card._count.scans}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                      Clicks
                    </span>
                    <p className="text-lg font-black text-neutral-950">
                      {card._count.linkClicks}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(card.cardId)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-50"
                  >
                    {copiedId === card.cardId ? (
                      <>
                        <Check size={14} className="text-emerald-700" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/c/${card.cardId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-50"
                    title="Open public view"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <button
                  onClick={() => handleToggle(card)}
                  disabled={loadingToggle === card.id}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
                    card.isActive
                      ? "text-neutral-500 hover:bg-red-50 hover:text-red-700"
                      : "text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {loadingToggle === card.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Power size={12} />
                  )}
                  <span>
                    {card.isActive ? "Deactivate Touchpoint" : "Re-activate Touchpoint"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Card Modal ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-base font-bold text-neutral-950">
                  Add New NFC Card
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-950 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-neutral-600">
              Create a custom slug for your physical NFC sticker, table tent, or counter badge.
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCard} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Card Label / Placement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 4 Tent, Front Register"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-2.5 px-3.5 text-xs text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Card Slug (NFC URL)
                </label>
                <div className="mt-1.5 flex rounded-xl border border-neutral-200 bg-neutral-50/70 px-3 py-2 text-xs">
                  <span className="text-neutral-500 font-mono">reviome.app/c/</span>
                  <input
                    type="text"
                    required
                    placeholder="counter-card-1"
                    value={newCardId}
                    onChange={(e) => setNewCardId(e.target.value)}
                    className="flex-1 bg-transparent text-neutral-950 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  Create Touchpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
