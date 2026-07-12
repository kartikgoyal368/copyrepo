import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateGovernanceScore } from "../lib/governance-score";
import { getEsgGrade, getScoreBg } from "@/lib/scoring";
import { ComplianceIssue, Audit } from "../types";
import { Scale, CheckCircle2, ShieldCheck } from "lucide-react";

interface ScoreCardProps {
  issues: ComplianceIssue[];
  audits: Audit[];
}

export default function GovernanceScoreCard({
  issues,
  audits,
}: ScoreCardProps) {
  const score = calculateGovernanceScore(issues, audits);
  const grade = getEsgGrade(score);
  const badgeClass = getScoreBg(score);

  return (
    <Card className="overflow-hidden border-2 border-emerald-500/20 shadow-md">
      <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600" />
          <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Governance Index
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 text-center space-y-5">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            G-Score Rating
          </span>
          <div className="flex justify-center items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-sm font-semibold text-neutral-400">/ 100</span>
          </div>
        </div>

        <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-extrabold ${badgeClass}`}>
          Grade: {grade}
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 text-left space-y-2.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Score Breakdown
          </span>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Issues Remediation Rate</span>
            </div>
            <span className="font-bold text-neutral-850 dark:text-neutral-200">
              {issues.length > 0
                ? `${Math.round(
                    (issues.filter((i) => i.status === "resolved").length / issues.length) * 100
                  )}%`
                : "100%"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Audits Disclosed Rate</span>
            </div>
            <span className="font-bold text-neutral-855 dark:text-neutral-200">
              {audits.length > 0
                ? `${Math.round((audits.filter((a) => a.status === "completed").length / audits.length) * 100)}%`
                : "100%"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
