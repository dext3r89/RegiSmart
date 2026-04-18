-- RegiSmart: baseline RLS policies for profiles + students
-- Run in the Supabase SQL editor.

alter table public.profiles enable row level security;
alter table public.students enable row level security;

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_select_admin_all" on public.profiles;
create policy "profiles_select_admin_all"
on public.profiles
for select
to authenticated
using (private.is_admin());

drop policy if exists "students_select_parent_own" on public.students;
create policy "students_select_parent_own"
on public.students
for select
to authenticated
using (parent_id = auth.uid());

drop policy if exists "students_insert_parent_own" on public.students;
create policy "students_insert_parent_own"
on public.students
for insert
to authenticated
with check (parent_id = auth.uid());

drop policy if exists "students_update_parent_own" on public.students;
create policy "students_update_parent_own"
on public.students
for update
to authenticated
using (parent_id = auth.uid())
with check (parent_id = auth.uid());

drop policy if exists "students_select_teacher_all" on public.students;
create policy "students_select_teacher_all"
on public.students
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'teacher'
  )
);

drop policy if exists "students_admin_all" on public.students;
create policy "students_admin_all"
on public.students
for all
to authenticated
using (
  private.is_admin()
)
with check (
  private.is_admin()
);
