import { z } from "zod";

export const esgPolicySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  version: z.string().default("1.0"),
  effectiveDate: z.string().or(z.date()),
});

export const auditSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  scope: z.string().min(3, "Scope is required"),
  auditorName: z.string().min(2, "Auditor name is required"),
  auditDate: z.string().or(z.date()),
  status: z.enum(["planned", "in_progress", "completed"]),
  findingsCount: z.coerce.number().nonnegative().default(0),
  rating: z.string().optional(),
  reportUrl: z.string().optional(),
});

export const complianceIssueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  ownerId: z.string().min(1, "Owner assignment is required"),
  dueDate: z.string().or(z.date()),
});
