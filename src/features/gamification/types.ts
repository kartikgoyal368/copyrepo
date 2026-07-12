import {
  badges,
  rewards,
  challenges,
  challengeParticipations,
  rewardRedemptions,
} from "@/server/db/schema";

export type Badge = typeof badges.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type ChallengeParticipation = typeof challengeParticipations.$inferSelect;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;

export interface GamificationKPIs {
  totalPointsEarned: number;
  totalXpEarned: number;
  unlockedBadgesCount: number;
  redeemedRewardsCount: number;
  activeChallengesCount: number;
}
