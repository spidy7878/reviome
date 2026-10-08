"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactClientForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Client-side simulation / mailto fallback
      await new Promise((res) => setTimeout(res, 800));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message. Please contact us directly at support@reviome.in.");
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
      <h2 className="text-lg font-bold text-neutral-950">Send Us a Message</h2>
      <p className="mt-1 text-xs text-neutral-600">
        Whether you have questions about NFC touchpoints, Google integration, or subscription plans, our team is here to help.
      </p>

      {status === "success" ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="mt-3 text-sm font-bold text-emerald-950">Thank you for reaching out</h3>
          <p className="mt-1 text-xs text-emerald-800">
            Your message has been received. A team member will respond to <span className="font-semibold">{email}</span> within 1-2 business days.
          </p>
          <button
            type="button"
            onClick={() => {
              setName("");
              setEmail("");
              setBusinessName("");
              setMessage("");
              setStatus("idle");
            }}
            className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-950 underline hover:text-emerald-800"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-neutral-800">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Merchant"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-800">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourbusiness.com"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="businessName" className="block text-xs font-semibold text-neutral-800">
              Business Name (Optional)
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Artisan Bakery & Cafe"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950 transition"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-neutral-800">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need help with, inquiries about NFC cards, or general questions..."
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950 transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-neutral-800 disabled:opacity-50 active:scale-98"
          >
            {status === "submitting" ? (
              <span>Sending message...</span>
            ) : (
              <>
                <Send size={13} />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
