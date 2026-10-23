# 01: Fix Non-Functional UI Triggers and Row Menus

**What to build:**
Implement accessible interactive controls for table configuration, row actions, and modal triggers:
- Connect the **Customize Columns** trigger in `DataTable` and feature tables to an accessible popover allowing column visibility toggling.
- Implement functional `RowActionMenu` replacing dead `MoreVertical` buttons across tables with contextual actions (View, Edit, Delete, Audit, Assign).
- Ensure all modal open/close triggers function reliably with ESC and click-outside dismissal.

**Blocked by:**
None (can start immediately)

**Status:** closed

- [x] Customize Columns opens popover and toggles column visibility in real time
- [x] Required columns (checkbox, title) remain locked and cannot be hidden
- [x] Row action menus open with appropriate actions per entity type
- [x] All modals support keyboard ESC and backdrop dismiss
