import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Zap,
  MapPin,
  Calendar,
} from "lucide-react";

export default async function AnalyticsPage() {
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
              _count: { select: { scans: true, linkClicks: true } },
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

  // Total counts
  const totalScans = await db.scan.count({
    where: { cardId: { in: cardIds } },
  });

  const totalClicks = await db.linkClick.count({
    where: { cardId: { in: cardIds } },
  });

  // Fetch scans from the last 14 days
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const scansLast14Days = await db.scan.findMany({
    where: {
      cardId: { in: cardIds },
      timestamp: { gte: fourteenDaysAgo },
    },
    select: { timestamp: true },
  });

  // Group scans by date
  const dateCounts: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dateCounts[key] = 0;
  }

  scansLast14Days.forEach((scan) => {
    const key = scan.timestamp.toISOString().split("T")[0];
    if (dateCounts[key] !== undefined) {
      dateCounts[key]++;
    }
  });

  const chartEntries = Object.entries(dateCounts).map(([date, count]) => {
    const formatted = new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return { date, label: formatted, count };
  });

  const maxDailyScans = Math.max(1, ...chartEntries.map((c) => c.count));

  // Clicks by Link Type
  const clicksByTypeRaw = await db.linkClick.groupBy({
    by: ["linkType"],
    where: { cardId: { in: cardIds } },
    _count: { linkType: true },
  });

  const clickDistribution = clicksByTypeRaw.map((item) => ({
    type: item.linkType,
    count: item._count.linkType,
    percentage:
      totalClicks > 0
        ? Math.round((item._count.linkType / totalClicks) * 100)
        : 0,
  }));

  // Top locations
  const scansWithLocation = await db.scan.groupBy({
    by: ["city", "country"],
    where: { cardId: { in: cardIds }, city: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-neutral-950/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
          Tap Telemetry & Review Analytics
        </h1>
        <p className="mt-1 text-xs text-neutral-600">
          Measure physical customer engagement, tap conversion rates, and channel intent.
        </p>
      </div>

      {/* ── Metric Highlights ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-950/10 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              All-Time Taps
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <Zap size={16} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-neutral-950">{totalScans}</p>
          <p className="mt-2 text-xs text-neutral-500">Physical chip activations</p>
        </div>

        <div className="rounded-2xl border border-neutral-950/10 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              High-Intent Clicks
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <MousePointerClick size={16} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-neutral-950">{totalClicks}</p>
          <p className="mt-2 text-xs text-neutral-500">Reviews, directions, socials</p>
        </div>

        <div className="rounded-2xl border border-neutral-950/10 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Conversion Ratio
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-neutral-950">
            {totalScans > 0
              ? `${Math.round((totalClicks / totalScans) * 100)}%`
              : "0%"}
          </p>
          <p className="mt-2 text-xs text-neutral-500">Taps converting into clicks</p>
        </div>
      </div>

      {/* ── 14-Day Timeline Chart (Pure CSS Bar Chart) ── */}
      <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-2 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-neutral-950">Daily Tap Velocity</h2>
            <p className="text-xs text-neutral-500">
              Customer taps recorded over the last 14 days
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-700">
            <Calendar size={13} className="text-neutral-950" />
            <span>Last 14 Days</span>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="mt-8 flex h-52 items-end gap-2 sm:gap-3">
          {chartEntries.map((item) => {
            const heightPercent =
              item.count > 0
                ? Math.max(12, Math.round((item.count / maxDailyScans) * 100))
                : 4;

            return (
              <div
                key={item.date}
                className="group relative flex flex-1 flex-col items-center h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-10 hidden rounded-lg border border-neutral-900 bg-neutral-950 px-2 py-1 text-[11px] font-bold text-white shadow-lg group-hover:flex">
                  {item.count} taps
                </div>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all group-hover:bg-neutral-800 ${
                    item.count > 0
                      ? "bg-neutral-950"
                      : "bg-neutral-200/60"
                  }`}
                />

                {/* Day label */}
                <span className="mt-2 truncate text-[10px] text-neutral-500">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Two Column Insights ── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Click Types Breakdown */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-base font-bold text-neutral-950">
              Intent Breakdown
            </h2>
            <p className="text-xs text-neutral-500">
              Where customers navigate after scanning
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {clickDistribution.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-500">
                No link clicks recorded yet.
              </p>
            ) : (
              clickDistribution.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-950">
                      {item.type === "REVIEW"
                        ? "⭐ Google Reviews"
                        : item.type === "DIRECTIONS"
                        ? "📍 Map & Directions"
                        : item.type === "CONTACT"
                        ? "📞 Phone / Email"
                        : item.type === "SOCIAL"
                        ? "📱 Social Channels"
                        : item.type === "WEBSITE"
                        ? "🌐 Official Website"
                        : item.type}
                    </span>
                    <span className="font-mono text-neutral-500">
                      {item.count} clicks ({item.percentage}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full rounded-full ${
                        item.type === "REVIEW"
                          ? "bg-neutral-950"
                          : item.type === "DIRECTIONS"
                          ? "bg-neutral-700"
                          : item.type === "CONTACT"
                          ? "bg-neutral-800"
                          : "bg-neutral-600"
                      }`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Cards Performance */}
        <div className="rounded-3xl border border-neutral-950/10 bg-white p-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-base font-bold text-neutral-950">
              Touchpoint Leaderboard
            </h2>
            <p className="text-xs text-neutral-500">
              Comparison between physical placement points
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {business.cards.map((card, idx) => (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-xs font-bold text-white">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-neutral-950">
                      {card.label || card.cardId}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      /c/{card.cardId}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-neutral-950">
                    {card._count.scans} taps
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {card._count.linkClicks} clicks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
