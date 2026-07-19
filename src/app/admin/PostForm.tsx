"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { ActionState } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import type { PostRow } from "@/lib/posts";

const CATEGORIES = ["Прогулки", "Культура", "Еда", "Активный отдых", "Развлечения"];

interface PostFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  post?: PostRow;
  submitLabel: string;
}

const inputClass =
  "w-full bg-[#0D0608] border border-[#3D1820] rounded-xl px-4 py-3 text-rose-100 placeholder:text-[#7A3040] focus:outline-none focus:border-rose-700/60 transition-colors";
const labelClass = "block text-sm font-medium text-[#C8828A] mb-2";

export default function PostForm({ action, post, submitLabel }: PostFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className={labelClass}>
          Заголовок *
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={inputClass}
          placeholder="Лучшие парки Петербурга для прогулок"
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          URL (slug) *
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className={inputClass}
          placeholder="luchshie-parki-spb"
        />
        <p className="text-xs text-[#7A3040] mt-1.5">
          Адрес статьи: /blog/{slug || "..."}
        </p>
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Категория *
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={post?.category ?? CATEGORIES[0]}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Краткое описание (анонс) *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={post?.description}
          className={`${inputClass} resize-none`}
          placeholder="Короткий анонс статьи для карточки и списка блога"
        />
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>
          Обложка (URL картинки)
        </label>
        <input
          id="image"
          name="image"
          type="url"
          defaultValue={post?.image ?? ""}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Текст статьи *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={16}
          defaultValue={post?.content}
          className={`${inputClass} resize-y font-mono text-sm`}
          placeholder={
            "## Заголовок раздела\n\nОбычный текст абзаца.\n\n- пункт списка\n- ещё пункт\n\n**Жирный текст**"
          }
        />
        <p className="text-xs text-[#7A3040] mt-1.5">
          Поддерживается упрощённый Markdown: <code>## заголовок</code>, <code>### подзаголовок</code>,{" "}
          <code>- список</code>, <code>**жирный**</code>, <code>[текст](ссылка)</code>, <code>---</code>.
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
          className="w-5 h-5 rounded border-[#3D1820] bg-[#0D0608] accent-rose-600"
        />
        <span className="text-sm text-[#C8828A]">
          Опубликовать (видна на сайте). Если выключено — статья сохранится как черновик.
        </span>
      </label>

      {state?.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-60 disabled:hover:bg-rose-600 text-white font-bold rounded-xl px-6 py-3 transition-all duration-200"
        >
          {pending ? "Сохраняем…" : submitLabel}
        </button>
        <Link
          href="/admin"
          className="bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] text-[#C8828A] hover:text-rose-300 rounded-xl px-6 py-3 transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
