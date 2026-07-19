-- Миграция для уже существующей таблицы posts (после первой версии админки).
-- Выполните этот файл в Supabase → SQL Editor, если блог пишет
-- "column posts.content_json does not exist".

alter table public.posts add column if not exists content_json jsonb;
alter table public.posts add column if not exists content_html text;
alter table public.posts add column if not exists tags text[] not null default '{}';
alter table public.posts add column if not exists seo_title text;
alter table public.posts add column if not exists seo_description text;

-- Публичный bucket для обложек и изображений внутри статей.
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
