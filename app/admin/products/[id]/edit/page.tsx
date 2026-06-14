"use client";

import { useState, useEffect, use, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const TAGS = ["Buying Guide", "Lifestyle", "Sustainability", "Tips", "News"];

export default function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
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

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          tag: data.tag ?? "Lifestyle",
          read_time: data.read_time ?? "",
          is_published: data.is_published ?? false,
          cover_image: data.cover_image ?? "",
          og_image: data.og_image ?? "",
          meta_title: data.meta_title ?? "",
          meta_description: data.meta_description ?? "",
          keywords: data.keywords ?? "",
        });
        if (data.cover_image) setImagePreview(data.cover_image);
      }
      setFetching(false);
    };
    fetchPost();
  }, [id]);

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
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(data.path);
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
    const { error } = await supabase
      .from("blog_posts")
      .update({
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
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin/blog");
  };

  if (fetching) return <div style={{ padding: 32, fontSize: 13, color: "#6B6560" }}>Loading post...</div>;

  return (
    <div style={{ padding: "32px", maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link href="/admin/blog" style={{ fontSize: 13, color: "#6B6560", textDecoration: "none" }}>← Back</Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-playfair)" }}>Edit Post</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["content", "seo"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
            background: activeTab === tab ? "#2C4A1E" : "#EDE8DF",
            color: activeTab === tab ? "#fff" : "#6B6560",
          }}>
            {tab === "content" ? "Content" : "SEO Settings"}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE8DF", padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

        {activeTab === "content" && (
          <>
            {/* Cover image */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Cover Image</label>
              {imagePreview ? (
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid #EDE8DF", marginBottom: 8 }}>
                  <Image src={imagePreview} alt="Cover" width={800} height={300} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  <button onClick={() => { setImagePreview(""); setForm((f) => ({ ...f, cover_image: "", og_image: "" })); }}
                    style={{ position: "absolute", top: 10, right: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: "2px dashed #EDE8DF", borderRadius: 12, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {imageUploading ? <p style={{ fontSize: 13, color: "#6B6560" }}>Uploading...</p> : (
                    <>
                      <span style={{ fontSize: 28, marginBottom: 8 }}>🖼️</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#2C4A1E" }}>Click to upload image</p>
                      <p style={{ fontSize: 11, color: "#6B6560", marginTop: 4 }}>JPG, PNG, WebP — max 5MB</p>
                    </>
                  )}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: "none" }} />
            </div>

            {/* Title */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Title <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#1A1A1A", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Slug */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>URL slug <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#1A1A1A", outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#6B6560", marginTop: 4 }}>naturdine.com/blog/{form.slug}</p>
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Excerpt <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={3}
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#1A1A1A", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#6B6560", marginTop: 4 }}>{form.excerpt.length}/160 characters</p>
            </div>

            {/* Content */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Article content</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={12}
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#1A1A1A", outline: "none", resize: "vertical", fontFamily: "monospace", boxSizing: "border-box" }} />
            </div>

            {/* Tag + Read time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Tag</label>
                <select value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none" }}>
                  {TAGS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Read time</label>
                <input value={form.read_time} onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))} placeholder="5 min read"
                  style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Publish toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: "#2C4A1E" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>Published (visible on site)</span>
            </label>
          </>
        )}

        {activeTab === "seo" && (
          <>
            <div style={{ background: "#F8F4EE", borderRadius: 12, padding: 16, fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
              These fields control how your post appears in Google and when shared on social media.
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Meta title</label>
              <input value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))} placeholder={form.title}
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#6B6560" }}>Shown in Google search results</span>
                <span style={{ fontSize: 11, color: form.meta_title.length > 60 ? "#ef4444" : "#6B6560" }}>{form.meta_title.length}/60</span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Meta description</label>
              <textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={3} placeholder={form.excerpt}
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#6B6560" }}>Shown below your title in Google</span>
                <span style={{ fontSize: 11, color: form.meta_description.length > 160 ? "#ef4444" : "#6B6560" }}>{form.meta_description.length}/160</span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Keywords</label>
              <input value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} placeholder="bamboo cutlery, eco friendly flatware"
                style={{ width: "100%", background: "#F8F4EE", border: "1px solid #EDE8DF", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#6B6560", marginTop: 4 }}>Separate with commas</p>
            </div>

            {/* Google preview */}
            {(form.meta_title || form.title) && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>Google preview</label>
                <div style={{ border: "1px solid #EDE8DF", borderRadius: 12, padding: "20px 24px", background: "#fff" }}>
                  <p style={{ color: "#1a0dab", fontSize: 17, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {form.meta_title || form.title}
                  </p>
                  <p style={{ fontSize: 12, color: "#006621", marginBottom: 4 }}>naturdine.com › blog › {form.slug}</p>
                  <p style={{ fontSize: 13, color: "#545454", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {form.meta_description || form.excerpt}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {error && <p style={{ fontSize: 13, color: "#ef4444", background: "#fef2f2", padding: "12px 16px", borderRadius: 12 }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", background: loading ? "#6B6560" : "#2C4A1E", color: "#fff",
          fontWeight: 700, padding: 16, borderRadius: 12, border: "none",
          cursor: loading ? "not-allowed" : "pointer", fontSize: 15,
        }}>
          {loading ? "Saving..." : "Save Changes →"}
        </button>
      </div>
    </div>
  );
}
