# 04: Program, Department, and Course Management CRUD Interfaces

**What to build:**
Upgrade `src/features/accreditations/components/program-catalog.tsx`:
- Add "Academic Courses" tab displaying course code, title, program, units, year/semester.
- Add Create/Edit modals for Departments.
- Add Create/Edit modals for Degree Programs with Department selector.
- Add Create/Edit modals for Courses with cascading Department → Program selector.
- Add Delete confirmation dialogues with clear validation error when deleting an entity with dependents.

**Blocked by:**
02: Reusable Dependent Select Hook and Cascading Fields, 03: Domain Store CRUD Expansion and Referential Integrity

**Status:** closed

- [x] Programs table supports Edit, Delete, and Add with department select
- [x] Colleges table supports Edit, Delete, and Add
- [x] Courses tab rendered with Add, Edit, Delete workflows
- [x] Referential integrity error prevents deleting department with programs
- [x] Referential integrity error prevents deleting program with courses/cycles
