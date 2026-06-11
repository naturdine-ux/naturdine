import Link from "next/link";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer">

        {/* Image area */}
        <div
          className="h-48 flex items-center justify-center text-6xl relative"
          style={{ background: product.color }}
        >
          {product.emoji}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-[#2C4A1E] text-white text-[10px] font-bold px-3 py-1 rounded-full">
              {product.tag}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96E] mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400 text-xs">{"★".repeat(Math.floor(product.rating))}</span>
            <span className="text-xs text-[#6B6560]">{product.rating} ({product.review_count})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#2C4A1E]"
              style={{ fontFamily: "var(--font-playfair)" }}>
              ${product.price}
            </span>
            <span className="text-xs text-[#6B6560]">View details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}