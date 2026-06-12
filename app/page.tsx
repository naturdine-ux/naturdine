import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export default async function Home() {
  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(4);

  return (
    <main>

      {/* ── HERO ── */}
      <section className="bg-[#F8F4EE] px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-full px-4 py-2 mb-6">
              <span className="text-xs font-semibold text-[#2C4A1E]">🌿 100% Natural &amp; Sustainable</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold text-[#1A1A1A] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Eat well.<br />
              <span className="text-[#2C4A1E]">Live lightly.</span>
            </h1>
            <p className="text-lg text-[#6B6560] leading-relaxed mb-8 max-w-md">
              Handcrafted bamboo and wooden cutlery sets for everyday dining.
              Beautiful, durable, and completely plastic-free.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="bg-[#2C4A1E] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1e3414] transition-colors"
              >
                Shop All Products →
              </Link>
              <Link
                href="/about"
                className="border-2 border-[#2C4A1E] text-[#2C4A1E] font-semibold px-8 py-4 rounded-xl hover:bg-[#2C4A1E] hover:text-white transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero product grid */}
          <div className="grid grid-cols-2 gap-4">
            {(featured ?? []).slice(0, 4).map((p: Product) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div
                  className="rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                  style={{ background: p.color }}
                >
                  <span className="text-4xl">{p.emoji}</span>
                  <span className="text-xs font-semibold text-[#1A1A1A] text-center leading-tight">
                    {p.name.split(" ").slice(0, 3).join(" ")}
                  </span>
                  <span className="text-sm font-bold text-[#2C4A1E]">${p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-[#2C4A1E] py-4 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🌱", text: "100% Natural Materials" },
            { icon: "📦", text: "Plastic-Free Packaging" },
            { icon: "✋", text: "Handcrafted with Care" },
            { icon: "⭐", text: "1,000+ Happy Customers" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2">
              <span>{item.icon}</span>
              <span className="text-sm font-medium text-white/85">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-[#FDFCF9] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
                Bestsellers
              </p>
              <h2
                className="text-3xl font-bold text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Most loved sets
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-[#2C4A1E] border border-[#EDE8DF] px-5 py-2 rounded-lg hover:bg-[#F8F4EE] transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featured ?? []).map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND VALUES ── */}
      <section className="bg-[#F8F4EE] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-[#1A1A1A] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Why Naturdine?
            </h2>
            <p className="text-[#6B6560] max-w-md mx-auto leading-relaxed">
              Every set we make is a step away from plastic and toward a table you feel good about.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🌱", title: "Sustainably sourced", desc: "Every piece harvested from certified sustainable forests." },
              { emoji: "✋", title: "Handcrafted", desc: "Made by skilled artisans. No two pieces are exactly alike." },
              { emoji: "♻️", title: "Plastic-free", desc: "From product to packaging — not a single gram of plastic." },
              { emoji: "💚", title: "Built to last", desc: "With basic care, a Naturdine set will last for years." },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-[#EDE8DF]">
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-[#FDFCF9] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#1A1A1A] text-center mb-12"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What people are saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", loc: "Portland, OR", text: "Switched from plastic a year ago and honestly can't believe I waited so long. Beautiful quality and my kids love using them." },
              { name: "James T.", loc: "Austin, TX", text: "Bought the family gift set for Christmas. Everyone asked where it was from. Fast delivery, gorgeous packaging." },
              { name: "Priya K.", loc: "Seattle, WA", text: "The travel set lives in my bag permanently. Light, doesn't smell, and people always comment on it at lunch." },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-[#EDE8DF]">
                <div className="text-yellow-400 mb-4 text-sm">★★★★★</div>
                <p className="text-sm text-[#6B6560] leading-relaxed italic mb-6">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="text-sm font-bold text-[#1A1A1A]">{r.name}</div>
                <div className="text-xs text-[#6B6560]">{r.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section className="bg-[#2C4A1E] px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-5">🌿</div>
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Get 10% off your first order
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Join 4,000+ families making the switch to natural cutlery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/25 rounded-xl px-5 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 text-sm"
            />
            <button className="bg-[#C8A96E] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#b8934a] transition-colors text-sm whitespace-nowrap">
              Get 10% Off
            </button>
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ── */}
      <section className="bg-[#FDFCF9] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
                Journal
              </p>
              <h2
                className="text-3xl font-bold text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                From the blog
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#2C4A1E] border border-[#EDE8DF] px-5 py-2 rounded-lg hover:bg-[#F8F4EE] transition-colors"
            >
              All articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: "Buying Guide", title: "Best Bamboo Cutlery Sets of 2026", excerpt: "We tested a dozen bamboo cutlery sets so you don't have to. Here's what actually holds up.", date: "June 2, 2026", slug: "best-bamboo-cutlery-sets-2026" },
              { tag: "Lifestyle", title: "5 Reasons to Switch to Wooden Flatware", excerpt: "Beyond the obvious eco wins, wooden cutlery has some genuinely surprising advantages.", date: "May 18, 2026", slug: "why-switch-wooden-flatware" },
              { tag: "Sustainability", title: "The Eco-Friendly Kitchen: A 2026 Guide", excerpt: "Switching to a plastic-free kitchen doesn't have to be expensive or complicated.", date: "May 5, 2026", slug: "eco-kitchen-guide-2026" },
            ].map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="bg-[#F8F4EE] h-40 flex items-center justify-center text-5xl">
                    🌿
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F8F4EE] text-[#2C4A1E] px-3 py-1 rounded-full">
                      {post.tag}
                    </span>
                    <h3
                      className="text-base font-bold text-[#1A1A1A] mt-3 mb-2 leading-snug"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#6B6560] leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-[#6B6560]">{post.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
