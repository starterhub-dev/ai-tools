-- AI News favorites and likes.
-- User-owned rows are protected by RLS. Only aggregate like counts are public.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.ai_news_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  news_id text not null,
  title text not null,
  url text not null,
  source text not null default 'Public Source',
  region text not null default 'Global',
  type text not null default 'update' check (type in ('major','update','abstract')),
  published_at timestamptz,
  saved_at timestamptz not null default now(),
  primary key (user_id, news_id),
  constraint ai_news_favorites_url_scheme check (url ~ '^https?://')
);

create table if not exists public.ai_news_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  news_id text not null,
  liked_at timestamptz not null default now(),
  primary key (user_id, news_id)
);

create table if not exists public.ai_news_like_stats (
  news_id text primary key,
  like_count bigint not null default 0 check (like_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.ai_news_favorites enable row level security;
alter table public.ai_news_likes enable row level security;
alter table public.ai_news_like_stats enable row level security;

drop policy if exists "Users read own AI news favorites" on public.ai_news_favorites;
create policy "Users read own AI news favorites"
  on public.ai_news_favorites for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users save own AI news favorites" on public.ai_news_favorites;
create policy "Users save own AI news favorites"
  on public.ai_news_favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users remove own AI news favorites" on public.ai_news_favorites;
create policy "Users remove own AI news favorites"
  on public.ai_news_favorites for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users read own AI news likes" on public.ai_news_likes;
create policy "Users read own AI news likes"
  on public.ai_news_likes for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users like as themselves" on public.ai_news_likes;
create policy "Users like as themselves"
  on public.ai_news_likes for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users remove own AI news likes" on public.ai_news_likes;
create policy "Users remove own AI news likes"
  on public.ai_news_likes for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Anyone can read aggregate AI news likes" on public.ai_news_like_stats;
create policy "Anyone can read aggregate AI news likes"
  on public.ai_news_like_stats for select to anon, authenticated
  using (true);

create or replace function private.bump_ai_news_like_stats()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if tg_op = 'INSERT' then
    insert into public.ai_news_like_stats (news_id, like_count, updated_at)
    values (new.news_id, 1, now())
    on conflict (news_id) do update
      set like_count = public.ai_news_like_stats.like_count + 1,
          updated_at = now();
    return new;
  elsif tg_op = 'DELETE' then
    update public.ai_news_like_stats
      set like_count = greatest(like_count - 1, 0),
          updated_at = now()
      where news_id = old.news_id;
    return old;
  end if;
  return null;
end;
$function$;

revoke all on function private.bump_ai_news_like_stats() from public, anon, authenticated;
drop trigger if exists ai_news_like_stats_after_insert on public.ai_news_likes;
create trigger ai_news_like_stats_after_insert
  after insert on public.ai_news_likes
  for each row execute function private.bump_ai_news_like_stats();

drop trigger if exists ai_news_like_stats_after_delete on public.ai_news_likes;
create trigger ai_news_like_stats_after_delete
  after delete on public.ai_news_likes
  for each row execute function private.bump_ai_news_like_stats();

-- Explicit grants are required because new public tables are no longer
-- automatically exposed through the Supabase Data API.
grant usage on schema public to anon, authenticated;
grant select, insert, delete on public.ai_news_favorites to authenticated;
grant select, insert, delete on public.ai_news_likes to authenticated;
grant select on public.ai_news_like_stats to anon, authenticated;
grant all on public.ai_news_favorites, public.ai_news_likes, public.ai_news_like_stats to service_role;
