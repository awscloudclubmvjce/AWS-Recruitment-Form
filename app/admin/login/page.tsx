"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { isClientDemoAdminEnabled, setDemoAdminSession } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  function demoLogin() {
    setDemoAdminSession();
    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center px-5 py-10 sm:px-8">
      <section className="glass-line mx-auto grid w-full max-w-xl gap-5 p-6 sm:p-8">
        <Lock className="text-[#ff9900]" size={34} aria-hidden="true" />
        <div>
          <p className="mono text-xs font-bold text-[#ff9900]">ADMIN AUTH</p>
          <h1 className="display mt-3 text-6xl uppercase leading-none sm:text-7xl">
            Recruitment Control.
          </h1>
        </div>
        {isClientDemoAdminEnabled() ? (
          <Button type="button" onClick={demoLogin}>
            Use Demo Admin
          </Button>
        ) : null}
      </section>
    </main>
  );
}
