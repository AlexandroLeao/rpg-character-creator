-- RPG Character Creator: initial user-owned character table.
-- This migration must be reviewed and tested before deployment to the hosted project.

begin;

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique
    references auth.users (id) on delete cascade,

  name varchar(32) not null
    constraint characters_name_valid check (
      name = btrim(name)
      and char_length(name) between 2 and 32
      and name !~ '[[:cntrl:]]'
    ),

  character_class text not null
    constraint characters_class_valid check (
      character_class in (
        'warrior', 'paladin', 'mage', 'rogue',
        'ranger', 'druid', 'cleric', 'bard'
      )
    ),

  ancestry text not null
    constraint characters_ancestry_valid check (
      ancestry in ('human', 'elf', 'dwarf', 'orc', 'fae', 'construct')
    ),

  background text not null
    constraint characters_background_valid check (
      background in (
        'noble', 'scholar', 'wanderer', 'guardian', 'artisan', 'outlaw'
      )
    ),

  weapon text not null
    constraint characters_weapon_valid check (
      weapon in (
        'sword', 'bow', 'staff', 'dagger',
        'axe', 'spear', 'hammer', 'wand'
      )
    ),

  artifact text not null
    constraint characters_artifact_valid check (
      artifact in (
        'none', 'emerald-amulet', 'ancient-ring',
        'moon-crystal', 'runic-compass', 'forgotten-tome',
        'phoenix-feather', 'timeworn-key', 'sun-relic'
      )
    ),

  personality text not null
    constraint characters_personality_valid check (
      personality in (
        'brave', 'curious', 'loyal', 'cunning',
        'kind', 'stoic', 'rebellious', 'mysterious'
      )
    ),

  aura text not null
    constraint characters_aura_valid check (
      aura in (
        'fire', 'ice', 'nature', 'shadow',
        'light', 'storm', 'arcane', 'void'
      )
    ),

  companion text not null
    constraint characters_companion_valid check (
      companion in (
        'none', 'wolf', 'owl', 'cat',
        'fox', 'raven', 'turtle', 'dragonling'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep modification time database-controlled, regardless of the API client.
create function public.set_character_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

create trigger set_character_updated_at
before update on public.characters
for each row
execute function public.set_character_updated_at();

-- Deny access by default, then grant only the operations and columns needed.
-- No account may choose an ID, alter ownership or change database timestamps.
revoke all on public.characters from public, anon, authenticated;
grant select on public.characters to authenticated;
grant insert (
  user_id, name, character_class, ancestry, background,
  weapon, artifact, personality, aura, companion
) on public.characters to authenticated;
grant update (
  name, character_class, ancestry, background,
  weapon, artifact, personality, aura, companion
) on public.characters to authenticated;
grant delete on public.characters to authenticated;

revoke all on function public.set_character_updated_at()
  from public, anon, authenticated;

alter table public.characters enable row level security;

create policy "characters_select_own"
  on public.characters
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "characters_insert_own"
  on public.characters
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "characters_update_own"
  on public.characters
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "characters_delete_own"
  on public.characters
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

commit;
