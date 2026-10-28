-- Run only against an isolated local Supabase database using: supabase test db
-- Test identities are fictional and are rolled back with this transaction.

begin;

create extension if not exists pgtap with schema extensions;
select plan(24);

select has_table('public', 'characters', 'Characters table exists');
select col_is_pk('public', 'characters', 'id', 'Character ID is the primary key');
select is(
  (select relrowsecurity from pg_class where oid = 'public.characters'::regclass),
  true,
  'RLS is enabled'
);
select is(
  (select count(*) from pg_policies where schemaname = 'public' and tablename = 'characters'),
  4::bigint,
  'Four separate operation policies exist'
);
select ok(
  not has_column_privilege('authenticated', 'public.characters', 'user_id', 'UPDATE'),
  'An authenticated user cannot rewrite ownership'
);
select ok(
  not has_table_privilege('anon', 'public.characters', 'SELECT'),
  'Anonymous access has no table SELECT grant'
);

-- These rows are inserted as the local test administrator, never in production.
insert into auth.users (id, email) values
  ('10000000-0000-4000-8000-000000000001', 'rls-user-a@example.test'),
  ('10000000-0000-4000-8000-000000000002', 'rls-user-b@example.test'),
  ('10000000-0000-4000-8000-000000000003', 'rls-user-c@example.test');

insert into public.characters (
  user_id, name, character_class, ancestry, background, weapon,
  artifact, personality, aura, companion
) values (
  '10000000-0000-4000-8000-000000000002', 'Beryl', 'warrior',
  'human', 'guardian', 'sword', 'none', 'loyal', 'light', 'wolf'
);

-- A has an authenticated identity, but cannot see B's character.
set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';

select results_eq(
  'select count(*) from public.characters',
  array[0::bigint],
  'User A cannot read B character'
);

select lives_ok(
  $$insert into public.characters (
      user_id, name, character_class, ancestry, background, weapon,
      artifact, personality, aura, companion
    ) values (
      '10000000-0000-4000-8000-000000000001', 'Aster', 'mage',
      'elf', 'scholar', 'staff', 'moon-crystal', 'curious', 'arcane', 'owl'
    )$$,
  'User A can create their own character'
);

select results_eq(
  'select count(*) from public.characters',
  array[1::bigint],
  'User A sees exactly one character'
);

-- C has no character: this must fail because of RLS, not uniqueness.
select throws_ok(
  $$insert into public.characters (
      user_id, name, character_class, ancestry, background, weapon,
      artifact, personality, aura, companion
    ) values (
      '10000000-0000-4000-8000-000000000003', 'Spoofed', 'mage',
      'elf', 'scholar', 'staff', 'none', 'curious', 'arcane', 'none'
    )$$
);

select throws_ok(
  $$update public.characters
    set user_id = '10000000-0000-4000-8000-000000000003'
    where user_id = '10000000-0000-4000-8000-000000000001'$$
);

select results_eq(
  $$with changed as (
    update public.characters set name = 'Hacked'
    where user_id = '10000000-0000-4000-8000-000000000002'
    returning 1
  ) select count(*) from changed$$,
  array[0::bigint],
  'User A cannot update B character'
);

select results_eq(
  $$with removed as (
    delete from public.characters
    where user_id = '10000000-0000-4000-8000-000000000002'
    returning 1
  ) select count(*) from removed$$,
  array[0::bigint],
  'User A cannot delete B character'
);

select throws_ok(
  $$insert into public.characters (
      user_id, name, character_class, ancestry, background, weapon,
      artifact, personality, aura, companion
    ) values (
      '10000000-0000-4000-8000-000000000001', 'Second', 'mage',
      'elf', 'scholar', 'staff', 'none', 'curious', 'arcane', 'none'
    )$$
);

select throws_ok(
  $$update public.characters set character_class = 'superhero'
    where user_id = '10000000-0000-4000-8000-000000000001'$$
);

select throws_ok(
  $$update public.characters set name = ' '
    where user_id = '10000000-0000-4000-8000-000000000001'$$
);

select lives_ok(
  $$update public.characters set name = 'Aster Updated'
    where user_id = '10000000-0000-4000-8000-000000000001'$$,
  'User A can edit their own character'
);

select lives_ok(
  $$delete from public.characters
    where user_id = '10000000-0000-4000-8000-000000000001'$$,
  'User A can delete their own character'
);

select results_eq(
  'select count(*) from public.characters',
  array[0::bigint],
  'Deleted character is no longer visible'
);

-- B can still access the independent B record.
set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000002';

select results_eq(
  'select count(*) from public.characters',
  array[1::bigint],
  'User B still sees their own character'
);

select results_eq(
  'select user_id from public.characters',
  array['10000000-0000-4000-8000-000000000002'::uuid],
  'User B sees only B ownership'
);

-- Anonymous callers have neither RLS policies nor table privileges.
reset role;
set local role anon;

select throws_ok('select * from public.characters');
select throws_ok(
  $$insert into public.characters (
      user_id, name, character_class, ancestry, background, weapon,
      artifact, personality, aura, companion
    ) values (
      '10000000-0000-4000-8000-000000000003', 'Anon', 'mage',
      'elf', 'scholar', 'staff', 'none', 'curious', 'arcane', 'none'
    )$$
);

-- The owned record disappears when the associated Supabase Auth user is removed.
reset role;
delete from auth.users
where id = '10000000-0000-4000-8000-000000000002';

select is(
  (select count(*) from public.characters where user_id = '10000000-0000-4000-8000-000000000002'),
  0::bigint,
  'Auth account deletion cascades to its character'
);

select * from finish();
rollback;
