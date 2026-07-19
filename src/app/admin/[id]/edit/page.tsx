import { notFound } from "next/navigation";
import PostForm from "@/app/admin/PostForm";
import { updatePost } from "@/app/admin/actions";
import { getPostById } from "@/lib/posts";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-rose-100 mb-8">Редактировать статью</h1>
      <PostForm action={updatePost.bind(null, post.id)} post={post} submitLabel="Сохранить" />
    </div>
  );
}
