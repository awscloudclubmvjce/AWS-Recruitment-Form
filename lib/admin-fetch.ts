"use client";

import { demoAdminToken } from "@/lib/demo-admin";
import { createClient } from "@/lib/supabase/client";

export function isClientDemoAdminEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_ADMIN === "true";
}

export function setDemoAdminSession() {
  window.localStorage.setItem("demo-admin-token", demoAdminToken);
}

export function clearDemoAdminSession() {
  window.localStorage.removeItem("demo-admin-token");
}

export function hasDemoAdminSession() {
  return isClientDemoAdminEnabled() && window.localStorage.getItem("demo-admin-token") === demoAdminToken;
}

export async function getAdminHeaders() {
  if (hasDemoAdminSession()) {
    return { Authorization: `Bearer ${demoAdminToken}` };
  }

  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${data.session?.access_token || ""}` };
}
