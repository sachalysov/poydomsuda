import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Пойдём Сюда — куда сходить в Санкт-Петербурге",
  description:
    "Сервис для поиска идей досуга в Санкт-Петербурге. Спросите AI-помощника куда сходить, что посетить и как интересно провести время в городе.",
  alternates: { canonical: "https://poydomsuda.ru" },
};

const features = [
  {
    emoji: "🤖",
    title: "AI-помощник",
    desc: "Опишите своё настроение, бюджет и компанию — и получите персональные рекомендации за секунды.",
  },
  {
    emoji: "📰",
    title: "Блог о досуге",
    desc: "Редакционные статьи о лучших местах, маршрутах и событиях города — от музеев до уличных фестивалей.",
  },
  {
    emoji: "📍",
    title: "Только Петербург",
    desc: "Фокусируемся на одном городе, чтобы давать актуальные и точные советы без воды.",
  },
];

const howItWorks = [
  {
    step: "1",
    emoji: "💬",
    title: "Напишите AI-помощнику",
    desc: "Расскажите, что ищете: «Хочу погулять с детьми», «Ищу ресторан для свидания», «Что поделать в дождь».",
  },
  {
    step: "2",
    emoji: "✨",
    title: "Получите рекомендации",
    desc: "Помощник подберёт места, события и маршруты с учётом вашего настроения, бюджета и компании.",
  },
  {
    step: "3",
    emoji: "🗺️",
    title: "Отправляйтесь",
    desc: "Сохраните идеи, изучите адреса — и вперёд навстречу новым впечатлениям по городу на Неве.",
  },
];

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0D0608] pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-20 w-96 h-96 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[280px] bg-rose-800/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
            <span>📍</span> Санкт-Петербург
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-rose-100 leading-tight mb-6 animate-fade-in-up delay-100">
            Найди, куда <br className="hidden sm:block" />
            <span className="text-rose-400">сходить сегодня</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#C8828A] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Сервис для поиска досуга в Петербурге. Пообщайтесь с AI-помощником, который подберёт
            лучшие места, маршруты и события — специально для вас.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center animate-glow"
            >
              <span>💬</span> Спросить AI-помощника
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-[#1E0E12] text-rose-300 font-semibold text-lg px-8 py-4 rounded-2xl border border-[#5C2530] hover:border-rose-600 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <span>📰</span> Читать блог
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 animate-fade-in-up delay-400">
            {[
              { value: "500+", label: "мест в базе" },
              { value: "24/7", label: "AI на связи" },
              { value: "100%", label: "про Петербург" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-rose-400">{value}</div>
                <div className="text-sm text-[#7A3040] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#3D1820] to-transparent" />

      {/* ── Features ── */}
      <section className="py-20 bg-[#0D0608]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-100 text-center mb-3">
            Что умеет сервис
          </h2>
          <p className="text-[#7A3040] text-center mb-12 max-w-lg mx-auto">
            Всё необходимое для того, чтобы каждые выходные в Петербурге были запоминающимися
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] rounded-2xl p-6 transition-all duration-200 group hover:bg-[#1E0E12]"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {emoji}
                </div>
                <h3 className="text-lg font-bold text-rose-200 mb-2">{title}</h3>
                <p className="text-[#C8828A] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#3D1820] to-transparent" />

      {/* ── How it works ── */}
      <section className="py-20 bg-[#0A0507]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-100 text-center mb-3">
            Как это работает
          </h2>
          <p className="text-[#7A3040] text-center mb-14 max-w-lg mx-auto">
            Три шага до идеального досуга в городе
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {howItWorks.map(({ step, emoji, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-600 text-white font-bold text-lg rounded-full mb-4 shadow-lg shadow-rose-900/60">
                  {step}
                </div>
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="text-lg font-bold text-rose-200 mb-2">{title}</h3>
                <p className="text-[#C8828A] text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>🚀</span> Попробовать бесплатно
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#3D1820] to-transparent" />

      {/* ── Latest posts ── */}
      <section className="py-20 bg-[#0D0608]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-rose-100">Из блога</h2>
              <p className="text-[#7A3040] mt-1">Свежие идеи и маршруты по городу</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1 text-rose-500 hover:text-rose-300 font-medium transition-colors"
            >
              Все статьи <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] rounded-2xl p-5 transition-all duration-200 hover:bg-[#1E0E12]"
              >
                <div className="text-4xl mb-3">{post.emoji}</div>
                <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="font-bold text-rose-200 text-base leading-snug mb-2 group-hover:text-rose-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#C8828A] text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#7A3040]">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} чтения</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="text-rose-500 hover:text-rose-300 font-medium">
              Все статьи →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-gradient-to-br from-[#1A060C] via-[#200B12] to-[#1A060C] border-t border-[#3D1820]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4 animate-float">🌆</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-100 mb-4">
            Петербург ждёт вас
          </h2>
          <p className="text-[#C8828A] mb-8 text-lg max-w-xl mx-auto">
            Спросите AI-помощника прямо сейчас — и узнайте, куда пойти сегодня вечером.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl shadow-rose-900/50 transition-all duration-200 hover:-translate-y-0.5 animate-glow"
          >
            <span>💬</span> Начать разговор
          </Link>
        </div>
      </section>
    </>
  );
}
