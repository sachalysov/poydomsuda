import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://poydomsuda.ru/blog/${slug}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  const contentHtml = post.content
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) {
        return `<h2 class="text-2xl font-bold text-amber-900 mt-10 mb-4">${line.slice(3)}</h2>`;
      }
      if (line.startsWith("### ")) {
        return `<h3 class="text-xl font-bold text-amber-800 mt-7 mb-3">${line.slice(4)}</h3>`;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return `<p class="font-semibold text-amber-900 my-2">${line.slice(2, -2)}</p>`;
      }
      if (line.startsWith("- ")) {
        return `<li class="ml-4 text-amber-800 leading-relaxed list-disc">${line.slice(2)}</li>`;
      }
      if (line.startsWith("---")) {
        return `<hr class="border-amber-200 my-8" />`;
      }
      if (line.trim() === "") {
        return "";
      }
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber-600 underline hover:text-amber-800">$1</a>');
      return `<p class="text-amber-800 leading-relaxed my-3">${formatted}</p>`;
    })
    .join("\n");

  return (
    <div className="min-h-screen bg-[#FFFBF2]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-amber-600">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-800 transition-colors">
            Блог
          </Link>
          <span>/</span>
          <span className="text-amber-800 font-medium line-clamp-1">{post.title}</span>
        </nav>
      </div>

      {/* Article header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-6xl mb-5">{post.emoji}</div>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-block text-sm font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-amber-600">{post.date}</span>
          <span className="text-amber-400">·</span>
          <span className="text-sm text-amber-600">{post.readTime} чтения</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 leading-tight mb-5">
          {post.title}
        </h1>
        <p className="text-lg text-amber-700/80 leading-relaxed border-l-4 border-amber-300 pl-4">
          {post.description}
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-amber-100 mb-8" />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="prose-amber"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {/* Ask AI CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 sm:p-8 text-center">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">
            Хотите персональный совет?
          </h3>
          <p className="text-amber-700/80 mb-5 text-sm">
            Спросите AI-помощника — он подберёт идеи специально для вас и вашей компании
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>🚀</span> Открыть чат
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-amber-50 border-t border-amber-100 py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-8">Читайте также</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group bg-white border border-amber-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
                >
                  <div className="text-3xl mb-3">{p.emoji}</div>
                  <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full mb-3">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-amber-900 text-sm leading-snug group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
                    {p.title}
                  </h3>
                  <div className="text-xs text-amber-600">
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
