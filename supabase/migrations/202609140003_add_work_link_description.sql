-- Add description column to work_links table
ALTER TABLE public.work_links ADD COLUMN IF NOT EXISTS description TEXT;
