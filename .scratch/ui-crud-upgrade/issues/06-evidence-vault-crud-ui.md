# 06: Evidence Vault Dependent Upload and Artifact Management

**What to build:**
Upgrade `src/features/evidence/components/evidence-vault.tsx`:
- Upload dialog with cascading dependent selectors:
  - Standard Area → Parameter
  - Department → Program → Course (optional)
- Document metadata editor (title, file name, category).
- Delete document confirmation modal.
- Document audit and verification status management.

**Blocked by:**
02: Reusable Dependent Select Hook and Cascading Fields, 03: Domain Store CRUD Expansion and Referential Integrity

**Status:** closed

- [x] Evidence upload modal dynamically filters parameters by selected standard area
- [x] Evidence upload modal filters courses by selected department and program
- [x] Document metadata edit modal updates title, file name, and category
- [x] Delete artifact modal safely removes evidence record
- [x] Table reflects new and updated artifacts immediately
