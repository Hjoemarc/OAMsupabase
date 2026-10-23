# ADR 0002: Role-Based Access Control (RBAC) via Postgres and Row-Level Security

## Status
Accepted

## Context
OAMS has distinct user personas with sensitive permission boundaries:
- `admin`: Full system oversight, institution configuration, user management.
- `coordinator`: Program-level management, faculty assignment, accreditation cycle coordination.
- `evaluator`: Audit review, scoring, findings entry (strictly read-only on unassigned areas, forbidden from altering submissions).
- `faculty`: Evidence upload, area self-survey narration (strictly forbidden from editing evaluator scores).

## Decision
We enforce authorization at the database level using Postgres tables and Supabase Row-Level Security (RLS):
- A `profiles` table linked to `auth.users(id)`.
- A normalized role association (`roles` and `user_roles`) or role enum.
- Postgres RLS policies ensure data security even if a client-side route guard is bypassed.
- Server Actions and Server Components verify roles before executing mutations.

## Consequences
- **Positive**: Strict data security at the database layer; prevents unauthorized tampering with evidence and evaluation scores.
- **Trade-off**: Requires database migration scripts and helper functions in Postgres (`has_role(user_id, role)`) to keep RLS policy queries performant.
