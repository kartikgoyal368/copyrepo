import { Challenge, ChallengeParticipation, RewardRedemption } from "../types";

export interface GamificationReportOptions {
  challengeId?: number;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export function generateGamificationReportData(
  challenges: Challenge[],
  participations: ChallengeParticipation[],
  redemptions: RewardRedemption[],
  options: GamificationReportOptions = {}
) {
  let filteredParts = [...participations];
  let filteredRedemptions = [...redemptions];

  if (options.challengeId) {
    filteredParts = filteredParts.filter((p) => p.challengeId === options.challengeId);
  }

  if (options.userId) {
    filteredParts = filteredParts.filter((p) => p.userId === options.userId);
    filteredRedemptions = filteredRedemptions.filter((r) => r.userId === options.userId);
  }

  if (options.startDate) {
    const start = new Date(options.startDate).getTime();
    filteredParts = filteredParts.filter((p) => new Date(p.createdAt).getTime() >= start);
    filteredRedemptions = filteredRedemptions.filter((r) => new Date(r.redeemedAt).getTime() >= start);
  }

  if (options.endDate) {
    const end = new Date(options.endDate).getTime();
    filteredParts = filteredParts.filter((p) => new Date(p.createdAt).getTime() <= end);
    filteredRedemptions = filteredRedemptions.filter((r) => new Date(r.redeemedAt).getTime() <= end);
  }

  const completedCount = filteredParts.filter((p) => p.status === "completed").length;
  const activeCount = filteredParts.filter((p) => p.status === "active").length;
  const totalPointsRedeemed = filteredRedemptions.reduce((acc, r) => acc + r.pointsDeducted, 0);

  return {
    participations: filteredParts,
    redemptions: filteredRedemptions,
    summary: {
      totalParticipations: filteredParts.length,
      completedCount,
      activeCount,
      totalRedemptions: filteredRedemptions.length,
      totalPointsRedeemed,
    },
  };
}
