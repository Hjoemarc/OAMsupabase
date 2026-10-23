# 05: Accreditation Cycle and Criteria Management CRUD Interfaces

**What to build:**
Upgrade `src/features/accreditations/components/cycle-manager.tsx` and `src/features/criteria/components/criteria-framework.tsx`:
- Cycle manager: Add Edit Cycle modal and Delete Cycle confirmation.
- Criteria framework: Add Add/Edit Parameter modals and Add/Edit Indicator modals.
- Delete confirmations for criteria parameters and indicators.
- Wire into store mutations with immediate reactive updates.

**Blocked by:**
03: Domain Store CRUD Expansion and Referential Integrity

**Status:** closed

- [x] Cycle Edit modal updates date window, programs, and level
- [x] Cycle Delete modal safely removes cycle from institutional roster
- [x] Criteria Framework supports creating and editing parameters and indicators
- [x] Row action menus provide direct access to edit and delete actions
