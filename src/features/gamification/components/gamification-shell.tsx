"use client";

import { useState } from "react";
import PageShell from "@/components/shell/page-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GamificationKPIsPanel from "./gamification-kpis";
import Leaderboard from "./leaderboard";
import DepartmentLeaderboard from "./department-leaderboard";
import RewardCatalog from "./reward-catalog";
import BadgeGrid from "./badge-grid";
import ChallengeTable from "./challenge-table";
import ChallengeForm from "./challenge-form";
import ChallengeProgressTable from "./challenge-progress-table";
import ChallengeParticipationForm from "./challenge-participation-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Star, Sparkles, Award } from "lucide-react";
import { getLevelFromXp } from "../lib/xp-score";
import { Progress } from "@/components/ui/progress";
import { Challenge, ChallengeParticipation, Reward, RewardRedemption, Badge } from "../types";

interface GamificationShellProps {
  challenges: Challenge[];
  participations: ChallengeParticipation[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  badges: Badge[];
  userLeaderboard: any[];
  deptLeaderboard: any[];
  currentUser: { id: string; name: string | null; email: string; role: string; pointsBalance: number; xpTotal: number };
}

export default function GamificationShell({
  challenges,
  participations,
  rewards,
  redemptions,
  badges,
  userLeaderboard,
  deptLeaderboard,
  currentUser,
}: GamificationShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [localChallenges, setLocalChallenges] = useState<Challenge[]>(challenges);
  const [localParticipations, setLocalParticipations] = useState<ChallengeParticipation[]>(participations);
  const [localRewards, setLocalRewards] = useState<Reward[]>(rewards);
  const [pointsBalance, setPointsBalance] = useState(currentUser.pointsBalance);

  const { level, nextLevelXp, progress: xpProgress } = getLevelFromXp(currentUser.xpTotal);
  const isAuthorized = currentUser.role === "admin" || currentUser.role === "manager";

  return (
    <PageShell
      title="Engagement & Gamification Hub"
      description="Earn points and experience points (XP) by participating in sustainability campaigns. Redeem points for rewards and unlock badges."
    >
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* KPI Panel and Tabs (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <GamificationKPIsPanel
            participations={localParticipations}
            redemptions={redemptions}
            challenges={localChallenges}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Leaderboards</TabsTrigger>
              <TabsTrigger value="challenges">Campaign Challenges</TabsTrigger>
              <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
              <TabsTrigger value="badges">Badges Inventory</TabsTrigger>
            </TabsList>

            {/* Leaderboard overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Leaderboard leaderboard={userLeaderboard} currentUserId={currentUser.id} />
                <DepartmentLeaderboard leaderboard={deptLeaderboard} />
              </div>
            </TabsContent>

            {/* Challenges */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Active Sustainability Campaigns
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Join active challenges, submit logs and earn point rewards.
                  </p>
                </div>
                <div className="flex gap-2">
                  <ChallengeParticipationForm
                    challenges={localChallenges}
                    participations={localParticipations}
                    onSuccess={(newPart) => {
                      setLocalParticipations((prev) => [newPart, ...prev]);
                    }}
                  />
                  {isAuthorized && (
                    <ChallengeForm
                      onSuccess={(newChal) => {
                        setLocalChallenges((prev) => [newChal, ...prev]);
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block mb-3">
                    Available Challenges
                  </span>
                  <ChallengeTable
                    challenges={localChallenges}
                    participations={localParticipations}
                    onJoined={(newPart) => {
                      setLocalParticipations((prev) => [newPart, ...prev]);
                    }}
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-neutral-455 uppercase tracking-wider block mb-3">
                    My Progress Logs
                  </span>
                  <ChallengeProgressTable
                    participations={localParticipations}
                    currentUser={currentUser}
                    onProgressUpdated={(partId, progress, proofUrl) => {
                      setLocalParticipations((prev) =>
                        prev.map((p) => (p.id === partId ? { ...p, progress, proofUrl } : p))
                      );
                    }}
                    onApproved={(partId, status) => {
                      setLocalParticipations((prev) =>
                        prev.map((p) => (p.id === partId ? { ...p, status } : p))
                      );
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Rewards */}
            <TabsContent value="rewards" className="space-y-6">
              <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-neutral-850 dark:text-neutral-100">
                      Claim Sustainability Rewards
                    </span>
                    <span className="block text-[11px] text-neutral-500 mt-0.5">
                      Redeem eco-friendly incentives using your earned points.
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider block">
                    Points Balance
                  </span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {pointsBalance} pts
                  </span>
                </div>
              </div>

              <RewardCatalog
                rewards={localRewards}
                userPoints={pointsBalance}
                onRedeemed={(rewardId, pointsCost) => {
                  setPointsBalance((p) => p - pointsCost);
                  setLocalRewards((prev) =>
                    prev.map((r) => (r.id === rewardId ? { ...r, stock: r.stock - 1 } : r))
                  );
                }}
              />
            </TabsContent>

            {/* Badges Grid */}
            <TabsContent value="badges" className="space-y-6">
              <BadgeGrid badges={badges} redemptions={redemptions} participations={localParticipations} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Level Stats and details (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-2 border-emerald-500/20 shadow-md">
            <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Employee Level Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                {/* Level Circle */}
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 flex flex-col items-center justify-center bg-emerald-500/5 shadow-inner">
                  <span className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                    Lvl {level}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white dark:border-neutral-900 shadow">
                  <Star className="w-4 h-4 fill-white" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-500">XP Progress</span>
                  <span>
                    {currentUser.xpTotal} / {nextLevelXp} XP
                  </span>
                </div>
                <Progress value={xpProgress} />
                <span className="block text-[9px] text-neutral-450 font-medium text-center">
                  Earn {nextLevelXp - currentUser.xpTotal} more XP to reach Level {level + 1}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
