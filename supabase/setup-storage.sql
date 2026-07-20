-- Создание публичного bucket для обложек и картинок в статьях.
-- Supabase → SQL Editor → New query → вставьте этот файл → Run.
-- Безопасно выполнять повторно.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read article images" on storage.objects;
create policy "Public can read article images"
on storage.objects for select
to public
using (bucket_id = 'article-images');

drop policy if exists "Authenticated can upload article images" on storage.objects;
create policy "Authenticated can upload article images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'article-images');

drop policy if exists "Authenticated can update article images" on storage.objects;
create policy "Authenticated can update article images"
on storage.objects for update
to authenticated
using (bucket_id = 'article-images')
with check (bucket_id = 'article-images');

drop policy if exists "Authenticated can delete article images" on storage.objects;
create policy "Authenticated can delete article images"
on storage.objects for delete
to authenticated
using (bucket_id = 'article-images');
