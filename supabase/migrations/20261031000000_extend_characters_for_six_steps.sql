-- ==========================================
-- ADVENTURE FILES
-- CHARACTER CREATOR — SIX STAGES
--
-- Compatible database migration
-- ==========================================

begin;

-- ==========================================
-- 01. CHARACTER MOTIVATION
-- ==========================================

-- Add motivation without removing or changing
-- previously saved characters.
--
-- Existing characters may have NULL motivation.
-- New characters must provide a valid motivation
-- through the API.

alter table public.characters
add column motivation text;

alter table public.characters
add constraint characters_motivation_valid
check (
  motivation is null
  or motivation in (
    'protection',
    'freedom',
    'justice',
    'redemption',
    'glory',
    'knowledge',
    'revenge',
    'adventure'
  )
);

-- ==========================================
-- 02. ARTIFACT COMPATIBILITY
-- ==========================================

-- Remove the previous artifact constraint
-- and replace it with the expanded catalog.
--
-- Keep legacy identifiers so previously
-- saved characters remain valid.

alter table public.characters
drop constraint characters_artifact_valid;

alter table public.characters
add constraint characters_artifact_valid
check (
  artifact in (
    -- Current options
    'arcane-seal',
    'ancient-ring',
    'moon-crystal',
    'runic-compass',
    'shadow-crown',
    'phoenix-feather',
    'chaos-orb',
    'sun-relic',

    -- Legacy options
    'none',
    'emerald-amulet',
    'forgotten-tome',
    'timeworn-key'
  )
);

-- ==========================================
-- 03. COMPANION COMPATIBILITY
-- ==========================================

-- Include the new dragon identifier while
-- preserving the legacy dragonling value.

alter table public.characters
drop constraint characters_companion_valid;

alter table public.characters
add constraint characters_companion_valid
check (
  companion in (
    'none',
    'wolf',
    'owl',
    'cat',
    'fox',
    'raven',
    'turtle',
    'dragon',
    'dragonling'
  )
);

-- ==========================================
-- 04. COLUMN PERMISSIONS
-- ==========================================

-- Allow authenticated users to save and
-- update the new motivation field.
--
-- Existing ownership policies remain unchanged.

grant insert (motivation)
on public.characters
to authenticated;

grant update (motivation)
on public.characters
to authenticated;

-- ==========================================
-- 05. FINISH MIGRATION
-- ==========================================

commit;