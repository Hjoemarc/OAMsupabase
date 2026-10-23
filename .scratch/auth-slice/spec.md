# Auth Feature Slice Specification (OAMS)

## Overview
This document specifies the authentication and authorization entrypoint for the Online Accreditation Management System (OAMS), pairing Supabase Auth (`@supabase/ssr`) with Next.js 16 App Router and PostgreSQL Row-Level Security.

## Role Resolution Hierarchy
Users in OAMS can hold multiple roles in `public.user_roles`. When authenticating or visiting root auth routes, primary dashboard destination is resolved strictly by highest privilege:

1. **`admin`** ➔ `/admin` (System administrators, QA directors)
2. **`coordinator`** ➔ `/coordinator` (Accreditation program managers)
3. **`evaluator`** ➔ `/evaluator` (Accreditors, peer reviewers)
4. **`faculty`** ➔ `/faculty` (Area leads, criteria document contributors)
5. **No roles assigned (`[]`)** ➔ `/pending-approval` (Self-registered users awaiting role provision by an Administrator)

## Architecture & Data Flow
```
User -> /login or /register
   │
   ▼
Server Actions (src/features/auth/actions.ts)
   │  [Validates with Zod schemas]
   ▼
Supabase Auth (signInWithPassword / signUp)
   │
   ├─► Trigger (handle_new_user) auto-creates public.profiles record
   │
   ▼
Query Session with Roles (src/features/auth/queries.ts)
   │  [Parallel fetch: profiles + user_roles]
   ▼
Resolve Primary Dashboard Path
   │
   ▼
redirect(primaryRedirectPath)
```

## Security & Verification Rules
- **No Client Privilege Escalation**: Roles are fetched server-side from PostgreSQL via `getUser()`, never trusted from client cookies or metadata.
- **Strict Zod Validations**: Input sanitization (trimming, lowercasing emails, minimum length).
- **Safe Callbacks**: OAuth/PKCE exchange in `(auth)/callback/route.ts` only redirects to verified relative paths.
