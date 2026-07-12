import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./shared";

export const reportExports = pgTable("report_exports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  format: text("format").notNull(), // 'pdf' | 'excel' | 'csv'
  module: text("module").notNull(), // 'environmental' | 'social' | 'governance' | 'summary' | 'custom'
  filters: text("filters"), // JSON stringification of active filter states
  createdById: text("created_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportExportsRelations = relations(reportExports, ({ one }) => ({
  createdBy: one(users, {
    fields: [reportExports.createdById],
    references: [users.id],
  }),
}));
