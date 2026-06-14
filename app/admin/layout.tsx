"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Leaf, LayoutDashboard, Package, FileText, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email ?? "");
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/admin/products", label: "Products", icon: <Package size={16} /> },
    { href: "/admin/blog", label: "Blog Posts", icon: <FileText size={16} /> },
  ];

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F8F4EE] flex">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-[#2C4A1E] min-h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Naturdine
            </span>
            <Leaf size={13} color="#C8A96E" />
          </div>
          <p className="text-xs text-white/50 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-white/15 text-white"
                  : "text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-3 truncate">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#2C4A1E] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          Naturdine Admin
        </span>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#2C4A1E] pt-16 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-4 text-white border-b border-white/10"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-4 text-white/65 mt-4"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-56 pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
