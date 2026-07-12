import { pgTable, serial, text, integer, timestamp, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users, departments } from "./shared";

export const csrActivities = pgTable("csr_activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  evidenceRequired: boolean("evidence_required").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const employeeParticipations = pgTable("employee_participations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  csrActivityId: integer("csr_activity_id").notNull().references(() => csrActivities.id, { onDelete: "cascade" }),
  hoursLogged: doublePrecision("hours_logged").notNull().default(0),
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  proofUrl: text("proof_url"),
  remarks: text("remarks"),
  approvedById: text("approved_by_id").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const diversityMetrics = pgTable("diversity_metrics", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "cascade" }),
  genderRatio: text("gender_ratio").notNull(), // e.g. "45:55"
  diversityPercentage: doublePrecision("diversity_percentage").notNull().default(0), // minority %
  ageDistribution: text("age_distribution").notNull(), // JSON string representing age ranges
  period: text("period").notNull(), // e.g. '2026'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trainingCompletions = pgTable("training_completions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  trainingName: text("training_name").notNull(),
  completionDate: timestamp("completion_date").notNull(),
  status: text("status").notNull().default("completed"), // 'completed' | 'pending'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const csrActivitiesRelations = relations(csrActivities, ({ many }) => ({
  participations: many(employeeParticipations),
}));

export const employeeParticipationsRelations = relations(employeeParticipations, ({ one }) => ({
  user: one(users, {
    fields: [employeeParticipations.userId],
    references: [users.id],
    relationName: "employeeParticipationUser",
  }),
  csrActivity: one(csrActivities, {
    fields: [employeeParticipations.csrActivityId],
    references: [csrActivities.id],
  }),
  approvedBy: one(users, {
    fields: [employeeParticipations.approvedById],
    references: [users.id],
    relationName: "employeeParticipationApprover",
  }),
}));

export const diversityMetricsRelations = relations(diversityMetrics, ({ one }) => ({
  department: one(departments, {
    fields: [diversityMetrics.departmentId],
    references: [departments.id],
  }),
}));

export const trainingCompletionsRelations = relations(trainingCompletions, ({ one }) => ({
  user: one(users, {
    fields: [trainingCompletions.userId],
    references: [users.id],
  }),
}));
