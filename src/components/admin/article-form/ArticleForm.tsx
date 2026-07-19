"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { Save } from "lucide-react";
import type { PostRow } from "@/lib/posts";
import type { ArticleEditorData } from "@/lib/article-types";
import { slugify } from "@/lib/slugify";
import { useAutosave } from "@/components/editor/hooks/useAutosave";
import type { EditorValue } from "@/components/editor/types";
import { MetadataFields } from "./MetadataFields";
import { SaveIndicator } from "./SaveIndicator";
import "./article-form.css";

const ArticleEditor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
  loading: () => <div className="article-editor-placeholder">Загрузка редактора…</div>,
});

const EMPTY_DOCUMENT: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

function toDateTimeLocal(value?: string) {
  const date = value ? new Date(value) : new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function initialArticle(post?: PostRow): ArticleEditorData {
  return {
    id: post?.id ?? null,
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    description: post?.description ?? "",
    image: post?.image ?? "",
    category: post?.category ?? "Прогулки",
    tags: post?.tags ?? [],
    seoTitle: post?.seo_title ?? "",
    seoDescription: post?.seo_description ?? "",
    status: post?.published ? "published" : "draft",
    publishedAt: toDateTimeLocal(post?.published_at),
    contentJson: post?.content_json ?? EMPTY_DOCUMENT,
    contentHtml: post?.content_html ?? "<p></p>",
  };
}

export function ArticleForm({ post, initialHtml }: { post?: PostRow; initialHtml?: string }) {
  const [article, setArticle] = useState<ArticleEditorData>(() => {
    const value = initialArticle(post);
    if (!post?.content_json && initialHtml) value.contentHtml = initialHtml;
    return value;
  });
  const [revision, setRevision] = useState(0);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));

  const markChanged = useCallback(() => setRevision((value) => value + 1), []);
  const update = useCallback(<K extends keyof ArticleEditorData>(key: K, value: ArticleEditorData[K]) => {
    if (key === "slug") setSlugTouched(true);
    setArticle((current) => ({ ...current, [key]: value }));
    markChanged();
  }, [markChanged]);

  const onCreated = useCallback((id: string, slug: string) => {
    setArticle((current) => ({ ...current, id, slug }));
    window.history.replaceState(null, "", `/admin/${id}/edit`);
  }, []);

  const { status, error, savedAt, saveNow } = useAutosave({ article, revision, onCreated });
  const handleEditorChange = useCallback((value: EditorValue) => {
    setArticle((current) => ({ ...current, contentJson: value.json, contentHtml: value.html }));
    markChanged();
  }, [markChanged]);

  const editorInitialContent = post?.content_json ?? initialHtml ?? EMPTY_DOCUMENT;

  return (
    <div className="article-form">
      <div className="article-form__topbar">
        <Link href="/admin" className="article-form__back">← К статьям</Link>
        <div className="article-form__save">
          <SaveIndicator status={status} error={error} savedAt={savedAt} />
          <button type="button" onClick={() => void saveNow()} disabled={status === "saving"}>
            <Save size={16} /> Сохранить
          </button>
        </div>
      </div>
      {error && <p className="article-form__global-error">{error}</p>}
      <MetadataFields
        article={article}
        update={update}
        onTitleChange={(title) => {
          setArticle((current) => ({
            ...current,
            title,
            slug: slugTouched ? current.slug : slugify(title),
          }));
          markChanged();
        }}
      />
      <section className="article-form__editor">
        <div className="article-form__editor-heading">
          <div>
            <h2>Текст статьи</h2>
            <p>Изменения сохраняются автоматически через 2 секунды.</p>
          </div>
        </div>
        <ArticleEditor initialContent={editorInitialContent} onChange={handleEditorChange} />
      </section>
    </div>
  );
}
