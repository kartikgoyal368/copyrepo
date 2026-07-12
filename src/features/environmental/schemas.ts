import { z } from "zod";

export const emissionFactorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  value: z.coerce.number().positive("Value must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
});

export const environmentalGoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  targetValue: z.coerce.number().positive("Target value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  deadline: z.string().or(z.date()),
  departmentId: z.coerce.number({ required_error: "Department is required" }),
});

export const carbonTransactionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["offset", "emission"]),
  departmentId: z.coerce.number({ required_error: "Department is required" }),
  date: z.string().or(z.date()).optional(),
  proofUrl: z.string().optional(),
});
