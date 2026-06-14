import { supabase } from "@/lib/supabase";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://naturdine.vercel.app";

  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("is_published", true);

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  const productPages = products?.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.created_at),
    priority: 0.8,
  })) ?? [];

  const blogPages = posts?.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
    priority: 0.7,
  })) ?? [];

  return [...staticPages, ...productPages, ...blogPages];
}