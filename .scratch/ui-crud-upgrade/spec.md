# Spec: Full-Stack Application Upgrade — Interactions, Dynamic Data, and CRUD Architecture

**Status:** ready-for-agent  
**Date:** 2026-10-23  
**Domain:** OAMS (Online Accreditation Management System)

---

## Problem Statement

Users of the Online Accreditation Management System encounter interactive UI controls that do not respond or lack expected functionality:
1. Controls such as **Customize Columns** display a dropdown arrow but clicking does nothing.
2. Row action buttons (`MoreVertical`) across data tables do not open contextual action menus (View, Edit, Delete, Assign, Audit).
3. Several creation and management triggers either do not open modal forms or lack complete update/delete capabilities.
4. Form selectors are largely disconnected: selecting a parent entity (such as a College/Department or Accreditation Cycle) does not dynamically constrain dependent child options (such as Degree Programs, Academic Courses, Standard Areas, or Criterion Parameters).
5. Modules outside User Management lack cohesive Create, Read, Update, and Delete (CRUD) workflows, preventing administrators, coordinators, and faculty from managing organizational structures, curriculum courses, and accreditation benchmarks directly.

---

## Solution

Deliver a cohesive full-stack architectural upgrade that:
1. **Audits and fixes all interactive UI controls**:
   - Implements a functional, accessible **Column Customizer** popover for data tables with immediate show/hide reflection and persistent storage.
   - Implements accessible **Row Action Dropdown Menus** (`RowActionMenu`) on all table rows with appropriate permissions.
   - Connects all creation, edit, evaluation, and confirmation dialog triggers.
2. **Establishes data-driven dependent selection**:
   - Introduces a reusable `useDependentOptions` hook and `DependentSelect` component.
   - Enforces cascading filtering across:
     - **Department → Program → Course** (Curriculum & Evidence contexts).
     - **Cycle → Area → Parameter → Indicator** (Accreditation & Audit contexts).
   - Handles loading states, automatic invalidation of child fields when parent changes, empty states, and error recovery.
3. **Implements complete and safe CRUD architecture**:
   - Expands the centralized accreditation store and services to support full CRUD across:
     - Departments / Colleges (`CollegeDepartment`)
     - Degree Programs (`DegreeProgram`)
     - Academic Courses (`AcademicCourse` — newly codified entity for Area III OBE syllabi)
     - Accreditation Cycles (`AccreditationCycle`)
     - Criteria Framework Parameters & Indicators (`CriterionParameter`, `AccreditationIndicator`)
     - Evidence Vault Documents (`EvidenceDocument`)
   - Provides safe deletion with referential integrity validation (blocking deletion of parent entities that hold active child records).
   - Reuses shared primitives: `ConfirmDialog`, `RowActionMenu`, `ColumnCustomizer`, and `DependentSelect`.

---

## User Stories

1. As a QA Director, I want to click **Customize Columns** on any data table, so that I can show or hide columns to focus on relevant accreditation metrics.
2. As an Administrator, I want my column visibility preferences to persist in local storage, so that I don't have to reconfigure columns on every visit.
3. As a Coordinator, I want required table columns (like item code or title) to remain locked in the column customizer, so that table rows remain identifiable.
4. As a Faculty Lead, I want clicking the row action menu (`MoreVertical`) to display valid contextual actions (View, Edit, Delete, Attach Evidence), so that I can manage records directly from the table.
5. As an Auditor, I want clicking row action items on audit findings to open the rubric evaluator or assign reviewers, so that I can complete audits efficiently.
6. As an Administrator, I want to create, edit, and delete Academic Departments/Colleges, so that organizational restructuring is reflected in the system.
7. As an Administrator, I want the system to prevent deleting a Department if it still has active Degree Programs, so that data integrity is protected.
8. As a Coordinator, I want to create, edit, and delete Degree Programs with department associations, so that curriculum offerings are accurately maintained.
9. As a Faculty Lead, I want to create, edit, and delete Academic Courses under Degree Programs, so that course syllabi and OBE evidence are correctly cataloged.
10. As a Coordinator, I want to select a Department and have the Program dropdown automatically filter to only programs belonging to that department, so that I don't select invalid pairings.
11. As a Faculty Lead, I want selecting a Program to filter the available Courses to only courses under that program, so that I can attach syllabi accurately.
12. As a User, I want changing my Department selection to automatically clear invalid child Program and Course selections, so that orphaned data is never submitted.
13. As an Auditor, I want selecting an Accreditation Cycle to filter available Standard Areas and Parameters, so that audit findings belong to the correct visit.
14. As an Administrator, I want to edit existing Accreditation Cycles (name, dates, target level, description), so that schedule changes are properly recorded.
15. As an Administrator, I want to delete planned Accreditation Cycles that were created in error, so that the cycle manager remains clean.
16. As a Coordinator, I want to edit and delete Criteria Parameters and Indicators, so that accreditation instruments can be updated to new AACCUP/CHED standards.
17. As a Faculty Lead, I want to edit document metadata and categories in the Evidence Vault, so that erroneous uploads can be corrected without re-uploading.
18. As a User, I want destructive actions (like deleting a cycle, program, or evidence document) to display a confirmation dialog with clear warnings, so that accidental data loss is prevented.
19. As a User, I want forms to provide field-level validation and descriptive error messages, so that I know exactly how to correct invalid inputs.
20. As a User, I want empty states in dropdowns to display a clear message (e.g. "No programs found for this department") instead of an empty white box, so that I understand why options are absent.

---

## Implementation Decisions

### Seams and Architectural Boundaries
- **Domain Store Seam**: `useAccreditationStore` in `src/features/accreditations/context/store-context.tsx` is the primary application state seam for client operations, backed by synchronous in-memory state and persisted to `localStorage` (with Supabase schema mirroring).
- **Domain Entity Codification**:
  - Introduce `AcademicCourse` to `src/types/domain/accreditation.ts`:
    ```typescript
    export interface AcademicCourse {
      id: string;
      code: string; // e.g. "IT 101"
      title: string; // e.g. "Introduction to Computing"
      programId: string;
      departmentId: string;
      units: number;
      yearLevel: number;
      semester: '1st' | '2nd' | 'Summer';
    }
    ```
  - Augment `DegreeProgram` with `departmentId: string` for foreign key consistency.
  - Augment `EvidenceDocument` with optional `courseId?: string` and `programId?: string`.
- **Reusable Deep UI Modules**:
  1. `ColumnCustomizer` (`src/components/ui/column-customizer.tsx`):
     - Interface: `columns: ColumnDef[]`, `visibleColumns: string[]`, `onToggleColumn: (key: string) => void`, `onReset: () => void`.
     - Uses Radix Popover with animated checkbox items and reset trigger.
  2. `RowActionMenu` (`src/components/ui/row-action-menu.tsx`):
     - Interface: `actions: { label: string; icon?: LucideIcon; onClick: () => void; tone?: 'default' | 'danger'; disabled?: boolean }[]`.
     - Uses Radix Dropdown Menu with keyboard accessibility and positioning.
  3. `ConfirmDialog` (`src/components/ui/confirm-dialog.tsx`):
     - Interface: `open: boolean`, `title: string`, `description: string`, `confirmLabel?: string`, `tone?: 'danger' | 'primary'`, `onConfirm: () => void`, `onCancel: () => void`, `isLoading?: boolean`.
  4. `DependentSelect` / `useDependentOptions` (`src/components/ui/dependent-select.tsx`):
     - Generic typed cascading selector supporting `parentValue`, `fetchOptions: (parentVal) => Option[]`, `emptyMessage`, `loading`.

---

## Testing Decisions

- **Seam**: Public functional interfaces of store operations, dependent filtering algorithms, and domain integrity validators.
- **Unit & Integration Tests**:
  - `src/features/accreditations/__tests__/dependent-filtering.test.ts`: Tests cascading filter logic (Dept → Prog → Course, Cycle → Area → Param), clearing on parent change, and empty result handling.
  - `src/features/accreditations/__tests__/crud-integrity.test.ts`: Tests department, program, course, cycle, parameter, and document CRUD lifecycle, preventing illegal parent deletions.
  - `src/components/ui/__tests__/column-customizer.test.ts`: Tests column toggling, locked column immutability, and storage persistence.
- **End-to-End Verification**:
  - Playwright test (`audit-screenshots/verify-crud-interactions.js`) verifying column customization toggle, dropdown menus opening/closing, cascading selects updating child options, and modal CRUD creation and deletion.

---

## Out of Scope

- Redesigning application brand colors, typography, or existing dashboard aesthetics.
- Introducing external state libraries (Redux, Zustand) — reuse existing context store.
- Bypassing existing Supabase RLS policies.

---

## Further Notes

- All changes maintain 100% TypeScript type safety.
- All newly added components adhere to Emil Kowalski micro-interaction polish and Tailwind styling.
