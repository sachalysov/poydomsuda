"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import type { ArticleEditorData, SaveArticleResult } from "@/lib/article-types";
import { calculateReadTime, sanitizeArticleHtml } from "@/lib/article-content";

function validateArticle(article: ArticleEditorData): string | null {
  if (!article.contentJson || article.contentJson.type !== "doc") return "Некорректный формат документа.";
  if (article.status === "published") {
    if (!article.title.trim()) return "Укажите название статьи.";
    if (!article.description.trim()) return "Укажите краткое описание.";
    if (!article.category.trim()) return "Выберите категорию.";
    if (!article.contentJson.content?.length) return "Добавьте текст статьи.";
  }
  if (article.seoTitle.length > 60) return "SEO title должен быть не длиннее 60 символов.";
  if (article.seoDescription.length > 160) return "SEO description должно быть не длиннее 160 символов.";
  return null;
}

export async function saveArticle(article: ArticleEditorData): Promise<SaveArticleResult> {
  const validationError = validateArticle(article);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "Сессия истекла. Войдите снова." };

  const generatedSlug = slugify(article.slug || article.title);
  const slug = generatedSlug || `draft-${crypto.randomUUID().slice(0, 8)}`;
  const title = article.title.trim() || "Без названия";
  const html = sanitizeArticleHtml(article.contentHtml);
  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt).toISOString()
    : new Date().toISOString();
  const row = {
    title,
    slug,
    description: article.description.trim(),
    category: article.category.trim() || "Без категории",
    content: html,
    content_json: article.contentJson,
    content_html: html,
    image: article.image.trim() || null,
    tags: article.tags.map((tag) => tag.trim()).filter(Boolean).slice(0, 20),
    seo_title: article.seoTitle.trim() || null,
    seo_description: article.seoDescription.trim() || null,
    published: article.status === "published",
    published_at: publishedAt,
    read_time: calculateReadTime(article.contentJson),
  };

  let oldSlug: string | null = null;
  let result;
  if (article.id) {
    const previous = await supabase.from("posts").select("slug").eq("id", article.id).maybeSingle();
    oldSlug = previous.data?.slug ?? null;
    result = await supabase.from("posts").update(row).eq("id", article.id).select("id, slug").single();
  } else {
    result = await supabase.from("posts").insert(row).select("id, slug").single();
  }

  if (result.error) {
    return {
      ok: false,
      error: result.error.code === "23505"
        ? "Статья с таким URL (slug) уже существует."
        : result.error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath(`/blog/${result.data.slug}`);
  if (oldSlug && oldSlug !== result.data.slug) revalidatePath(`/blog/${oldSlug}`);

  return {
    ok: true,
    id: result.data.id,
    slug: result.data.slug,
    savedAt: new Date().toISOString(),
  };
}

export async function deletePost(id: string, slug: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
