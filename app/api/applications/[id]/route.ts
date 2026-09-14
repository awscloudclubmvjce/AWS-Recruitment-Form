import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { adminUpdateSchema } from "@/lib/validations/application";
import { getApplicationById, updateApplication } from "@/lib/supabase/services";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin(request.headers.get("authorization"));
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  return NextResponse.json({ data: application });
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
  const updated = await updateApplication(id, {
    status: parsed.data.status,
    adminNotes: parsed.data.adminNotes,
  });

  if (!updated) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
