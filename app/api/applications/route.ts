import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { applicationSchema } from "@/lib/validations/application";
import { createApplication, getApplications } from "@/lib/supabase/services";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = applicationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Check the highlighted fields and try again." }, { status: 400 });
  }

  const result = await createApplication(parsed.data);

  if (result.conflict) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  if (!result.success || result.error) {
    return NextResponse.json({ error: result.error || "Failed to submit application." }, { status: 500 });
  }

  return NextResponse.json({ id: result.id }, { status: 201 });
}

export async function GET(request: Request) {
  const admin = await assertAdmin(request.headers.get("authorization"));
  if (!admin.ok) {
    return NextResponse.json({ error: admin.message }, { status: admin.status });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Math.min(Number(searchParams.get("pageSize") || "20"), 100);
  const search = searchParams.get("search") || undefined;
  const domain = searchParams.get("domain") || undefined;
  const status = searchParams.get("status") || undefined;
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  const { data, count, error } = await getApplications({
    page,
    pageSize,
    search,
    domain,
    status,
    sort,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
