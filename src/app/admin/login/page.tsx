"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setPending(false);

    if (signInError) {
      setError("Неверная почта или пароль.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0D0608] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-[#160A0D] border border-[#3D1820] rounded-3xl p-8">
        <h1 className="text-2xl font-bold text-rose-100 mb-1 text-center">
          Вход в админ-панель
        </h1>
        <p className="text-sm text-[#7A3040] text-center mb-8">
          Пойдём Сюда — управление блогом
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#C8828A] mb-2">
              Почта
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0D0608] border border-[#3D1820] rounded-xl px-4 py-3 text-rose-100 placeholder:text-[#7A3040] focus:outline-none focus:border-rose-700/60 transition-colors"
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#C8828A] mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0D0608] border border-[#3D1820] rounded-xl px-4 py-3 text-rose-100 placeholder:text-[#7A3040] focus:outline-none focus:border-rose-700/60 transition-colors"
              placeholder=""
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-60 disabled:hover:bg-rose-600 text-white font-bold rounded-xl px-4 py-3 transition-all duration-200"
          >
            {pending ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
