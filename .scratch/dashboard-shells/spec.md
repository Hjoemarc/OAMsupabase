# Dashboard Shells & Role Route Guards Specification (OAMS)

## Overview
This document specifies the dashboard shell architecture, role-level sub-layouts, workspace switching, root routing, and Edge proxy session refresh boundaries for the Online Accreditation Management System (OAMS).

## Architecture & Layout Hierarchy
```
src/app/
├── page.tsx                     ➔ Root gateway (redirects to /login or primaryRedirectPath)
├── (auth)/...                   ➔ Public auth routes (/login, /register, /pending-approval)
└── (dashboard)/                 ➔ Protected workspace group (enforces requireAuth())
    ├── layout.tsx               ➔ Shared application shell (Header, user profile, role badges, workspace switcher, logout)
    ├── admin/                   ➔ Administrator Workspace (enforces requireRole('admin'))
    │   ├── layout.tsx
    │   └── page.tsx
    ├── coordinator/             ➔ Accreditation Coordinator Workspace (enforces requireRole('coordinator'))
    │   ├── layout.tsx
    │   └── page.tsx
    ├── evaluator/               ➔ Accreditation Evaluator / Auditor Workspace (enforces requireRole('evaluator'))
    │   ├── layout.tsx
    │   └── page.tsx
    └── faculty/                 ➔ Area Lead / Faculty Workspace (enforces requireRole('faculty'))
        ├── layout.tsx
        └── page.tsx
```

## Multi-Role Workspace Switcher
Users in academic institutions often wear multiple hats (e.g. a Faculty member who is also an internal Evaluator).
1. When authenticating, users land on their highest-precedence role dashboard (`admin` > `coordinator` > `evaluator` > `faculty`).
2. The shared shell header in `(dashboard)/layout.tsx` inspects `auth.roles`. If the user holds multiple roles, it presents active navigation tabs to switch seamlessly between their authorized workspaces (e.g., `/evaluator` <-> `/faculty`).
3. If a user attempts to manually navigate to a workspace they are not assigned to (e.g. `/admin`), `requireRole('admin')` denies access and safely redirects them back to their primary authorized dashboard.

## Edge Session Refresh (`src/proxy.ts`)
The Next.js 16 request proxy intercepts all incoming requests to protected routes:
- Refreshes expired Supabase session cookies transparently before downstream React Server Components execute.
- Redirects unauthenticated requests targeting `/admin`, `/coordinator`, `/evaluator`, `/faculty`, or `/pending-approval` immediately to `/login`.
