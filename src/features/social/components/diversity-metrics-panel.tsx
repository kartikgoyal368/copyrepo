import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DiversityMetric } from "../types";
import { Users, Info, Heart, ArrowUpRight } from "lucide-react";

interface PanelProps {
  metrics: DiversityMetric[];
}

export default function DiversityMetricsPanel({ metrics }: PanelProps) {
  const metric = metrics[0] || {
    genderRatio: "50:50",
    diversityPercentage: 35.0,
    ageDistribution: JSON.stringify({ "18-25": 10, "26-35": 40, "36-50": 35, "50+": 15 }),
    period: "2026",
  };

  const ageData = JSON.parse(metric.ageDistribution);

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-sm font-bold">Organizational Diversity Indicators</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
        {/* Minority inclusion */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Workforce Minority Inclusion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-neutral-900 dark:text-white">
              {metric.diversityPercentage}%
            </span>
            <span className="text-xs text-neutral-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              +1.2% YOY
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 leading-normal">
            Reflects overall percentage representation of veteran, minority and disabled groups across corporate branches.
          </p>
        </div>

        {/* Gender diversity */}
        <div className="space-y-4 border-l border-neutral-100 dark:border-neutral-800 pl-0 md:pl-6">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Gender Representation (M:F)
          </span>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-neutral-800 dark:text-neutral-100">
              {metric.genderRatio}
            </span>
            <div className="flex gap-1 items-center bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200/50">
              <Heart className="w-3 h-3 text-emerald-500 shrink-0" />
              Equal Opportunities
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 leading-normal">
            Male to Female staff counts. Excludes executive suite board allocations.
          </p>
        </div>

        {/* Age distribution */}
        <div className="space-y-3.5 border-l border-neutral-100 dark:border-neutral-800 pl-0 md:pl-6">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Age Demographic Spread
          </span>
          <div className="space-y-2 text-xs">
            {Object.entries(ageData).map(([range, val]) => (
              <div key={range} className="flex justify-between items-center font-medium">
                <span className="text-neutral-500">{range} years</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-neutral-100 dark:bg-neutral-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 dark:bg-emerald-500 h-1.5" style={{ width: `${val}%` }} />
                  </div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{val as number}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
