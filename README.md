# SAMS Next.js Frontend

## Run
1. `cp .env.example .env.local`
2. Set `NEXT_PUBLIC_API_BASE_URL` if backend is on a different host.
3. `npm install`
4. `npm run dev`

## Notes
- Uses App Router and React Query.
- Auth uses backend session cookies (`credentials: include`).
- Legacy Replit project remains untouched; this app is fully isolated under `frontend-next/`.
