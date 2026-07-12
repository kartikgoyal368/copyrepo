import {
  esgPolicies,
  policyAcknowledgements,
  audits,
  complianceIssues,
} from "@/server/db/schema";

export type EsgPolicy = typeof esgPolicies.$inferSelect;
export type PolicyAcknowledgement = typeof policyAcknowledgements.$inferSelect;
export type Audit = typeof audits.$inferSelect;
export type ComplianceIssue = typeof complianceIssues.$inferSelect;

export interface GovernanceKPIs {
  activePoliciesCount: number;
  acknowledgementRate: number;
  completedAuditsCount: number;
  openIssuesCount: number;
  overdueIssuesCount: number;
}
