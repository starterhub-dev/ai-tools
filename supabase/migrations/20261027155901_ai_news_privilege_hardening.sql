-- Tighten table-level permissions after creating the AI News Center tables.
-- RLS protects rows; it does not protect against table-level TRUNCATE privileges.
revoke all privileges on table
  public.ai_news_favorites,
  public.ai_news_likes,
  public.ai_news_like_stats
from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select, insert, delete on public.ai_news_favorites to authenticated;
grant select, insert, delete on public.ai_news_likes to authenticated;
grant select on public.ai_news_like_stats to anon, authenticated;
grant all privileges on public.ai_news_favorites, public.ai_news_likes, public.ai_news_like_stats to service_role;
