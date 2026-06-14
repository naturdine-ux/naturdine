"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="text-2xl font-bold text-[#2C4A1E]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Naturdine
            </span>
            <Leaf size={16} color="#C8A96E" />
          </div>
          <p className="text-sm text-[#6B6560]">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 shadow-sm">
          <h1
            className="text-2xl font-bold text-[#1A1A1A] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Sign in
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="admin@naturdine.com"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-4 bg-red-50 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#2C4A1E] text-white font-bold py-3 rounded-xl hover:bg-[#1e3414] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </div>

        <p className="text-center text-xs text-[#6B6560] mt-6">
          This page is only accessible to authorised administrators.
        </p>
      </div>
    </div>
  );
}
