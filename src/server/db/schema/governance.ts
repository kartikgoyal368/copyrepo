import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./shared";

export const esgPolicies = pgTable("esg_policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'environmental' | 'social' | 'governance'
  version: text("version").notNull().default("1.0"),
  effectiveDate: timestamp("effective_date").notNull(),
  reviewDate: timestamp("review_date"),
  createdById: text("created_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const policyAcknowledgements = pgTable("policy_acknowledgements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  policyId: integer("policy_id").notNull().references(() => esgPolicies.id, { onDelete: "cascade" }),
  acknowledgedAt: timestamp("acknowledged_at").defaultNow().notNull(),
});

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  scope: text("scope").notNull(),
  auditorName: text("auditor_name").notNull(),
  auditDate: timestamp("audit_date").notNull(),
  status: text("status").notNull().default("planned"), // 'planned' | 'in_progress' | 'completed'
  findingsCount: integer("findings_count").notNull().default(0),
  rating: text("rating"), // 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement'
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const complianceIssues = pgTable("compliance_issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  severity: text("severity").notNull(), // 'low' | 'medium' | 'high' | 'critical'
  status: text("status").notNull().default("open"), // 'open' | 'resolved'
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dueDate: timestamp("due_date").notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolvedById: text("resolved_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const esgPoliciesRelations = relations(esgPolicies, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [esgPolicies.createdById],
    references: [users.id],
  }),
  acknowledgements: many(policyAcknowledgements),
}));

export const policyAcknowledgementsRelations = relations(policyAcknowledgements, ({ one }) => ({
  user: one(users, {
    fields: [policyAcknowledgements.userId],
    references: [users.id],
  }),
  policy: one(esgPolicies, {
    fields: [policyAcknowledgements.policyId],
    references: [esgPolicies.id],
  }),
}));

export const complianceIssuesRelations = relations(complianceIssues, ({ one }) => ({
  owner: one(users, {
    fields: [complianceIssues.ownerId],
    references: [users.id],
    relationName: "complianceIssueOwner",
  }),
  resolvedBy: one(users, {
    fields: [complianceIssues.resolvedById],
    references: [users.id],
    relationName: "complianceIssueResolver",
  }),
}));
