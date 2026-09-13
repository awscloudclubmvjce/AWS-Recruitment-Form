-- AWS SBG Club Recruitment - Database Schema
-- Paste and run this entirely in your Supabase SQL Editor

-- 1. Create Applications Table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL, -- 'TECH' or 'PR'
  improvement_idea TEXT NOT NULL,
  expectations TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING'
);

-- 2. Create Work Links Table
CREATE TABLE public.work_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  url TEXT NOT NULL
);

-- 3. Create Admins Table (for dashboard access)
CREATE TABLE public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for secure access
-- Only the service_role (Admin API) can access everything bypasses RLS naturally.
-- But for good measure, we explicitly deny anonymous read/write directly from the frontend client.
-- The Next.js API Routes (which use the SUPABASE_SERVICE_ROLE_KEY) will handle all interactions safely.

CREATE POLICY "Allow Service Role Only - Applications" 
ON public.applications 
FOR ALL 
TO service_role 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow Service Role Only - Work Links" 
ON public.work_links 
FOR ALL 
TO service_role 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow Service Role Only - Admins" 
ON public.admins 
FOR ALL 
TO service_role 
USING (true) WITH CHECK (true);
