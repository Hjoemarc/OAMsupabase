# Agent Guidelines: OAMS (Online Accreditation Management System)

This repository is an Online Accreditation Management System built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (PostgreSQL, Auth, Storage, Row-Level Security).

## Architecture & Codebase Design Principles

1. **Deep Modules Over Shallow Layers**:
   - Every module presents a minimal, high-leverage interface that hides internal implementation details.
   - Group by feature domain (`src/features/*`) rather than separating related code across global folders.
2. **Locality & Seams**:
   - Feature-specific UI, server actions, state, and hooks reside within `src/features/<feature>/`.
   - External dependencies (Supabase, external storage, mailers) are isolated behind clear adapter interfaces in `src/lib/<adapter>/`.
3. **App Router Conventions**:
   - `src/app/` serves strictly as the routing and presentation layer (layouts, pages, route handlers, error boundaries).
   - Domain logic and data fetching actions are encapsulated in `src/features/`.

## Folder Organization

```
OAMsupabase/
├── docs/
│   ├── adr/                      # Architecture Decision Records
│   ├── agents/                   # Engineering skill conventions
│   │   ├── domain.md             # Domain doc rules
│   │   └── issue-tracker.md      # GitHub issues workflow
│   └── schema/                   # Supabase database diagrams and migrations
├── src/
│   ├── app/                      # Next.js App Router (pages, layouts, routes)
│   │   ├── (auth)/               # Login, registration, password recovery
│   │   ├── (dashboard)/          # Role-based workspace shells
│   │   │   ├── admin/            # Super admin / QA director
│   │   │   ├── coordinator/      # Program accreditation managers
│   │   │   ├── evaluator/        # Accreditation audit team
│   │   │   └── faculty/          # Area leads & document submitters
│   │   └── api/                  # Route handlers & webhooks
│   ├── features/                 # Vertical domain slices (deep modules)
│   │   ├── accreditations/       # Cycles, programs, accreditation levels
│   │   ├── criteria/             # Standards, areas, parameters, rubrics
│   │   ├── evidence/             # Document upload, Supabase storage, metadata
│   │   ├── evaluations/          # Scoring, findings, audit recommendations
│   │   ├── reports/              # Summary generation & compliance metrics
│   │   └── users/                # Profile management & role assignment
│   ├── components/               # Shared cross-cutting UI
│   │   ├── ui/                   # Reusable atomic primitives (buttons, dialogs, inputs)
│   │   ├── layout/               # Header, sidebar, navigation, breadcrumbs
│   │   └── feedback/             # Toasts, badges, empty states, error fallbacks
│   ├── lib/                      # Infrastructure adapters & utilities
│   │   ├── supabase/             # Client, Server, Middleware, and Admin clients
│   │   ├── utils/                # Pure utility functions (formatting, clsx)
│   │   └── validations/          # Shared Zod schemas
│   ├── types/                    # Shared TypeScript types & Supabase generated types
│   ├── hooks/                    # Reusable React hooks
│   └── config/                   # Site config, navigation items, constants
├── GLOSSARY.md                   # Canonical domain vocabulary
└── AGENTS.md                     # Agent guide and skills config
```

## Agent skills

### Issue tracker

Local markdown files in `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical 5-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`GLOSSARY.md` + `docs/adr/` at repo root). See `docs/agents/domain.md`.
