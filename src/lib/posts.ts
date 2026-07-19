import { createClient } from "@/lib/supabase/server";

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  content: string;
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
  image: string | null;
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
  };
}

const POST_COLUMNS =
  "id, slug, title, description, category, content, image, read_time, published, published_at, created_at, updated_at";

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getAllPosts:", error.message);
    return [];
  }

  return (data as PostRow[]).map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("getPostBySlug:", error.message);
    return undefined;
  }

  return data ? toPost(data as PostRow) : undefined;
}

export async function getRelatedPosts(slug: string, count = 3): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(count);

  if (error) {
    console.error("getRelatedPosts:", error.message);
    return [];
  }

  return (data as PostRow[]).map(toPost);
}

// --- Admin helpers (require an authenticated session; RLS returns drafts too) ---

export async function getAllPostsForAdmin(): Promise<PostRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getAllPostsForAdmin:", error.message);
    return [];
  }

  return data as PostRow[];
}

export async function getPostById(id: string): Promise<PostRow | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getPostById:", error.message);
    return undefined;
  }

  return (data as PostRow) ?? undefined;
}
