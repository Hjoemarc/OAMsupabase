# 02: Reusable Dependent Select Hook and Cascading Fields

**What to build:**
Build a reusable `useDependentOptions` hook and `DependentSelect` component supporting cascading data-driven selections:
- Select Department → filters Program options.
- Select Program → filters Course options.
- Select Cycle → filters Standard Area options.
- Select Area → filters Parameter options.
- Changing a parent selection automatically clears invalid dependent selections.
- Displays loading states during fetch, empty states when no records match, and recoverable error messages.

**Blocked by:**
01: Fix Non-Functional UI Triggers and Row Menus

**Status:** closed

- [x] Department selection restricts available Programs to associated department
- [x] Program selection restricts available Courses to associated program
- [x] Changing parent clears invalid child selections immediately
- [x] Empty options state provides helpful feedback ("No programs available in this department")
- [x] Form submission validates that selected child belongs to selected parent
