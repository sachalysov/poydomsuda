"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/blog", label: "Блог" },
  { href: "/chat", label: "Спросить AI" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF2]/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl animate-float">☀️</span>
            <span className="font-bold text-xl text-amber-700 group-hover:text-amber-600 transition-colors">
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
                    ? "bg-amber-400 text-amber-900"
                    : "text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA button desktop */}
          <Link
            href="/chat"
            className="hidden md:inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>💬</span> Найти досуг
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
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
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-amber-400 text-amber-900"
                    : "text-amber-800 hover:bg-amber-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
