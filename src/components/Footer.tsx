import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0507] border-t border-[#3D1820] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌆</span>
              <span className="font-bold text-lg text-rose-200">Пойдём Сюда</span>
            </div>
            <p className="text-sm text-[#7A3040] leading-relaxed">
              Помогаем жителям и гостям Санкт-Петербурга находить лучшие места для отдыха и развлечений.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-rose-400 mb-4 text-sm uppercase tracking-wider">Разделы</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Главная" },
                { href: "/blog", label: "Блог о досуге" },
                { href: "/chat", label: "Чат с AI-помощником" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[#C8828A] hover:text-rose-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* City */}
          <div>
            <h3 className="font-semibold text-rose-400 mb-4 text-sm uppercase tracking-wider">Город</h3>
            <p className="text-sm text-[#C8828A] flex items-center gap-2">
              <span>📍</span> Санкт-Петербург, Россия
            </p>
            <p className="text-xs text-[#7A3040] mt-5">
              © {new Date().getFullYear()} Пойдём Сюда. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
