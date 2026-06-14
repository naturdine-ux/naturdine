import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Naturdine Admin" };

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
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
            Products
          </h1>
          <p className="text-sm text-[#6B6560] mt-1">
            {products?.length ?? 0} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#2C4A1E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1e3414] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F8F4EE] border-b border-[#EDE8DF]">
          <div className="col-span-1" />
          <div className="col-span-4 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Product</div>
          <div className="col-span-2 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Category</div>
          <div className="col-span-2 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Price</div>
          <div className="col-span-1 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Featured</div>
          <div className="col-span-1 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Status</div>
          <div className="col-span-1 text-xs font-bold uppercase tracking-widest text-[#6B6560]">Actions</div>
        </div>

        {/* Rows */}
        {products?.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#EDE8DF] last:border-0 items-center hover:bg-[#FDFCF9] transition-colors"
          >
            <div className="col-span-1 text-2xl">{product.emoji}</div>
            <div className="col-span-4">
              <p className="text-sm font-semibold text-[#1A1A1A]">{product.name}</p>
              <p className="text-xs text-[#6B6560] mt-0.5 truncate max-w-[200px]">
                /{product.slug}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-xs bg-[#F8F4EE] text-[#6B6560] px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <div className="col-span-2 text-sm font-semibold text-[#2C4A1E]">
              ${product.price}
            </div>
            <div className="col-span-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.is_featured ? "bg-[#C8A96E]/20 text-[#8B6325]" : "bg-[#F8F4EE] text-[#6B6560]"}`}>
                {product.is_featured ? "Yes" : "No"}
              </span>
            </div>
            <div className="col-span-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {product.is_active ? "Active" : "Hidden"}
              </span>
            </div>
            <div className="col-span-1">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-xs font-semibold text-[#2C4A1E] hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
