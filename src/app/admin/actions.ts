"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type ActionState = { error?: string } | undefined;

function computeReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} мин`;
}

interface PostInput {
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  image: string | null;
  published: boolean;
  read_time: string;
}

function extractPostInput(formData: FormData): { data: PostInput } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !category || !description || !content) {
    return { error: "Заполните все обязательные поля." };
  }

  const slug = slugify(slugRaw || title);
  if (!slug) {
    return { error: "Не удалось сформировать корректный URL (slug) из заголовка." };
  }

  return {
    data: {
      title,
      slug,
      category,
      description,
      content,
      image: image || null,
      published,
      read_time: computeReadTime(content),
    },
  };
}

export async function createPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = extractPostInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return { error: "Статья с таким URL (slug) уже существует." };
    }
    return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = extractPostInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").update(parsed.data).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Статья с таким URL (slug) уже существует." };
    }
    return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(id: string, slug: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
