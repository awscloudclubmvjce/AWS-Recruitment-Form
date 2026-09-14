"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { applicationStatuses } from "@/lib/config";
import { getAdminHeaders } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { inputClass, textareaClass } from "@/components/ui/field";

export function ApplicationDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Application | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>("NEW");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/applications/${id}`, {
        headers: await getAdminHeaders(),
      });
      const body = await response.json();
      if (response.ok) {
        setItem(body.data);
        setStatus(body.data.status);
        setNotes(body.data.admin_notes || "");
      } else {
        setMessage(body.error || "Application not found.");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function save(nextStatus = status) {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: {
        ...(await getAdminHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus, adminNotes: notes }),
    });
    const body = await response.json();
    if (response.ok) {
      setItem(body.data);
      setStatus(body.data.status);
      setNotes(body.data.admin_notes || "");
      setMessage("Saved.");
    } else {
      setMessage(body.error || "Could not save.");
    }
    setSaving(false);
  }

  if (loading) return <p className="mono text-[#ff9900]">Loading applicant...</p>;
  if (!item) return <p className="text-[#ffb84d]">{message || "Application not found."}</p>;

  return (
    <div className="grid gap-5">
      <Link href="/admin/applications" className="mono inline-flex items-center gap-2 text-xs font-bold uppercase text-[#ff9900]">
        <ArrowLeft size={16} /> Back to applications
      </Link>

      <header className="grid gap-5 lg:grid-cols-[1fr_0.42fr]">
        <div>
          <p className="mono text-xs font-bold text-[#ff9900]">{item.domain} / {formatDate(item.created_at)}</p>
          <h1 className="display mt-2 break-words text-6xl uppercase leading-none sm:text-8xl">
            {item.name}
          </h1>
        </div>
        <div className="glass-line grid gap-3 p-4">
          <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus)}>
            {applicationStatuses.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="ghost" onClick={() => { setStatus("SHORTLISTED"); save("SHORTLISTED"); }}>Shortlist</Button>
            <Button variant="ghost" onClick={() => { setStatus("SELECTED"); save("SELECTED"); }}>Select</Button>
            <Button variant="danger" onClick={() => { setStatus("REJECTED"); save("REJECTED"); }}>Reject</Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Personal Details">
          <Info label="Department" value={item.department} />
          <Info label="USN" value={item.usn} />
          <Info label="Phone" value={item.phone} />
          <Info label="Email" value={item.email} />
        </Panel>
        <Panel title="Domain">
          <p className="text-4xl font-black text-[#ff9900]">{item.domain}</p>
        </Panel>
        <Panel title="Work & Explanations">
          <div className="grid gap-3">
            {(item.work_links || []).map((link) => (
              <div key={link.id} className="border border-white/12 p-3.5 grid gap-1.5">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between gap-3 text-[#ff9900] hover:underline font-mono text-sm"
                >
                  <span className="break-all">{link.url}</span>
                  <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
                </a>
                {link.description ? (
                  <p className="text-xs text-white/76 leading-relaxed border-t border-white/8 pt-1.5 mt-0.5">
                    {link.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Recruiter Notes">
          <textarea className={`${textareaClass} min-h-44`} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add private reviewer notes..." />
        </Panel>
        <Panel title="Club Improvement">
          <p className="whitespace-pre-wrap leading-7 text-white/76">{item.improvement_idea}</p>
        </Panel>
        <Panel title="Expectations">
          <p className="whitespace-pre-wrap leading-7 text-white/76">{item.expectations}</p>
        </Panel>
      </section>

      {message ? <p className="text-sm font-semibold text-[#ffb84d]">{message}</p> : null}
      <Button className="w-full sm:w-fit" onClick={() => save()} disabled={saving}>
        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        Save Status And Notes
      </Button>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass-line p-5">
      <h2 className="mono mb-4 text-xs font-bold uppercase text-[#ff9900]">{title}</h2>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="mb-3 grid gap-1">
      <span className="mono text-xs text-white/44">{label}</span>
      <span className="break-words text-lg font-bold">{value}</span>
    </p>
  );
}
