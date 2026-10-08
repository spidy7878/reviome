import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Zap,
  LayoutDashboard,
  CreditCard,
  Building2,
  BarChart3,
  ExternalLink,
  LogOut,
  User,
  Star,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch current business and active cards
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: {
        include: {
          cards: {
            where: { isActive: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!user || !user.business) {
    redirect("/login");
  }

  const business = user.business;
  const primaryCard = business.cards[0];

  return (
    <div className="flex min-h-screen bg-[#fafaf8] text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="hidden w-64 flex-col border-r border-neutral-950/10 bg-white md:flex">
        {/* Brand */}
        <div className="flex h-20 items-center gap-2.5 border-b border-neutral-950/10 px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 font-bold text-white shadow-xs">
            <Zap size={14} className="fill-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-[-0.04em] text-neutral-950">
              reviome
            </span>
            <span className="ml-1.5 rounded-full border border-neutral-900/10 bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
              Merchant
            </span>
          </div>
        </div>

        {/* Business Selector Pill */}
        <div className="p-4">
          <div className="rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-3.5 shadow-xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Active Business
            </p>
            <p className="mt-1 truncate text-sm font-bold text-neutral-950">
              {business.name}
            </p>
            <p className="truncate text-xs text-neutral-500 font-mono">
              /c/{primaryCard?.cardId ?? business.slug}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <LayoutDashboard size={16} className="text-neutral-500" />
            Overview
          </Link>
          <Link
            href="/dashboard/growth"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <Zap size={16} className="text-neutral-500" />
            Google Growth
          </Link>
          <Link
            href="/dashboard/reviews"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <Star size={16} className="text-neutral-500" />
            Reviews
          </Link>
          <Link
            href="/dashboard/cards"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <CreditCard size={16} className="text-neutral-500" />
            Touchpoints
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <BarChart3 size={16} className="text-neutral-500" />
            Analytics
          </Link>
          <Link
            href="/dashboard/feedback"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <Building2 size={16} className="text-neutral-500" />
            Feedback
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <User size={16} className="text-neutral-500" />
            Settings
          </Link>
        </nav>

        {/* Live Card Preview Button */}
        {primaryCard && (
          <div className="p-4">
            <a
              href={`/c/${primaryCard.cardId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-900/15 bg-white py-2.5 text-xs font-semibold text-neutral-900 shadow-xs transition hover:border-neutral-950 hover:bg-neutral-50"
            >
              <span>View Public Card</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* User Info & Logout */}
        <div className="border-t border-neutral-950/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-800">
                <User size={14} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-neutral-950">
                  {user.name || "Owner"}
                </p>
                <p className="truncate text-[11px] text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-red-600 transition"
              >
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header & Main Container ───────────────── */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-950/10 bg-white px-4 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white">
              <Zap size={14} className="fill-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-neutral-950">reviome</span>
          </Link>

          <div className="flex items-center gap-2">
            {primaryCard && (
              <a
                href={`/c/${primaryCard.cardId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-neutral-950/15 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-neutral-900 shadow-xs"
              >
                Live Card ↗
              </a>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg p-1.5 text-neutral-400 hover:text-red-600"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </header>

        {/* Mobile Navigation bar */}
        <div className="flex border-b border-neutral-950/10 bg-white/80 px-2 py-1 md:hidden overflow-x-auto text-xs backdrop-blur-md">
          <Link href="/dashboard" className="px-3 py-2 text-neutral-600 hover:text-neutral-950 font-medium whitespace-nowrap">Overview</Link>
          <Link href="/dashboard/cards" className="px-3 py-2 text-neutral-600 hover:text-neutral-950 font-medium whitespace-nowrap">Cards</Link>
          <Link href="/dashboard/profile" className="px-3 py-2 text-neutral-600 hover:text-neutral-950 font-medium whitespace-nowrap">Profile</Link>
          <Link href="/dashboard/analytics" className="px-3 py-2 text-neutral-600 hover:text-neutral-950 font-medium whitespace-nowrap">Analytics</Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
