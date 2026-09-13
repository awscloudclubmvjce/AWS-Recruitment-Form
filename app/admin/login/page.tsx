"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { isClientDemoAdminEnabled, setDemoAdminSession } from "@/lib/admin-fetch";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function demoLogin() {
    setDemoAdminSession();
    router.push("/admin");
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError || !data.session) {
      setError("Login failed. Check your credentials.");
      setLoading(false);
      return;
    }
    const response = await fetch("/api/applications?pageSize=1", {
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    });
    if (!response.ok) {
      await supabase.auth.signOut();
      setError("This account is not authorized as a recruitment admin.");
      setLoading(false);
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center px-5 py-10 sm:px-8">
      <form onSubmit={login} className="glass-line mx-auto grid w-full max-w-xl gap-5 p-6 sm:p-8">
        <Lock className="text-[#ff9900]" size={34} aria-hidden="true" />
        <div>
          <p className="mono text-xs font-bold text-[#ff9900]">ADMIN AUTH</p>
          <h1 className="display mt-3 text-6xl uppercase leading-none sm:text-7xl">
            Recruitment Control.
          </h1>
        </div>
        <Field label="Email">
          <input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </Field>
        <Field label="Password">
          <input className={inputClass} value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </Field>
        {error ? <p className="text-sm font-semibold text-[#ffb84d]">{error}</p> : null}
        <Button disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
          Log In
        </Button>
        {isClientDemoAdminEnabled() ? (
          <Button type="button" variant="ghost" onClick={demoLogin}>
            Use Demo Admin
          </Button>
        ) : null}
      </form>
    </main>
  );
}
