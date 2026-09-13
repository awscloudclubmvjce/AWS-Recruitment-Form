import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/supabase/admin";
import { demoApplications } from "@/lib/demo-admin";
import { adminUpdateSchema } from "@/lib/validations/application";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin(request.headers.get("authorization"));
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const { id } = await params;
  if (admin.demo) {
    const application = demoApplications.find((item) => item.id === id);
    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }
    return NextResponse.json({ data: application });
  }

  const { data, error } = await admin.service
    .from("applications")
    .select("*, work_links(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin(request.headers.get("authorization"));
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const json = await request.json().catch(() => null);
  const parsed = adminUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status or notes." }, { status: 400 });
  }

  const { id } = await params;
  if (admin.demo) {
    const application = demoApplications.find((item) => item.id === id);
    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }
    return NextResponse.json({
      data: {
        ...application,
        status: parsed.data.status,
        admin_notes: parsed.data.adminNotes || null,
        updated_at: new Date().toISOString(),
      },
    });
  }

  const { data, error } = await admin.service
    .from("applications")
    .update({
      status: parsed.data.status,
      admin_notes: parsed.data.adminNotes || null,
    })
    .eq("id", id)
    .select("*, work_links(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not update application." }, { status: 500 });
  }

  return NextResponse.json({ data });
}
