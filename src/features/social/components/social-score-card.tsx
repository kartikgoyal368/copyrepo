import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateSocialScore } from "../lib/social-score";
import { getEsgGrade, getScoreBg } from "@/lib/scoring";
import { EmployeeParticipation, TrainingCompletion, DiversityMetric } from "../types";
import { Heart, Clock, Award } from "lucide-react";

interface ScoreCardProps {
  participations: EmployeeParticipation[];
  training: TrainingCompletion[];
  diversity: DiversityMetric[];
}

export default function SocialScoreCard({
  participations,
  training,
  diversity,
}: ScoreCardProps) {
  const score = calculateSocialScore(participations, training, diversity);
  const grade = getEsgGrade(score);
  const badgeClass = getScoreBg(score);

  return (
    <Card className="overflow-hidden border-2 border-emerald-500/20 shadow-md">
      <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-600" />
          <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Social Index
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 text-center space-y-5">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            S-Score Rating
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
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Volunteering Activity</span>
            </div>
            <span className="font-bold text-neutral-850 dark:text-neutral-200">
              {participations.filter((p) => p.status === "approved").length > 0 ? "Active" : "Baseline"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
              <Award className="w-3.5 h-3.5 text-neutral-400" />
              <span>Compliance Training</span>
            </div>
            <span className="font-bold text-neutral-855 dark:text-neutral-200">
              {training.length > 0
                ? `${Math.round((training.filter((t) => t.status === "completed").length / training.length) * 100)}%`
                : "80%"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
