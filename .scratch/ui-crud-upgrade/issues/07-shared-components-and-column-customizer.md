# 07: Reusable Data Components, Column Visibility, and Action Primitives

**What to build:**
Create shared, reusable primitives in `src/components/ui/`:
- `ColumnCustomizer` (`column-customizer.tsx`): popover dropdown allowing users to toggle column visibility with persistent storage and locked key preservation.
- `RowActionMenu` (`row-action-menu.tsx`): Radix-based action dropdown with contextual icons and destructive styling.
- `ConfirmDialog` (`confirm-dialog.tsx`): reusable confirmation modal for delete and critical actions.
- Integrate these primitives across `DataTable`, `CycleManager`, `ProgramCatalog`, `CriteriaFramework`, and `EvidenceVault`.

**Blocked by:**
01: Fix Non-Functional UI Triggers and Row Menus

**Status:** closed

- [x] `ColumnCustomizer` operates seamlessly across all major data tables
- [x] `RowActionMenu` unifies row-level action dispatching across all modules
- [x] `ConfirmDialog` provides consistent visual and functional safeguards
