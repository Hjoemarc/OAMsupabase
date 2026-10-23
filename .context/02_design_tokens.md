# 02 Design Tokens & Visual Contracts

## 1. Design System Foundation
* **Framework**: Tailwind CSS v4 (`@tailwindcss/turbopack`)
* **Component Library**: Radix UI Primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-checkbox`, etc.)
* **Iconography**: Lucide React / SVG primitives.

## 2. Invariants
1. **Interactive Controls**: All dropdown triggers, dialog triggers, and popovers must be wrapped in client components with `'use client'` directive.
2. **Accessible Semantics**: Radix UI primitives manage ARIA attributes (`aria-expanded`, `aria-haspopup`, keyboard navigation). Custom triggers must forward refs (`React.forwardRef`).
3. **Responsive Breakpoints**: Desktop-first layouts with standard breakpoints (`sm`, `md`, `lg`, `xl`).
4. **Theme Tokens**: Neutral slate / zinc grayscale with primary indigo/blue accent for accreditation actions and semantic status colors (green = Compliant, yellow = Needs Improvement, red = Non-Compliant).
