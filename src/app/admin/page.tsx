import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/posts";
import { deletePost } from "@/app/admin/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export default async function AdminDashboardPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-rose-100">Статьи блога</h1>
          <p className="text-sm text-[#7A3040] mt-1">
            {posts.length} {posts.length === 1 ? "статья" : "статей"}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          + Новая статья
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-[#160A0D] border border-[#3D1820] rounded-2xl p-10 text-center">
          <p className="text-[#C8828A]">Пока нет ни одной статьи.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#160A0D] border border-[#3D1820] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {post.image && (
                <div className="w-full sm:w-28 aspect-[16/10] shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block text-xs font-medium bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  {!post.published && (
                    <span className="inline-block text-xs font-medium bg-[#271318] border border-[#5C2530] text-[#7A3040] px-2.5 py-1 rounded-full">
                      Черновик
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-rose-200 leading-snug truncate">{post.title}</h2>
                <p className="text-xs text-[#7A3040] mt-1">/blog/{post.slug}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[11px] text-[#7A3040]">#{tag}</span>
                  ))}
                  <span className="text-[11px] text-[#7A3040]">
                    {new Date(post.published_at).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-sm bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] text-[#C8828A] hover:text-rose-300 rounded-full px-4 py-2 transition-colors"
                  >
                    Открыть
                  </Link>
                )}
                <Link
                  href={`/admin/${post.id}/edit`}
                  className="text-sm bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 rounded-full px-4 py-2 transition-colors"
                >
                  Редактировать
                </Link>
                <DeleteButton
                  postTitle={post.title}
                  action={deletePost.bind(null, post.id, post.slug)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
