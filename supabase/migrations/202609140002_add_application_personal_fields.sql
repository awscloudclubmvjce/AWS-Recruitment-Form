alter table public.applications
  add column if not exists department text not null default '',
  add column if not exists usn text not null default '',
  add column if not exists phone text not null default '';

alter table public.applications
  alter column department drop default,
  alter column usn drop default,
  alter column phone drop default;