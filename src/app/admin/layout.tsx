import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/admin/actions";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // No session means this is the login page (middleware already redirects
  // every other /admin route when logged out) — render it without the nav.
  if (!data.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0D0608]">
      <header className="border-b border-[#3D1820] bg-[#0A0507]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/admin" className="font-bold text-rose-100">
            Пойдём Сюда — <span className="text-rose-400">Админ</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-[#7A3040]">{data.user.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm bg-[#160A0D] border border-[#3D1820] hover:border-[#5C2530] text-[#C8828A] hover:text-rose-300 rounded-full px-4 py-2 transition-colors"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
