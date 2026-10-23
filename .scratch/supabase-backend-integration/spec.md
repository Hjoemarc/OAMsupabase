# Supabase Backend-as-a-Service Integration

Status: ready-for-agent

## Problem Statement

Institutional accreditation at Zamboanga Peninsula Polytechnic State University (ZPPSU) is currently simulated using in-browser local storage mock data across the Arc UI dashboards. While the user interface and navigation are complete and responsive across all four role workspaces (Super Admin, QA Director / Accreditation Coordinator, Evaluator / Accreditor, and Area Chair / Faculty Lead), any evidence uploads, self-survey ratings, evaluation scores, or cycle scheduling operations are isolated to a single browser session. 

Personnel cannot collaborate across departments, uploaded evidence files are not persisted to cloud storage, role-based access control (RBAC) is enforced only at the route level rather than at the database layer, and real accreditation audit reports cannot be preserved or submitted for official AACCUP or CHED compliance evaluations.

## Solution

Transition the Online Accreditation Management System (OAMS) from client-side mock data to a production-grade Supabase Backend-as-a-Service architecture. 

This establishes a normalized PostgreSQL schema with Row-Level Security (RLS) policies matching institutional accreditation hierarchies, connects Server Actions and Data Queries across vertical domain slices (`accreditations`, `criteria`, `evidence`, `evaluations`, `users`, `reports`), provisions secure Supabase Storage buckets for accreditation evidence artifacts with strict MIME and size validations, and replaces the client-side store with real-time optimistic server mutations and revalidation.

## User Stories

1. As a Super Admin, I want to provision academic colleges and degree programs with assigned target accreditation levels, so that the university curriculum catalog is kept current for upcoming accreditation cycles.
2. As a Super Admin, I want to manage institutional personnel accounts and toggle operational roles (admin, coordinator, evaluator, faculty), so that users only access functionality appropriate to their institutional responsibilities.
3. As a Super Admin, I want self-lockout safeguards to prevent me from revoking my own administrative permissions, so that the institution is never locked out of system administration.
4. As a Super Admin, I want to review pending account registrations from faculty and accreditors and approve or reject them, so that unverified users cannot view confidential academic audit records.
5. As an Accreditation Coordinator, I want to schedule a new accreditation cycle specifying the accrediting body (AACCUP, CHED, ALCUCOA, PAASCU), academic year, start date, and target programs, so that audit preparations have formal institutional timelines.
6. As an Accreditation Coordinator, I want newly created cycles to automatically provision the standard 10 AACCUP accreditation areas for every enrolled program, so that manual data entry errors and missing areas are eliminated.
7. As an Accreditation Coordinator, I want to assign designated Faculty Leads and Area Chairs to specific accreditation areas with real-time email notifications, so that area teams know their collection responsibilities.
8. As an Accreditation Coordinator, I want to track overall compliance percentage and submission progress across all degree programs in an active cycle, so that deficiencies are identified before external audit teams arrive.
9. As an Accreditation Coordinator, I want to assign internal QA reviewers to inspect uploaded faculty evidence and issue formal revision requests, so that only high-quality documentation is forwarded to external evaluators.
10. As an Accreditation Coordinator, I want to monitor the institutional accreditation timeline and validity expiration dates across all academic programs, so that re-accreditation surveys are initiated well before current certifications expire.
11. As an Area Chair / Faculty Lead, I want to view my assigned accreditation areas and parameters in a dedicated checklist, so that I understand exactly what benchmarks require documentation.
12. As an Area Chair / Faculty Lead, I want to upload electronic evidence files (PDFs, syllabi, board exam records, meeting minutes, facility photos) directly into secure cloud storage tied to specific indicators, so that proof of compliance is centrally archived.
13. As an Area Chair / Faculty Lead, I want uploaded evidence files to be validated for acceptable document MIME types and a 50MB file size ceiling, so that invalid or corrupt files do not degrade system storage.
14. As an Area Chair / Faculty Lead, I want to record preliminary self-survey ratings (1.0 to 5.0) and descriptive compliance justifications per parameter, so that our internal self-assessment baseline is documented.
15. As an Area Chair / Faculty Lead, I want to view feedback notes and revision requests from QA reviewers on my submitted evidence, so that I can promptly correct deficiencies and re-upload revised files.
16. As an Area Chair / Faculty Lead, I want to replace or delete draft evidence files before formal submission, so that outdated working drafts do not clutter the audit repository.
17. As an Evaluator / Accreditor, I want to access an assigned survey audit queue displaying degree programs, benchmark indicators, and submitted evidence documents, so that I can inspect institutional compliance systematically.
18. As an Evaluator / Accreditor, I want to preview and download submitted PDF and document evidence files directly within the review workbench, so that I can verify authenticity without third-party tools.
19. As an Evaluator / Accreditor, I want to record official rubric scores on a standardized 5-point scale with fine-decimal adjustments, so that ratings comply with AACCUP and CHED scoring formulas.
20. As an Evaluator / Accreditor, I want to record qualitative findings categorized by Institutional Strengths, Compliance Deficiencies, and Actionable Recommendations, so that formal audit narratives accompany quantitative scores.
21. As an Evaluator / Accreditor, I want real-time calculation of area means and the final accreditation grand mean based on standard area weightings, so that our audit team can determine the recommended accreditation level immediately upon completing scoring.
22. As an Evaluator / Accreditor, I want to sign off and finalize evaluation scores to lock them against further editing, so that the integrity of the audit verdict is preserved.
23. As an Institutional Stakeholder / QA Director, I want to generate comprehensive accreditation summary reports and compliance matrices, so that university leadership has executive visibility into institutional quality benchmarks.
24. As an authenticated user holding multiple operational roles (e.g., Coordinator and Faculty Lead), I want the system to resolve my primary dashboard route by strict role precedence while allowing me to navigate between my authorized workspaces, so that I can perform varied institutional duties without multiple accounts.
25. As any authenticated user, I want database operations and data access protected by Row-Level Security policies, so that users cannot inspect or manipulate records belonging to unauthorized programs or confidential evaluation audits.

## Implementation Decisions

### Architectural Seams & Domain Modules

The transition maintains the established Next.js App Router and vertical feature slice structure:

- `src/features/accreditations/`: Owns accreditation cycles, degree programs, departments, accreditation levels, timeline schedules, and pure arithmetic calculation utilities.
- `src/features/criteria/`: Owns accreditation frameworks, 10 standard AACCUP areas, parameters, indicators, and institutional compliance tracking.
- `src/features/evidence/`: Owns document metadata, Supabase Storage integration, secure file uploading, signed URL generation, and evidence lifecycle status.
- `src/features/evaluations/`: Owns evaluator audit queues, rubric scoring records, qualitative findings (strengths/deficiencies/recommendations), review management, and reviewer assignments.
- `src/features/users/`: Owns personnel profiles, multi-role RBAC grants and revocations, self-lockout enforcement, and pending registration approvals.
- `src/features/auth/`: Owns session verification, credentials authentication, registration workflows, and server-side role guards (`requireRole`).

### Primary Testing & Data Access Seam

The primary architectural seam for testing and operational data flow is the **Feature Server Action and Data Query Interface** (`src/features/*/actions.ts` and `src/features/*/queries.ts`).

- UI components (Arc UI workbenches, dialogs, forms, tables) interact exclusively through typed server actions and query functions.
- The UI layer contains zero direct database queries or raw Supabase SDK calls.
- Server actions execute input validation using Zod schemas, enforce role authorization via `requireRole`, perform atomic database transactions, and trigger Next.js cache revalidation (`revalidatePath`).
- This single seam enables comprehensive automated testing of business logic, validation, security boundaries, and calculations without requiring browser automation or rendering overhead.

### Normalized Database Schema & PostgreSQL Tables

All tables reside in the `public` schema and enforce relational foreign keys and timestamps:

- `public.profiles`: Extends `auth.users` with `email`, `full_name`, `avatar_url`, and `department`.
- `public.user_roles`: Maps `user_id` to `app_role` enum (`admin`, `coordinator`, `evaluator`, `faculty`).
- `public.colleges`: Academic units (`id`, `code`, `name`, `dean_name`).
- `public.programs`: Degree programs (`id`, `code`, `name`, `college_id`, `current_level`, `target_level`, `lead_coordinator_id`).
- `public.accreditation_cycles`: Survey campaigns (`id`, `name`, `body`, `academic_year`, `start_date`, `end_date`, `status`, `target_level`, `description`).
- `public.cycle_programs`: Junction mapping cycles to participating degree programs.
- `public.accreditation_areas`: The standard 10 evaluation areas for an enrolled program cycle (`id`, `cycle_id`, `program_id`, `area_number`, `title`, `chair_id`, `weight`, `status`).
- `public.parameters`: Structured sub-standards under an area (`id`, `area_id`, `code`, `title`, `description`, `weight`).
- `public.indicators`: Measurable compliance criteria under a parameter (`id`, `parameter_id`, `code`, `description`, `benchmark_text`).
- `public.faculty_assignments`: Evidence collection tasks delegated to personnel (`id`, `area_id`, `parameter_id`, `indicator_id`, `faculty_id`, `assigned_by`, `status`, `deadline`).
- `public.evidence_documents`: Uploaded verification files (`id`, `indicator_id`, `program_id`, `file_name`, `file_path`, `file_size`, `mime_type`, `storage_bucket`, `uploaded_by`, `status`, `notes`).
- `public.evaluations`: Evaluator rubric scoring records (`id`, `indicator_id`, `evaluator_id`, `cycle_id`, `rating_score`, `findings`, `strengths`, `deficiencies`, `recommendations`, `is_finalized`).
- `public.document_reviews`: Internal QA review records (`id`, `evidence_id`, `reviewer_id`, `status`, `feedback`).

### Row-Level Security (RLS) Policy Design

PostgreSQL RLS is enabled on all domain tables:

- **Super Admins**: Global SELECT, INSERT, UPDATE, DELETE access on all tables via `public.is_admin()`.
- **Coordinators**: Full access to cycles, program assignments, areas, and compliance tracking for degree programs within their purview.
- **Faculty Leads**: Read access to assigned cycle areas, parameters, and indicators; INSERT and UPDATE access to their own evidence uploads and self-survey notes; zero write access to evaluation scores.
- **Evaluators**: Read access to assigned audit programs and approved evidence documents; INSERT and UPDATE access to their own evaluation ratings and findings; read-only access to personnel management.
- **Unassigned / Pending Personnel**: Zero access to domain tables until granted an operational role by a Super Admin.

### Supabase Storage Bucket Configuration

- Bucket Name: `evidence-vault` (Private bucket).
- Access Control: Restrictive storage RLS policies ensuring only authenticated faculty leads can upload files to their assigned program/cycle paths, while evaluators and coordinators can download via signed URLs.
- Allowed MIME Types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX), `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX), `image/png`, `image/jpeg`.
- File Size Limit: 50MB per uploaded artifact.

### Deprecation of In-Browser Mock Store

- The mock store provider and `localStorage` sync (`oams_state_v1`) are superseded by Server Components for initial data fetches and Server Actions for mutations.
- Arc UI components receive live data as props or through lightweight feature context hooks that wrap optimistic Server Action invocations.

## Testing Decisions

### What Makes a Good Test

Tests must verify external domain behavior, authorization contracts, calculation precision, and validation boundaries. Tests must never inspect internal component states, private variables, or raw SQL strings.

### Modules Under Test

1. **Pure Calculation Engine**: Verify AACCUP/CHED arithmetic mean algorithms, completion rates, area weight summaries, and grand mean level thresholds across normal, edge, and null rating conditions.
2. **Role Hierarchy & Route Guards**: Verify that role resolution priority (`admin` > `coordinator` > `evaluator` > `faculty` > `/pending-approval`) and workspace access evaluation enforce institutional security without false redirects.
3. **Admin Role Delegation & Policy**: Verify Zod schema validation, self-lockout enforcement (admin cannot revoke their own admin role), and profile-role mapping.
4. **Server Action Contracts & Validation**: Test that cycle scheduling, evidence metadata insertion, review status updates, and rubric evaluation actions reject malformed payloads, reject unauthorized roles, and succeed with valid data.
5. **Database RLS Invariant Verification**: Verify that a simulated faculty user cannot write to evaluation rating records, and an evaluator cannot mutate program catalog records.

### Prior Art

- [`calculations.test.ts`](file:///c:/Users/NaphierNODE/Documents/NaphierPROJECTS/OAMsupabase/src/features/accreditations/__tests__/calculations.test.ts): 11 tests verifying pure accreditation mathematics.
- [`guards.test.ts`](file:///c:/Users/NaphierNODE/Documents/NaphierPROJECTS/OAMsupabase/src/features/auth/__tests__/guards.test.ts): 5 tests verifying multi-role evaluation logic.
- [`users.test.ts`](file:///c:/Users/NaphierNODE/Documents/NaphierPROJECTS/OAMsupabase/src/features/users/__tests__/users.test.ts): 9 tests verifying RBAC mutation policies and self-lockout protection.
- [`auth.test.ts`](file:///c:/Users/NaphierNODE/Documents/NaphierPROJECTS/OAMsupabase/src/features/auth/__tests__/auth.test.ts): 10 tests verifying authentication schemas and path resolutions.

## Out of Scope

- Public marketing landing pages (the application remains strictly an authenticated internal institutional portal).
- Integration with third-party university SIS/ERP databases (all student or course rosters are represented via uploaded evidence attachments).
- Video conferencing or live remote meeting streaming for audit teams.
- Native mobile applications (the Next.js responsive web application serves mobile and desktop browsers).
- Automated optical character recognition (OCR) or automated AI grading of uploaded evidence documents.

## Further Notes

- All UI components are already migrated to Arc UI (`src/components/arc/` and `src/components/ui/`) with strict Light Mode styling, ZPPSU Maroon (`#7B1113`) and Gold (`#D97706`) tokens, sentence case typography, and zero dark-theme leaks.
- Schema migrations must be authored as declarative SQL files in `docs/schema/` and applied using Supabase migrations.
- The existing Next.js build (`npm run build`) and test suite (`npm test`) compile and pass with zero errors. All subsequent backend integration tasks must preserve green test and build states.
