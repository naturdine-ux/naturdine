"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogActions({
  id,
  slug,
  isPublished,
}: {
  id: string;
  slug: string;
  isPublished: boolean;
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublished = async () => {
    setLoading(true);
    await supabase
      .from("blog_posts")
      .update({
        is_published: !isPublished,
        published_at: !isPublished ? new Date().toISOString() : null,
      })
      .eq("id", id);
    router.refresh();
    setLoading(false);
  };

  const deletePost = async () => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setLoading(true);
    await supabase.from("blog_posts").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/blog/${slug}`}
        target="_blank"
        className="text-xs font-semibold text-[#6B6560] hover:text-[#2C4A1E] hover:underline"
      >
        View
      </Link>
      <Link
        href={`/admin/blog/${id}/edit`}
        className="text-xs font-semibold text-[#2C4A1E] hover:underline"
      >
        Edit
      </Link>
      <button
        onClick={togglePublished}
        disabled={loading}
        className={`text-xs font-semibold hover:underline disabled:opacity-50 ${
          isPublished ? "text-orange-500" : "text-green-600"
        }`}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={deletePost}
        disabled={loading}
        className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
