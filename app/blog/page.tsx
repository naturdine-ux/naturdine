import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import BlogActions from "@/components/admin/BlogActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog Posts — Naturdine Admin" };
export const revalidate = 0;

export default async function AdminBlogPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Blog Posts
          </h1>
          <p className="text-sm text-[#6B6560] mt-1">
            {posts?.length ?? 0} total posts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[#2C4A1E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1e3414] transition-colors"
        >
          + Add Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F8F4EE] border-b border-[#EDE8DF]">
          <div className="col-span-4 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Title</div>
          <div className="col-span-2 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Tag</div>
          <div className="col-span-2 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Read time</div>
          <div className="col-span-1 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Status</div>
          <div className="col-span-3 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Actions</div>
        </div>

        {posts?.map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#EDE8DF] last:border-0 items-center hover:bg-[#FDFCF9] transition-colors"
          >
            <div className="col-span-4">
              <p className="text-sm font-semibold text-[#1A1A1A] leading-snug">{post.title}</p>
              <p className="text-xs text-[#6B6560] mt-0.5 truncate">/blog/{post.slug}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs bg-[#F8F4EE] text-[#6B6560] px-2 py-1 rounded-full">
                {post.tag}
              </span>
            </div>
            <div className="col-span-2 text-sm text-[#6B6560]">{post.read_time}</div>
            <div className="col-span-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                post.is_published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
              }`}>
                {post.is_published ? "Live" : "Draft"}
              </span>
            </div>
            <div className="col-span-3">
              <BlogActions id={post.id} slug={post.slug} isPublished={post.is_published} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
