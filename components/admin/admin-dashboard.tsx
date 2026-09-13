"use client";

import Link from "next/link";
import { Download, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { applicationStatuses } from "@/lib/config";
import { getAdminHeaders } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types/database";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/applications?pageSize=100", {
        headers: await getAdminHeaders(),
      });
      const body = await response.json();
      if (!response.ok) setError(body.error || "Could not load dashboard.");
      else setApplications(body.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const count = (predicate: (item: Application) => boolean) =>
      applications.filter(predicate).length;
    return {
      total: applications.length,
      tech: count((item) => item.domain === "TECH"),
      pr: count((item) => item.domain === "PR"),
      new: count((item) => item.status === "NEW"),
      shortlisted: count((item) => item.status === "SHORTLISTED"),
      selected: count((item) => item.status === "SELECTED"),
    };
  }, [applications]);

  async function exportCsv() {
    const response = await fetch("/api/export", {
      headers: await getAdminHeaders(),
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aws-club-applications.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="mono text-[#ff9900]">Loading dashboard...</p>;
  if (error) return <p className="text-[#ffb84d]">{error}</p>;

  return (
    <div className="grid gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mono text-xs font-bold text-[#ff9900]">LIVE PIPELINE</p>
          <h1 className="display mt-2 text-6xl uppercase leading-none sm:text-8xl">
            {stats.total} Applications
          </h1>
        </div>
        <Button onClick={exportCsv}>
          <Download size={18} aria-hidden="true" />
          Export CSV
        </Button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          ["TOTAL", stats.total],
          ["TECH", stats.tech],
          ["PR", stats.pr],
          ["NEW", stats.new],
          ["SHORTLISTED", stats.shortlisted],
          ["SELECTED", stats.selected],
        ].map(([label, value]) => (
          <div key={label} className="glass-line p-5">
            <p className="mono text-xs font-bold text-white/55">{label}</p>
            <p className="mt-3 text-4xl font-black text-[#ff9900]">{value}</p>
          </div>
        ))}
      </section>

      <section className="glass-line p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase">Recent Applicants</h2>
          <Link className="mono text-xs font-bold text-[#ff9900]" href="/admin/applications">
            VIEW ALL
          </Link>
        </div>
        {applications.length === 0 ? (
          <div className="grid place-items-center border border-white/12 p-12 text-center">
            <Users className="mb-4 text-[#ff9900]" />
            <p className="text-xl font-black uppercase">No applications yet.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {applications.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                href={`/admin/applications/${item.id}`}
                className="grid gap-2 border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ff9900]/60 md:grid-cols-[1fr_1fr_auto]"
              >
                <strong>{item.name}</strong>
                <span className="text-white/62">{item.email}</span>
                <span className="mono text-xs text-[#ff9900]">{formatDate(item.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export { applicationStatuses };
