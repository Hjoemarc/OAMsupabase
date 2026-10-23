-- ==============================================================================
-- OAMS: Initial Role-Based Access Control (RBAC) Schema & Row Level Security
-- ==============================================================================

-- 1. Create App Role Enum
create type public.app_role as enum ('admin', 'coordinator', 'evaluator', 'faculty');

-- 2. Create User Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  department text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Create User Roles Table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 4. Indexes for fast lookup
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role on public.user_roles(role);

-- 5. Helper Functions
-- Check if a user has a specific role (security definer bypasses RLS for role checks)
create or replace function public.has_role(target_user_id uuid, required_role public.app_role)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = target_user_id and role = required_role
  );
$$;

-- Check if current authenticated user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

-- Get list of roles for the current user
create or replace function public.get_my_roles()
returns setof public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.user_roles where user_id = auth.uid();
$$;

-- 6. Trigger to automatically create a profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Enable Row-Level Security
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- 8. Profiles RLS Policies
-- Users can view their own profile, or admins/coordinators can view all profiles
create policy "Users can view own profile or admins can view all"
  on public.profiles for select
  using (
    auth.uid() = id
    or public.has_role(auth.uid(), 'admin'::public.app_role)
    or public.has_role(auth.uid(), 'coordinator'::public.app_role)
  );

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 9. User Roles RLS Policies
-- Users can view their own assigned roles
create policy "Users can view own roles"
  on public.user_roles for select
  using (
    auth.uid() = user_id
    or public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Only admins can assign, update, or remove roles
create policy "Admins can manage user roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));
