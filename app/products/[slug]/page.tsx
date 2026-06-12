import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
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

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) return {};

  return {
    title: `${product.name} — Naturdine`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Naturdine`,
      description: product.description,
    },
  };
}

export async function generateStaticParams() {
  const { data: products } = await supabase
    .from("products")
    .select("slug");

  return products?.map((p) => ({ slug: p.slug })) ?? [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(3);

  return (
    <main>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B6560] mb-8">
          <Link href="/" className="hover:text-[#2C4A1E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#2C4A1E] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left — image */}
          <div>
            <div
              className="rounded-2xl h-96 flex items-center justify-center text-9xl mb-4"
              style={{ background: product.color }}
            >
              {product.emoji}
            </div>
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-20 rounded-xl flex items-center justify-center text-3xl cursor-pointer border-2 border-transparent hover:border-[#2C4A1E] transition-colors"
                  style={{ background: product.color }}
                >
                  {product.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Right — details */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
              {product.category}
            </p>
            <h1
              className="text-3xl font-bold text-[#1A1A1A] mb-3 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">
                {"★".repeat(Math.floor(product.rating))}
              </span>
              <span className="text-sm text-[#6B6560]">
                {product.rating} · {product.review_count} reviews on Amazon
              </span>
            </div>

            <p
              className="text-4xl font-bold text-[#2C4A1E] mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              ${product.price}
            </p>

            <p className="text-[#6B6560] leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">
                What&apos;s included
              </h3>
              {product.features.map((feature: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-[#EDE8DF]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2C4A1E] flex-shrink-0" />
                  <span className="text-sm text-[#6B6560]">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href={product.amazon_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#FF9900] text-[#111] font-bold text-base rounded-xl py-4 hover:bg-[#e68a00] transition-colors mb-3"
            >
              Buy on Amazon →
            </a>

            <div className="bg-[#F8F4EE] rounded-xl p-4 flex flex-wrap gap-4 mt-4">
              {[
                { icon: "🌱", text: "100% Natural" },
                { icon: "♻️", text: "Plastic-Free" },
                { icon: "✋", text: "Handcrafted" },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 text-sm text-[#2C4A1E] font-medium"
                >
                  {badge.icon} {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <h2
              className="text-2xl font-bold text-[#1A1A1A] mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p: Product) => (
                <Link key={p.id} href={`/products/${p.slug}`}>
                  <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                    <div
                      className="h-40 flex items-center justify-center text-5xl"
                      style={{ background: p.color }}
                    >
                      {p.emoji}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {p.name}
                      </p>
                      <p className="text-[#2C4A1E] font-bold mt-1">
                        ${p.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
