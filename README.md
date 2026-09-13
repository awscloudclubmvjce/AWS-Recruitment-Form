# AWS Club Recruitment 2026

A premium recruitment website for AWS Club applicants and admins. It includes a public landing page, a multi-step application experience, Supabase-backed submission storage, admin authentication, applicant review tools, status management, recruiter notes, and CSV export.

## Features

- Experimental orange, black, and white recruitment landing page
- Six-step application flow with preserved state and inline validation
- Dynamic work links stored in a separate table
- Server-side Zod validation and URL normalization
- Duplicate email protection
- Supabase Auth admin login
- Explicit admin authorization through the `admins` table
- Protected admin dashboard, search, filters, pagination, detail pages, notes, statuses, and CSV export
- PostgreSQL schema with constraints, indexes, triggers, and RLS policies
- Responsive, accessible UI with reduced-motion support

## Tech Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth + PostgreSQL
- Zod
- Lucide React

## Local Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_AWS_CLUB_SOCIAL_URL=
ENABLE_DEMO_ADMIN=false
NEXT_PUBLIC_ENABLE_DEMO_ADMIN=false
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public browser values. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to client code.

For local admin UI testing without Supabase Auth, set both demo variables to `true` in `.env.local`, restart the dev server, then use the **Use Demo Admin** button on `/admin/login`. Demo admin is ignored in production builds.

## Supabase Setup

1. Create a Supabase project.
2. Enable email/password authentication in Supabase Auth.
3. Run the SQL migration in `supabase/migrations/202609130001_initial_recruitment_schema.sql`.
4. Create admin users in Supabase Auth.
5. Add each admin user ID to the `public.admins` table.

Example:

```sql
insert into public.admins (id)
values ('00000000-0000-0000-0000-000000000000');
```

## Database

The migration creates:

- `applications`
- `work_links`
- `admins`
- domain and status checks
- unique email duplicate protection
- updated-at trigger
- admin-only RLS policies

Public application submissions are handled by the server API using the service-role key. Public users cannot query applications or work links directly.

## Development Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the same environment variables in Vercel Project Settings.
4. Deploy.

The service-role key must be configured only as a server-side environment variable in Vercel.
