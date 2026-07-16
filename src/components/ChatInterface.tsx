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
  "Привет! Я помогу найти идеальный досуг в Санкт-Петербурге. Расскажите — с кем идёте, какой у вас бюджет и что вам нравится? Или выберите один из вариантов ниже.";

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
        await new Promise((r) => setTimeout(r, 800));
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: `Отличный вопрос! Я получил ваше сообщение: «${text.trim()}». \n\nПока вебхук с нейросетью не подключён — но скоро я смогу давать полноценные персональные рекомендации по досугу в Санкт-Петербурге. Пока загляните в наш блог — там много интересных идей.`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Упс, что-то пошло не так. Попробуйте ещё раз чуть позже!",
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
              <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-xs font-semibold text-rose-400 flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-rose-600 text-white rounded-br-sm font-medium"
                  : "bg-[#160A0D] border border-[#3D1820] text-[#C8828A] rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#1E0E12] border border-[#3D1820] flex items-center justify-center text-xs font-semibold text-[#C8828A] flex-shrink-0 mt-1">
                Вы
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-xs font-semibold text-rose-400 flex-shrink-0 mt-1">
              AI
            </div>
            <div className="bg-[#160A0D] border border-[#3D1820] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
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
              className="text-xs bg-[#160A0D] border border-[#3D1820] text-[#C8828A] px-3 py-2 rounded-full hover:border-[#5C2530] hover:text-rose-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-[#160A0D] border border-[#3D1820] rounded-2xl focus-within:border-rose-700/60 transition-all duration-200">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите что ищете... (Enter для отправки)"
          rows={2}
          className="w-full px-4 pt-4 pb-2 text-sm text-rose-100 placeholder:text-[#7A3040] bg-transparent resize-none outline-none"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-[#7A3040]">Shift+Enter для переноса строки</span>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2 rounded-xl transition-all duration-200"
          >
            <span>Отправить</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
