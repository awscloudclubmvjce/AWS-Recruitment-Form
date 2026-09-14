import { z } from "zod";
import { applicationStatuses } from "@/lib/config";

const dangerousProtocols = new Set(["javascript:", "data:", "vbscript:"]);

export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (dangerousProtocols.has(url.protocol.toLowerCase())) {
    throw new Error("Unsafe URL protocol");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https links are allowed");
  }
  return url.toString();
}

const urlSchema = z
  .string()
  .trim()
  .min(1, "Add a link or remove this field.")
  .transform((value, ctx) => {
    try {
      return normalizeUrl(value);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid http or https URL.",
      });
      return z.NEVER;
    }
  });

export const workLinkItemSchema = z.object({
  url: urlSchema,
  description: z
    .string()
    .trim()
    .max(1000, "Keep explanation under 1000 characters.")
    .optional()
    .default(""),
});

export const applicationSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name."),
  department: z.string().trim().min(1, "Department is required."),
  usn: z.string().trim().min(1, "USN is required."),
  phone: z.string().trim().min(1, "Phone number is required."),
  email: z.email("Use a valid email address.").trim().toLowerCase(),
  domain: z.enum(["TECH", "PR"], "Pick one domain."),
  workLinks: z.array(workLinkItemSchema).min(1, "Add at least one work link."),
  improvementIdea: z
    .string()
    .trim()
    .min(1, "Share one idea with us.")
    .max(1000, "Keep it under 1000 characters."),
  expectations: z
    .string()
    .trim()
    .min(1, "Tell us what you expect.")
    .max(1000, "Keep it under 1000 characters."),
});

export const adminUpdateSchema = z.object({
  status: z.enum(applicationStatuses),
  adminNotes: z.string().trim().max(3000).optional().nullable(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type WorkLinkInput = z.infer<typeof workLinkItemSchema>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>;
