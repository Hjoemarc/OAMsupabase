# 06 Domain: Authentication & Onboarding

## 1. Domain Entities
* **User Session**: Active JWT cookie pair maintained by `@supabase/ssr`.
* **Invite Token**: Single-use token issued by Admin for new user onboarding.
* **Password Reset Flow**: PKCE exchange via `/auth/callback?next=/reset-password`.

## 2. Invariants
* Public signup endpoints must not be exposed.
* Users without assigned roles in `public.user_roles` cannot enter any `(dashboard)` route.
