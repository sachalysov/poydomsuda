import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form/ArticleForm";
import { getPostById } from "@/lib/posts";
import { resolveArticleHtml } from "@/lib/article-content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return <ArticleForm post={post} initialHtml={resolveArticleHtml(post.content_html, post.content)} />;
}
