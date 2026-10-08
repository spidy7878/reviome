import Link from "next/link";
import { Zap, ExternalLink } from "lucide-react";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-950/10 bg-[#f4f4f0] text-neutral-800">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold tracking-[-0.04em] text-neutral-950"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white shadow-xs">
                <Zap size={14} className="fill-white" />
              </span>
              <span>reviome</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
              Tools for local businesses to manage reviews, customer engagement, and Google Business Profile workflows.
            </p>
            <div className="mt-6 text-xs text-neutral-500">
              <span>Domain: </span>
              <span className="font-mono text-neutral-700">reviome.in</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="/#product" className="transition-colors hover:text-neutral-950">
                  NFC & QR Touchpoints
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition-colors hover:text-neutral-950">
                  Review Management
                </Link>
              </li>
              <li>
                <Link href="/#google-connection" className="transition-colors hover:text-neutral-950">
                  Google Integration
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="transition-colors hover:text-neutral-950">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-neutral-950">
                  Merchant Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="/about" className="transition-colors hover:text-neutral-950">
                  About Reviome
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-neutral-950">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition-colors hover:text-neutral-950">
                  How It Works
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@reviome.in"
                  className="transition-colors hover:text-neutral-950"
                >
                  support@reviome.in
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Trust & Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="/third-party-disclosure" className="transition-colors hover:text-neutral-950">
                  Third-Party Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-neutral-950">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-neutral-950">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://support.google.com/business/answer/7163404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-neutral-950"
                >
                  Google Third-Party Policy
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-neutral-950"
                >
                  Manage Google Access
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Clear Third-Party Legal Disclosure Box */}
        <div className="mt-14 rounded-2xl border border-neutral-300/70 bg-white/70 p-5 text-xs leading-relaxed text-neutral-600">
          <p className="font-semibold text-neutral-900">
            Independent Third-Party Service Notice
          </p>
          <p className="mt-1.5">
            Reviome is an independent third-party software platform developed to help local businesses manage customer interactions, review workflows, and supported Google Business Profile operations. Reviome is not affiliated with, endorsed by, certified by, or officially partnered with Google LLC. Google, Google Maps, and Google Business Profile are registered trademarks of Google LLC.
          </p>
          <p className="mt-1.5 text-neutral-500">
            Merchants connect their Google Business Profile via Google&apos;s standard OAuth authorization consent screen and retain 100% control, ownership, and management rights of their business listings. You may revoke Reviome&apos;s authorization at any time directly from your Reviome profile settings or from your Google Account security permissions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-300/60 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>© {currentYear} Reviome. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900">
              Terms of Service
            </Link>
            <Link href="/third-party-disclosure" className="hover:text-neutral-900">
              Third-Party Disclosure
            </Link>
            <Link href="/contact" className="hover:text-neutral-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
