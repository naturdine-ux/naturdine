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
    title: `${post.title} — Naturdine Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
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

const BLOG_CONTENT: Record<string, string[]> = {
  "best-bamboo-cutlery-sets-2026": [
    "Making a genuine change to a plastic-free kitchen starts with the things you use every single day. Cutlery is used three times a day, touched before every meal, and usually outlives most other items in the kitchen.",
    "Bamboo and wood have been used for eating utensils for thousands of years across Asia, Africa, and South America. They are naturally antimicrobial, warm to the touch, and require far less energy to produce than stainless steel or plastic.",
    "The key thing to look for when buying wooden or bamboo cutlery is the finish. Avoid anything with a painted or lacquered coating that might chip. The best pieces use a natural beeswax or food-grade oil finish — safe, durable, and renewable.",
    "After six months of daily use, a good bamboo set should look essentially the same as when you bought it. A monthly light oiling with coconut oil keeps the bamboo from drying out. That is the full maintenance routine.",
    "Our top pick remains a full family set — knife, fork, spoon, and chopsticks for each person, packaged in a way that makes it a genuinely good gift. The quality difference between a well-made bamboo set and a cheap one is immediately obvious when you hold both.",
  ],
  "why-switch-wooden-flatware": [
    "The most obvious reason to switch is the environmental one. Plastic cutlery, even when washed and reused, degrades over time and eventually ends up in landfill. Bamboo and wood are fully compostable at end of life.",
    "What surprises most people is the feel. Wood and bamboo are warm materials — they do not conduct heat the way metal does, so they are comfortable to hold even when eating hot food. Many people find they simply prefer the experience.",
    "Bamboo is naturally antimicrobial. Studies have shown that bacteria introduced to bamboo surfaces die off significantly faster than on plastic surfaces. This is not a marketing claim — it is a property of the material itself.",
    "Wooden and bamboo cutlery is also lighter than stainless steel, which makes it ideal for travel, packed lunches, and picnics. A travel set that fits in a small pouch and weighs almost nothing is genuinely useful.",
    "Finally, there is the aesthetic argument. A bamboo cutlery set on a table looks considered and intentional. It signals that you care about what you eat and how you eat it. That is worth something.",
  ],
  "eco-kitchen-guide-2026": [
    "The kitchen is the room in the house with the most plastic, the most waste, and therefore the most opportunity for meaningful change. But trying to change everything at once is the fastest way to give up entirely.",
    "Start with the things you replace most often. Disposable plastic cutlery, plastic wrap, and single-use containers are the obvious targets. Replacing them with durable, natural alternatives is a one-time purchase that pays for itself quickly.",
    "Cutlery is the easiest switch. A single bamboo cutlery set will outlast dozens of plastic alternatives and costs less over time. It is also the most visible change — something you interact with at every meal.",
    "Storage is the next area to address. Glass and stainless steel containers have improved dramatically in recent years. They are lighter, cheaper, and more widely available than even five years ago.",
    "The final piece is cleaning products. Most conventional dish soap and cleaning products come in single-use plastic bottles. Concentrated refillable options are now available from most supermarkets and work just as well.",
  ],
};

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

  const paragraphs = BLOG_CONTENT[slug] ?? [
    "This article is coming soon. Check back shortly for the full content.",
  ];

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
        <div className="bg-[#F8F4EE] rounded-2xl h-64 flex items-center justify-center text-8xl mb-10">
          🌿
        </div>

        {/* Content */}
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
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
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#2C4A1E] hover:underline"
          >
            ← Back to Journal
          </Link>
        </div>

      </div>
    </main>
  );
}
