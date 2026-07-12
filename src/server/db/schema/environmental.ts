import { pgTable, serial, text, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "./shared";

export const emissionFactors = pgTable("emission_factors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'electricity', 'gas', 'fuel', 'waste'
  value: doublePrecision("value").notNull(), // e.g., 0.385 (kg CO2e/kWh)
  unit: text("unit").notNull(), // e.g., 'kg CO2e/kWh'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productEsgProfiles = pgTable("product_esg_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  carbonFootprint: doublePrecision("carbon_footprint").notNull(), // kg CO2e per unit
  recycledContent: doublePrecision("recycled_content").notNull(), // percentage (0 to 100)
  waterFootprint: doublePrecision("water_footprint").notNull(), // liters per unit
  certificationStatus: text("certification_status").notNull(), // 'Gold', 'Silver', 'Bronze', 'None'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const environmentalGoals = pgTable("environmental_goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  targetValue: doublePrecision("target_value").notNull(),
  currentValue: doublePrecision("current_value").notNull().default(0),
  unit: text("unit").notNull(), // e.g., 't CO2e'
  deadline: timestamp("deadline").notNull(),
  status: text("status").notNull().default("active"), // 'active' | 'achieved' | 'missed'
  departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const carbonTransactions = pgTable("carbon_transactions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: doublePrecision("amount").notNull(), // kg CO2e
  type: text("type").notNull(), // 'offset' | 'emission'
  departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  proofUrl: text("proof_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const departmentScores = pgTable("department_scores", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "cascade" }),
  environmentalScore: doublePrecision("environmental_score").notNull().default(0),
  socialScore: doublePrecision("social_score").notNull().default(0),
  governanceScore: doublePrecision("governance_score").notNull().default(0),
  overallScore: doublePrecision("overall_score").notNull().default(0),
  period: text("period").notNull(), // e.g., '2026-M07', '2026-Q2'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const environmentalGoalsRelations = relations(environmentalGoals, ({ one }) => ({
  department: one(departments, {
    fields: [environmentalGoals.departmentId],
    references: [departments.id],
  }),
}));

export const carbonTransactionsRelations = relations(carbonTransactions, ({ one }) => ({
  department: one(departments, {
    fields: [carbonTransactions.departmentId],
    references: [departments.id],
  }),
}));

export const departmentScoresRelations = relations(departmentScores, ({ one }) => ({
  department: one(departments, {
    fields: [departmentScores.departmentId],
    references: [departments.id],
  }),
}));
