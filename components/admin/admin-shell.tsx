"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearDemoAdminSession, hasDemoAdminSession } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    if (hasDemoAdminSession()) clearDemoAdminSession();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-10">
      <nav className="mx-auto mb-6 flex max-w-7xl flex-col gap-4 border-b border-[#ff9900]/25 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin" className="display text-4xl uppercase leading-none">
          Recruitment Control.
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "mono border border-white/12 px-4 py-2 text-xs font-bold uppercase text-white/70",
                pathname === link.href && "border-[#ff9900] text-[#ff9900]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" className="min-h-10 px-3 py-2" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Logout
          </Button>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
