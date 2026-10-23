# 04 Auth & Access Control

## 1. Authentication Lifecycle
* **Authentication Provider**: Supabase Auth (Cookie-based session synchronization via `@supabase/ssr`).
* **Request Proxy**: `src/proxy.ts` executes `updateSession` on every matched request, refreshing tokens at the edge and propagating cookies.
* **Onboarding Model**: Invite-only via Supabase Admin API (`auth.admin.inviteUserByEmail`). Public self-registration is disabled.

## 2. Role-Based Access Control (RBAC)
* Roles are defined in `src/types/domain/roles.ts` (`admin`, `coordinator`, `evaluator`, `faculty`).
* Route namespaces under `src/app/(dashboard)/`:
  - `/admin/*`: Super Admin workspace (User management, system configuration).
  - `/coordinator/*`: Accreditation Director workspace (Cycle planning, area assignments).
  - `/evaluator/*`: Auditor workspace (Reviewing evidence, scoring benchmarks).
  - `/faculty/*`: Area Lead workspace (Submitting compliance evidence).

## 3. Invariants
* Layout guards at `src/app/(dashboard)/<role>/layout.tsx` verify the active session and role. Unauthorized access redirects to `/login` or `/unauthorized`.
* Database operations enforce security definer functions (`has_role()`) in PostgreSQL RLS.
