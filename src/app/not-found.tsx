import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-bg-base">
      <h1 className="text-4xl font-bold text-text-head mb-4">404 — Страница не найдена</h1>
      <p className="text-text-body text-lg max-w-sm mb-8">
        Кажется, эта страница уже ушла на прогулку по ночному Петербургу.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
        >
          На главную
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-bg-raised border border-border-md hover:border-rose-600 text-rose-700 dark:text-rose-300 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
        >
          В блог
        </Link>
      </div>
    </div>
  );
}
