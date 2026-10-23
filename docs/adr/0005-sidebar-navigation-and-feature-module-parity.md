# 5. Sidebar Navigation & Feature Module Parity from Reference OAMS

Date: 2026-10-23

## Status

Accepted

## Context

The legacy PHP reference repository [`Hjoemarc/oams`](https://github.com/Hjoemarc/oams) contains a complete accreditation management portal designed with specific role workspaces:
- `UI-Admin`: System Management (`users`, `program`, `accreditation_framework`, `accre_dept` / `program_history`), Accreditation Operations (`accreditation_cycles`, `compliance_tracking`, `review_management`), and Account Settings.
- `UI-Head` / `UI-QA` / `UI-department_head`: Coordinator / QA workspace with Review Management, Accreditation Timeline, and Compliance Tracking.
- `UI-Faculty`: Area Lead / Faculty workspace with My Assignments and Document Management.
- `UI-Accreditor`: Evaluator workspace with Review Documents.

Our target codebase (`OAMsupabase`) is a Next.js 16 App Router application with strict Light Mode styling, shadcn/ui components, and ZPPSU branding (`#7B1113` maroon and `#D97706` gold).

We need to implement full sidebar module parity across all four canonical roles (`admin`, `coordinator`, `evaluator`, `faculty`) while ensuring:
1. Pure Light-Mode aesthetic with clean borders, cards, and tables.
2. Complete functional continuity: metric cards, filter controls, data tables, and modal workflows for all legacy modules.
3. Decoupled frontend mock state store (`store-context.tsx`) that can later transition directly to Supabase BaaS without rewriting UI components.

## Decision

1. **Role Mapping**:
   - `admin`: Full system oversight with collapsible/grouped sidebar sections:
     - **Main**: Dashboard (`/admin`).
     - **System Management**: Users (`/admin/users`), Programs & Departments (`/admin/programs`), Framework (`/admin/framework`), Timeline (`/admin/timeline`).
     - **Accreditation Operations**: Cycles (`/admin/cycles`), Compliance (`/admin/compliance`), Review Management (`/admin/reviews`).
   - `coordinator` (merging legacy QA, Department Head, and Head):
     - Dashboard (`/coordinator`), Review Management (`/coordinator/reviews`), Accreditation Timeline (`/coordinator/timeline`), Compliance Tracking (`/coordinator/compliance`).
   - `evaluator` (merging legacy Accreditor):
     - Dashboard (`/evaluator`), Review Documents (`/evaluator/reviews`).
   - `faculty`:
     - Dashboard (`/faculty`), My Assignments (`/faculty/assignments`), Document Management (`/faculty/documents`).

2. **Route Hierarchy vs Tabs**:
   - High-level modules are established as first-class sub-routes (`/admin/programs`, `/admin/framework`, etc.) to provide direct bookmarking, role-guard isolation via `requireRole()`, and clean App Router architecture.
   - Internal sub-slices (e.g. Framework's Areas vs Parameters vs Indicators, or Programs' Departments vs Degree Programs) use shadcn tabbed switches inside those routes.

3. **Consistent UI Primitives**:
   - All modules follow the standardized shadcn pattern:
     - Breadcrumb & Title Header with contextual Action Button (e.g., "Add Cycle", "Add Program").
     - 3-4 Metric Summary Cards with status indicators.
     - Search & Status Filter Bar.
     - Shadcn Data Table with status badges, pagination, and action menus.

## Consequences

- Full feature alignment with legacy system requirements.
- Zero feature gaps between legacy and new platform.
- Clean separation of concerns between route layouts and domain components.
