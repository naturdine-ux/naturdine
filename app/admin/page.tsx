import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Package, FileText, Eye, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalPosts },
    { count: publishedPosts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
  ]);

  const { data: recentProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#6B6560] mt-1">Welcome back. Here&apos;s an overview of your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Products", value: totalProducts ?? 0, icon: <Package size={18} />, color: "#2C4A1E" },
          { label: "Active Products", value: activeProducts ?? 0, icon: <Eye size={18} />, color: "#C8A96E" },
          { label: "Blog Posts", value: totalPosts ?? 0, icon: <FileText size={18} />, color: "#2C4A1E" },
          { label: "Published Posts", value: publishedPosts ?? 0, icon: <TrendingUp size={18} />, color: "#C8A96E" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EDE8DF] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#6B6560]">{stat.icon}</span>
              <span
                className="text-2xl font-bold"
                style={{ color: stat.color, fontFamily: "var(--font-playfair)" }}
              >
                {stat.value}
              </span>
            </div>
            <p className="text-xs font-medium text-[#6B6560]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Recent products */}
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#1A1A1A]">Recent Products</h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#2C4A1E] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts?.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#EDE8DF] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A] leading-tight">{p.name}</p>
                    <p className="text-xs text-[#6B6560]">${p.price}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {p.is_active ? "Active" : "Hidden"}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/products/new"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#2C4A1E] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1e3414] transition-colors"
          >
            + Add New Product
          </Link>
        </div>

        {/* Recent blog posts */}
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#1A1A1A]">Blog Posts</h2>
            <Link
              href="/admin/blog"
              className="text-xs font-semibold text-[#2C4A1E] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts?.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-[#EDE8DF] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A] leading-tight">{post.title}</p>
                  <p className="text-xs text-[#6B6560] mt-0.5">{post.tag} · {post.read_time}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-3 ${post.is_published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                  {post.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/blog/new"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#2C4A1E] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1e3414] transition-colors"
          >
            + Add New Post
          </Link>
        </div>

      </div>
    </div>
  );
}
