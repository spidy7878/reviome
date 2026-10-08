"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Menu, X, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  currentPath?: string;
}

export function MarketingHeader({ currentPath }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Product", href: "/#product" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-950/10 bg-[#fafaf8]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4.5 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-[-0.04em] text-neutral-950 transition-opacity hover:opacity-85"
        >
          <span className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-neutral-950 text-white shadow-xs">
            <Zap size={14} className="fill-white" />
          </span>
          <span>reviome</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-neutral-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-neutral-800 active:scale-95"
          >
            Get Started
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-[#fafaf8] px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-base font-medium text-neutral-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 transition-colors hover:text-neutral-950"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2.5 border-t border-neutral-200/80 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-neutral-300 bg-white py-2.5 text-sm font-semibold text-neutral-900"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-sm font-semibold text-white shadow-xs"
              >
                Get Started
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
