import Link from "next/link";
import { Leaf } from "lucide-react";
import EmailCapture from "@/components/EmailCapture";

export default function Footer() {
  return (
    <footer className="bg-[#2C4A1E] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Naturdine</span>
              <Leaf size={14} color="#C8A96E" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-[200px]">
              Natural wooden cutlery for a plastic-free table. Sustainably sourced, beautifully made.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Shop</h4>
            {["Cutlery Sets", "Gift Sets", "Individual Pieces"].map((item) => (
              <Link key={item} href={`/products?category=${item}`} className="block text-sm text-white/60 hover:text-white py-1 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
            {[
              { href: "/about", label: "Our Story" },
              { href: "/blog", label: "Journal" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm text-white/60 hover:text-white py-1 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Email signup */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Get 10% off</h4>
            <p className="text-xs text-white/50 mb-4">Join our community for offers and updates.</p>
            <EmailCapture source="footer" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3">
          <p className="text-xs text-white/40">© 2026 Naturdine. All rights reserved.</p>
          <p className="text-xs text-white/40">Natural cutlery, made with care 🌿</p>
        </div>
      </div>
    </footer>
  );
}
