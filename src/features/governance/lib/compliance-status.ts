import { ComplianceIssue } from "../types";

export function getComplianceRate(issues: ComplianceIssue[]) {
  const total = issues.length;
  if (total === 0) return 100;
  const resolved = issues.filter((i) => i.status === "resolved").length;
  return Math.round((resolved / total) * 100);
}

export function getComplianceRiskGrade(issues: ComplianceIssue[]): "low" | "medium" | "high" {
  const openIssues = issues.filter((i) => i.status === "open");
  const criticalOrHigh = openIssues.filter((i) => i.severity === "critical" || i.severity === "high").length;
  
  if (criticalOrHigh > 0) return "high";
  if (openIssues.length > 2) return "medium";
  return "low";
}
