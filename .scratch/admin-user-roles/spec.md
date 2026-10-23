# Admin User & Role Management Specification (OAMS)

## Overview
This specification details the user administration and role-provisioning slice for the Online Accreditation Management System (OAMS). It empowers institutional Super Administrators and QA Directors to view registered personnel, approve pending accounts, and grant or revoke operational roles (`admin`, `coordinator`, `evaluator`, `faculty`).

## Role Provisioning Workflow
```
New User Registration (starts with user_roles = [])
   │
   ▼
Land on /pending-approval
   │
   ▼
Administrator navigates to /admin/users
   │
   ├─ Filter by "Pending Approval" or search by name/email
   ├─ Inspect profile details (full name, email, department, registered date)
   │
   ▼
Role Mutation (grant/revoke via mutateUserRole Server Action)
   │
   ├─ Server enforces validateRoleMutationPolicy (blocks self-revocation of admin)
   ├─ Directly updates PostgreSQL public.user_roles with Row-Level Security
   │
   ▼
revalidatePath('/admin/users') & revalidatePath('/admin')
   │
   ▼
User next request is granted access to their authorized workspace
```

## Security & Self-Demotion Protection
- **Hard Gate**: Only users with active `admin` role in `public.user_roles` can query or mutate user roles (`requireRole('admin')`).
- **Self-Lockout Prevention**: An administrator is strictly prevented from revoking their own `admin` role (`validateRoleMutationPolicy`). They may revoke other roles from themselves or revoke `admin` from other administrators.
- **Atomic Operations**: Role granting and revocation map directly to `public.user_roles` records, governed by PostgreSQL foreign keys and uniqueness constraints `(user_id, role)`.
