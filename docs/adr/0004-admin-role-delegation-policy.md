# ADR 0004: Admin Role Delegation and Self-Lockout Protection Policy

## Status
Accepted

## Context
In OAMS, user role provisioning must be securely delegated to system administrators. A critical operational hazard is accidental self-demotion, where the sole active administrator revokes their own `admin` role, permanently locking the institution out of system configuration.

## Decision
We enforce role delegation rules at both the server-action boundary and database level:
1. **Server Action Policy Guard (`validateRoleMutationPolicy`)**: Rejects any request where `actorUserId === targetUserId && role === 'admin' && intent === 'revoke'`.
2. **Database Integrity**: Role assignment is managed as individual rows in `public.user_roles` with `unique(user_id, role)` and foreign-key cascading to `public.profiles`.
3. **Audit Trail Preparedness**: All role modifications trigger Next.js cache revalidation (`revalidatePath`) and maintain `created_at` timestamps in `public.user_roles`.

## Consequences
- **Positive**: Complete prevention of accidental administrator lockout; atomic granting and revoking without managing complex bitmask flags; full compliance with PostgreSQL RLS.
- **Trade-off**: Requires administrators to have another administrator demote them if role transfer is required.
