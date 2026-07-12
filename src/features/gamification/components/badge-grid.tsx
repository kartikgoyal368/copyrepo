import { Badge, ChallengeParticipation, RewardRedemption } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { checkBadgeUnlockEligibility } from "../lib/badge-awards";
import { Lock, CheckCircle2, Flame, Award, Shield, Gift, Leaf } from "lucide-react";

interface GridProps {
  badges: Badge[];
  participations: ChallengeParticipation[];
  redemptions: RewardRedemption[];
}

export default function BadgeGrid({ badges, participations, redemptions }: GridProps) {
  // Simulate user achievements
  const userState = {
    loggedEmissionsCount: 1, // simulated emission logged
    offsetAmountTotal: 6000, // simulated offset > 5000
    policiesReadCount: 3, // simulated active policies read
    csrActivitiesCount: participations.filter((p) => p.status === "completed").length,
    redemptionsCount: redemptions.length,
  };

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const iconClass = `w-8 h-8 ${unlocked ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-600"}`;
    switch (iconName) {
      case "leaf":
        return <Leaf className={iconClass} />;
      case "shield":
        return <Shield className={iconClass} />;
      case "award":
        return <Award className={iconClass} />;
      case "flame":
        return <Flame className={iconClass} />;
      case "gift":
        return <Gift className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Earned Badges & Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-5 gap-6">
        {badges.map((badge) => {
          const unlocked = checkBadgeUnlockEligibility(userState, badge);

          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center relative ${
                unlocked
                  ? "bg-emerald-50/20 border-emerald-500/25 dark:bg-emerald-950/10 dark:border-emerald-900/30"
                  : "bg-neutral-50/50 border-neutral-200 dark:bg-neutral-900/10 dark:border-neutral-800/80 grayscale opacity-60"
              }`}
            >
              <div className="absolute top-2.5 right-2.5">
                {unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950/20" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                )}
              </div>

              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner ${
                unlocked ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-neutral-200/50 dark:bg-neutral-800"
              }`}>
                {getBadgeIcon(badge.iconUrl, unlocked)}
              </div>

              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100">{badge.name}</h4>
              <p className="text-[10px] text-neutral-500 leading-normal mt-1 max-w-[120px]">
                {badge.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
