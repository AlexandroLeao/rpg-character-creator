-- ==========================================
-- ADVENTURE FILES
-- SIX-STAGE CHARACTER DATABASE TESTS
--
-- LOCAL TEST DATABASE ONLY
-- ==========================================

begin;

create extension if not exists pgtap
with schema extensions;

select plan(15);

-- ==========================================
-- 01. MOTIVATION COLUMN
-- ==========================================

select has_column(
  'public',
  'characters',
  'motivation',
  'Characters have a motivation column'
);

select col_type_is(
  'public',
  'characters',
  'motivation',
  'text',
  'Motivation uses the text type'
);

-- ==========================================
-- 02. COLUMN PERMISSIONS
-- ==========================================

select ok(
  has_column_privilege(
    'authenticated',
    'public.characters',
    'motivation',
    'INSERT'
  ),
  'Authenticated users can insert motivation'
);

select ok(
  has_column_privilege(
    'authenticated',
    'public.characters',
    'motivation',
    'UPDATE'
  ),
  'Authenticated users can update motivation'
);

-- ==========================================
-- 03. ROW LEVEL SECURITY
-- ==========================================

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.characters'::regclass
  ),
  'Character RLS remains enabled'
);

-- ==========================================
-- 04. FICTIONAL TEST USERS
-- ==========================================

-- These accounts exist only inside
-- the rolled-back test transaction.

insert into auth.users (id, email)
values
(
  '20000000-0000-4000-8000-000000000001',
  'six-stage-a@example.test'
),
(
  '20000000-0000-4000-8000-000000000002',
  'six-stage-b@example.test'
),
(
  '20000000-0000-4000-8000-000000000003',
  'six-stage-c@example.test'
),
(
  '20000000-0000-4000-8000-000000000004',
  'six-stage-d@example.test'
),
(
  '20000000-0000-4000-8000-000000000005',
  'six-stage-e@example.test'
);

-- ==========================================
-- 05. CURRENT CHARACTER OPTIONS
-- ==========================================

select lives_ok(
  $$
    insert into public.characters (
      user_id,
      name,
      character_class,
      ancestry,
      background,
      weapon,
      artifact,
      personality,
      aura,
      companion,
      motivation
    )
    values (
      '20000000-0000-4000-8000-000000000001',
      'New Hero',
      'mage',
      'elf',
      'scholar',
      'staff',
      'arcane-seal',
      'curious',
      'arcane',
      'dragon',
      'protection'
    )
  $$,
  'A complete six-stage character can be inserted'
);

select results_eq(
  $$
    select motivation
    from public.characters
    where user_id =
      '20000000-0000-4000-8000-000000000001'
  $$,
  array['protection'::text],
  'Motivation is preserved correctly'
);

-- ==========================================
-- 06. LEGACY CHARACTER COMPATIBILITY
-- ==========================================

select lives_ok(
  $$
    insert into public.characters (
      user_id,
      name,
      character_class,
      ancestry,
      background,
      weapon,
      artifact,
      personality,
      aura,
      companion
    )
    values (
      '20000000-0000-4000-8000-000000000002',
      'Legacy Hero',
      'warrior',
      'human',
      'guardian',
      'sword',
      'none',
      'loyal',
      'light',
      'dragonling'
    )
  $$,
  'Legacy artifact and companion identifiers remain valid'
);

select ok(
  (
    select motivation is null
    from public.characters
    where user_id =
      '20000000-0000-4000-8000-000000000002'
  ),
  'Legacy characters may have NULL motivation'
);

-- ==========================================
-- 07. INVALID MOTIVATION
-- ==========================================

select throws_ok(
  $$
    insert into public.characters (
      user_id,
      name,
      character_class,
      ancestry,
      background,
      weapon,
      artifact,
      personality,
      aura,
      companion,
      motivation
    )
    values (
      '20000000-0000-4000-8000-000000000003',
      'Invalid Motivation',
      'mage',
      'elf',
      'scholar',
      'staff',
      'arcane-seal',
      'curious',
      'arcane',
      'owl',
      'invalid-motivation'
    )
  $$
);

-- ==========================================
-- 08. INVALID ARTIFACT
-- ==========================================

select throws_ok(
  $$
    insert into public.characters (
      user_id,
      name,
      character_class,
      ancestry,
      background,
      weapon,
      artifact,
      personality,
      aura,
      companion,
      motivation
    )
    values (
      '20000000-0000-4000-8000-000000000004',
      'Invalid Artifact',
      'mage',
      'elf',
      'scholar',
      'staff',
      'unknown-artifact',
      'curious',
      'arcane',
      'owl',
      'knowledge'
    )
  $$
);

-- ==========================================
-- 09. INVALID COMPANION
-- ==========================================

select throws_ok(
  $$
    insert into public.characters (
      user_id,
      name,
      character_class,
      ancestry,
      background,
      weapon,
      artifact,
      personality,
      aura,
      companion,
      motivation
    )
    values (
      '20000000-0000-4000-8000-000000000005',
      'Invalid Companion',
      'mage',
      'elf',
      'scholar',
      'staff',
      'arcane-seal',
      'curious',
      'arcane',
      'unknown-companion',
      'knowledge'
    )
  $$
);

-- ==========================================
-- 10. NEW ARTIFACT COMPATIBILITY
-- ==========================================

select lives_ok(
  $$
    update public.characters
    set artifact = 'chaos-orb'
    where user_id =
      '20000000-0000-4000-8000-000000000001'
  $$,
  'Chaos Orb is supported'
);

select lives_ok(
  $$
    update public.characters
    set artifact = 'shadow-crown'
    where user_id =
      '20000000-0000-4000-8000-000000000001'
  $$,
  'Shadow Crown is supported'
);

-- ==========================================
-- 11. OWNERSHIP PROTECTION
-- ==========================================

select ok(
  not has_column_privilege(
    'authenticated',
    'public.characters',
    'user_id',
    'UPDATE'
  ),
  'Authenticated users cannot change character ownership'
);

-- ==========================================
-- 12. FINISH TESTS
-- ==========================================

select * from finish();

rollback;