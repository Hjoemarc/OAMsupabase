# 08: Automated Test Coverage and End-to-End Playwright Verification

**What to build:**
Write and execute automated test suites:
- Unit tests (`src/features/accreditations/__tests__/crud-integrity.test.ts` & `dependent-filtering.test.ts`):
  - Testing referential integrity guardrails (deleting department with active programs, deleting program with courses/cycles).
  - Testing dependent filtering (`filterProgramsByDepartment`, `filterCoursesByProgram`, `filterAreasByCycle`, `filterParametersByArea`).
  - Testing course, parameter, indicator mutations.
- Playwright verification script (`audit-screenshots/verify-crud-interactions.js`):
  - Click **Customize Columns** → verify popover opens → toggle column off → verify column hides.
  - Click **Row Action Menu** → verify contextual actions open and respond.
  - Click **Add Section** → verify modal opens and handles inputs.
  - Open **Add Course** dialog → verify cascading selection (`Department → Program`).
  - Click **Delete Department** with active programs → verify system safeguard modal blocks deletion.
  - Open **Add Cycle / Edit Cycle** dialogs → verify fields and persistence.
  - Open **Evidence Vault** upload dialog → verify cascading selectors (`Area → Parameter`, `Department → Program → Course`).
  - Capture visual before-and-after screenshots under `audit-screenshots/after/`.

**Blocked by:**
01 through 07

**Status:** closed

- [x] All unit tests pass with 0 errors via `npm run test`
- [x] Playwright script verifies Customize Columns, RowActionMenu, and cascading dropdowns in real browser
- [x] Referential integrity error dialog visually and functionally verified
- [x] Screenshots captured and stored under `audit-screenshots/after/`
- [x] `npx tsc --noEmit` reports 0 TypeScript errors
