"use client";

import { useState } from "react";
import { generateGovernanceReportData } from "../lib/governance-report-data";
import { EsgPolicy, Audit, ComplianceIssue } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Filter } from "lucide-react";

interface GovernanceReportProps {
  policies: EsgPolicy[];
  audits: Audit[];
  issues: ComplianceIssue[];
}

export default function GovernanceReport({
  policies,
  audits,
  issues,
}: GovernanceReportProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const options = {
    severity: severityFilter !== "all" ? severityFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    startDate: dateStart ? new Date(dateStart) : undefined,
    endDate: dateEnd ? new Date(dateEnd) : undefined,
  };

  const { issues: filteredIssues, summary } = generateGovernanceReportData(
    policies,
    audits,
    issues,
    options
  );

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div>
              <CardTitle className="text-sm font-bold">Governance Disclosures Statement</CardTitle>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                Generate disclosures reports for risk logs, internal audits and policy compliance metrics.
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Filters Panel */}
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-100 dark:border-neutral-850 grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Risk Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-250 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Issue Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-250 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All States</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Start Date
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-255 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              End Date
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-255 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
            />
          </div>
        </div>

        {/* Audit Disclosure Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Total Issues Logged
            </span>
            <span className="text-xl font-black text-neutral-800 dark:text-neutral-100 block mt-1.5">
              {summary.totalIssues} issues
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Life cycle logs</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Open Issues
            </span>
            <span className="text-xl font-black text-amber-500 block mt-1.5">
              {summary.openCount} open
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Remediation pending</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Overdue Open Items
            </span>
            <span className={`text-xl font-black block mt-1.5 ${summary.overdueCount > 0 ? "text-rose-600" : "text-neutral-500"}`}>
              {summary.overdueCount} issues
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Past target date</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Resolved Discrepancies
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-1.5">
              {summary.resolvedCount} resolved
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Remediation verified</span>
          </div>
        </div>

        {/* Disclosed transactions summary table */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Disclosed Compliance Issue Logs ({filteredIssues.length})
            </span>
          </div>
          <div className="divide-y divide-neutral-150 dark:divide-neutral-850">
            {filteredIssues.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                No logs matching selected audit parameters.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue.id} className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-neutral-50/50">
                  <div>
                    <span className="font-bold text-neutral-855 dark:text-neutral-200 block">
                      {issue.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Target Due: {new Date(issue.dueDate).toLocaleDateString()} | Severity: <b className="uppercase">{issue.severity}</b> | Status: <b className="uppercase">{issue.status}</b>
                    </span>
                  </div>
                  <span className={`font-bold uppercase text-[10px] ${issue.status === "resolved" ? "text-emerald-600" : "text-amber-500"}`}>
                    {issue.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
