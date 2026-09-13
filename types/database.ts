export type Domain = "TECH" | "PR";

export type ApplicationStatus =
  | "NEW"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export type WorkLink = {
  id: string;
  application_id: string;
  url: string;
  created_at: string;
};

export type Application = {
  id: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  domain: Domain;
  improvement_idea: string;
  expectations: string;
  status: ApplicationStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  work_links?: WorkLink[];
};
