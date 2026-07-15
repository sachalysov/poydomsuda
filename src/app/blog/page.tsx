import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Блог о досуге в Петербурге",
  description:
    "Статьи о лучших местах, маршрутах и событиях Санкт-Петербурга. Идеи для выходных, куда сходить и как интересно провести время в городе.",
  alternates: { canonical: "https://poydomsuda.ru/blog" },
};

const categories = ["Все", "Прогулки", "Культура", "Еда", "Активный отдых", "Развлечения"];

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#FFFBF2]">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            <span>📰</span> Блог о досуге
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4">
            Идеи для Петербурга
          </h1>
          <p className="text-amber-700/80 text-lg max-w-xl mx-auto">
            Маршруты, места, события и советы — всё, чтобы ваш досуг в городе был ярким
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === "Все"
                  ? "bg-amber-400 text-amber-900"
                  : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Featured post */}
        {posts[0] && (
          <Link
            href={`/blog/${posts[0].slug}`}
            className="group block bg-white border border-amber-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="text-6xl sm:text-7xl flex-shrink-0">{posts[0].emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                    {posts[0].category}
                  </span>
                  <span className="text-xs text-amber-500 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">
                    Рекомендуем
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition-colors leading-snug">
                  {posts[0].title}
                </h2>
                <p className="text-amber-700/75 leading-relaxed mb-4 line-clamp-2">
                  {posts[0].description}
                </p>
                <div className="flex items-center gap-3 text-sm text-amber-600">
                  <span>{posts[0].date}</span>
                  <span>·</span>
                  <span>{posts[0].readTime} чтения</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-amber-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col"
            >
              <div className="text-4xl mb-3">{post.emoji}</div>
              <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full mb-3 self-start">
                {post.category}
              </span>
              <h2 className="font-bold text-amber-900 text-base leading-snug mb-2 group-hover:text-amber-700 transition-colors line-clamp-2 flex-1">
                {post.title}
              </h2>
              <p className="text-amber-700/70 text-sm leading-relaxed line-clamp-2 mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-600 mt-auto">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime} чтения</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-amber-50 border-t border-amber-100 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-amber-800 mb-6">
            Хотите персональные рекомендации? Спросите нашего AI-помощника!
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-8 py-4 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>💬</span> Открыть чат с AI
          </Link>
        </div>
      </section>
    </div>
  );
}
