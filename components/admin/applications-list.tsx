"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { applicationStatuses } from "@/lib/config";
import { getAdminHeaders } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types/database";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";

export function ApplicationsList() {
  const [items, setItems] = useState<Application[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sort,
      });
      if (search) params.set("search", search);
      if (domain) params.set("domain", domain);
      if (status) params.set("status", status);
      try {
        const response = await fetch(`/api/applications?${params}`, {
          signal: controller.signal,
          headers: await getAdminHeaders(),
        });
        const body = await response.json();
        if (response.ok) {
          setItems(body.data || []);
          setCount(body.count || 0);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to load applications:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [page, search, domain, status, sort]);

  const pages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="grid gap-5">
      <header>
        <p className="mono text-xs font-bold text-[#ff9900]">APPLICATION INDEX</p>
        <h1 className="display mt-2 text-6xl uppercase leading-none sm:text-8xl">
          Applicants
        </h1>
      </header>

      <section className="glass-line grid gap-3 p-4 lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            className={`${inputClass} pl-10`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name or email"
          />
        </label>
        <select className={inputClass} value={domain} onChange={(event) => { setDomain(event.target.value); setPage(1); }}>
          <option value="">All Domains</option>
          <option value="TECH">TECH</option>
          <option value="PR">PR</option>
        </select>
        <select className={inputClass} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {applicationStatuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select className={inputClass} value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </section>

      <section className="glass-line overflow-hidden">
        <div className="hidden grid-cols-[1.1fr_1fr_0.7fr_1.2fr_0.8fr_0.9fr] gap-3 border-b border-white/12 p-4 mono text-xs font-bold uppercase text-[#ff9900] md:grid">
          <span>Name</span>
          <span>Department</span>
          <span>Domain</span>
          <span>Email</span>
          <span>Status</span>
          <span>Created At</span>
        </div>
        {loading ? (
          <p className="p-6 mono text-[#ff9900]">Loading applicants...</p>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-xl font-black uppercase">No applications yet.</p>
        ) : (
          <div className="grid">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/admin/applications/${item.id}`}
                className="grid gap-2 border-b border-white/10 p-4 transition hover:bg-[#ff9900]/8 md:grid-cols-[1.1fr_1fr_0.7fr_1.2fr_0.8fr_0.9fr] md:gap-3"
              >
                <strong>{item.name}</strong>
                <span className="text-white/66">{item.department}</span>
                <span className="mono text-[#ff9900]">{item.domain}</span>
                <span className="break-all text-white/66">{item.email}</span>
                <span className="mono text-xs">{item.status}</span>
                <span className="mono text-xs text-white/52">{formatDate(item.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
          Previous
        </Button>
        <span className="mono text-xs text-white/60">PAGE {page} / {pages}</span>
        <Button variant="ghost" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
