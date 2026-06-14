"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  tag: string;
  read_time: string;
  is_published: boolean;
};

function BlogRow({ post }: { post: BlogPost }) {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(post.is_published);

  const togglePublished = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("blog_posts")
      .update({
        is_published: !isPublished,
        published_at: !isPublished ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (!error) setIsPublished(!isPublished);
    setLoading(false);
  };

  const deletePost = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setLoading(true);
    await supabase.from("blog_posts").delete().eq("id", post.id);
    window.location.reload();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "16px", padding: "16px 24px", borderBottom: "1px solid #EDE8DF", alignItems: "center" }}>
      <div style={{ gridColumn: "span 4" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4 }}>{post.title}</p>
        <p style={{ fontSize: 11, color: "#6B6560", marginTop: 2 }}>/blog/{post.slug}</p>
      </div>
      <div style={{ gridColumn: "span 2" }}>
        <span style={{ fontSize: 11, background: "#F8F4EE", color: "#6B6560", padding: "3px 10px", borderRadius: 20 }}>
          {post.tag}
        </span>
      </div>
      <div style={{ gridColumn: "span 2", fontSize: 13, color: "#6B6560" }}>{post.read_time}</div>
      <div style={{ gridColumn: "span 1" }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: isPublished ? "#f0fdf4" : "#fefce8",
          color: isPublished ? "#15803d" : "#a16207"
        }}>
          {isPublished ? "Live" : "Draft"}
        </span>
      </div>
      <div style={{ gridColumn: "span 3", display: "flex", gap: 12, alignItems: "center" }}>
        <a href={`/blog/${post.slug}`} target="_blank" style={{ fontSize: 12, fontWeight: 600, color: "#6B6560", textDecoration: "none" }}>View</a>
        <Link href={`/admin/blog/${post.id}/edit`} style={{ fontSize: 12, fontWeight: 600, color: "#2C4A1E", textDecoration: "none" }}>Edit</Link>
        <button
          onClick={togglePublished}
          disabled={loading}
          style={{ fontSize: 12, fontWeight: 600, color: isPublished ? "#f97316" : "#16a34a", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={deletePost}
          disabled={loading}
          style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const supabase = createSupabaseBrowserClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, tag, read_time, is_published")
        .order("created_at", { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-playfair)" }}>
            Blog Posts
          </h1>
          <p style={{ fontSize: 13, color: "#6B6560", marginTop: 4 }}>{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          style={{ background: "#2C4A1E", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 12, textDecoration: "none" }}
        >
          + Add Post
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE8DF", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "16px", padding: "12px 24px", background: "#F8F4EE", borderBottom: "1px solid #EDE8DF" }}>
          <div style={{ gridColumn: "span 4", fontSize: 11, fontWeight: 700, color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em" }}>Title</div>
          <div style={{ gridColumn: "span 2", fontSize: 11, fontWeight: 700, color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tag</div>
          <div style={{ gridColumn: "span 2", fontSize: 11, fontWeight: 700, color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em" }}>Read time</div>
          <div style={{ gridColumn: "span 1", fontSize: 11, fontWeight: 700, color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</div>
          <div style={{ gridColumn: "span 3", fontSize: 11, fontWeight: 700, color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em" }}>Actions</div>
        </div>

        {loading && (
          <div style={{ padding: "32px 24px", fontSize: 13, color: "#6B6560" }}>Loading posts...</div>
        )}

        {!loading && posts.map((post) => (
          <BlogRow key={post.id} post={post} />
        ))}

        {!loading && posts.length === 0 && (
          <div style={{ padding: "48px 24px", textAlign: "center", fontSize: 13, color: "#6B6560" }}>
            No posts yet.{" "}
            <Link href="/admin/blog/new" style={{ color: "#2C4A1E", fontWeight: 600 }}>Add your first post →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
