# 7. CQI, Dossier Compiler, Multi-Agency Cross-Walk & Mock Survey Architecture

Date: 2026-10-23

## Status

Accepted

## Context

While OAMS successfully manages accreditation cycles, self-surveys, and evaluator scoring, an audit of real-world higher-education accreditation lifecycle requirements (AACCUP, PAASCU, CHED, ISO 9001) revealed critical institutional capability gaps:
1. **The Post-Evaluation Void**: Evaluations produce numerical ratings and narrative findings, but lack a closed-loop mechanism to convert deficiencies into time-bound institutional remediation commitments with responsible offices, budgets, and verification artifacts.
2. **Exhibit Compilation Burden**: Accreditation coordinators and faculty chairs manually compile hundreds of documents into physical folders or Google Drive folders for survey teams, creating massive friction and risking unverified or missing exhibits.
3. **Multi-Agency Redundancy**: Faculty repeatedly upload the same syllabus, faculty credential, or laboratory safety manual under distinct taxonomies for AACCUP, CHED COE/COD, and ISO 9001 audits.
4. **Pre-Audit Uncertainty**: Institutions lack an isolated simulation sandbox to conduct mock surveys and identify critical gaps 30–60 days before the external survey team arrives, without polluting official accreditation records.

## Decision

We introduce four cohesive, high-leverage architectural modules under `src/features/`:

1. **Continuous Quality Improvement (CQI) (`src/features/cqi`)**:
   - Manages institutional post-evaluation action plans (`CQIActionPlan`).
   - Links directly to evaluator findings/weaknesses, tracks milestones, budget allocation, responsible leads, and overdue statuses.
   - Provides verification workflows where remedial evidence is validated before closing findings.

2. **Self-Survey Report (SSR) & Exhibit Dossier Compiler (`src/features/reports`)**:
   - Programmatically aggregates executive summaries, parameter scorecards, area narratives, and evidence exhibits into a structured `SSRDossier`.
   - Generates deterministic exhibit codes (`EX-A{area}-{index}`) with cryptographic SHA-256 checksum verification stamps and printable/exportable layout.

3. **Multi-Agency Cross-Walk Matrix (`src/features/crosswalk`)**:
   - Implements a many-to-many relationship mapping uploaded evidence artifacts across multiple agency frameworks (AACCUP, CHED CMOs, ISO 9001:2015, PTC).
   - Computes agency-specific readiness coverage to eliminate duplicate uploads.

4. **Mock Survey & Pre-Audit Workspace (`src/features/mock-survey`)**:
   - Sandboxes mock survey sessions (`MockSurveySession`) and internal auditor findings (`MockAuditFinding`).
   - Calculates institutional risk ratings ('Low Risk', 'Moderate Risk', 'Critical Risk') and provides a one-click action to promote mock findings into formal CQI Action Plans.

## Consequences

- End-to-end coverage of the accreditation lifecycle: from cross-agency preparation, mock simulation, and dossier compilation to post-survey closed-loop remediation.
- State is managed reactively via the hydrated store context (`store-context.tsx`), providing instant interactivity and relational integrity without external service dependencies.
- Strict isolation prevents mock ratings from contaminating official accreditation cycles while preserving seamless migration paths into CQI.
