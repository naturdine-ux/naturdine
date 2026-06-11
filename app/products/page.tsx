import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main>
      {/* Header */}
      <section className="bg-[#F8F4EE] border-b border-[#EDE8DF] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
            Shop
          </p>
          <h1 className="text-4xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            All Products
          </h1>
          <p className="text-[#6B6560] mt-2">
            Natural cutlery for every table. Every order ships from the USA.
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}