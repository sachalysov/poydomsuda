"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";

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

  // The admin panel has its own nav — don't show the public site header there.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-50 relative transition-[background-color,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-bg-base/70 backdrop-blur-md"
          : "bg-bg-base/40 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-light.png"
              alt="Пойдём Сюда"
              width={84}
              height={56}
              className="h-10 sm:h-12 w-auto transition-opacity group-hover:opacity-90 dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Пойдём Сюда"
              width={84}
              height={56}
              className="h-10 sm:h-12 w-auto transition-opacity group-hover:opacity-90 hidden dark:block"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? "bg-rose-600/10 text-rose-700 border border-rose-500/30 dark:bg-rose-600/20 dark:text-rose-300"
                    : "text-text-body hover:bg-bg-hover hover:text-rose-800 dark:hover:text-rose-200"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-rose-900/20 dark:shadow-rose-900/50"
            >
              Найти досуг
            </Link>
          </div>

          {/* Mobile: theme + burger */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 min-w-11 min-h-11 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-bg-hover transition-colors"
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
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-border mt-2 pt-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-rose-600/10 text-rose-700 border border-rose-500/30 dark:bg-rose-600/20 dark:text-rose-300"
                    : "text-text-body hover:bg-bg-hover hover:text-rose-800 dark:hover:text-rose-200"
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
              Найти досуг
            </Link>
          </nav>
        )}
      </div>

      {/* Soft fade into page content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-10 bg-gradient-to-b from-bg-base/40 via-bg-base/15 to-transparent"
      />
    </header>
  );
}
