import { demoAdminToken } from "@/lib/demo-admin";

export function assertAdmin(authHeader: string | null) {
  const token = authHeader?.replace("Bearer ", "");
  if (token !== demoAdminToken) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }

  return { ok: true as const, demo: true as const };
}