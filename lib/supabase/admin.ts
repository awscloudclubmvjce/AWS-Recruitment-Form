import { createClient } from "@supabase/supabase-js";
import { demoAdminToken, isDemoAdminEnabled } from "@/lib/demo-admin";

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing server Supabase configuration.");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function assertAdmin(authHeader: string | null) {
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { ok: false as const, status: 401, message: "Unauthorized" };

  if (isDemoAdminEnabled() && token === demoAdminToken) {
    return { ok: true as const, demo: true as const };
  }

  const service = createServiceClient();
  const { data, error } = await service.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }

  const { data: admin, error: adminError } = await service
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return { ok: false as const, status: 403, message: "Admin access required" };
  }

  return { ok: true as const, demo: false as const, user: data.user, service };
}
