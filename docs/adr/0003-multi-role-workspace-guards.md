# ADR 0003: Multi-Role Workspace Resolution and Layout Guard Architecture

## Status
Accepted

## Context
In higher education accreditation, users frequently have multiple institutional duties. A senior faculty member may lead an accreditation area (`faculty`) while also serving on an internal audit committee (`evaluator`). The application requires an authorization architecture that prevents unauthorized cross-role access while providing a seamless workspace-switching experience for multi-role personnel.

## Decision
We enforce multi-tiered authorization:
1. **Edge/Proxy Tier (`src/proxy.ts`)**: Fast perimeter check ensuring an authenticated Supabase session exists before any dashboard route loads.
2. **Dashboard Shell Tier (`src/app/(dashboard)/layout.tsx`)**: Executes `requireAuth()` server-side to guarantee valid session and user roles, and renders a dynamic workspace switcher for multi-role accounts.
3. **Role Sub-Layout Tier (`src/app/(dashboard)/<role>/layout.tsx`)**: Executes `requireRole('<role>')` as a hard gate. If a user lacks the specific role, they are redirected back to their highest-precedence authorized dashboard without an infinite loop.
4. **Database Tier**: Postgres Row-Level Security (RLS) ensures data cannot be read or mutated even if route guards are bypassed.

## Consequences
- **Positive**: Zero possibility of unauthorized view rendering; clean user experience for multi-role staff; zero code duplication across sub-pages in a role section.
- **Trade-off**: Requires layout-level server execution (`requireRole`), which is optimized through parallel profile and role queries.
