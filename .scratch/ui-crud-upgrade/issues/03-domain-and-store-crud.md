# 03: Domain Store CRUD Expansion and Referential Integrity

**What to build:**
Upgrade `store-context.tsx` and domain models in `src/types/domain/accreditation.ts`:
- Add `AcademicCourse` interface (`units`, `yearLevel`, `semester`).
- Add `departmentId` to `DegreeProgram` and `programId`/`courseId` to `EvidenceDocument`.
- Implement store CRUD actions:
  - `addCourse`, `updateCourse`, `deleteCourse`.
  - `updateDepartment`, `deleteDepartment` (with check preventing deletion if active programs exist).
  - `updateProgram`, `deleteProgram` (with check preventing deletion if in active cycle or has courses).
  - `updateCycle`, `deleteCycle`.
  - `addParameter`, `updateParameter`, `deleteParameter`.
  - `updateIndicator`, `deleteIndicator`.
  - `updateEvidenceDocument`.
  - `deleteComplianceRecord`.
- Add local storage persistence for state modifications.

**Blocked by:**
None

**Status:** closed

- [x] Course model added and integrated with Program and Department
- [x] Department mutations implemented with child-program integrity safeguard
- [x] Program mutations implemented with active-cycle/course integrity safeguard
- [x] Course, Cycle, Criteria, and Evidence CRUD mutations added to store
- [x] State changes persist across browser reloads via LocalStorage
