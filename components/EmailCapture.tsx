"use client";

import { useState } from "react";

export default function EmailCapture({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm font-semibold" style={{ color: "#C8A96E" }}>
        ✓ You&apos;re in! Check your inbox for your discount.
      </p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="your@email.com"
        className="flex-1 bg-white/10 border border-white/25 rounded-xl px-5 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 text-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        style={{
          background: "#C8A96E",
          color: "#fff",
          fontWeight: 700,
          padding: "12px 24px",
          borderRadius: 12,
          border: "none",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          fontSize: 14,
          whiteSpace: "nowrap",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? "Joining..." : "Get 10% Off"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-300 mt-1">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
