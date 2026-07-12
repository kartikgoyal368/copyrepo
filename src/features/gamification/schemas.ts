import { z } from "zod";

export const challengeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  points: z.coerce.number().nonnegative(),
  xp: z.coerce.number().nonnegative(),
  status: z.enum(["draft", "active", "under_review", "completed", "archived"]).default("draft"),
  evidenceRequired: z.boolean().default(true),
});

export const challengeParticipationSchema = z.object({
  challengeId: z.coerce.number(),
  progress: z.coerce.number().min(0).max(100).default(0),
  proofUrl: z.string().optional(),
});
