import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Gift, CheckSquare, Sparkles } from "lucide-react";
import { ChallengeParticipation, RewardRedemption, Challenge } from "../types";

interface KPIsProps {
  participations: ChallengeParticipation[];
  redemptions: RewardRedemption[];
  challenges: Challenge[];
}

export default function GamificationKPIsPanel({
  participations,
  redemptions,
  challenges,
}: KPIsProps) {
  const activeEnrolled = participations.filter((p) => p.status === "active").length;
  const completedEnrolled = participations.filter((p) => p.status === "completed").length;

  const totalPointsAwarded = participations.reduce(
    (acc, p) => (p.status === "completed" ? acc + p.pointsAwarded : acc),
    0
  );

  const totalPointsSpent = redemptions.reduce((acc, r) => acc + r.pointsDeducted, 0);

  const kpis = [
    {
      title: "Active Enrollments",
      value: String(activeEnrolled),
      unit: "Campaigns in progress",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Completed Campaigns",
      value: String(completedEnrolled),
      unit: "Challenges accomplished",
      icon: CheckSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Points Earned",
      value: `${totalPointsAwarded} pts`,
      unit: "Campaign points total",
      icon: Sparkles,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Redeemed Prizes",
      value: String(redemptions.length),
      unit: `${totalPointsSpent} points spent`,
      icon: Gift,
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
