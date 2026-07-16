import type { Metadata } from "next";
import ChatInterface from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "Чат с AI-помощником — куда сходить в Петербурге",
  description:
    "Спросите AI-помощника куда сходить в Санкт-Петербурге. Персональные рекомендации по досугу, ресторанам, музеям и маршрутам.",
  alternates: { canonical: "https://poydomsuda.ru/chat" },
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#0D0608] flex flex-col">
      {/* Page header */}
      <section className="bg-[#0A0507] border-b border-[#3D1820] py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            AI-помощник
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-100 mb-3">
            Куда пойти сегодня?
          </h1>
          <p className="text-[#C8828A] max-w-lg mx-auto">
            Расскажите о своём настроении, компании и бюджете — AI подберёт лучшие варианты досуга в Петербурге
          </p>
        </div>
      </section>

      {/* Chat */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChatInterface />
      </div>
    </div>
  );
}
