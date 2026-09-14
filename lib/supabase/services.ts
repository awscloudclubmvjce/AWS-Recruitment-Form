import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { demoApplications } from "@/lib/demo-admin";
import type { ApplicationInput } from "@/lib/validations/application";
import type { Application, ApplicationStatus } from "@/types/database";

export async function createApplication(payload: ApplicationInput): Promise<{
  success?: boolean;
  conflict?: boolean;
  error?: string;
  id?: string;
}> {
  if (!isSupabaseConfigured()) {
    if (demoApplications.some((item) => item.email === payload.email)) {
      return { conflict: true, error: "An application with this email already exists. You're already in the queue." };
    }
    const id = crypto.randomUUID();
    demoApplications.push({
      id,
      name: payload.name,
      department: payload.department,
      usn: payload.usn,
      phone: payload.phone,
      email: payload.email,
      domain: payload.domain,
      improvement_idea: payload.improvementIdea,
      expectations: payload.expectations,
      status: "NEW",
      admin_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      work_links: payload.workLinks.map((link) => ({
        id: crypto.randomUUID(),
        application_id: id,
        url: link.url,
        description: link.description || null,
        created_at: new Date().toISOString(),
      })),
    });
    return { success: true, id };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { error: "Failed to initialize Supabase client." };
  }

  // Check duplicate email
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  if (existing) {
    return { conflict: true, error: "An application with this email already exists. You're already in the queue." };
  }

  // Insert application
  const { data: appData, error: appError } = await supabase
    .from("applications")
    .insert({
      name: payload.name,
      department: payload.department,
      usn: payload.usn,
      phone: payload.phone,
      email: payload.email,
      domain: payload.domain,
      improvement_idea: payload.improvementIdea,
      expectations: payload.expectations,
      status: "NEW",
    })
    .select("id")
    .single();

  if (appError || !appData) {
    console.error("Supabase insert application error:", appError);
    return { error: appError?.message || "Could not save application to database." };
  }

  const applicationId = appData.id;

  // Insert work links if present
  if (payload.workLinks && payload.workLinks.length > 0) {
    const linkInserts = payload.workLinks.map((link) => ({
      application_id: applicationId,
      url: link.url,
      description: link.description || null,
    }));

    const { error: linksError } = await supabase.from("work_links").insert(linkInserts);
    if (linksError) {
      console.error("Supabase insert work links error:", linksError);
    }
  }

  return { success: true, id: applicationId };
}

export type GetApplicationsOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  domain?: string;
  status?: string;
  sort?: "newest" | "oldest";
};

export async function getApplications(options: GetApplicationsOptions = {}): Promise<{
  data: Application[];
  count: number;
  error?: string;
}> {
  const page = Math.max(options.page || 1, 1);
  const pageSize = Math.min(options.pageSize || 20, 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const search = options.search?.trim().toLowerCase();
  const domain = options.domain;
  const status = options.status;
  const sort = options.sort === "oldest" ? "oldest" : "newest";

  if (!isSupabaseConfigured()) {
    const filtered = demoApplications
      .filter((item) => !search || item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search))
      .filter((item) => !domain || item.domain === domain)
      .filter((item) => !status || item.status === status)
      .sort((a, b) =>
        sort === "oldest"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    return { data: filtered.slice(from, to + 1), count: filtered.length };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { data: [], count: 0, error: "Supabase client uninitialized" };
  }

  let query = supabase
    .from("applications")
    .select("*, work_links(*)", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (domain) {
    query = query.eq("domain", domain);
  }
  if (status) {
    query = query.eq("status", status);
  }

  query = query.order("created_at", { ascending: sort === "oldest" }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error("Supabase getApplications error:", error);
    return { data: [], count: 0, error: error.message };
  }

  return { data: (data as Application[]) || [], count: count || 0 };
}

export async function getApplicationById(id: string): Promise<Application | null> {
  if (!isSupabaseConfigured()) {
    return demoApplications.find((item) => item.id === id) || null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("applications")
    .select("*, work_links(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Application;
}

export async function updateApplication(
  id: string,
  updates: { status: ApplicationStatus; adminNotes?: string | null },
): Promise<Application | null> {
  if (!isSupabaseConfigured()) {
    const item = demoApplications.find((app) => app.id === id);
    if (!item) return null;
    item.status = updates.status;
    item.admin_notes = updates.adminNotes || null;
    item.updated_at = new Date().toISOString();
    return item;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("applications")
    .update({
      status: updates.status,
      admin_notes: updates.adminNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*, work_links(*)")
    .maybeSingle();

  if (error || !data) return null;
  return data as Application;
}

export async function getAllApplicationsForExport(): Promise<Application[]> {
  if (!isSupabaseConfigured()) {
    return demoApplications;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("applications")
    .select("*, work_links(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Application[];
}
