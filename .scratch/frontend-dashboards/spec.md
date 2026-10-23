# ZPPSU OAMS Frontend Dashboards Specification

## 1. Overview & Visual Direction
- **Institution**: Zamboanga Peninsula Polytechnic State University (ZPPSU)
- **Palette**:
  - Primary Brand: Deep Maroon (`#7B1113`, darker `#580C0E`, surface `#FDF2F2`)
  - Accent / Secondary: Warm Gold (`#D97706`, `#B45309`, subtle `#FEF3C7`)
  - Neutral / Surfaces: `#F8FAFC`, `#0F172A`, `#FFFFFF`, crisp hairline borders `#E2E8F0`
- **Aesthetic**: Minimal academic portal with dense information hierarchy, zero AI slop, zero decorative neon gradients, high-craft typography and clear institutional status badges.
- **Scope**: Authenticated dashboard workspaces only (`/admin`, `/coordinator`, `/evaluator`, `/faculty`), no marketing landing page.

## 2. Shared Interactive Architecture
- **State Seam**: `AccreditationStoreProvider` (`src/features/accreditations/context/store-context.tsx`) wrapped around all dashboards via `src/app/(dashboard)/layout.tsx`.
- **Session Persistence**: Syncs reactive state to browser `localStorage` (`oams_state_v1`) so mutations in any role reflect immediately across all workspaces.
- **Domain Seam**: `src/types/domain/accreditation.ts` defines `AccreditationCycle`, `DegreeProgram`, `AccreditationArea`, `CriterionParameter`, `EvidenceDocument`, `ParameterEvaluation`.
- **Pure Math**: `src/features/accreditations/calculations.ts` implements AACCUP / CHED arithmetic mean rounding, completion percentages, and grand mean decisions.

## 3. Role Workspace Implementations

### Admin Console (`/admin`)
- Executive quality assurance overview.
- System metrics: active cycles, monitored degree programs, user directory counts, pending approvals.
- Active accreditation visits table with links to coordinator area management.
- Quick user role distribution cards and links to `/admin/users`.

### Coordinator Workspace (`/coordinator`)
- Accreditation cycle scheduling via interactive `CreateCycleModal`.
- Automatic 10 AACCUP Standard Areas provisioning for mapped degree programs.
- Real-time inline assignment of Faculty Area Chairs (`updateAreaChair`).
- Expandable parameter criteria breakdown per area.

### Faculty Workspace (`/faculty`)
- Assigned area switcher (defaults to Area III: Curriculum & Instruction).
- Interactive parameter criteria checklist.
- Parameter self-survey rating selector (1.0 to 5.0) and justification narrative editor with instant save.
- Evidence document vault with upload simulator (`UploadEvidenceModal`) and document deletion.

### Evaluator / Auditor Workspace (`/evaluator`)
- Survey team audit queue with criteria benchmarks.
- Interactive rubric scoring modal (`AuditModal`) with 5-point standard scale (Poor to Excellent) and fine-decimal adjustments.
- Qualitative findings recorder (Institutional Strengths, Compliance Deficiencies, Actionable Recommendations).
- Real-time team grand mean and accreditation verdict computation.
