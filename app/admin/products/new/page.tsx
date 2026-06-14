"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Cutlery Sets", "Gift Sets", "Individual Pieces"];

export default function AdminNewProductPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    amazon_url: "",
    category: "Cutlery Sets",
    emoji: "🥢",
    color: "#E8F0E0",
    tag: "",
    rating: "4.8",
    review_count: "0",
    features: ["", "", "", "", ""],
    is_featured: false,
    is_active: true,
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((f) => ({ ...f, name, slug }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const features = [...form.features];
    features[index] = value;
    setForm((f) => ({ ...f, features }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.description || !form.price || !form.amazon_url) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const features = form.features.filter((f) => f.trim() !== "");

    const { error } = await supabase.from("products").insert({
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price),
      amazon_url: form.amazon_url,
      category: form.category,
      emoji: form.emoji,
      color: form.color,
      tag: form.tag || null,
      rating: parseFloat(form.rating),
      review_count: parseInt(form.review_count),
      features,
      is_featured: form.is_featured,
      is_active: form.is_active,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-[#6B6560] hover:text-[#2C4A1E] transition-colors"
        >
          ← Back
        </Link>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Add New Product
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Product name <span className="text-red-400">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Bamboo Cutlery Set for 4"
            className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            URL slug <span className="text-red-400">*</span>
          </label>
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="bamboo-cutlery-set-4"
            className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors font-mono"
          />
          <p className="text-xs text-[#6B6560] mt-1">naturdine.com/products/{form.slug || "..."}</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="A complete bamboo flatware set for four..."
            rows={4}
            className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors resize-none"
          />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Price (USD) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="34.99"
              step="0.01"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Amazon URL */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Amazon listing URL <span className="text-red-400">*</span>
          </label>
          <input
            value={form.amazon_url}
            onChange={(e) => setForm((f) => ({ ...f, amazon_url: e.target.value }))}
            placeholder="https://www.amazon.com/dp/..."
            className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
          />
        </div>

        {/* Emoji + Color + Tag */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Emoji</label>
            <input
              value={form.emoji}
              onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
              placeholder="🥢"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Card colour</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="w-full h-[46px] bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-2 py-1 outline-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Badge tag</label>
            <input
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              placeholder="Best Seller"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>
        </div>

        {/* Rating + Reviews */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Amazon rating</label>
            <input
              type="number"
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
              placeholder="4.8"
              step="0.1"
              min="0"
              max="5"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Review count</label>
            <input
              type="number"
              value={form.review_count}
              onChange={(e) => setForm((f) => ({ ...f, review_count: e.target.value }))}
              placeholder="312"
              className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Features (what&apos;s included)
          </label>
          <div className="space-y-2">
            {form.features.map((feature, i) => (
              <input
                key={i}
                value={feature}
                onChange={(e) => handleFeatureChange(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              className="w-4 h-4 accent-[#2C4A1E]"
            />
            <span className="text-sm font-medium text-[#1A1A1A]">Featured on homepage</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-[#2C4A1E]"
            />
            <span className="text-sm font-medium text-[#1A1A1A]">Active (visible on site)</span>
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#2C4A1E] text-white font-bold py-4 rounded-xl hover:bg-[#1e3414] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Product →"}
        </button>
      </div>
    </div>
  );
}
