"use client";

import { useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const TAGS = ["Buying Guide", "Lifestyle", "Sustainability", "Tips", "News"];

export default function AdminNewBlogPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tag: "Lifestyle",
    read_time: "",
    is_published: false,
    cover_image: "",
    og_image: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
  });

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((f) => ({
      ...f,
      title,
      slug,
      meta_title: f.meta_title || title,
    }));
  };

  const handleExcerptChange = (excerpt: string) => {
    setForm((f) => ({
      ...f,
      excerpt,
      meta_description: f.meta_description || excerpt,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError("");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(data.path);

      setImagePreview(publicUrl);
      setForm((f) => ({ ...f, cover_image: publicUrl, og_image: publicUrl }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.excerpt) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.from("blog_posts").insert({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      tag: form.tag,
      read_time: form.read_time || "5 min read",
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      cover_image: form.cover_image || null,
      og_image: form.og_image || null,
      meta_title: form.meta_title || form.title,
      meta_description: form.meta_description || form.excerpt,
      keywords: form.keywords || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/blog"
          className="text-sm text-[#6B6560] hover:text-[#2C4A1E] transition-colors"
        >
          ← Back
        </Link>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Add New Post
        </h1>
      </div>

      {/* Tabs */}
<div className="flex gap-2 mb-6">
  <button
    onClick={() => setActiveTab("content")}
    style={{
      background: activeTab === "content" ? "#2C4A1E" : "#EDE8DF",
      color: activeTab === "content" ? "#fff" : "#6B6560",
      padding: "10px 20px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
    }}
  >
    Content
  </button>
  <button
    onClick={() => setActiveTab("seo")}
    style={{
      background: activeTab === "seo" ? "#2C4A1E" : "#EDE8DF",
      color: activeTab === "seo" ? "#fff" : "#6B6560",
      padding: "10px 20px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
    }}
  >
    SEO Settings
  </button>
</div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 space-y-6">

        {/* ── CONTENT TAB ── */}
        {activeTab === "content" && (
          <>
            {/* Cover image upload */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Cover Image
              </label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#EDE8DF] mb-3">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    width={800}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setForm((f) => ({ ...f, cover_image: "", og_image: "" }));
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#EDE8DF] rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#2C4A1E] hover:bg-[#F8F4EE] transition-colors"
                >
                  {imageUploading ? (
                    <p className="text-sm text-[#6B6560]">Uploading...</p>
                  ) : (
                    <>
                      <span className="text-3xl mb-2">🖼️</span>
                      <p className="text-sm font-semibold text-[#2C4A1E]">Click to upload image</p>
                      <p className="text-xs text-[#6B6560] mt-1">JPG, PNG, WebP — max 5MB</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              {form.cover_image && (
                <p className="text-xs text-[#6B6560] mt-2 truncate">
                  Saved to: media/blog/...
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Best Bamboo Cutlery Sets of 2026"
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
                placeholder="best-bamboo-cutlery-sets-2026"
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors font-mono"
              />
              <p className="text-xs text-[#6B6560] mt-1">
                naturdine.com/blog/{form.slug || "..."}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Excerpt <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="A short summary shown on the blog listing page..."
                rows={3}
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors resize-none"
              />
              <p className="text-xs text-[#6B6560] mt-1">
                {form.excerpt.length}/160 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Article content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your full article here. Each paragraph on a new line..."
                rows={14}
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors resize-none font-mono"
              />
              <p className="text-xs text-[#6B6560] mt-1">
                {form.content.split("\n").filter(Boolean).length} paragraphs
              </p>
            </div>

            {/* Tag + Read time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Tag</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
                >
                  {TAGS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Read time
                </label>
                <input
                  value={form.read_time}
                  onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
                  placeholder="5 min read"
                  className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
                />
              </div>
            </div>

            {/* Publish toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4 accent-[#2C4A1E]"
              />
              <span className="text-sm font-medium text-[#1A1A1A]">
                Publish immediately (visible on site)
              </span>
            </label>
          </>
        )}

        {/* ── SEO TAB ── */}
        {activeTab === "seo" && (
          <>
            <div className="bg-[#F8F4EE] rounded-xl p-4 text-sm text-[#6B6560] leading-relaxed">
              These fields control how your post appears in Google search results and when shared on social media.
              If left empty, the title and excerpt will be used automatically.
            </div>

            {/* Meta title */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Meta title
              </label>
              <input
                value={form.meta_title}
                onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                placeholder={form.title || "Best Bamboo Cutlery Sets of 2026 — Naturdine"}
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-[#6B6560]">Shown in Google search results</p>
                <p className={`text-xs font-medium ${form.meta_title.length > 60 ? "text-red-500" : "text-[#6B6560]"}`}>
                  {form.meta_title.length}/60
                </p>
              </div>
            </div>

            {/* Meta description */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Meta description
              </label>
              <textarea
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                placeholder={form.excerpt || "A short description for search engines..."}
                rows={3}
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors resize-none"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-[#6B6560]">Shown below your title in Google results</p>
                <p className={`text-xs font-medium ${form.meta_description.length > 160 ? "text-red-500" : "text-[#6B6560]"}`}>
                  {form.meta_description.length}/160
                </p>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Keywords
              </label>
              <input
                value={form.keywords}
                onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                placeholder="bamboo cutlery, eco friendly flatware, wooden cutlery set"
                className="w-full bg-[#F8F4EE] border border-[#EDE8DF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C4A1E] transition-colors"
              />
              <p className="text-xs text-[#6B6560] mt-1">
                Separate with commas
              </p>
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Social share image (OG Image)
              </label>
              {form.og_image ? (
                <div className="relative rounded-xl overflow-hidden border border-[#EDE8DF] mb-2">
                  <Image
                    src={form.og_image}
                    alt="OG image preview"
                    width={800}
                    height={300}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => setForm((f) => ({ ...f, og_image: "" }))}
                    className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="bg-[#F8F4EE] rounded-xl p-4 text-sm text-[#6B6560]">
                  {form.cover_image
                    ? "Using cover image as OG image — upload a cover image in the Content tab first."
                    : "No image set. Upload a cover image in the Content tab — it will be used automatically."}
                </div>
              )}
              <p className="text-xs text-[#6B6560] mt-2">
                Shown when your post is shared on Facebook, Twitter, WhatsApp, etc.
                Recommended size: 1200 × 630px.
              </p>
            </div>

            {/* Google preview */}
            {(form.meta_title || form.title) && (
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                  Google search preview
                </label>
                <div className="border border-[#EDE8DF] rounded-xl p-5 bg-white">
                  <p className="text-[#1a0dab] text-lg font-medium leading-snug mb-1 truncate">
                    {form.meta_title || form.title || "Post title"}
                  </p>
                  <p className="text-xs text-[#006621] mb-1">
                    naturdine.com › blog › {form.slug || "post-slug"}
                  </p>
                  <p className="text-sm text-[#545454] leading-relaxed line-clamp-2">
                    {form.meta_description || form.excerpt || "Post description will appear here..."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || imageUploading}
          className="w-full bg-[#2C4A1E] text-white font-bold py-4 rounded-xl hover:bg-[#1e3414] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Post →"}
        </button>
      </div>
    </div>
  );
}
