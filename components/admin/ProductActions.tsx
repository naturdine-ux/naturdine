"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductActions({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    await supabase
      .from("products")
      .update({ is_active: !isActive })
      .eq("id", id);
    router.refresh();
    setLoading(false);
  };

  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    setLoading(true);
    await supabase.from("products").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/products/${id}/edit`}
        className="text-xs font-semibold text-[#2C4A1E] hover:underline"
      >
        Edit
      </Link>
      <button
        onClick={toggleActive}
        disabled={loading}
        className={`text-xs font-semibold hover:underline disabled:opacity-50 ${
          isActive ? "text-orange-500" : "text-green-600"
        }`}
      >
        {isActive ? "Hide" : "Show"}
      </button>
      <button
        onClick={deleteProduct}
        disabled={loading}
        className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
