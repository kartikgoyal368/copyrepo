import { EsgPolicy, Audit, ComplianceIssue } from "../types";
import { isIssueOverdue } from "./overdue-issues";

export interface GovernanceReportOptions {
  severity?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export function generateGovernanceReportData(
  policies: EsgPolicy[],
  audits: Audit[],
  issues: ComplianceIssue[],
  options: GovernanceReportOptions = {}
) {
  let filteredIssues = [...issues];

  if (options.severity && options.severity !== "all") {
    filteredIssues = filteredIssues.filter((i) => i.severity === options.severity);
  }

  if (options.status && options.status !== "all") {
    filteredIssues = filteredIssues.filter((i) => i.status === options.status);
  }

  if (options.startDate) {
    const start = new Date(options.startDate).getTime();
    filteredIssues = filteredIssues.filter((i) => new Date(i.createdAt).getTime() >= start);
  }

  if (options.endDate) {
    const end = new Date(options.endDate).getTime();
    filteredIssues = filteredIssues.filter((i) => new Date(i.createdAt).getTime() <= end);
  }

  const openIssues = filteredIssues.filter((i) => i.status === "open");
  const overdueCount = openIssues.filter(isIssueOverdue).length;

  return {
    policies,
    audits,
    issues: filteredIssues,
    summary: {
      totalIssues: filteredIssues.length,
      openCount: openIssues.length,
      resolvedCount: filteredIssues.filter((i) => i.status === "resolved").length,
      overdueCount,
      completedAudits: audits.filter((a) => a.status === "completed").length,
    },
  };
}
