create extension if not exists "pgcrypto";

create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  phone text not null,
  email text not null,
  domain text not null,
  improvement_idea text not null,
  expectations text not null,
  status text not null default 'NEW',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_domain_check check (domain in ('TECH', 'PR')),
  constraint applications_status_check check (
    status in ('NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED')
  ),
  constraint applications_email_unique unique (email),
  constraint applications_improvement_length check (char_length(improvement_idea) <= 1000),
  constraint applications_expectations_length check (char_length(expectations) <= 1000)
);

create table public.work_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

create index work_links_application_id_idx on public.work_links(application_id);
create index applications_created_at_idx on public.applications(created_at desc);
create index applications_domain_idx on public.applications(domain);
create index applications_status_idx on public.applications(status);
create index applications_email_idx on public.applications(email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  );
$$;

alter table public.admins enable row level security;
alter table public.applications enable row level security;
alter table public.work_links enable row level security;

create policy "Admins can read their own admin row"
on public.admins
for select
to authenticated
using (id = auth.uid());

create policy "Admins can read applications"
on public.applications
for select
to authenticated
using (public.is_admin());

create policy "Admins can update applications"
on public.applications
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read work links"
on public.work_links
for select
to authenticated
using (public.is_admin());

create policy "Admins can update work links"
on public.work_links
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on public.applications from anon;
revoke all on public.work_links from anon;
revoke all on public.admins from anon;
