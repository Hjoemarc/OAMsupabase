# 00 System Architecture & Manifest

## 1. Project Profile
* **Project Name**: Online Accreditation Management System (OAMS)
* **Archetype**: FULL-STACK APPLICATION
* **Lifecycle Phase**: MATURE / BROWNFIELD (Established Architecture)
* **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (`@supabase/ssr`, PostgreSQL, RLS, Storage), Radix UI Primitives.
* **Knowledge Graph**: AST indexed via `graphify` (`graphify-out/graph.json`, `graphify-out/GRAPH_TREE.html`, `graphify-out/OAMsupabase-callflow.html`).

---

## 2. Directory Layout Manifest

### Root
* `/src/app`: Next.js App Router (Layouts, Role Shells, Route Handlers)
  * `/(auth)`: Authentication flows (`login`, `register`, `callback`)
  * `/(dashboard)`: Role-based dashboard interfaces (`admin`, `coordinator`, `evaluator`, `faculty`)
  * `/api`: Edge and serverless route handlers
* `/src/components`: Shared UI layer
  * `/ui`: Atomic primitives (buttons, dialogs, dropdowns, data tables, column customizers)
  * `/layout`: Shell layouts, sidebar navigation, headers
  * `/feedback`: Toasts, alerts, confirmation dialogs
* `/src/features`: Domain slices (Deep Modules)
  * `accreditations`: Cycles, programs, accreditation levels, program catalogs
  * `auth`: Login, registration, session management
  * `criteria`: Standard areas, parameters, benchmark rubrics
  * `evaluations`: Ratings, findings, auditor observations
  * `evidence`: Document uploading, Supabase storage integration, metadata
  * `reports`: Compliance summaries and export generation
  * `users`: Profiles, user directory, role assignments
* `/src/lib`: Infrastructure adapters
  * `supabase`: SSR client factory (`client.ts`, `server.ts`, `middleware.ts`)
  * `utils`: Utility helpers
  * `validations`: Shared validation schemas
* `/src/types`: TypeScript definitions
  * `database`: Supabase generated & database schemas
  * `domain`: Domain models & role types (`roles.ts`)

---

## 3. Active Context Blueprint Index

* [01_database_contracts.md](01_database_contracts.md): PostgreSQL tables, RLS policies, indexes, and triggers.
* [02_design_tokens.md](02_design_tokens.md): Tailwind CSS v4 design tokens, color palette, and layout geometry.
* [03_api_and_server_boundaries.md](03_api_and_server_boundaries.md): Server actions, serialization contracts, and client-server seams.
* [04_auth_and_access_control.md](04_auth_and_access_control.md): Role hierarchy (`admin`, `coordinator`, `evaluator`, `faculty`), middleware proxies, and session lifecycle.
* [05_domain_accreditations.md](05_domain_accreditations.md): Accreditation cycles, degree programs, levels, and statuses.
* [06_domain_auth.md](06_domain_auth.md): Authentication flows, invite-only onboarding, and session persistence.
* [07_domain_criteria.md](07_domain_criteria.md): Areas, benchmarks, parameters, and scoring rubrics.
* [08_domain_evaluations.md](08_domain_evaluations.md): Evaluator ratings, qualitative findings, and recommendations.
* [09_domain_evidence.md](09_domain_evidence.md): Evidence vault, document upload, storage buckets, and audit trails.
* [10_domain_users.md](10_domain_users.md): User management, profiles, departments, and personnel directory.
* [99_icm_execution_protocol.md](99_icm_execution_protocol.md): Surgical execution, TDD, and regression verification rules.
