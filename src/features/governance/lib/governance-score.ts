import { ComplianceIssue, Audit } from "../types";
import { getComplianceRate } from "./compliance-status";

export function calculateGovernanceScore(
  issues: ComplianceIssue[],
  audits: Audit[]
): number {
  // 1. Issue Resolution Rate (70% weight)
  const complianceRate = getComplianceRate(issues);

  // 2. Audit Completion (30% weight)
  let auditScore = 0;
  if (audits.length > 0) {
    const completed = audits.filter((a) => a.status === "completed").length;
    auditScore = (completed / audits.length) * 100;
  } else {
    auditScore = 80; // Default baseline if no audits
  }

  const overall = complianceRate * 0.7 + auditScore * 0.3;
  return Math.round(overall * 10) / 10;
}
