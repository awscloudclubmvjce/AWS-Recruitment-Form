"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminHeaders, hasDemoAdminSession } from "@/lib/admin-fetch";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasDemoAdminSession()) {
      router.replace("/admin/login");
      return;
    }
    getAdminHeaders()
      .then((headers) => fetch("/api/applications?pageSize=1", { headers }))
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, [router]);

  if (!mounted || !ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="mono text-sm font-bold uppercase text-[#ff9900]">Checking admin access...</p>
      </main>
    );
  }

  return <>{children}</>;
}
