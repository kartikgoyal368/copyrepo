import { z } from "zod";

export const csrActivitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string().or(z.date()),
  location: z.string().min(2, "Location is required"),
  points: z.coerce.number().nonnegative(),
  xp: z.coerce.number().nonnegative(),
  evidenceRequired: z.boolean().default(true),
});

export const participationSchema = z.object({
  csrActivityId: z.coerce.number(),
  hoursLogged: z.coerce.number().positive("Hours logged must be positive"),
  proofUrl: z.string().optional(),
  remarks: z.string().optional(),
});
