import { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { ContactClientForm } from "./contact-client";
import { Mail, Globe, Clock, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support & Inquiries",
  description:
    "Get in touch with the Reviome team for support, product inquiries, NFC card orders, and third-party integration questions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-950">
      <MarketingHeader currentPath="/contact" />

      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="border-b border-neutral-950/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-800">
            <Mail size={13} className="text-neutral-950" />
            Support & Help
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Contact Reviome
          </h1>
          <p className="mt-3 text-base text-neutral-600 max-w-2xl">
            Have questions about physical NFC touchpoints, Google Business Profile connection, pricing plans, or need merchant assistance? Reach out to our team.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Interactive Form */}
          <div>
            <ContactClientForm />
          </div>

          {/* Right Column: Contact info & quick answers */}
          <div className="space-y-8">
            {/* Direct Channels */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Direct Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <Mail size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-950">Support & General Inquiries</p>
                    <a
                      href="mailto:support@reviome.in"
                      className="mt-0.5 text-neutral-600 underline hover:text-neutral-950"
                    >
                      support@reviome.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <Globe size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-950">Official Web Domain</p>
                    <p className="mt-0.5 font-mono text-neutral-600">https://reviome.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
                    <Clock size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-950">Support Availability</p>
                    <p className="mt-0.5 text-neutral-600">
                      Monday through Friday · Inquiries typically answered within 24 to 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Third-Party Independence Note */}
            <div className="rounded-2xl border border-neutral-200/80 bg-[#fafaf8] p-5 text-xs text-neutral-600 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-neutral-950">
                <ShieldCheck size={14} className="text-blue-700" />
                <span>Third-Party Notice</span>
              </div>
              <p className="leading-relaxed">
                Reviome is an independent third-party software service. We cannot assist with direct Google password recovery, Google account suspension appeals, or internal Google policy disputes. For direct Google account issues, please visit the official{" "}
                <a
                  href="https://support.google.com/business/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-neutral-950"
                >
                  Google Business Profile Help Center
                </a>.
              </p>
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <HelpCircle size={15} />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                  <p className="font-semibold text-neutral-950">How long do NFC cards take to ship?</p>
                  <p className="mt-1 text-neutral-600">
                    Custom-programmed NFC touchpoints typically ship within 3 to 5 business days after your merchant profile configuration is confirmed.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                  <p className="font-semibold text-neutral-950">Can I use Reviome without physical NFC cards?</p>
                  <p className="mt-1 text-neutral-600">
                    Yes. Every Reviome business receives high-resolution QR codes, custom web touchpoint URLs, and full dashboard review management capabilities.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                  <p className="font-semibold text-neutral-950">Can I disconnect my Google profile?</p>
                  <p className="mt-1 text-neutral-600">
                    Yes. You can disconnect your Google Business Profile at any time from your account settings with zero penalties or lock-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
