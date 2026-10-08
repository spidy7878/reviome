"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Lock,
  Mail,
  Store,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          name,
          email,
          password,
        }),
      });

      const data = await regRes.json();

      if (!regRes.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Automatically sign in upon registration
      const authRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (authRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf8] text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* Background subtle dot grid */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      {/* Header */}
      <header className="relative z-10 flex h-20 items-center justify-between px-6 md:px-12 border-b border-neutral-950/5 bg-[#fafaf8]/80 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-[-0.05em] text-neutral-950"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white">
            <Zap size={14} className="fill-white" />
          </span>
          reviome
        </Link>
        <Link
          href="/login"
          className="text-xs font-medium text-neutral-600 transition hover:text-neutral-950"
        >
          Already have an account? Sign In →
        </Link>
      </header>

      {/* Main card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl border border-neutral-950/10 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:p-10">
            {/* Header copy */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-900">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Get Started in 60 Seconds
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                Create your merchant space
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Set up your business, claim your NFC endpoint, and turn physical visits into 5-star reviews.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Business / Brand Name
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                    <Store size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Copper Leaf Coffee"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 pl-10 pr-4 text-sm text-neutral-950 placeholder-neutral-400 transition focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Your Full Name
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 pl-10 pr-4 text-sm text-neutral-950 placeholder-neutral-400 transition focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourbrand.com"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 pl-10 pr-4 text-sm text-neutral-950 placeholder-neutral-400 transition focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Password (min. 6 characters)
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-3 pl-10 pr-4 text-sm text-neutral-950 placeholder-neutral-400 transition focus:border-neutral-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  What you get instantly:
                </div>
                <p className="mt-1 pl-5 text-[11px] text-neutral-600">
                  A public mobile profile, auto-generated first NFC slug, and scan analytics.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating Merchant Space...
                  </>
                ) : (
                  <>
                    Create Account & Get Started
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <div className="mt-8 border-t border-neutral-200/80 pt-6 text-center text-xs text-neutral-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-neutral-950 underline underline-offset-2 transition hover:text-neutral-700"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
