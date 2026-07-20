import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/components/blog/BackButton";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import "./article.css";

interface Props {
  params: Promise<{ slug: string }>;
}

// Posts are managed via the admin panel and stored in Supabase, so the page
// is rendered dynamically on every request instead of being statically built.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    alternates: { canonical: `https://poydomsuda.ru/blog/${slug}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: `https://poydomsuda.ru/blog/${post.slug}`,
    publisher: { "@type": "Organization", name: "Пойдём Сюда" },
  };

  return (
    <div className="min-h-screen bg-[#0D0608]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Back + breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-3">
        <BackButton />
        <nav className="flex items-center gap-2 text-sm text-[#7A3040]" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-rose-400 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-rose-400 transition-colors">Блог</Link>
          <span>/</span>
          <span className="text-[#C8828A] line-clamp-1">{post.title}</span>
        </nav>
      </div>

      {/* Article header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-block text-sm font-medium bg-rose-600/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-[#7A3040]">{post.date}</span>
          <span className="text-[#3D1820]">·</span>
          <span className="text-sm text-[#7A3040]">{post.readTime} чтения</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-rose-100 leading-tight mb-5">
          {post.title}
        </h1>
        <p className="text-lg text-[#C8828A] leading-relaxed border-l-4 border-rose-700/50 pl-4">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-rose-400 bg-rose-600/10 border border-rose-500/20 rounded-full px-2.5 py-1">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.image && (
        <figure className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={`Обложка статьи «${post.title}»`} className="w-full h-auto max-h-[32rem] object-cover rounded-2xl" />
        </figure>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-[#3D1820] mb-8" />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      {/* Ask AI CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-[#160A0D] border border-[#5C2530] rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl font-bold text-rose-200 mb-2">
            Хотите персональный совет?
          </h3>
          <p className="text-[#C8828A] mb-5 text-sm">
            Спросите AI-помощника — он подберёт идеи специально для вас и вашей компании
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Открыть чат
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-[#0A0507] border-t border-[#3D1820] py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-rose-100 mb-8">Читайте также</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] rounded-2xl p-5 transition-all duration-200 hover:bg-[#1E0E12]"
                >
                  <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full mb-3">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-rose-200 text-sm leading-snug group-hover:text-rose-300 transition-colors line-clamp-2 mb-2">
                    {p.title}
                  </h3>
                  <div className="text-xs text-[#7A3040]">
                    {p.date} · {p.readTime} чтения
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
