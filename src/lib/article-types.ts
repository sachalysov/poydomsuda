import type { JSONContent } from "@tiptap/core";

export interface ArticleEditorData {
  id: string | null;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  publishedAt: string;
  contentJson: JSONContent;
  contentHtml: string;
}

export interface SaveArticleResult {
  ok: boolean;
  id?: string;
  slug?: string;
  savedAt?: string;
  error?: string;
}
