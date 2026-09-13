import { NextResponse } from "next/server";
import { assertAdmin, createServiceClient } from "@/lib/supabase/admin";
import { demoApplications } from "@/lib/demo-admin";
import { applicationSchema } from "@/lib/validations/application";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = applicationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Check the highlighted fields and try again." }, { status: 400 });
  }

  const service = createServiceClient();
  const payload = parsed.data;

  const { data: existing } = await service
    .from("applications")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "An application with this email already exists. You're already in the queue." },
      { status: 409 },
    );
  }

  const { data: application, error } = await service
    .from("applications")
    .insert({
      name: payload.name,
      department: payload.department,
      phone: payload.phone,
      email: payload.email,
      domain: payload.domain,
      improvement_idea: payload.improvementIdea,
      expectations: payload.expectations,
    })
    .select("id")
    .single();

  if (error || !application) {
    const duplicate = error?.code === "23505";
    return NextResponse.json(
      {
        error: duplicate
          ? "An application with this email already exists. You're already in the queue."
          : "We could not save your application right now. Try again in a moment.",
      },
      { status: duplicate ? 409 : 500 },
    );
  }

  const { error: linkError } = await service.from("work_links").insert(
    payload.workLinks.map((url) => ({
      application_id: application.id,
      url,
    })),
  );

  if (linkError) {
    await service.from("applications").delete().eq("id", application.id);
    return NextResponse.json(
      { error: "We could not save your work links. Please check them and try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: application.id }, { status: 201 });
}

export async function GET(request: Request) {
  const admin = await assertAdmin(request.headers.get("authorization"));
  if (!admin.ok) {
    return NextResponse.json({ error: admin.message }, { status: admin.status });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Math.min(Number(searchParams.get("pageSize") || "20"), 100);
  const from = (Math.max(page, 1) - 1) * pageSize;
  const to = from + pageSize - 1;
  const search = searchParams.get("search")?.trim().toLowerCase();
  const domain = searchParams.get("domain");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  if (admin.demo) {
    const filtered = demoApplications
      .filter((item) => !search || item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search))
      .filter((item) => !domain || item.domain === domain)
      .filter((item) => !status || item.status === status)
      .sort((a, b) =>
        sort === "oldest"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    return NextResponse.json({ data: filtered.slice(from, to + 1), count: filtered.length });
  }

  let query = admin.service
    .from("applications")
    .select("*, work_links(*)", { count: "exact" });

  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  if (domain && ["TECH", "PR"].includes(domain)) query = query.eq("domain", domain);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query
    .order("created_at", { ascending: sort === "oldest" })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: "Could not load applications." }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
