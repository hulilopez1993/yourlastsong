create extension if not exists pgcrypto;

create table if not exists public.last_songs (
  id uuid primary key default gen_random_uuid(),
  song_title text not null,
  artist text not null,
  spotify_id text not null unique,
  album_cover_url text not null,
  preview_url text,
  chooses_count integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.song_quotes (
  id uuid primary key default gen_random_uuid(),
  spotify_id text not null references public.last_songs(spotify_id) on delete cascade,
  song_title text not null,
  artist text not null,
  quote varchar(150) not null,
  city text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_last_songs_chooses_count on public.last_songs (chooses_count desc);
create index if not exists idx_song_quotes_created_at on public.song_quotes (created_at desc);

create or replace function public.bump_last_song_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_last_songs_updated_at on public.last_songs;

create trigger trg_last_songs_updated_at
before update on public.last_songs
for each row
execute function public.bump_last_song_updated_at();
