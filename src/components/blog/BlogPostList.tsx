"use client";

import { useState } from "react";
import Link from "next/link";

export type BlogPostCard = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
};

const CATEGORIES = ["Все", "Прогулки", "Культура", "Еда", "Активный отдых", "Развлечения"] as const;

type Category = (typeof CATEGORIES)[number];

export function BlogPostList({ posts }: { posts: BlogPostCard[] }) {
  const [active, setActive] = useState<Category>("Все");

  const filtered =
    active === "Все" ? posts : posts.filter((post) => post.category === active);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по категориям">
          {CATEGORIES.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(cat)}
                className={`min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-600 text-white"
                    : "bg-bg-raised border border-border text-text-body hover:border-border-md hover:text-rose-700 dark:hover:text-rose-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-text-body py-16">
            В категории «{active}» пока нет статей
          </p>
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group block bg-bg-raised border border-border hover:border-border-md rounded-3xl p-6 sm:p-8 transition-all duration-300 mb-8 hover:bg-bg-card"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {featured.image && (
                    <div className="w-full sm:w-64 lg:w-80 shrink-0 overflow-hidden rounded-2xl aspect-[16/10]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featured.image}
                        alt={`Обложка статьи «${featured.title}»`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 px-2.5 py-1 rounded-full">
                        {featured.category}
                      </span>
                      {active === "Все" && (
                        <span className="text-xs bg-red-600/10 border border-red-500/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-medium">
                          Рекомендуем
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-soft mb-3 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-text-body leading-relaxed mb-4 line-clamp-2">
                      {featured.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <span>{featured.date}</span>
                      <span>·</span>
                      <span>{featured.readTime} чтения</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-bg-raised border border-border hover:border-border-md rounded-2xl p-5 transition-all duration-200 flex flex-col hover:bg-bg-card"
                  >
                    {post.image && (
                      <div className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl aspect-[16/9]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image}
                          alt={`Обложка статьи «${post.title}»`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                        />
                      </div>
                    )}
                    <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 px-2.5 py-1 rounded-full mb-3 self-start">
                      {post.category}
                    </span>
                    <h2 className="font-bold text-text-soft text-base leading-snug mb-2 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h2>
                    <p className="text-text-body text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-auto">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime} чтения</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
