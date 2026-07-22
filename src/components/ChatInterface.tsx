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

const SESSION_KEY = "poydomsuda-chat-session";

const botPlaceholder =
  "Привет! Я помогу найти идеальный досуг в Санкт-Петербурге. Расскажите — с кем идёте, какой у вас бюджет и что вам нравится? Или выберите один из вариантов ниже.";

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", text: botPlaceholder },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const trimmed = text.trim();
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const activeSessionId = sessionId || getOrCreateSessionId();
    if (!sessionId) setSessionId(activeSessionId);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId: activeSessionId }),
      });

      const data = (await res.json()) as { reply?: string; error?: string; sessionId?: string };

      if (data.sessionId && data.sessionId !== activeSessionId) {
        setSessionId(data.sessionId);
        try {
          sessionStorage.setItem(SESSION_KEY, data.sessionId);
        } catch {
          /* ignore */
        }
      }

      const botText =
        res.ok && data.reply
          ? data.reply
          : data.error || "Упс, что-то пошло не так. Попробуйте ещё раз чуть позже!";

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", text: botText },
      ]);
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
              <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-xs font-semibold text-rose-700 dark:text-rose-400 flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-rose-600 text-white rounded-br-sm font-medium"
                  : "bg-bg-raised border border-border text-text-body rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-xs font-semibold text-text-body flex-shrink-0 mt-1">
                Вы
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-xs font-semibold text-rose-700 dark:text-rose-400 flex-shrink-0 mt-1">
              AI
            </div>
            <div className="bg-bg-raised border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
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
              className="text-xs bg-bg-raised border border-border text-text-body px-3 py-2 rounded-full hover:border-border-md hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 bg-bg-raised border border-border rounded-2xl px-4 py-2 focus-within:border-rose-700/60 transition-all duration-200">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите что ищете... (Enter для отправки)"
          rows={2}
          className="flex-1 min-w-0 py-2 text-sm text-text-head placeholder:text-text-muted bg-transparent resize-none outline-none"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          aria-label="Отправить"
          className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
