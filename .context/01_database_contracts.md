# 01 Database Contracts & Invariants

## 1. Schema Authority
Database contracts are rooted in PostgreSQL schemas managed via Supabase. Reference migrations under `docs/schema/` (e.g. `001_rbac_schema.sql`).

## 2. Core Tables & Contracts

### `public.profiles`
* **Primary Key**: `id uuid references auth.users(id) on delete cascade`
* **Columns**: `email text not null`, `full_name text`, `avatar_url text`, `department text`, `created_at timestamptz`, `updated_at timestamptz`.
* **Invariants**: 1:1 mapping with `auth.users`. Profiles are soft-updated; hard deletions are forbidden if historical evidence or evaluations exist.

### `public.user_roles`
* **Primary Key**: `id uuid default gen_random_uuid()`
* **Columns**: `user_id uuid not null references public.profiles(id) on delete cascade`, `role public.app_role not null`, `created_at timestamptz`.
* **Constraints**: `unique(user_id, role)`. A user can have multiple assigned roles (1:N).

## 3. Enums & Functions
* **`app_role`**: `'admin' | 'coordinator' | 'evaluator' | 'faculty'`
* **`has_role(target_user_id, required_role)`**: Security definer function checking role assignment.
* **`is_admin()`**: Fast path checking `auth.uid()` against `'admin'`.

## 4. Row Level Security (RLS) Policy Invariants
1. RLS is enabled on all public schema tables.
2. Direct client mutations (`anon`) are disabled.
3. Users can only select/update their own profile, unless holding the `admin` role.
