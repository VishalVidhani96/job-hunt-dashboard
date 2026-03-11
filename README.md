# Daily CV Job Finder

Zero-cost MVP job-finder for Germany-based roles posted in the last 24 hours.

## Stack
- Next.js 14 + TypeScript + Tailwind
- PostgreSQL (Neon free tier)
- Prisma ORM
- Vercel Hobby deployment + Vercel Cron
- Single-user now, multi-user-ready schema

## Architecture (zero-cost friendly)
- **Web + API**: Next.js App Router and route handlers (no paid worker).
- **Database**: Neon PostgreSQL free tier.
- **Daily sync**: Vercel cron calls `/api/cron/daily-sync` once daily.
- **Refresh-on-open**: client trigger (`/api/sync/trigger`) checks recent successful sync and runs only when stale.
- **CV pipeline**: upload PDF, parse to structured profile, store normalized profile only (raw PDF retention not required).
- **Ingestion**: adapter-based source layer (`lib/sources/adapters`) so sources are replaceable.
- **Dedup**: URL fingerprint + hashed normalized title/company/city.
- **ATS scoring**: deterministic explainable score (skills/title/keywords/language/location).

## Folder structure
- `app/` UI pages + route handlers
- `components/` reusable client components
- `lib/services/` CV parsing, ATS, dedup, queries
- `lib/sources/` source adapter interfaces and implementations
- `lib/sync/` sync orchestration and sync throttle policy
- `prisma/` schema + seed
- `tests/` ATS, parser, dedup tests

## Local setup
1. Install deps:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Set `DATABASE_URL` to your Neon connection string.
4. Generate and apply schema:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run seed
   ```
5. Run dev server:
   ```bash
   npm run dev
   ```

## MVP behavior
- Germany-only jobs are ingested.
- New feed shows only last 24h postings.
- All jobs view persists full historical list.
- Status workflow: New / Applied / Interview / Reject / Accept.
- Per-job notes and status history are persisted.
- Source URL is always stored.

## Neon setup
1. Create free Neon project and database.
2. Copy pooled connection string into `DATABASE_URL`.
3. Keep SSL mode required (`sslmode=require`).

## GitHub + Vercel deployment (free)
1. Push repo to GitHub Free.
2. Import project in Vercel Hobby.
3. Add env vars from `.env.example`.
4. Deploy.
5. Configure cron endpoint auth:
   - Set `CRON_SECRET` in env.
   - Add header in Vercel cron request or keep same secret convention.

## Vercel cron config
`vercel.json` includes:
- `0 6 * * *` -> `/api/cron/daily-sync`

## Refresh-on-open safety
- Every dashboard open calls `/api/sync/trigger`.
- Backend checks last successful sync timestamp (`SYNC_MIN_INTERVAL_MINUTES` window).
- If too recent, sync is skipped to avoid excessive calls.

## Source adapter extensibility
- Implement `JobSourceAdapter` in `lib/sources/adapters/*`.
- Register adapter in `lib/sources/index.ts`.
- Keep source-specific logic inside adapter only.

## Docker (optional local parity)
```bash
docker build -t daily-cv-job-finder .
docker run -p 3000:3000 --env-file .env daily-cv-job-finder
```

## Notes
- This MVP keeps parsing and scoring fully local/server-side to avoid paid AI APIs.
- Add auth later by introducing a `session/user` layer without changing core job/profile models.
