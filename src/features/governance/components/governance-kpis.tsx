import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ShieldAlert, Award, FileText } from "lucide-react";
import { ComplianceIssue, Audit, EsgPolicy } from "../types";
import { getComplianceRate } from "../lib/compliance-status";
import { getOverdueIssues } from "../lib/overdue-issues";

interface KPIsProps {
  issues: ComplianceIssue[];
  audits: Audit[];
  policies: EsgPolicy[];
}

export default function GovernanceKPIsPanel({
  issues,
  audits,
  policies,
}: KPIsProps) {
  const activePolicies = policies.length;
  
  // Audits Completed count
  const completedAudits = audits.filter((a) => a.status === "completed").length;

  // Open Issues count
  const openIssues = issues.filter((i) => i.status === "open").length;

  // Overdue issues count
  const overdueIssues = getOverdueIssues(issues).length;

  // Compliance Rate
  const complianceRate = getComplianceRate(issues);

  const kpis = [
    {
      title: "Active Policies",
      value: String(activePolicies),
      unit: "Registered charters",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Compliance Rate",
      value: `${complianceRate}%`,
      unit: "Resolved issues index",
      icon: Award,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Open Issues",
      value: String(openIssues),
      unit: `${overdueIssues} past due deadline`,
      icon: ShieldAlert,
      color: overdueIssues > 0 ? "text-rose-500" : "text-amber-500",
      bg: overdueIssues > 0 ? "bg-rose-50 dark:bg-rose-950/20" : "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Audits Completed",
      value: String(completedAudits),
      unit: "Disclosed reports log",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg}`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <span className="block text-lg font-extrabold text-neutral-900 dark:text-white leading-tight mt-0.5">
                  {kpi.value}
                </span>
                <span className="block text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                  {kpi.unit}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
