"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const suggestions = [
  "Куда сходить с детьми в выходные?",
  "Романтический ужин с видом на Неву",
  "Активный отдых в Петербурге",
  "Что поделать в дождливый день?",
  "Куда сходить вечером с друзьями?",
  "Недорогие кафе в центре",
];

const WEBHOOK_URL = ""; // Подключите ваш вебхук здесь

const botPlaceholder =
  "Привет! 👋 Я помогу найти идеальный досуг в Санкт-Петербурге. Расскажите — с кем идёте, какой у вас бюджет и что вам нравится? Или выберите один из вариантов ниже.";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", text: botPlaceholder },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (WEBHOOK_URL) {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim() }),
        });
        const data = await res.json();
        const botText = data.response || data.text || data.message || "Спасибо за вопрос! Скоро я смогу полноценно ответить.";
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: "assistant", text: botText },
        ]);
      } else {
        // Заглушка до подключения вебхука
        await new Promise((r) => setTimeout(r, 800));
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: `Отличный вопрос! 🌟 Я получил ваше сообщение: «${text.trim()}». \n\nПока вебхук с нейросетью не подключён — но скоро я смогу давать полноценные персональные рекомендации по досугу в Санкт-Петербурге. Пока загляните в наш блог — там много интересных идей! 👇`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Упс, что-то пошло не так. Попробуйте ещё раз чуть позже! 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Messages */}
      <div className="flex-1 space-y-4 mb-4 min-h-[300px] max-h-[60vh] overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                ☀️
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-amber-400 text-amber-900 rounded-br-sm font-medium"
                  : "bg-white border border-amber-100 text-amber-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                👤
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm flex-shrink-0 mt-1">
              ☀️
            </div>
            <div className="bg-white border border-amber-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-full hover:bg-amber-100 hover:border-amber-400 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border border-amber-200 rounded-2xl shadow-sm focus-within:border-amber-400 focus-within:shadow-amber-100 focus-within:shadow-md transition-all duration-200">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите что ищете... (Enter для отправки)"
          rows={2}
          className="w-full px-4 pt-4 pb-2 text-sm text-amber-900 placeholder:text-amber-400 bg-transparent resize-none outline-none"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-amber-400">Shift+Enter для переноса строки</span>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-900 font-semibold text-sm px-5 py-2 rounded-xl transition-all duration-200"
          >
            <span>Отправить</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
