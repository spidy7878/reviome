import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import {
  ArrowUpRight,
  Radio,
  QrCode,
  Smartphone,
  Star,
  CheckCircle2,
  Lock,
  Shield,
  Layers,
  BarChart3,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Store,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sliders,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <MarketingHeader currentPath="/" />

      <main>
        {/* ================================================================
            SECTION 1: HERO
        ================================================================ */}
        <section className="relative overflow-hidden border-b border-neutral-950/10">
          {/* Subtle architectural background grid */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#e2e2dc_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />

          <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* Left Column */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 shadow-xs">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
                  Independent Local SaaS Platform
                </div>

                <h1 className="max-w-3xl text-[clamp(2.75rem,5.5vw,5.5rem)] font-bold leading-[0.96] tracking-[-0.045em] text-neutral-950">
                  Turn every customer interaction into{" "}
                  <span className="font-normal italic text-neutral-500">
                    local business growth.
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-base font-normal leading-relaxed text-neutral-700 sm:text-lg">
                  Reviome helps local businesses collect customer feedback, manage Google reviews, understand their performance, and grow their presence across Google.
                </p>

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-neutral-950/10 transition hover:bg-neutral-800 active:scale-98"
                  >
                    <span>Get Started</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-800 shadow-xs transition hover:border-neutral-950 hover:bg-neutral-50"
                  >
                    See How It Works
                  </a>
                </div>

                {/* Transparency Indicators */}
                <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-neutral-950/10 pt-6 text-xs font-medium text-neutral-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    <span>No app downloads for customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    <span>Works with iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    <span>Merchant retains 100% profile ownership</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Physical NFC Card & Phone Demonstration */}
              <div className="relative flex min-h-[460px] items-center justify-center lg:min-h-[540px]">
                {/* Background Ring */}
                <div className="absolute h-[380px] w-[380px] rounded-full border border-neutral-300/70 bg-neutral-100/50 sm:h-[460px] sm:w-[460px]" />

                {/* Physical NFC Card Mockup */}
                <div className="relative z-10 h-[230px] w-[340px] -rotate-6 rounded-[22px] border border-neutral-800 bg-[#111113] p-6 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-rotate-3 hover:scale-[1.01] sm:h-[250px] sm:w-[390px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-neutral-950">
                          <Radio size={13} className="text-neutral-950" />
                        </span>
                        <p className="text-lg font-bold tracking-tight">reviome</p>
                      </div>
                      <p className="mt-1.5 font-mono text-[11px] tracking-wider text-neutral-400">
                        NFC TOUCHPOINT · COUNTER
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300">
                      <Radio size={18} />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between border-t border-neutral-800 pt-3.5">
                      <div>
                        <p className="text-xs font-semibold text-white">Tap smartphone here</p>
                        <p className="text-[10px] text-neutral-400">Direct contactless interaction</p>
                      </div>
                      <span className="rounded-full bg-neutral-800 px-2.5 py-1 font-mono text-[10px] uppercase text-neutral-300">
                        NFC + QR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Smartphone Preview */}
                <div className="absolute bottom-0 right-[2%] z-20 hidden h-[400px] w-[205px] rotate-6 rounded-[34px] border-[7px] border-neutral-950 bg-white p-2 shadow-[0_30px_70px_rgba(0,0,0,0.22)] sm:block lg:right-[4%]">
                  <div className="flex h-full flex-col justify-between rounded-[24px] border border-neutral-200 bg-[#fafaf8] p-4 text-center">
                    <div>
                      <div className="mx-auto mb-4 h-1.2 w-12 rounded-full bg-neutral-950" />
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                        <Store size={18} />
                      </div>
                      <p className="text-xs font-bold text-neutral-950">Artisan Cafe</p>
                      <p className="mt-0.5 text-[10px] text-neutral-500">How was your visit today?</p>
                      <div className="mt-2.5 flex justify-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full rounded-lg bg-neutral-950 py-2 text-[10px] font-semibold text-white shadow-xs">
                        Leave Google Review
                      </div>
                      <div className="flex justify-center gap-2 text-[9px] text-neutral-500">
                        <span>Directions</span>
                        <span>·</span>
                        <span>Call Store</span>
                        <span>·</span>
                        <span>Menu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: WHAT REVIOME DOES
        ================================================================ */}
        <section id="product" className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                Core Capabilities
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                What Reviome Does
              </h2>
              <p className="mt-4 text-base text-neutral-600">
                A purpose-built suite of tools engineered specifically for local brick-and-mortar merchants to bridge physical customer foot traffic with online reputation.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Capability 1: Review Growth */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                    <Radio size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-neutral-950">Review Growth</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    Make it effortless for happy in-store customers to find your official review link before leaving your counter.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-700">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      NFC and QR review touchpoints
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Direct Google review links
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Direct feedback collection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Touchpoint tap tracking
                    </li>
                  </ul>
                </div>
              </div>

              {/* Capability 2: Review Management */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-neutral-950">Review Management</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    Keep tabs on your incoming Google reviews, identify unanswered feedback, and draft thoughtful replies promptly.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-700">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Unified review dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Unanswered review alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      AI-assisted reply drafting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Rating and sentiment trends
                    </li>
                  </ul>
                </div>
              </div>

              {/* Capability 3: Business Insights */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-neutral-950">Business Insights</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    Gain clear visibility into physical foot traffic engagement, scan frequencies, and localized reputation performance.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-700">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Touchpoint scan analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Review click conversion tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Growth Score calculation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Actionable improvement tips
                    </li>
                  </ul>
                </div>
              </div>

              {/* Capability 4: Google Business Profile Management */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                    <Store size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-neutral-950">Google Profile Management</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    Connect your Google Business Profile to Reviome and manage supported business information and review workflows from one place.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-700">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Secure OAuth 2.0 connection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Verified location discovery
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Profile information sync
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      Independent control retained
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: HOW IT WORKS
        ================================================================ */}
        <section id="how-it-works" className="border-y border-neutral-950/10 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                Setup Process
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                How Reviome Works
              </h2>
              <p className="mt-4 text-base text-neutral-600">
                Three clear steps to deploy your physical review touchpoints and begin managing feedback.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-[#fafaf8] p-8 shadow-xs">
                <span className="font-mono text-2xl font-bold text-neutral-400">01</span>
                <h3 className="mt-4 text-base font-bold text-neutral-950">
                  Create your Reviome account
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-600">
                  Sign up with your business details, enter your storefront information, and select your touchpoint identifier.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-[#fafaf8] p-8 shadow-xs">
                <span className="font-mono text-2xl font-bold text-neutral-400">02</span>
                <h3 className="mt-4 text-base font-bold text-neutral-950">
                  Connect your Google Business Profile
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-600">
                  Authorize Reviome securely through Google&apos;s official OAuth consent flow. You retain complete ownership, and Reviome only accesses the capabilities you authorize.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-[#fafaf8] p-8 shadow-xs">
                <span className="font-mono text-2xl font-bold text-neutral-400">03</span>
                <h3 className="mt-4 text-base font-bold text-neutral-950">
                  Deploy touchpoints & manage growth
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-600">
                  Place your pre-configured NFC touchpoint or QR code at your checkout counter, tables, or exit. Monitor customer engagement and reply to feedback from your dashboard.
                </p>
              </div>
            </div>

            {/* Merchant Control Guarantee Box */}
            <div className="mt-12 rounded-2xl border border-neutral-300 bg-neutral-50 p-6 text-xs text-neutral-700">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield size={16} className="text-neutral-950 shrink-0" />
                  <span className="font-semibold text-neutral-950">
                    Your business stays yours.
                  </span>
                  <span>
                    Reviome only accesses the Google Business Profile data and capabilities you authorize. You can revoke access at any time.
                  </span>
                </div>
                <Link
                  href="/third-party-disclosure"
                  className="font-semibold underline hover:text-neutral-950 shrink-0 mt-2 sm:mt-0"
                >
                  Read Third-Party Policy &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: NFC + QR PHYSICAL PRODUCT
        ================================================================ */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
              {/* Left Column Text */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                  Physical Touchpoints
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                  Give customers a simple way to find your business online and leave feedback.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  Customers in physical stores are in a hurry. Reviome solves the in-person friction with dual contactless technology:
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="flex items-center gap-2.5">
                      <Radio size={16} className="text-neutral-950" />
                      <h3 className="text-xs font-bold text-neutral-950">NFC Tap-to-Open</h3>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600">
                      Customers simply bring any modern iPhone or Android near the card. The touchpoint opens instantly without opening a camera or downloading any application.
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="flex items-center gap-2.5">
                      <QrCode size={16} className="text-neutral-950" />
                      <h3 className="text-xs font-bold text-neutral-950">High-Resolution QR Code</h3>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600">
                      Serves as an instant fallback for older smartphones or customers who prefer scanning with their camera app.
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-xs text-neutral-500 italic">
                  Note: NFC touchpoints make it physically easier for genuine customers to interact with your business. They do not alter Google&apos;s proprietary ranking algorithms or guarantee review counts.
                </p>
              </div>

              {/* Right Column Visual Diagram */}
              <div className="rounded-2xl border border-neutral-300/80 bg-white p-8 shadow-xs">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Interaction Architecture
                </p>

                <div className="mt-8 space-y-6">
                  {/* Step A: Hardware */}
                  <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-[#fafaf8] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-white">
                        <Radio size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-950">NFC Card + QR Code</p>
                        <p className="text-[11px] text-neutral-500">Contactless physical hardware at store</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-neutral-500">
                      Step 1
                    </span>
                  </div>

                  <div className="flex justify-center text-neutral-400">
                    <ArrowRight size={16} className="rotate-90" />
                  </div>

                  {/* Step B: Reviome Touchpoint Hub */}
                  <div className="flex items-center justify-between rounded-xl border border-neutral-950 bg-neutral-950 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-neutral-950">
                        <Layers size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Reviome Digital Touchpoint</p>
                        <p className="text-[11px] text-neutral-400">Lightning-fast mobile landing hub</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-neutral-400">
                      Step 2
                    </span>
                  </div>

                  <div className="flex justify-center text-neutral-400">
                    <ArrowRight size={16} className="rotate-90" />
                  </div>

                  {/* Step C: Destinations */}
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <div className="rounded-lg border border-neutral-200 bg-[#fafaf8] p-3 text-center">
                      <Star size={14} className="mx-auto text-amber-500" />
                      <p className="mt-1 text-[11px] font-semibold text-neutral-950">Google Review</p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-[#fafaf8] p-3 text-center">
                      <Store size={14} className="mx-auto text-blue-600" />
                      <p className="mt-1 text-[11px] font-semibold text-neutral-950">Directions</p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-[#fafaf8] p-3 text-center">
                      <Smartphone size={14} className="mx-auto text-emerald-600" />
                      <p className="mt-1 text-[11px] font-semibold text-neutral-950">Call Store</p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-[#fafaf8] p-3 text-center">
                      <Layers size={14} className="mx-auto text-purple-600" />
                      <p className="mt-1 text-[11px] font-semibold text-neutral-950">Menu / Socials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: GOOGLE BUSINESS PROFILE CONNECTION
        ================================================================ */}
        <section id="google-connection" className="border-y border-neutral-950/10 bg-[#f4f4f0] py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                Third-Party Integration
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Connect your Google Business Profile
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Reviome connects with your Google Business Profile using official OAuth 2.0 authorization protocols to help you manage supported review and business information workflows.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-300/80 bg-white p-6 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                  <Lock size={17} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-neutral-950">
                  Sign in with Your Google Account
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  You sign in directly through Google&apos;s secure login dialog. Reviome never sees or stores your Google account password.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-300/80 bg-white p-6 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                  <Shield size={17} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-neutral-950">
                  Explicit OAuth Consent
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  Reviome only receives access permissions that you explicitly approve. Refresh tokens are secured with AES-256-GCM encryption.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-300/80 bg-white p-6 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                  <Sliders size={17} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-neutral-950">
                  Complete Merchant Ownership
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  The merchant remains the owner and administrator of their Business Profile. Reviome never claims listing ownership.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-neutral-300 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-700">
                <div>
                  <p className="font-semibold text-neutral-950">
                    Independent Third-Party Statement
                  </p>
                  <p className="mt-1 text-neutral-600 max-w-2xl">
                    Reviome is a third-party service. Google Business Profile remains a Google service and your business retains control of its profile. You can disconnect Reviome at any time.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href="https://support.google.com/business/answer/7163404"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                  >
                    <span>Google Third-Party Policy</span>
                    <ExternalLink size={12} />
                  </a>
                  <Link
                    href="/third-party-disclosure"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                  >
                    <span>Our Disclosure</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: FEATURES GRID (CURRENT VS COMING SOON)
        ================================================================ */}
        <section id="features" className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                Platform Capabilities
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Features & Roadmap
              </h2>
              <p className="mt-4 text-base text-neutral-600">
                We clearly distinguish features that are available in Reviome today from upcoming capabilities currently in development.
              </p>
            </div>

            {/* Current Features */}
            <div className="mt-12">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-950/10">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Available Today (Active Features)
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "NFC Review Cards",
                    desc: "Durable physical tap cards for counters and checkout areas with instant smartphone detection.",
                  },
                  {
                    title: "QR Review Links",
                    desc: "High-resolution downloadable QR codes for storefront signage, menus, and printed receipts.",
                  },
                  {
                    title: "Custom Touchpoints",
                    desc: "Branded mobile landing pages highlighting review links, store phone, directions, and menu.",
                  },
                  {
                    title: "Google Review Direct Links",
                    desc: "Optimized direct link generation that takes customers directly to the Google review write box.",
                  },
                  {
                    title: "Review Management Dashboard",
                    desc: "Unified interface to view recent reviews, star ratings, and reply statuses across linked locations.",
                  },
                  {
                    title: "AI Review Reply Assistant",
                    desc: "Draft professional, contextual review responses with one click to streamline owner replies.",
                  },
                  {
                    title: "Customer Feedback Inbox",
                    desc: "Private feedback channel for direct customer messages before public review escalation.",
                  },
                  {
                    title: "Touchpoint Analytics",
                    desc: "Detailed telemetry on total taps, scans, peak interaction hours, and device types.",
                  },
                  {
                    title: "Growth Score & Recommendations",
                    desc: "Actionable performance metrics assessing review response rates and customer engagement frequency.",
                  },
                  {
                    title: "Google Business Profile Connection",
                    desc: "Secure OAuth integration with automated access token refresh and location discovery.",
                  },
                  {
                    title: "Multi-Card Management",
                    desc: "Activate, label, or toggle multiple physical cards across different tables or registers.",
                  },
                  {
                    title: "Merchant Dashboard",
                    desc: "Secure web portal with profile editing, social link management, and store contact info.",
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-neutral-950">{feat.title}</h4>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Live
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Roadmap */}
            <div className="mt-14">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-950/10">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Coming Soon (In Development)
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "AI GBP Content & Post Automation",
                    desc: "Scheduled drafting and publishing of Google Business Profile updates, promotions, and events.",
                  },
                  {
                    title: "Automated Review Reply Publishing",
                    desc: "Direct submission of approved AI review replies to Google Business Profile without manual copying.",
                  },
                  {
                    title: "Multi-Location Enterprise Grouping",
                    desc: "Consolidated analytics and role-based permissions for franchise operators with 5+ storefronts.",
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-neutral-800">{feat.title}</h4>
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                        Coming soon
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-500">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 7: PRICING
        ================================================================ */}
        <section id="pricing" className="border-y border-neutral-950/10 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                Transparent Pricing
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Honest, predictable plans
              </h2>
              <p className="mt-4 text-base text-neutral-600">
                No hidden setup fees, no lock-in contracts. Cancel anytime directly from your merchant account.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Plan 1: BASIC */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-[#fafaf8] p-8 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
                      TRACK
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700">
                      Basic
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-950">₹199</span>
                    <span className="text-xs text-neutral-500">/ month</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                    Essential physical touchpoint tracking and review link tools for single-location shops.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-neutral-700 border-t border-neutral-200/80 pt-6">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      NFC & QR touchpoint configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Direct Google review links
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Touchpoint tap & scan analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Growth Score assessment
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Basic improvement recommendations
                    </li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 flex w-full items-center justify-center rounded-xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-950 shadow-xs hover:border-neutral-950 transition"
                >
                  Get Started
                </Link>
              </div>

              {/* Plan 2: PRO (Featured) */}
              <div className="relative flex flex-col justify-between rounded-2xl border-2 border-neutral-950 bg-white p-8 shadow-md">
                <div className="absolute -top-3 left-8 rounded-full bg-neutral-950 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                      GROW
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-900">
                      Pro
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-950">₹449</span>
                    <span className="text-xs text-neutral-500">/ month</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                    Comprehensive Google Business Profile review sync, response assistance, and insights.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-neutral-700 border-t border-neutral-200/80 pt-6">
                    <li className="flex items-center gap-2 font-medium text-neutral-950">
                      <Check size={14} className="text-neutral-950" />
                      Everything in Basic
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Google review management dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      AI review reply drafting assistant
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Customer feedback inbox
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Review trends & sentiment insights
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      Weekly growth reports
                    </li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-neutral-950 py-3 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
                >
                  Start Pro Trial
                </Link>
              </div>

              {/* Plan 3: PREMIUM */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-[#fafaf8] p-8 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
                      AUTOMATE
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700">
                      Premium
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-950">₹799</span>
                    <span className="text-xs text-neutral-500">/ month</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                    Advanced workflow automation and Google Business Profile content planning.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-neutral-700 border-t border-neutral-200/80 pt-6">
                    <li className="flex items-center gap-2 font-medium text-neutral-950">
                      <Check size={14} className="text-neutral-950" />
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      AI Google Business Profile content planning
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      <span>Post automation <span className="text-[10px] text-neutral-400 font-semibold">(Coming soon)</span></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      <span>Approval workflow <span className="text-[10px] text-neutral-400 font-semibold">(Coming soon)</span></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-950" />
                      <span>Advanced multi-store automation <span className="text-[10px] text-neutral-400 font-semibold">(Coming soon)</span></span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 flex w-full items-center justify-center rounded-xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-950 shadow-xs hover:border-neutral-950 transition"
                >
                  Choose Premium
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 8 & 9: TRUST & MERCHANT CONTROL
        ================================================================ */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Trust & Transparency */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                  Transparency Notice
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950">
                  Independent Platform Status
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  Reviome is an independent third-party software platform. Google Business Profile is a service provided independently by Google. Reviome is not affiliated with, endorsed by, certified by, or officially partnered with Google LLC.
                </p>
                <div className="mt-6 rounded-xl border border-neutral-200/80 bg-[#fafaf8] p-4 text-xs text-neutral-600 space-y-2">
                  <p className="font-semibold text-neutral-950">Our Commitments:</p>
                  <p>&bull; We do not make claims of guaranteed Google search rankings.</p>
                  <p>&bull; We do not sell or encourage artificial review generation.</p>
                  <p>&bull; We do not charge fees for creating Google Business listings (which are free directly through Google).</p>
                </div>
              </div>

              {/* Merchant Control */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-950">
                  Merchant Sovereignty
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950">
                  Your business. Your profile. Your control.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  You retain complete authority and ownership over your Google Business Profile:
                </p>
                <ul className="mt-6 space-y-3 text-xs text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Reviome operates only with authorized access:</strong> You authorize specific permissions through Google&apos;s standard OAuth screen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Revoke access whenever you wish:</strong> You can disconnect from Reviome settings or directly from your Google Account permissions.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>No claim of profile ownership:</strong> Reviome never transfers or claims listing ownership.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 10: BOTTOM CALL TO ACTION
        ================================================================ */}
        <section className="border-t border-neutral-950/10 bg-[#111113] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Start turning in-person customer interactions into verified reviews.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-neutral-300">
              Create your merchant account in minutes. Deploy contactless NFC touchpoints and manage customer feedback from one simple dashboard.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-950 shadow-md transition hover:bg-neutral-100"
              >
                <span>Get Started with Reviome</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <span>Contact Our Team</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
