import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal — Naturdine",
  description: "Ideas, guides, and inspiration for living more sustainably. Tips on eco-friendly kitchens, natural materials, and plastic-free living.",
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <main>

      {/* Header */}
      <section className="bg-[#F8F4EE] border-b border-[#EDE8DF] px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
            Journal
          </p>
          <h1
            className="text-4xl font-bold text-[#1A1A1A] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ideas for living better
          </h1>
          <p className="text-[#6B6560]">
            Guides, tips, and inspiration for a more natural table.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post: BlogPost) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="bg-[#F8F4EE] h-48 flex items-center justify-center text-6xl">
                  🌿
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F8F4EE] text-[#2C4A1E] px-3 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <h2
                    className="text-lg font-bold text-[#1A1A1A] mt-4 mb-3 leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#6B6560] leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B6560]">
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-xs font-semibold text-[#C8A96E]">
                      {post.read_time}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
