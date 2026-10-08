import { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { ArrowUpRight, Compass, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Reviome — Our Mission and Approach",
  description:
    "Reviome is building practical tools that help local businesses turn customer interactions into measurable growth.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-950">
      <MarketingHeader currentPath="/about" />

      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="border-b border-neutral-950/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-800">
            <Compass size={13} className="text-neutral-950" />
            Company & Product Mission
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            About Reviome
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-700">
            Reviome is building practical tools that help local businesses turn customer interactions into measurable growth.
          </p>
        </div>

        {/* Narrative */}
        <div className="mt-12 space-y-12 text-sm leading-relaxed text-neutral-700">
          {/* Section 1: The Problem */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              The Reality for Local Merchants
            </h2>
            <p>
              Local businesses—bakeries, cafes, clinics, salons, repair shops, and boutique retailers—deliver exceptional experiences every single day. Yet, when satisfied customers walk out the door, the moment to capture that feedback is usually lost.
            </p>
            <p>
              Asking customers to search for a business on Google, find the right listing, click reviews, and write feedback involves too much friction. Most customers intend to leave a review, but forget within minutes of leaving. At the same time, merchants are busy running operations and lack time to monitor multiple dashboards, respond to reviews, and track customer engagement.
            </p>
          </section>

          {/* Section 2: What We Build */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              Our Approach: Physical Simplicity, Digital Power
            </h2>
            <p>
              Reviome bridges the physical and digital worlds for brick-and-mortar merchants:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
                  <Sparkles size={16} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-950">
                  Frictionless Touchpoints
                </h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  We deploy durable, contactless NFC touchpoints and clean QR codes at counters and tables. Customers tap their phone with zero app downloads and land instantly on your review or touchpoint destination.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
                  <Shield size={16} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-950">
                  Unified Reputation Management
                </h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  Through secure Google Business Profile OAuth authorization, merchants can view reviews, organize response drafts, track interaction volume, and discover actionable areas for service improvement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Principles */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              Our Principles
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-950">1. Complete Authenticity</h4>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    We strictly advocate for genuine customer feedback. We do not support fake reviews, incentive schemes, or manipulative review gating. Genuine reputation cannot be manufactured through shortcuts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-950">2. Merchant Ownership & Control</h4>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    Your Google Business Profile belongs entirely to your business. Reviome is an independent third-party software service. We only access the data you explicitly authorize, and you can revoke access at any time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-950">3. Honest Product Capabilities</h4>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    We do not claim algorithmic guarantees, magic SEO hacks, or official Google certification. We provide reliable software that helps businesses do the work of engaging their customers consistently.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="rounded-2xl border border-neutral-950 bg-[#111113] p-8 text-white">
            <h3 className="text-lg font-bold">Ready to modernize your review touchpoints?</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-300 max-w-xl">
              Get started with Reviome today. Connect your Google Business Profile, configure your review links, and begin turning in-person customers into verified local advocates.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-100 transition shadow-xs"
              >
                <span>Create Merchant Account</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition"
              >
                <span>Talk with Us</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
