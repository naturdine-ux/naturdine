"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main>

      {/* Header */}
      <section className="bg-[#F8F4EE] border-b border-[#EDE8DF] px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
            Get in touch
          </p>
          <h1
            className="text-4xl font-bold text-[#1A1A1A] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            We&apos;d love to hear from you
          </h1>
          <p className="text-[#6B6560] leading-relaxed">
            Questions about an order, wholesale enquiries, or just want to say hello —
            we reply within one business day.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Contact info */}
          <div className="space-y-6">
            {[
              { emoji: "📦", title: "Orders", desc: "Questions about your order or product details." },
              { emoji: "🤝", title: "Wholesale", desc: "Interested in stocking Naturdine in your store?" },
              { emoji: "💌", title: "General", desc: "Anything else — we are always happy to chat." },
            ].map((item, i) => (
              <div key={i} className="bg-[#F8F4EE] rounded-2xl p-5 border border-[#EDE8DF]">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{item.title}</h3>
                <p className="text-xs text-[#6B6560] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {status === "success" ? (
              <div className="bg-white rounded-2xl border border-[#EDE8DF] p-12 text-center">
                <div className="text-6xl mb-5">✅</div>
                <h2
                  className="text-2xl font-bold text-[#1A1A1A] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Message sent!
                </h2>
                <p className="text-[#6B6560] leading-relaxed mb-6">
                  Thanks {form.name || "for reaching out"}. We&apos;ll get back to you within one business day.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="bg-[#2C4A1E] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#1e3414] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Your name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Jane Smith"
                      className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B6560]/50 outline-none focus:border-[#2C4A1E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Email address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="jane@example.com"
                      className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B6560]/50 outline-none focus:border-[#2C4A1E] transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Order enquiry, wholesale, general question..."
                    className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B6560]/50 outline-none focus:border-[#2C4A1E] transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B6560]/50 outline-none focus:border-[#2C4A1E] transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-500 mb-4">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="w-full bg-[#2C4A1E] text-white font-bold py-4 rounded-xl hover:bg-[#1e3414] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Send Message →"}
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

    </main>
  );
}
