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
    <div className="min-h-screen bg-[#0D0608]">

      {/* Page header */}
      <section className="bg-[#0A0507] border-b border-[#3D1820] py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Блог о досуге
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-100 mb-4">
            Идеи для Петербурга
          </h1>
          <p className="text-[#C8828A] text-lg max-w-xl mx-auto">
            Маршруты, места, события и советы — всё, чтобы ваш досуг в городе был ярким
          </p>
        </div>
      </section>

      {/* Category filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === "Все"
                  ? "bg-rose-600 text-white"
                  : "bg-[#160A0D] border border-[#3D1820] text-[#C8828A] hover:border-[#5C2530] hover:text-rose-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Featured post */}
        {posts[0] && (
          <Link
            href={`/blog/${posts[0].slug}`}
            className="group block bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] rounded-3xl p-6 sm:p-8 transition-all duration-300 mb-8 hover:bg-[#1E0E12]"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full">
                    {posts[0].category}
                  </span>
                  <span className="text-xs bg-red-600/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full font-medium">
                    Рекомендуем
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-rose-200 mb-3 group-hover:text-rose-300 transition-colors leading-snug">
                  {posts[0].title}
                </h2>
                <p className="text-[#C8828A] leading-relaxed mb-4 line-clamp-2">
                  {posts[0].description}
                </p>
                <div className="flex items-center gap-3 text-sm text-[#7A3040]">
                  <span>{posts[0].date}</span>
                  <span>·</span>
                  <span>{posts[0].readTime} чтения</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] rounded-2xl p-5 transition-all duration-200 flex flex-col hover:bg-[#1E0E12]"
            >
              <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full mb-3 self-start">
                {post.category}
              </span>
              <h2 className="font-bold text-rose-200 text-base leading-snug mb-2 group-hover:text-rose-300 transition-colors line-clamp-2 flex-1">
                {post.title}
              </h2>
              <p className="text-[#C8828A] text-sm leading-relaxed line-clamp-2 mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#7A3040] mt-auto">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime} чтения</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-[#0A0507] border-t border-[#3D1820] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-[#C8828A] mb-6">
            Хотите персональные рекомендации? Спросите нашего AI-помощника!
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Открыть чат с AI
          </Link>
        </div>
      </section>
    </div>
  );
}
