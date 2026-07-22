import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Блог о досуге в Петербурге",
  description:
    "Статьи о лучших местах, маршрутах и событиях Санкт-Петербурга. Идеи для выходных, куда сходить и как интересно провести время в городе.",
  alternates: { canonical: "https://poydomsuda.ru/blog" },
};

// Posts are managed via the admin panel and stored in Supabase, so the page
// is rendered dynamically on every request instead of being statically built.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getAllPosts();

  const cards = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
  }));

  return (
    <div className="min-h-screen bg-bg-base">
      <section className="bg-bg-deep border-b border-border py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-600/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Блог о досуге
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-head mb-4">
            Идеи для Петербурга
          </h1>
          <p className="text-text-body text-lg max-w-xl mx-auto">
            Маршруты, места, события и советы — всё, чтобы ваш досуг в городе был ярким
          </p>
        </div>
      </section>

      <BlogPostList posts={cards} />

      <section className="bg-bg-deep border-t border-border py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-text-body mb-6">
            Хотите персональные рекомендации? Спросите нашего AI-помощника!
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-rose-900/20 dark:shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Открыть чат с AI
          </Link>
        </div>
      </section>
    </div>
  );
}
