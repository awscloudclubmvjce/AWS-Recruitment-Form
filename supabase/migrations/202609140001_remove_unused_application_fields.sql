alter table public.applications
  drop column if exists department,
  drop column if exists phone;