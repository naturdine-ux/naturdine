import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story — Naturdine",
  description: "Naturdine was born out of a simple belief: your table shouldn't cost the earth. Learn about our mission to make plastic-free dining beautiful and accessible.",
};

export default function AboutPage() {
  return (
    <main>

      {/* ── HERO ── */}
      <section className="bg-[#F8F4EE] px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🪵</div>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            We believe your table<br />
            <span className="text-[#2C4A1E]">shouldn&apos;t cost the earth</span>
          </h1>
          <p className="text-lg text-[#6B6560] leading-relaxed">
            Naturdine started with a simple frustration: beautiful, durable,
            plastic-free cutlery was impossible to find at a fair price.
            We fixed that.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-3">
              Our Story
            </p>
            <h2
              className="text-3xl font-bold text-[#1A1A1A] mb-5 leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Born out of a kitchen drawer argument
            </h2>
            <p className="text-[#6B6560] leading-relaxed mb-4">
              Like most families, we used to have a drawer full of mismatched plastic
              cutlery — some of it a decade old. One day we decided to clear it out
              completely and replace everything with something we actually felt good about.
            </p>
            <p className="text-[#6B6560] leading-relaxed mb-4">
              We couldn&apos;t find what we were looking for at a price that made sense.
              So we made it ourselves. Every set is handcrafted from sustainably sourced
              bamboo and mango wood — natural materials that have been used for centuries.
            </p>
            <p className="text-[#6B6560] leading-relaxed">
              Today, Naturdine is used by over a thousand families across the US who
              made the same decision we did — to eat well and live lightly.
            </p>
          </div>
          <div
            className="rounded-2xl h-80 flex items-center justify-center text-8xl bg-[#F8F4EE]"
          >
            🌿
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#F8F4EE] px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "1,000+", label: "Families served" },
            { number: "100%", label: "Plastic-free" },
            { number: "★ 4.8", label: "Average rating" },
            { number: "3", label: "Core materials" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center border border-[#EDE8DF]">
              <div
                className="text-3xl font-bold text-[#2C4A1E] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stat.number}
              </div>
              <div className="text-sm text-[#6B6560]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              What we stand for
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🌱",
                title: "Sustainability first",
                desc: "Every material we use is carefully chosen for its environmental footprint. Our bamboo is harvested from certified sustainable sources, and our packaging contains zero plastic.",
              },
              {
                emoji: "✋",
                title: "Craft over convenience",
                desc: "We work with skilled artisans who hand-finish every piece. It takes longer. It costs more. But the result is something that lasts years, not months.",
              },
              {
                emoji: "💚",
                title: "Fair and transparent",
                desc: "We price our products fairly — not cheaply made, not luxury-priced. You should be able to switch your entire household to natural cutlery without breaking the bank.",
              },
            ].map((v, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-5xl mb-5">{v.emoji}</div>
                <h3
                  className="text-lg font-bold text-[#1A1A1A] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATERIALS ── */}
      <section className="bg-[#F8F4EE] px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-3">
              Our Materials
            </p>
            <h2
              className="text-3xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              What goes into every piece
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🎋",
                name: "Bamboo",
                desc: "The fastest-growing plant on earth. Naturally antimicrobial, harder than most hardwoods, and harvested without killing the plant.",
              },
              {
                emoji: "🪵",
                name: "Mango Wood",
                desc: "Sourced from mango trees that no longer bear fruit. Dense, beautiful grain, and a second life for wood that would otherwise go to waste.",
              },
              {
                emoji: "🐝",
                name: "Beeswax Finish",
                desc: "All our pieces are finished with natural beeswax or food-grade oil. No synthetic lacquers, no chemicals — just a protective natural coating.",
              },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#EDE8DF]">
                <div className="text-4xl mb-4">{m.emoji}</div>
                <h3
                  className="text-lg font-bold text-[#1A1A1A] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {m.name}
                </h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#2C4A1E] px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to make the switch?
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Every set we send out is one less drawer full of plastic somewhere in the world.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#C8A96E] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#b8934a] transition-colors"
          >
            Shop All Products
          </Link>
        </div>
      </section>

    </main>
  );
}
