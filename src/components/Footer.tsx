import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-amber-50 border-t border-amber-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☀️</span>
              <span className="font-bold text-lg text-amber-700">Пойдём Сюда</span>
            </div>
            <p className="text-sm text-amber-800/70 leading-relaxed">
              Помогаем жителям и гостям Санкт-Петербурга находить лучшие места для отдыха и развлечений.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-amber-800 mb-3">Разделы</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-amber-700 hover:text-amber-900 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-amber-700 hover:text-amber-900 transition-colors">
                  Блог о досуге
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-amber-700 hover:text-amber-900 transition-colors">
                  Чат с AI-помощником
                </Link>
              </li>
            </ul>
          </div>

          {/* City */}
          <div>
            <h3 className="font-semibold text-amber-800 mb-3">Город</h3>
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <span>📍</span> Санкт-Петербург, Россия
            </p>
            <p className="text-xs text-amber-600 mt-4">
              © {new Date().getFullYear()} Пойдём Сюда. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
