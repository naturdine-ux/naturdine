import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) return {};

  return {
    title: post.meta_title || `${post.title} — Naturdine Journal`,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.og_image ? [post.og_image] : [],
    },
  };
}

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return posts?.map((p) => ({ slug: p.slug })) ?? [];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  // Split content into paragraphs by newline
  const paragraphs = post.content
    ? post.content.split("\n").filter((p: string) => p.trim() !== "")
    : [post.excerpt];

  return (
    <main>
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B6560] mb-8">
          <Link href="/" className="hover:text-[#2C4A1E] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#2C4A1E] transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Tag */}
        <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F8F4EE] text-[#2C4A1E] px-3 py-1 rounded-full">
          {post.tag}
        </span>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-5 mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-[#6B6560] mb-8">
          <span>
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{post.read_time}</span>
        </div>

        {/* Cover image */}
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-2xl mb-10"
          />
        ) : (
          <div className="bg-[#F8F4EE] rounded-2xl h-64 flex items-center justify-center text-8xl mb-10">
            🌿
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {paragraphs.map((para: string, i: number) => (
            <p key={i} className="text-[#6B6560] leading-[1.85] text-base">
              {para}
            </p>
          ))}
        </div>

        {/* Pull quote */}
        <blockquote className="border-l-4 border-[#2C4A1E] bg-[#F8F4EE] rounded-r-xl px-6 py-5 my-10">
          <p className="text-[#1A1A1A] italic leading-relaxed text-lg">
            &ldquo;Switching to wooden cutlery was one of those changes that felt
            like it would be hard and turned out to take about three minutes.&rdquo;
          </p>
        </blockquote>

        {/* CTA */}
        <div className="bg-[#2C4A1E] rounded-2xl p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Ready to make the switch?
            </h3>
            <p className="text-sm text-white/70">
              Browse our full range of natural cutlery sets.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-[#C8A96E] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#b8934a] transition-colors whitespace-nowrap"
          >
            Shop Now →
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link href="/blog" className="text-sm font-semibold text-[#2C4A1E] hover:underline">
            ← Back to Journal
          </Link>
        </div>

      </div>
    </main>
  );
}
