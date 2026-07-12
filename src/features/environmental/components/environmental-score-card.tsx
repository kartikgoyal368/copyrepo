import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateEnvironmentalScore } from "../lib/environmental-score";
import { getEsgGrade, getScoreBg } from "@/lib/scoring";
import { CarbonTransaction, EnvironmentalGoal } from "../types";
import { Award, Leaf, Zap } from "lucide-react";

interface EnvironmentalScoreCardProps {
  goals: EnvironmentalGoal[];
  transactions: CarbonTransaction[];
}

export default function EnvironmentalScoreCard({
  goals,
  transactions,
}: EnvironmentalScoreCardProps) {
  const score = calculateEnvironmentalScore(goals, transactions);
  const grade = getEsgGrade(score);
  const badgeClass = getScoreBg(score);

  return (
    <Card className="overflow-hidden border-2 border-emerald-500/20 shadow-md">
      <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Environmental Index
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 text-center space-y-5">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            E-Score Rating
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
              <Award className="w-3.5 h-3.5 text-neutral-400" />
              <span>Goal Reduction Rate</span>
            </div>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">
              {goals.length > 0
                ? `${Math.round(
                    (goals.filter((g) => g.status === "achieved" || g.currentValue >= g.targetValue).length /
                      goals.length) *
                      100
                  )}%`
                : "80%"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
              <Zap className="w-3.5 h-3.5 text-neutral-400" />
              <span>Emissions Mitigation</span>
            </div>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">
              {transactions.length > 0 ? "Active" : "Baseline"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
