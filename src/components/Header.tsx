"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/blog", label: "Блог" },
  { href: "/chat", label: "Спросить AI" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#3D1820]/60 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-[#0D0608]/40 backdrop-blur-md"
          : "bg-[#0D0608]/50 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl animate-float">🌆</span>
            <span className="font-bold text-xl text-rose-200 group-hover:text-rose-100 transition-colors">
              Пойдём Сюда
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/30"
                    : "text-[#C8828A] hover:bg-[#271318] hover:text-rose-200"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA button */}
          <Link
            href="/chat"
            className="hidden md:inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-rose-900/50"
          >
            <span>💬</span> Найти досуг
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-rose-400 hover:bg-[#271318] transition-colors"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-[#3D1820] mt-2 pt-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/30"
                    : "text-[#C8828A] hover:bg-[#271318] hover:text-rose-200"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/chat"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <span>💬</span> Найти досуг
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
