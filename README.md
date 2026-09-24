# AWS Club Recruitment 2026

A premium recruitment website for AWS Club applicants and admins. It includes a public landing page, a multi-step application experience, local in-memory submission storage, local admin access, applicant review tools, status management, recruiter notes, and CSV export.

## Features

- Experimental orange, black, and white recruitment landing page
- Six-step application flow with preserved state and inline validation
- Dynamic work links stored in a separate table
- Server-side Zod validation and URL normalization
- Duplicate email protection
- Local demo-token admin login
- Local admin authorization
- Protected admin dashboard, search, filters, pagination, detail pages, notes, statuses, and CSV export
- In-memory application store for local use
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

## Storage

Applications are stored in memory by the Next.js server for local/demo use. Data is cleared when the server restarts or redeploys. The admin area is accessed through the local **Use Demo Admin** button.

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


