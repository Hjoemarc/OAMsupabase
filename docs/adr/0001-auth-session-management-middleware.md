# ADR 0001: Auth Session Management via Next.js Middleware and @supabase/ssr

## Status
Accepted

## Context
The Online Accreditation Management System (OAMS) requires secure, server-side session persistence and token refresh across React Server Components, Client Components, Server Actions, and Route Handlers.

## Decision
We use Next.js 16 Request Proxy (`src/proxy.ts`, the successor convention to `middleware.ts`) paired with `@supabase/ssr` to manage session cookies:
- The proxy intercepts incoming requests at the edge, reads the Supabase session cookies, refreshes expired tokens via the Supabase Auth server, and forwards the updated cookies onto downstream Server Components and Client responses.
- We do not use an external reverse proxy (e.g. Nginx/Cloudflare worker proxy) because external proxies cannot manipulate Next.js server cookie stores directly, add unnecessary infrastructure complexity, and break Server Action cookie synchronization.

## Consequences
- **Positive**: Standard Next.js + Supabase pattern; zero external infrastructure overhead; seamless SSR and Server Actions authentication.
- **Trade-off**: Requires implementing clean Supabase client factory adapters (`client.ts`, `server.ts`, `middleware.ts`) under `src/lib/supabase/`.
