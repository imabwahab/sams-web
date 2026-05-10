# Frontend Migration Summary

## Extracted from Legacy Replit Project

- UI pages: landing, auth, patient dashboard/find-doctors/appointments/profile, doctor dashboard/schedule/appointments/profile, admin dashboard/users/stats.
- Shared presentation: shell layout (`Sidebar`, `BottomNav`, `MobileHeader`) and shadcn UI primitives used by migrated pages.
- Client state and data access: auth/session state, doctors, schedules, appointments, and admin data flows.
- Styling: legacy Tailwind theme variables and global styles.

## Reorganized Next.js Structure

- `src/app`: App Router routes for all public/protected pages.
- `src/features`: domain pages grouped by `landing`, `auth`, `patient`, `doctor`, `admin`. 
- `src/components`: shared layout/auth guards + UI primitives.
- `src/hooks`: React Query + auth hooks.
- `src/services`: centralized API layer (`api-client`, endpoint map, domain services).
- `src/types`: frontend-only domain/API contracts.
- `src/lib`: shared query keys, query client, utility helpers.

## Major Refactors

- Replaced Wouter routing/navigation with Next.js App Router (`next/link`, `next/navigation`).
- Added role-based guard components for protected route access.
- Removed legacy shared backend coupling (`@shared/*`) and replaced with frontend-owned typed contracts.
- Unified API calls behind service modules and environment-driven base URL.
- Corrected backend route mismatches to current API shape (notably schedules and admin user activation endpoints).

## Backend API Integration

- All client-server calls now flow through `src/services/*` and `src/services/api-client.ts`.
- API base URL is configurable via `NEXT_PUBLIC_API_BASE_URL` (defaults to same-origin).
- Cookie/session auth is preserved with `credentials: include` on every request.
- Query invalidation is centralized via `src/lib/query-keys.ts` and React Query hooks.

## Legacy Folder Safety

- Original Replit source under `client/`, `server/`, and `shared/` was not modified.
- New production-ready frontend lives entirely in `frontend-next/` and can operate independently.
