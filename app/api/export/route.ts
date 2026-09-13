import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/supabase/admin";
import { demoApplications } from "@/lib/demo-admin";
import { toCsvCell } from "@/lib/utils";

export async function GET(request: Request) {
  const admin = await assertAdmin(request.headers.get("authorization"));
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  if (admin.demo) {
    return csvResponse(demoApplications);
  }

  const { data, error } = await admin.service
    .from("applications")
    .select("*, work_links(url)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not export applications." }, { status: 500 });
  }

  return csvResponse(data || []);
}

function csvResponse(data: typeof demoApplications) {
  const header = [
    "Name",
    "Department",
    "Phone",
    "Email",
    "Domain",
    "Improvement Idea",
    "Expectations",
    "Status",
    "Created At",
    "Work Links",
  ];
  const rows = data.map((item) =>
    [
      item.name,
      item.department,
      item.phone,
      item.email,
      item.domain,
      item.improvement_idea,
      item.expectations,
      item.status,
      item.created_at,
      (item.work_links || []).map((link: { url: string }) => link.url).join(" | "),
    ].map(toCsvCell).join(","),
  );

  return new Response([header.map(toCsvCell).join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=aws-club-applications.csv",
    },
  });
}
