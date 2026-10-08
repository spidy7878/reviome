import { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { ShieldCheck, ExternalLink, Key, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Third-Party Disclosure — Working with Reviome",
  description:
    "Important information about working with Reviome as an independent third-party service for Google Business Profile management.",
  alternates: {
    canonical: "/third-party-disclosure",
  },
};

export default function ThirdPartyDisclosurePage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-950">
      <MarketingHeader currentPath="/third-party-disclosure" />

      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="border-b border-neutral-950/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-800">
            <ShieldCheck size={13} className="text-blue-700" />
            Transparency Notice
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Working with a Third-Party Service
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Reviome is an independent third-party software platform. This notice explains our role, our relationship with Google, and your rights as a business profile owner.
          </p>
        </div>

        {/* Core Principles */}
        <div className="mt-12 space-y-10 text-sm text-neutral-700 leading-relaxed">
          {/* Key Principle 1: Independent Status */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white font-mono text-xs font-bold">
                01
              </span>
              <h2 className="text-lg font-bold text-neutral-950">
                Reviome is Independent of Google
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Reviome is an independent third-party SaaS application developed and maintained by Reviome. Google Business Profile is a service provided independently by Google LLC. Reviome is <strong>not affiliated with, endorsed by, certified by, or in partnership with Google LLC</strong>.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              We do not claim any official status with Google, and our fees are solely for the Reviome software platform, analytics tools, and physical touchpoint products. Creating and maintaining a Google Business Profile directly with Google is free.
            </p>
          </section>

          {/* Key Principle 2: Merchant Control & Ownership */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white font-mono text-xs font-bold">
                02
              </span>
              <h2 className="text-lg font-bold text-neutral-950">
                Your Business. Your Profile. Your Control.
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              As a merchant, you remain the sole owner and administrative authority of your Google Business Profile:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-neutral-600 sm:text-sm">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Profile Ownership:</strong> Reviome never requests or takes primary ownership of your Google Business Profile. You should always remain the Primary Owner of your listing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Explicit OAuth Consent:</strong> Access is granted solely when you sign in with your own Google account and approve permissions via Google&apos;s official OAuth consent screen.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Immediate Revocation:</strong> You can disconnect Reviome at any time. Revoking access instantly prevents Reviome from making API calls on your behalf.
                </span>
              </li>
            </ul>
          </section>

          {/* Key Principle 3: How to Manage or Revoke Access */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white font-mono text-xs font-bold">
                03
              </span>
              <h2 className="text-lg font-bold text-neutral-950">
                How to Manage or Revoke Reviome Access
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              You have two simple ways to discontinue Reviome&apos;s access to your Google Business Profile at any moment:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-[#fafaf8] p-4 text-xs">
                <p className="font-semibold text-neutral-950">Option A: Inside Reviome</p>
                <p className="mt-1 text-neutral-600">
                  Navigate to <strong>Dashboard &rarr; Profile</strong>, and click &quot;Change Location&quot; or disconnect your profile connection.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-[#fafaf8] p-4 text-xs">
                <p className="font-semibold text-neutral-950">Option B: Direct from Google</p>
                <p className="mt-1 text-neutral-600">
                  Visit Google&apos;s Third-Party Access Security page at{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:text-neutral-950"
                  >
                    myaccount.google.com/permissions
                  </a>{" "}
                  and click &quot;Remove Access&quot; for Reviome.
                </p>
              </div>
            </div>
          </section>

          {/* Key Principle 4: Google Official Third-Party Resources */}
          <section className="rounded-2xl border border-blue-200/90 bg-blue-50/40 p-7">
            <h2 className="text-base font-bold text-blue-950">
              Official Google Third-Party Policy & Help Resources
            </h2>
            <p className="mt-2 text-xs text-blue-950/80 leading-relaxed">
              Google provides official guidance for businesses that work with third-party partners and software tools. We encourage every merchant to review these resources:
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <a
                href="https://support.google.com/business/answer/7163404"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900 shadow-xs"
              >
                <span>Read Google Third-Party Policy</span>
                <ExternalLink size={13} />
              </a>
              <a
                href="https://www.google.com/business/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs font-semibold text-blue-950 transition hover:bg-blue-50"
              >
                <span>Google Business Profile Home</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </section>

          {/* Key Principle 5: Honest Review & Feedback Standards */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white font-mono text-xs font-bold">
                04
              </span>
              <h2 className="text-lg font-bold text-neutral-950">
                Ethical Review Practices & Policy Compliance
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Reviome is designed to assist businesses with legitimate, honest customer communication. In adherence to consumer protection laws and Google content policies:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-neutral-600">
              <li>&bull; We do not provide automated or fake reviews.</li>
              <li>&bull; We do not support &quot;review gating&quot; (filtering negative reviews while only directing positive reviews to Google).</li>
              <li>&bull; We do not offer or promote incentives or compensation in exchange for reviews.</li>
              <li>&bull; All feedback links direct customers to genuine, uninhibited review submission flows.</li>
            </ul>
          </section>

          {/* Questions & Contact */}
          <section className="border-t border-neutral-950/10 pt-8">
            <h3 className="text-base font-bold text-neutral-950">
              Have Questions About Third-Party Access?
            </h3>
            <p className="mt-2 text-xs text-neutral-600">
              If you have any questions regarding how Reviome interacts with your Google Business Profile or wish to request data deletion, contact us at:
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-900">
              <a
                href="mailto:support@reviome.in"
                className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2 hover:border-neutral-950 transition"
              >
                support@reviome.in
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-950"
              >
                <span>Visit Contact Page</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
