import { ComplianceIssue } from "../types";

export function isIssueOverdue(issue: ComplianceIssue): boolean {
  if (issue.status === "resolved") return false;
  return new Date(issue.dueDate).getTime() < Date.now();
}

export function getOverdueIssues(issues: ComplianceIssue[]): ComplianceIssue[] {
  return issues.filter(isIssueOverdue);
}
