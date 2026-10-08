import { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { Shield, Lock, Eye, RefreshCw, Trash2, Mail, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Reviome. Learn how we collect, store, and protect merchant data and Google Business Profile information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-950">
      <MarketingHeader currentPath="/privacy" />

      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="border-b border-neutral-950/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-800">
            <Shield size={13} className="text-emerald-700" />
            Legal & Data Protection
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Privacy Policy
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
              1. Introduction & Overview
            </h2>
            <p>
              Reviome (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the software platform available at{" "}
              <strong>reviome.in</strong>. Reviome is an independent third-party software service built to help local businesses manage customer interactions, physical review touchpoints (NFC and QR codes), customer feedback, and supported Google Business Profile operations.
            </p>
            <p>
              This Privacy Policy explains what information we collect, how we use it, how we safeguard your data, and your rights concerning your personal and business information when using our website and services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              2. Information We Collect
            </h2>
            <p>We collect information in the following categories:</p>

            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200/80 bg-white p-5">
                <h3 className="font-semibold text-neutral-950">
                  A. Account & Profile Information
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  When you register for a Reviome merchant account, we collect your name, business email address, hashed password, business name, phone number, physical address, website URL, and social media handles that you voluntarily provide to customize your public review touchpoints.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white p-5">
                <h3 className="font-semibold text-neutral-950">
                  B. Touchpoint & Interaction Analytics (NFC & QR Scans)
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  When customers tap an NFC card or scan a QR code associated with your business, our servers record non-personally identifiable telemetry data. This includes interaction timestamps, device operating system type (e.g., iOS, Android), browser family, touchpoint card identifier, and whether a customer clicked to leave a review or view store links. We <strong>do not</strong> track or collect end-customer personal identities, names, or phone numbers during touchpoint scans.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-white p-5">
                <h3 className="font-semibold text-neutral-950">
                  C. Google Business Profile Data (OAuth Integration)
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  If you choose to connect your Google Business Profile to Reviome, you authorize access via Google&apos;s standard OAuth consent dialog. Through this authorization, Reviome receives:
                </p>
                <ul className="mt-2 list-disc pl-5 text-xs text-neutral-600 space-y-1">
                  <li>Your Google Business Profile account identifier and business display name.</li>
                  <li>Location identifiers and public business details (storefront address, phone number, primary category).</li>
                  <li>Customer reviews submitted to your public Google Business Profile, including reviewer names, ratings, review text, and review dates.</li>
                  <li>Owner responses to reviews and response statuses.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 - Google API Disclosure */}
          <section className="space-y-4 rounded-2xl border border-blue-200/80 bg-blue-50/40 p-6">
            <div className="flex items-center gap-2 text-blue-950">
              <Lock size={18} className="text-blue-700" />
              <h2 className="text-lg font-bold">
                3. Google API Services User Data Policy Compliance
              </h2>
            </div>
            <p className="text-xs text-blue-950/80 leading-relaxed">
              Reviome&apos;s use and transfer of information received from Google APIs adheres strictly to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-900"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements:
            </p>
            <ul className="list-disc pl-5 text-xs text-blue-950/80 space-y-1.5">
              <li>
                <strong>Purpose Specification:</strong> We access Google Business Profile data solely to provide user-facing features requested by you, including synchronizing reviews, organizing response drafts, displaying local reputation analytics, and updating verified location metadata.
              </li>
              <li>
                <strong>No Sale of Data:</strong> We never sell Google user data, merchant data, or customer reviews to third parties, data brokers, or advertising networks.
              </li>
              <li>
                <strong>No Advertising Use:</strong> We do not use Google API data to serve advertisements or retarget customers.
              </li>
              <li>
                <strong>No Generalized AI Training:</strong> We do not use Google Business Profile data to train generalized AI or machine learning foundation models.
              </li>
              <li>
                <strong>Encryption at Rest:</strong> All Google OAuth refresh tokens are encrypted using industry-standard AES-256-GCM encryption before storage in our database.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              4. How We Use Your Information
            </h2>
            <p>We use the collected information for specific, legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>To provide, maintain, and operate the Reviome SaaS platform and merchant dashboard.</li>
              <li>To generate customized NFC and QR review touchpoint destinations.</li>
              <li>To aggregate non-PII tap and scan counts so you can evaluate customer engagement.</li>
              <li>To sync and display your public Google reviews and enable review reply drafting.</li>
              <li>To authenticate your login sessions and secure your merchant account.</li>
              <li>To respond to customer support inquiries and provide service announcements.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              5. Data Storage, Security & Retention
            </h2>
            <p>
              We implement comprehensive administrative, technical, and physical safeguards to protect merchant data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>
                <strong>Encryption in Transit:</strong> All communications between your browser, our servers, and third-party APIs use TLS 1.3 / HTTPS encryption.
              </li>
              <li>
                <strong>Encryption at Rest:</strong> Sensitive authentication tokens (such as Google OAuth refresh tokens) are encrypted with AES-256-GCM. Passwords are salted and hashed using bcrypt.
              </li>
              <li>
                <strong>Access Controls:</strong> Access to production databases is strictly restricted to authenticated internal processes and authorized technical personnel.
              </li>
              <li>
                <strong>Data Retention:</strong> We retain merchant account information and interaction logs for as long as your account remains active. If you request account closure, we delete your personal information, profile settings, and stored OAuth credentials within thirty (30) days.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              6. Your Rights & Control Over Google Integration
            </h2>
            <p>
              You maintain complete control over your business data and third-party authorizations at all times:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>
                <strong>Disconnecting Reviome:</strong> You can disconnect your Google Business Profile from Reviome at any time directly through your Reviome dashboard under Profile settings.
              </li>
              <li>
                <strong>Revoking Google OAuth Directly:</strong> You can revoke Reviome&apos;s API access directly through your Google Account security controls at{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-neutral-950 inline-flex items-center gap-1"
                >
                  myaccount.google.com/permissions
                  <ExternalLink size={11} />
                </a>
                .
              </li>
              <li>
                <strong>Data Access and Deletion:</strong> You may request an export of your stored business data or complete deletion of your account by emailing us at{" "}
                <a href="mailto:support@reviome.in" className="font-semibold underline hover:text-neutral-950">
                  support@reviome.in
                </a>
                .
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              7. Third-Party Disclosures & Links
            </h2>
            <p>
              Reviome is an independent third-party service provider. Our service interfaces with external platforms, notably Google LLC for Google Business Profile management. Google&apos;s privacy practices are governed by the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-950"
              >
                Google Privacy Policy
              </a>
              . We encourage you to review Google&apos;s policies when authorizing third-party integrations.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our legal obligations, features, or service architecture. When updates are published, we will revise the &quot;Effective Date&quot; at the top of this document. Material changes will be communicated to active account holders via email or an in-app notice.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 border-t border-neutral-950/10 pt-8">
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              9. Contact Information
            </h2>
            <p>
              If you have any questions, concerns, or data access requests regarding this Privacy Policy, please contact our privacy and data protection team:
            </p>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 text-xs text-neutral-700 space-y-1">
              <p className="font-semibold text-neutral-950">Reviome Data Protection Team</p>
              <p>Email: <a href="mailto:support@reviome.in" className="font-medium underline hover:text-neutral-950">support@reviome.in</a></p>
              <p>Website: <a href="https://reviome.in" className="font-medium underline hover:text-neutral-950">https://reviome.in</a></p>
              <p className="text-neutral-500 pt-1">Response time: Typically within 2 business days.</p>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
