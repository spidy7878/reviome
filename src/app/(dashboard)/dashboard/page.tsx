import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Zap,
  CreditCard,
  MousePointerClick,
  TrendingUp,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Phone,
  Navigation,
  Globe,
  Star,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronRight,
  Clock,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: {
        include: {
          cards: {
            include: {
              _count: {
                select: { scans: true, linkClicks: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user?.business) {
    redirect("/login");
  }

  const business = user.business;
  const cardIds = business.cards.map((c: { id: string }) => c.id);

  // Stats computation
  const totalCards = business.cards.length;
  const activeCards = business.cards.filter((c: { isActive: boolean }) => c.isActive).length;

  const totalScans = await db.scan.count({
    where: { cardId: { in: cardIds } },
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentScans = await db.scan.count({
    where: {
      cardId: { in: cardIds },
      timestamp: { gte: sevenDaysAgo },
    },
  });

  // Breakdown of link clicks
  const clicksByTypeRaw = await db.linkClick.groupBy({
    by: ["linkType"],
    where: { cardId: { in: cardIds } },
    _count: { linkType: true },
  });

  const clickMap: Record<string, number> = {};
  clicksByTypeRaw.forEach((item: any) => {
    clickMap[item.linkType] = item._count.linkType;
  });

  const reviewClicks = clickMap["REVIEW"] || 0;
  const contactClicks = clickMap["CONTACT"] || 0;
  const directionsClicks = clickMap["DIRECTIONS"] || 0;
  const websiteClicks = clickMap["WEBSITE"] || 0;
  const totalClicks = clicksByTypeRaw.reduce((acc: number, c: any) => acc + c._count.linkType, 0);

  // Recent scans feed
  const latestScans = await db.scan.findMany({
    where: { cardId: { in: cardIds } },
    orderBy: { timestamp: "desc" },
    take: 6,
    include: { card: true },
  });

  const primaryCard = business.cards[0];

  const businessTheme =
    typeof business.theme === "object" && business.theme !== null
      ? (business.theme as Record<string, unknown>)
      : {};

  const checklist = (businessTheme.checklist as Record<string, boolean>) || {};
  const privateFeedbacks = (businessTheme.privateFeedback as Array<any>) || [];
  const unresolvedFeedbackCount = privateFeedbacks.filter((f) => !f.resolved).length;

  const hasOptimalReviewUrl = Boolean(
    business.googleReviewUrl &&
      business.googleReviewUrl.includes("writereview?placeid=")
  );

  const hasContactInfo = Boolean(
    business.phone && business.address && business.website
  );

  // Calculate Reviome Growth Score (0 to 100)
  let growthScore = 0;
  if (hasOptimalReviewUrl) growthScore += 25;
  if (activeCards > 0 && totalScans > 0) growthScore += 20;
  if (hasContactInfo) growthScore += 15;
  if (checklist.gbpHours) growthScore += 15;
  if (checklist.replyReviews) growthScore += 15;
  if (checklist.weeklyPhotos) growthScore += 10;

  // Touchpoint Leaderboard
  const touchpointsSummary = business.cards
    .map((card: any) => {
      const interactions = card._count.scans + card._count.linkClicks;
      return {
        id: card.id,
        cardId: card.cardId,
        label: card.label || card.cardId,
        isActive: card.isActive,
        scans: card._count.scans,
        clicks: card._count.linkClicks,
        interactions,
      };
    })
    .sort((a: any, b: any) => b.interactions - a.interactions);

  const topTouchpoint = touchpointsSummary[0] || null;

  // Data-Driven Action Center items
  type ActionItem = {
    level: "HIGH" | "OPPORTUNITY" | "GOOD";
    title: string;
    description: string;
    actionText?: string;
    actionHref?: string;
  };

  const actionItems: ActionItem[] = [];

  // High priority: missing 1-tap Place ID
  if (!hasOptimalReviewUrl) {
    actionItems.push({
      level: "HIGH",
      title: "Configure 1-Tap Google Review Place ID",
      description:
        "Your current review link does not pop open the 5-star modal directly. Add your Place ID to maximize customer review submissions.",
      actionText: "Configure in Growth Hub →",
      actionHref: "/dashboard/growth#review-tools",
    });
  }

  // High priority: unresolved customer feedback
  if (unresolvedFeedbackCount > 0) {
    actionItems.push({
      level: "HIGH",
      title: `${unresolvedFeedbackCount} Unanswered Private Feedback ${
        unresolvedFeedbackCount === 1 ? "Note" : "Notes"
      }`,
      description:
        "Direct customer critiques or suggestions have arrived through your NFC touchpoints and require management attention.",
      actionText: "Open Feedback Inbox →",
      actionHref: "/dashboard/feedback",
    });
  }

  // Opportunity: weekly photos
  if (!checklist.weeklyPhotos) {
    actionItems.push({
      level: "OPPORTUNITY",
      title: "Upload Fresh Google Maps Photos",
      description:
        "No photos logged this week. Uploading photos of your venue, food, or team signals an active business to Google.",
      actionText: "Update Growth Checklist →",
      actionHref: "/dashboard/growth",
    });
  }

  // Opportunity: incomplete profile
  if (!hasContactInfo) {
    actionItems.push({
      level: "OPPORTUNITY",
      title: "Complete Local Store Details",
      description:
        "Ensure your phone number, store address, and website are populated so customers can call or navigate directly.",
      actionText: "Update Store Profile →",
      actionHref: "/dashboard/profile",
    });
  }

  // Good status
  if (recentScans > 0) {
    actionItems.push({
      level: "GOOD",
      title: "Consistent Tap Activity",
      description: `Recorded ${recentScans} customer taps over the last 7 days across your active touchpoints.`,
    });
  }

  if (hasOptimalReviewUrl) {
    actionItems.push({
      level: "GOOD",
      title: "1-Tap Review Magnet Active",
      description:
        "Your Google Place ID is active and directs customers into the 5-star review dialog.",
    });
  }

  return (
    <div className="space-y-8">
      {/* ── Top Header / Welcome ───────────────────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-950/10 pb-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            Basic ₹199/mo Plan Active • Collect + Measure + Growth
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
            {business.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Real-time physical customer engagement, Google review conversions, and location performance.
          </p>
        </div>

        {primaryCard && (
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/growth"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-xs transition hover:bg-neutral-50"
            >
              <Zap size={13} className="text-amber-500" />
              <span>Google Growth Hub</span>
            </Link>
            <Link
              href={`/c/${primaryCard.cardId}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800"
            >
              <span>Test Tap Simulator</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Metric 1: Total Interactions */}
        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Total Taps & Scans
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <Zap size={14} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-neutral-950">{totalScans}</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp size={12} />
            <span>+{recentScans} in 7 days</span>
          </div>
        </div>

        {/* Metric 2: Google Review Clicks */}
        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Review Clicks
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Star size={14} className="fill-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-neutral-950">{reviewClicks}</p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {totalScans > 0
              ? `${Math.round((reviewClicks / totalScans) * 100)}% tap conversion`
              : "Direct Google intents"}
          </p>
        </div>

        {/* Metric 3: Phone Calls */}
        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Customer Calls
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Phone size={14} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-neutral-950">{contactClicks}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Tapped to call</p>
        </div>

        {/* Metric 4: Directions & Web */}
        <div className="rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Directions & Web
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Navigation size={14} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-neutral-950">
            {directionsClicks + websiteClicks}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {directionsClicks} maps • {websiteClicks} web
          </p>
        </div>

        {/* Metric 5: Active Touchpoints */}
        <div className="col-span-2 rounded-2xl border border-neutral-950/10 bg-white p-4 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Touchpoints
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <CreditCard size={14} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-neutral-950">
            {activeCards}{" "}
            <span className="text-xs font-normal text-neutral-400">/ {totalCards}</span>
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">Active NFC cards</p>
        </div>
      </div>

      {/* ── Two Column: Growth Score Snapshot & Action Center ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Reviome Growth Score Summary Card */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-950 text-white font-bold text-[10px]">
                  RG
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Growth Score
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  growthScore >= 80
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {growthScore >= 80 ? "STRONG" : "NEEDS ACTION"}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-neutral-950">
                {growthScore}
              </span>
              <span className="text-sm font-semibold text-neutral-400">/ 100</span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                style={{ width: `${growthScore}%` }}
                className={`h-full transition-all duration-500 ${
                  growthScore >= 80 ? "bg-emerald-600" : "bg-neutral-950"
                }`}
              />
            </div>

            <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
              Monitors your review magnet setup, touchpoint activity, and local business habits.
            </p>
            <p className="mt-1 text-[10px] text-neutral-400">
              * Internal Reviome operational score (not an official Google score).
            </p>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <Link
              href="/dashboard/growth"
              className="flex items-center justify-between text-xs font-bold text-neutral-950 hover:underline"
            >
              <span>View Full Checklist & Review Tools</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right 2 Columns: Action Center (Your Next Actions) */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-950">
                Action Center • Your Next Actions
              </h2>
              <p className="text-xs text-neutral-500">
                Data-driven priorities based on your live customer telemetry and profile status.
              </p>
            </div>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-700">
              {actionItems.length} {actionItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {actionItems.length === 0 ? (
              <p className="py-6 text-center text-xs text-neutral-500">
                All high-priority operational items are up to date!
              </p>
            ) : (
              actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-xs transition ${
                    item.level === "HIGH"
                      ? "border-amber-200/80 bg-amber-50/30"
                      : item.level === "OPPORTUNITY"
                      ? "border-blue-200/60 bg-blue-50/20"
                      : "border-emerald-200/60 bg-emerald-50/20"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                          item.level === "HIGH"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : item.level === "OPPORTUNITY"
                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        }`}
                      >
                        {item.level === "HIGH"
                          ? "HIGH PRIORITY"
                          : item.level === "OPPORTUNITY"
                          ? "OPPORTUNITY"
                          : "GOOD"}
                      </span>
                      <p className="font-bold text-neutral-950">{item.title}</p>
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.actionHref && (
                    <Link
                      href={item.actionHref}
                      className="shrink-0 text-[11px] font-bold text-neutral-950 underline hover:text-neutral-700 mt-0.5"
                    >
                      {item.actionText}
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Two Column: Touchpoint Leaderboard & Recent Activity ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Touchpoint Summary Leaderboard */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-950">Touchpoint Leaderboard</h2>
              <p className="text-xs text-neutral-500">
                Which physical spots generate the most engagement
              </p>
            </div>
            <Link
              href="/dashboard/cards"
              className="text-xs font-semibold text-neutral-950 hover:underline"
            >
              Manage →
            </Link>
          </div>

          {topTouchpoint && topTouchpoint.interactions > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-neutral-950 p-3 text-white">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-400" />
                <span className="text-xs font-bold">Top Performer:</span>
                <span className="text-xs text-neutral-200">{topTouchpoint.label}</span>
              </div>
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                {topTouchpoint.interactions} total
              </span>
            </div>
          )}

          <div className="mt-4 space-y-2.5">
            {touchpointsSummary.length === 0 ? (
              <p className="py-6 text-center text-xs text-neutral-500">
                No touchpoints configured.
              </p>
            ) : (
              touchpointsSummary.map((card: any, idx: number) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-3 text-xs"
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 font-bold text-[10px] text-neutral-700">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-neutral-950">{card.label}</p>
                      <p className="truncate text-[10px] font-mono text-neutral-500">
                        /c/{card.cardId}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-neutral-950">
                      {card.interactions}
                    </span>{" "}
                    <span className="text-[10px] text-neutral-500">interactions</span>
                    <div className="text-[10px] text-neutral-400">
                      {card.scans} taps • {card.clicks} clicks
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Columns: Recent Live Physical Scans */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-950">
                Recent Physical Scans
              </h2>
              <p className="text-xs text-neutral-500">
                Real-time tap telemetry from your NFC tags & QR codes
              </p>
            </div>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-950 hover:underline"
            >
              Full Analytics
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-neutral-100">
            {latestScans.length === 0 ? (
              <div className="py-12 text-center text-sm text-neutral-500">
                No scans recorded yet. Tap your physical card or open{" "}
                <Link
                  href={`/c/${primaryCard?.cardId}`}
                  className="font-semibold text-neutral-950 underline"
                  target="_blank"
                >
                  your card link
                </Link>{" "}
                to generate real telemetry.
              </div>
            ) : (
              latestScans.map((scan: any) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                      <Zap size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-950">
                        {scan.card.label || scan.card.cardId}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {scan.city ? `${scan.city}, ${scan.country}` : "Mobile Device"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-neutral-700">
                      {new Date(scan.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <span className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-mono font-medium text-neutral-600">
                      /c/{scan.card.cardId}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
