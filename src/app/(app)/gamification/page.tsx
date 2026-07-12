import { requireUser } from "@/server/auth/session";
import {
  getChallenges,
  getChallengeParticipations,
  getRewards,
  getRewardRedemptions,
  getBadges,
  getUserLeaderboard,
  getDepartmentLeaderboard,
} from "@/features/gamification/queries";
import GamificationShell from "@/features/gamification/components/gamification-shell";

export default async function GamificationPage() {
  const user = await requireUser();
  const [
    challenges,
    participations,
    rewards,
    redemptions,
    badges,
    userLeaderboard,
    deptLeaderboard,
  ] = await Promise.all([
    getChallenges(),
    getChallengeParticipations(),
    getRewards(),
    getRewardRedemptions(),
    getBadges(),
    getUserLeaderboard(),
    getDepartmentLeaderboard(),
  ]);

  const currentUser = {
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    role: user.role,
    pointsBalance: user.pointsBalance ?? 0,
    xpTotal: user.xpTotal ?? 0,
  };

  return (
    <GamificationShell
      challenges={challenges}
      participations={participations}
      rewards={rewards}
      redemptions={redemptions}
      badges={badges}
      userLeaderboard={userLeaderboard}
      deptLeaderboard={deptLeaderboard}
      currentUser={currentUser}
    />
  );
}
