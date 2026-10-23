# 6. Domain-Driven File Naming & Module Depth Standards

Date: 2026-10-23

## Status

Accepted

## Context

As the OAMS application scaled, several architectural naming frictions emerged:
1. Repetitive UI suffixes (`*-view.tsx`) across feature modules obscured domain responsibilities (`framework-view`, `programs-view`, `review-management-view`).
2. Third-party vendor branding leaked into foundational architectural seams (`shadcn-sidebar.tsx`, `shadcn-data-table.tsx`), violating interface abstraction principles.
3. Domain boundaries were blurred: the AACCUP Criteria Framework (Areas, Parameters, Indicators) was placed in `src/features/accreditations/` instead of `src/features/criteria/`.
4. Standalone 1-action modal files (`create-cycle-modal.tsx`, `audit-modal.tsx`, etc.) were left orphaned after their logic was consolidated directly inside deep domain workbenches.

## Decision

1. **Retire Generic `-view` Suffixes**:
   - Name feature modules by their canonical domain concept in singular kebab-case:
     - `criteria-framework.tsx`
     - `compliance-tracker.tsx`
     - `program-catalog.tsx`
     - `accreditation-timeline.tsx`
     - `cycle-manager.tsx`
     - `review-workbench.tsx`
     - `rubric-evaluator.tsx`
     - `evidence-vault.tsx`
     - `assignment-checklist.tsx`
     - `user-directory.tsx`
     - Role overview entrypoints: `admin-overview.tsx`, `coordinator-overview.tsx`, `evaluator-overview.tsx`, `faculty-overview.tsx`.

2. **Purge Implementation Leaks from Primitives**:
   - Rename `shadcn-sidebar.tsx` &rarr; `portal-sidebar.tsx`.
   - Rename `shadcn-data-table.tsx` &rarr; `data-table.tsx`.

3. **Realign Criteria Domain Slice**:
   - `src/features/criteria/` owns standards, areas, parameters, indicators, and compliance tracking.
   - `src/features/accreditations/` owns cycles, degree programs, accreditation levels, and survey timelines.

4. **Apply Deletion Test to Orphaned Modals**:
   - Delete standalone modal files (`create-cycle-modal.tsx`, `area-lead-modal.tsx`, `self-survey-modal.tsx`, `audit-modal.tsx`, `upload-evidence-modal.tsx`). All modal workflows remain self-contained inside the deep domain workbenches with strong locality.

## Consequences

- Direct alignment with `GLOSSARY.md` domain entities.
- Zero vendor branding in import paths.
- Clean Next.js App Router layer (`src/app/`) delegating to cohesive domain modules in `src/features/`.
- Deletion of dead code concentrates complexity where it belongs.
