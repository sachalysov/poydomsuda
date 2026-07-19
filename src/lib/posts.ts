import { createClient } from "@/lib/supabase/server";
import type { JSONContent } from "@tiptap/core";
import { resolveArticleHtml } from "@/lib/article-content";

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  content: string;
  contentHtml: string;
  contentJson: JSONContent | null;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishedAt: string;
}

// Raw shape of a `posts` row in Supabase — used by the admin panel, which
// (unlike the public site) also needs `id`, `published` and raw timestamps.
export interface PostRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  content_json: JSONContent | null;
  content_html: string | null;
  image: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  read_time: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

function toPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    date: formatDate(row.published_at),
    readTime: row.read_time,
    image: row.image ?? undefined,
    content: row.content,
    contentHtml: resolveArticleHtml(row.content_html, row.content),
    contentJson: row.content_json,
    tags: row.tags ?? [],
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    publishedAt: row.published_at,
  };
}

const POST_COLUMNS =
  "id, slug, title, description, category, content, content_json, content_html, image, tags, seo_title, seo_description, read_time, published, published_at, created_at, updated_at";

const LEGACY_POST_COLUMNS =
  "id, slug, title, description, category, content, image, read_time, published, published_at, created_at, updated_at";

function normalizeRow(row: Record<string, unknown>): PostRow {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    category: String(row.category),
    content: String(row.content),
    content_json: (row.content_json as JSONContent | null | undefined) ?? null,
    content_html: (row.content_html as string | null | undefined) ?? null,
    image: (row.image as string | null | undefined) ?? null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    seo_title: (row.seo_title as string | null | undefined) ?? null,
    seo_description: (row.seo_description as string | null | undefined) ?? null,
    read_time: String(row.read_time ?? "5 мин"),
    published: Boolean(row.published),
    published_at: String(row.published_at),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function isMissingColumnError(message: string): boolean {
  return (
    message.includes("content_json") ||
    message.includes("content_html") ||
    message.includes("seo_title") ||
    message.includes("seo_description") ||
    message.includes("tags")
  );
}

async function selectPosts(
  build: (columns: string) => PromiseLike<{ data: unknown; error: { message: string } | null }>
): Promise<PostRow[]> {
  const primary = await build(POST_COLUMNS);
  if (!primary.error) {
    return ((primary.data as Record<string, unknown>[] | null) ?? []).map(normalizeRow);
  }

  if (!isMissingColumnError(primary.error.message)) {
    console.error("selectPosts:", primary.error.message);
    return [];
  }

  console.warn(
    "selectPosts: Tiptap/SEO columns are missing. Run supabase/migrate-tiptap.sql. Falling back to legacy columns."
  );
  const fallback = await build(LEGACY_POST_COLUMNS);
  if (fallback.error) {
    console.error("selectPosts (legacy):", fallback.error.message);
    return [];
  }

  return ((fallback.data as Record<string, unknown>[] | null) ?? []).map(normalizeRow);
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const rows = await selectPosts((columns) =>
    supabase
      .from("posts")
      .select(columns)
      .eq("published", true)
      .order("published_at", { ascending: false })
  );
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const supabase = await createClient();
  const rows = await selectPosts((columns) =>
    supabase
      .from("posts")
      .select(columns)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then((result) => ({
        data: result.data ? [result.data] : [],
        error: result.error,
      }))
  );
  return rows[0] ? toPost(rows[0]) : undefined;
}

export async function getRelatedPosts(slug: string, count = 3): Promise<Post[]> {
  const supabase = await createClient();
  const rows = await selectPosts((columns) =>
    supabase
      .from("posts")
      .select(columns)
      .eq("published", true)
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(count)
  );
  return rows.map(toPost);
}

// --- Admin helpers (require an authenticated session; RLS returns drafts too) ---

export async function getAllPostsForAdmin(): Promise<PostRow[]> {
  const supabase = await createClient();
  return selectPosts((columns) =>
    supabase.from("posts").select(columns).order("published_at", { ascending: false })
  );
}

export async function getPostById(id: string): Promise<PostRow | undefined> {
  const supabase = await createClient();
  const rows = await selectPosts((columns) =>
    supabase
      .from("posts")
      .select(columns)
      .eq("id", id)
      .maybeSingle()
      .then((result) => ({
        data: result.data ? [result.data] : [],
        error: result.error,
      }))
  );
  return rows[0];
}
