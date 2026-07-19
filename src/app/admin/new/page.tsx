import PostForm from "@/app/admin/PostForm";
import { createPost } from "@/app/admin/actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-rose-100 mb-8">Новая статья</h1>
      <PostForm action={createPost} submitLabel="Опубликовать" />
    </div>
  );
}
