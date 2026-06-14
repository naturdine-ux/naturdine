import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🌿</div>
        <h1
          className="text-5xl font-bold text-[#2C4A1E] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          404
        </h1>
        <h2
          className="text-2xl font-bold text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Page not found
        </h2>
        <p className="text-[#6B6560] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#2C4A1E] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#1e3414] transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/products"
            className="bg-[#F8F4EE] text-[#2C4A1E] font-semibold px-8 py-3 rounded-xl hover:bg-[#EDE8DF] transition-colors border border-[#EDE8DF]"
          >
            Shop products
          </Link>
        </div>
      </div>
    </main>
  );
}