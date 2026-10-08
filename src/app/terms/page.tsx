import { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { FileText, ShieldAlert, CheckCircle2, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Reviome. Understand your rights and responsibilities when using Reviome services and Google integrations.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-950">
      <MarketingHeader currentPath="/terms" />

      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="border-b border-neutral-950/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-800">
            <FileText size={13} className="text-neutral-950" />
            Terms of Use
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Effective Date: {lastUpdated} · Website:{" "}
            <span className="font-mono text-neutral-700">https://reviome.in</span>
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral mt-12 max-w-none space-y-12 text-sm leading-relaxed text-neutral-700">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering for, or using the Reviome platform available at{" "}
              <strong>reviome.in</strong> (&quot;Service&quot; or &quot;Platform&quot;), you agree to be legally bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Service.
            </p>
            <p>
              Reviome is an independent third-party software service. If you are entering into these Terms on behalf of a company, partnership, or business entity, you represent and warrant that you have the legal authority to bind that entity.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              2. Description of Service
            </h2>
            <p>
              Reviome provides software tools designed to help local merchants manage customer interactions, deploy physical NFC and QR review touchpoints, view customer feedback, monitor review metrics, and interact with supported Google Business Profile capabilities through authorized APIs.
            </p>
            <p>
              Reviome is a tool that facilitates customer communication and profile workflow management. Reviome does not manipulate review algorithms, buy reviews, fabricate feedback, or guarantee any specific search ranking on Google, Google Maps, or other search engines.
            </p>
          </section>

          {/* Section 3 - Third Party & Google */}
          <section className="space-y-4 rounded-2xl border border-neutral-300/80 bg-white p-6">
            <h2 className="text-lg font-bold tracking-tight text-neutral-950">
              3. Google Business Profile & Third-Party Relationship
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              When utilizing Google Business Profile integration features within Reviome:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>
                <strong>Independent Status:</strong> Reviome is an independent third-party software provider and is <strong>not</strong> affiliated with, certified by, endorsed by, or operated by Google LLC.
              </li>
              <li>
                <strong>Merchant Ownership & Control:</strong> You retain complete ownership, authority, and control over your Google Business Profile. Reviome does not claim ownership, transfer ownership, or restrict your administrative access to your Google Business Profile.
              </li>
              <li>
                <strong>Authorization via OAuth:</strong> Reviome only accesses Google Business Profile data and features that you explicitly authorize through Google&apos;s standard OAuth consent dialog.
              </li>
              <li>
                <strong>Revocability:</strong> You may disconnect Reviome from your Google Business Profile at any time from your Reviome profile settings or directly via your Google Account security settings at{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-neutral-950"
                >
                  myaccount.google.com/permissions
                </a>.
              </li>
              <li>
                <strong>Google Terms Apply:</strong> Your use of Google Business Profile remains subject to the{" "}
                <a
                  href="https://support.google.com/business/answer/7163404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-neutral-950 inline-flex items-center gap-1"
                >
                  Google Third-Party Policies
                  <ExternalLink size={11} />
                </a>{" "}
                and the Google Terms of Service.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              4. Merchant Account Responsibilities
            </h2>
            <p>
              When creating an account on Reviome, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
              <li>Provide accurate, current, and complete business information.</li>
              <li>Maintain the confidentiality of your login credentials.</li>
              <li>Notify Reviome immediately of any unauthorized access to your account.</li>
              <li>Accept responsibility for all activities occurring under your account.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              5. Acceptable Use & Honest Review Policies
            </h2>
            <p>
              Reviome is committed to genuine consumer transparency. You strictly agree <strong>NOT</strong> to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>Generate, solicit, post, or purchase fraudulent, artificial, or incentivized reviews.</li>
              <li>Engage in illegal &quot;review gating&quot; that selectively filters or suppresses negative feedback in violation of applicable consumer protection laws or Google review policies.</li>
              <li>Misrepresent your business identity, physical address, or licensing status.</li>
              <li>Use the Service to transmit spam, malware, or unlawful promotional materials.</li>
              <li>Reverse engineer, decompile, or attempt to extract source code from the Service.</li>
            </ul>
            <p className="text-xs text-neutral-500">
              Violation of these acceptable use policies may result in immediate suspension or termination of your account without refund.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              6. Subscriptions, Fees & Billing
            </h2>
            <p>
              Reviome offers tiered subscription plans (e.g., Basic at ₹199/month, Pro at ₹449/month, and Premium at ₹799/month). Fees are billed in advance on a recurring monthly basis. All prices are clearly posted in your dashboard.
            </p>
            <p>
              You may cancel your subscription at any time through your account settings. Upon cancellation, your subscription will remain active until the end of the current billing cycle, after which paid features will cease without further recurring charges.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              7. Disclaimers of Warranties
            </h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied.
            </p>
            <p>
              Reviome specifically disclaims any warranty or guarantee regarding:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
              <li>Google search engine ranking, placement, or visibility on Google Maps.</li>
              <li>The quantity or rating of reviews left by your customers.</li>
              <li>Uninterrupted or error-free availability of third-party APIs (including Google Business Profile APIs).</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Reviome and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruption, arising out of or related to your use of or inability to use the Service. In no event shall Reviome&apos;s total aggregate liability exceed the total amount paid by you to Reviome in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 border-t border-neutral-950/10 pt-8">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              9. Contact & Support
            </h2>
            <p>
              For legal inquiries, dispute notices, or terms support, please reach out to us at:
            </p>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 text-xs text-neutral-700 space-y-1">
              <p className="font-semibold text-neutral-950">Reviome Legal Team</p>
              <p>Email: <a href="mailto:support@reviome.in" className="font-medium underline hover:text-neutral-950">support@reviome.in</a></p>
              <p>Website: <a href="https://reviome.in" className="font-medium underline hover:text-neutral-950">https://reviome.in</a></p>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
