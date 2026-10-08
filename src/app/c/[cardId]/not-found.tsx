import { Zap } from "lucide-react";

export default function CardNotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#fafaf8] px-6 text-center text-neutral-950 selection:bg-neutral-900 selection:text-white">
      {/* Background subtle dot grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      {/* Icon */}
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg">
        <Zap size={24} className="fill-white" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
        Card not found
      </h1>

      <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
        This Reviome touchpoint doesn&apos;t exist or has been deactivated by the
        business owner.
      </p>

      {/* CTA */}
      <a
        href="/"
        className="mt-8 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md"
      >
        Go to reviome
      </a>

      {/* Footer */}
      <p className="mt-12 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        reviome · Smart NFC Touchpoints
      </p>
    </div>
  );
}
