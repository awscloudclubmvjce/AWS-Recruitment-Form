import type { Application } from "@/types/database";

export const demoAdminToken = "demo-local-admin";

export function isDemoAdminEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ENABLE_DEMO_ADMIN === "true";
}

export const demoApplications: Application[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Maya Haddad",
    department: "Computer Science",
    phone: "+962 790000001",
    email: "maya@example.com",
    domain: "TECH",
    improvement_idea:
      "I would create a small project lab where members ship one useful AWS-based prototype every month and document what they learned.",
    expectations:
      "I expect practical learning, mentorship, and a group that pushes me to build instead of only watching tutorials.",
    status: "SHORTLISTED",
    admin_notes: "Strong builder profile. Ask about teamwork experience.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    work_links: [
      {
        id: "21111111-1111-4111-8111-111111111111",
        application_id: "11111111-1111-4111-8111-111111111111",
        url: "https://github.com/example/cloud-notes",
        created_at: new Date().toISOString(),
      },
      {
        id: "21111111-1111-4111-8111-111111111112",
        application_id: "11111111-1111-4111-8111-111111111111",
        url: "https://portfolio.example.com",
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "12222222-2222-4222-8222-222222222222",
    name: "Omar Saleh",
    department: "Marketing",
    phone: "+962 790000002",
    email: "omar@example.com",
    domain: "PR",
    improvement_idea:
      "I would improve the club's public presence with weekly member spotlights and clearer event communication.",
    expectations:
      "I want to learn how to organize campaigns, collaborate with technical members, and represent the club well.",
    status: "NEW",
    admin_notes: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    work_links: [
      {
        id: "22222222-2222-4222-8222-222222222222",
        application_id: "12222222-2222-4222-8222-222222222222",
        url: "https://linkedin.com/in/example",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
];
