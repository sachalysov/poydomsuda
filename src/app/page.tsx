import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Пойдём Сюда — куда сходить в Санкт-Петербурге",
  description:
    "Сервис для поиска идей досуга в Санкт-Петербурге.",
  alternates: { canonical: "https://poydomsuda.ru" },
};

const howItWorks = [
  {
    step: "1",
    title: "Напишите AI-помощнику",
    desc: "Расскажите, что ищете: «Хочу погулять с детьми», «Ищу ресторан для свидания», «Что поделать в дождь».",
  },
  {
    step: "2",
    title: "Получите рекомендации",
    desc: "Помощник подберёт места, события и маршруты с учётом вашего настроения, бюджета и компании.",
  },
  {
    step: "3",
    title: "Отправляйтесь",
    desc: "Сохраните идеи, изучите адреса — и вперёд навстречу новым впечатлениям по городу на Неве.",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative -mt-16 overflow-hidden bg-bg-base pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Background image — extends under sticky header */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/spb-hero.png')" }}
        />
        {/* Overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-overlay/95 via-overlay/80 to-overlay/50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--overlay)_0%,transparent_18%,transparent_82%,var(--overlay)_100%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="inline-flex items-center gap-2 bg-rose-600/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in-up text-shadow-soft">
            Санкт-Петербург
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-head leading-tight mb-6 animate-fade-in-up delay-100 text-shadow-soft">
            Найди, куда <br className="hidden sm:block" />
            <span className="text-rose-600 dark:text-rose-400">сходить сегодня</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-body max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-200 text-shadow-soft">
             AI-помощник, который подберёт
            лучшие места специально для вас.
          </p>

          <div className="flex flex-col sm:flex-row items-start justify-start gap-4 animate-fade-in-up delay-300">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-rose-900/20 dark:shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center animate-glow"
            >
              Спросить AI-помощника
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-bg-card text-rose-700 dark:text-rose-300 font-semibold text-lg px-8 py-4 rounded-2xl border border-border-md hover:border-rose-600 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Читать блог
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative overflow-hidden py-20 bg-bg-deep">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-head text-center mb-3 text-shadow-soft">
            Как это работает
          </h2>
          <p className="text-text-body text-center mb-14 max-w-lg mx-auto text-shadow-soft">
            Три шага до идеального досуга в городе
          </p>
          <HowItWorksSteps steps={howItWorks} />

          <div className="text-center mt-12">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-rose-900/20 dark:shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Попробовать бесплатно
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest posts ── */}
      <section className="relative overflow-hidden py-20 bg-bg-base">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/spb-how-it-works.png')" }}
        />
        <div className="absolute inset-0 bg-overlay/75" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--overlay)_0%,transparent_18%,transparent_82%,var(--overlay)_100%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-head text-shadow-soft">Блог по местам Санкт-Петербурга</h2>
              <p className="text-text-body mt-1 text-shadow-soft">Свежие идеи и маршруты по городу</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 dark:text-rose-500 dark:hover:text-rose-300 font-medium transition-colors"
            >
              Все статьи <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-bg-raised/80 backdrop-blur-sm border border-border hover:border-border-md rounded-2xl p-5 transition-all duration-200 hover:bg-bg-card"
              >
                <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 px-2.5 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="font-bold text-text-soft text-base leading-snug mb-2 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-text-body text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} чтения</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="text-rose-600 hover:text-rose-800 dark:text-rose-500 dark:hover:text-rose-300 font-medium">
              Все статьи →
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
