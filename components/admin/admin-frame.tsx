"use client";

import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminShell } from "@/components/admin/admin-shell";

export function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
