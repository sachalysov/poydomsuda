import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6 animate-float">🌅</div>
      <h1 className="text-4xl font-bold text-amber-900 mb-4">404 — Страница не найдена</h1>
      <p className="text-amber-700/75 text-lg max-w-sm mb-8">
        Кажется, эта страница уже ушла на прогулку по Петербургу.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-6 py-3 rounded-xl transition-all duration-200"
        >
          <span>🏠</span> На главную
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-white border border-amber-200 hover:border-amber-400 text-amber-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
        >
          <span>📰</span> В блог
        </Link>
      </div>
    </div>
  );
}
