# 03 API & Server Boundaries

## 1. Boundary Architecture
1. **App Router Presentation Layer (`src/app/`)**:
   - Layouts, server pages, and thin presentation routing.
   - Responsible for receiving requests, checking session guards, and passing data down to domain components.
2. **Feature Domain Layer (`src/features/`)**:
   - Encapsulates domain logic, data queries, mutations (Server Actions), and state hooks.
   - Code inside features must not make direct unauthenticated database calls.
3. **Infrastructure Layer (`src/lib/supabase/`)**:
   - Isolates `@supabase/ssr` creation:
     - `createClient()` (browser client)
     - `createServerClient()` (server component / server action client)
     - `updateSession()` (middleware / request proxy client)

## 2. Invariants
* Server Actions must validate inputs with Zod schemas before executing database queries.
* Mutations must return structured results `{ success: boolean, data?: T, error?: string }` instead of throwing raw database errors to the client.
