"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // The admin panel has its own layout — don't show the public site footer there.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-bg-deep mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-footer-light.png"
                alt="Пойдём Сюда"
                width={84}
                height={56}
                className="h-10 sm:h-12 w-auto object-contain object-left dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-footer.png"
                alt="Пойдём Сюда"
                width={84}
                height={56}
                className="h-10 sm:h-12 w-auto object-contain object-left hidden dark:block"
              />
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Помогаем жителям и гостям Санкт-Петербурга находить лучшие места для отдыха и развлечений.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-rose-700 dark:text-rose-400 mb-4 text-sm uppercase tracking-wider">Разделы</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Главная" },
                { href: "/blog", label: "Блог о досуге" },
                { href: "/chat", label: "Чат с AI-помощником" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-text-body hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* City */}
          <div>
            <h3 className="font-semibold text-rose-700 dark:text-rose-400 mb-4 text-sm uppercase tracking-wider">Город</h3>
            <p className="text-sm text-text-body">
              Санкт-Петербург, Россия
            </p>
            <p className="text-xs text-text-muted mt-5">
              © {new Date().getFullYear()} Пойдём Сюда. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
