"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminHeaders, hasDemoAdminSession } from "@/lib/admin-fetch";
import { createClient } from "@/lib/supabase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(() =>
    typeof window === "undefined" ? false : hasDemoAdminSession(),
  );

  useEffect(() => {
    if (ready) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      getAdminHeaders().then((headers) => fetch("/api/applications?pageSize=1", { headers })).then((response) => {
        if (response.status === 401 || response.status === 403) {
          router.replace("/admin/login");
          return;
        }
        setReady(true);
      });
    });
  }, [ready, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="mono text-sm font-bold uppercase text-[#ff9900]">Checking admin access...</p>
      </main>
    );
  }

  return children;
}
