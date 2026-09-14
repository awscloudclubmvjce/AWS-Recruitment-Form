-- AWS SBG Club Recruitment - Database Schema
-- Paste and run this entirely in your Supabase SQL Editor (SQL Editor -> New Query -> Run)

-- Drop existing tables if reset is needed (optional / commented out)
-- DROP TABLE IF EXISTS public.work_links CASCADE;
-- DROP TABLE IF EXISTS public.applications CASCADE;

-- 1. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  usn TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL, -- 'TECH' or 'PR'
  improvement_idea TEXT NOT NULL,
  expectations TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  admin_notes TEXT
);

-- 2. Create Work Links Table (with URL and Explanation)
CREATE TABLE IF NOT EXISTS public.work_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_domain ON public.applications (domain);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_links_application_id ON public.work_links (application_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_links ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if re-running script
DROP POLICY IF EXISTS "Allow Service Role Only - Applications" ON public.applications;
DROP POLICY IF EXISTS "Allow Service Role Only - Work Links" ON public.work_links;
DROP POLICY IF EXISTS "Allow Service Role Full Access - Applications" ON public.applications;
DROP POLICY IF EXISTS "Allow Service Role Full Access - Work Links" ON public.work_links;
DROP POLICY IF EXISTS "Allow Public Insert - Applications" ON public.applications;
DROP POLICY IF EXISTS "Allow Public Insert - Work Links" ON public.work_links;

-- 6. Create RLS Policies
-- Allow Service Role (Next.js backend server with SUPABASE_SERVICE_ROLE_KEY) full access
CREATE POLICY "Allow Service Role Full Access - Applications"
ON public.applications
FOR ALL
TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "Allow Service Role Full Access - Work Links"
ON public.work_links
FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- Allow Public/Anon users to submit recruitment applications directly if needed
CREATE POLICY "Allow Public Insert - Applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow Public Insert - Work Links"
ON public.work_links
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
