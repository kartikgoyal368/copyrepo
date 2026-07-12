import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf, Award, BarChart3, TrendingDown } from "lucide-react";
import { CarbonTransaction, EnvironmentalGoal, EmissionFactor } from "../types";

interface EnvironmentalKPIsProps {
  transactions: CarbonTransaction[];
  goals: EnvironmentalGoal[];
  factors: EmissionFactor[];
}

export default function EnvironmentalKPIsPanel({
  transactions,
  goals,
  factors,
}: EnvironmentalKPIsProps) {
  // Compute metrics
  let totalEmissionsKg = 0;
  let totalOffsetsKg = 0;

  transactions.forEach((tx) => {
    if (tx.type === "emission") {
      totalEmissionsKg += tx.amount;
    } else {
      totalOffsetsKg += tx.amount;
    }
  });

  const grossEmissionsTonnes = Math.round((totalEmissionsKg / 1000) * 10) / 10;
  const grossOffsetsTonnes = Math.round((totalOffsetsKg / 1000) * 10) / 10;
  const netEmissionsTonnes = Math.round(((totalEmissionsKg - totalOffsetsKg) / 1000) * 10) / 10;

  const totalGoals = goals.length;
  const achievedGoals = goals.filter((g) => g.status === "achieved" || g.currentValue >= g.targetValue).length;
  const goalAchievementRate = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

  const kpis = [
    {
      title: "Gross Emissions",
      value: `${grossEmissionsTonnes} t`,
      unit: "CO2e output",
      icon: Leaf,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      title: "Carbon Offsets",
      value: `${grossOffsetsTonnes} t`,
      unit: "CO2e mitigated",
      icon: TrendingDown,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Net Footprint",
      value: `${netEmissionsTonnes} t`,
      unit: "Net CO2e load",
      icon: BarChart3,
      color: netEmissionsTonnes <= 0 ? "text-emerald-600" : "text-amber-500",
      bg: netEmissionsTonnes <= 0 ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Reduction Goals",
      value: `${goalAchievementRate}%`,
      unit: `${achievedGoals} of ${totalGoals} target(s)`,
      icon: Award,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
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
