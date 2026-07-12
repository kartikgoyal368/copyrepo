import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, ShieldCheck, Heart } from "lucide-react";
import { EmployeeParticipation, TrainingCompletion, DiversityMetric } from "../types";

interface KPIsProps {
  participations: EmployeeParticipation[];
  training: TrainingCompletion[];
  diversity: DiversityMetric[];
}

export default function SocialKPIsPanel({
  participations,
  training,
  diversity,
}: KPIsProps) {
  // 1. Volunteer Hours
  const volunteerHours = participations.reduce(
    (acc, p) => (p.status === "approved" ? acc + p.hoursLogged : acc),
    0
  );

  // 2. CSR Initiatives (Count unique active IDs)
  const uniqueActivities = new Set(participations.map((p) => p.csrActivityId)).size;

  // 3. Training Completion
  const completedTrainingCount = training.filter((t) => t.status === "completed").length;
  const trainingRate = training.length > 0 ? Math.round((completedTrainingCount / training.length) * 100) : 0;

  // 4. Diversity index
  const diversityPct = diversity[0]?.diversityPercentage || 35.0;

  const kpis = [
    {
      title: "Volunteer Hours",
      value: `${volunteerHours} hrs`,
      unit: "Community service logged",
      icon: Clock,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Active Campaigns",
      value: String(uniqueActivities || 1),
      unit: "CSR initiatives logged",
      icon: Calendar,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      title: "Training Completed",
      value: `${trainingRate}%`,
      unit: `${completedTrainingCount} of ${training.length} staff members`,
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Diversity Score",
      value: `${diversityPct}%`,
      unit: "Inclusion index rating",
      icon: Heart,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/20",
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
