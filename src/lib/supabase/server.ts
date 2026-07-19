import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Creates a Supabase client for use in Server Components, Server Actions and
// Route Handlers. Server Components can't write cookies, so `setAll` is a
// no-op there — session refresh is instead handled by the middleware.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore, middleware refreshes the session.
          }
        },
      },
    }
  );
}
