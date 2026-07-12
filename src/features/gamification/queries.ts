import { db } from "@/server/db/client";
import {
  badges,
  rewards,
  challenges,
  challengeParticipations,
  rewardRedemptions,
  users,
  departments,
  departmentScores,
} from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  MOCK_BADGES,
  MOCK_REWARDS,
  MOCK_CHALLENGES,
  MOCK_CHALLENGE_PARTICIPATIONS,
  MOCK_REDEMPTIONS,
  MOCK_USER_LEADERBOARD,
  MOCK_DEPARTMENT_LEADERBOARD,
} from "./demo-data";

export async function getBadges() {
  try {
    const result = await db.select().from(badges).orderBy(badges.name);
    return result.length > 0 ? result : MOCK_BADGES;
  } catch (error) {
    console.warn("getBadges query failed, using mock data:", error);
    return MOCK_BADGES;
  }
}

export async function getRewards() {
  try {
    const result = await db.select().from(rewards).orderBy(desc(rewards.pointsCost));
    return result.length > 0 ? result : MOCK_REWARDS;
  } catch (error) {
    console.warn("getRewards query failed, using mock data:", error);
    return MOCK_REWARDS;
  }
}

export async function getChallenges() {
  try {
    const result = await db.select().from(challenges).orderBy(desc(challenges.startDate));
    return result.length > 0 ? result : MOCK_CHALLENGES;
  } catch (error) {
    console.warn("getChallenges query failed, using mock data:", error);
    return MOCK_CHALLENGES;
  }
}

export async function getChallengeParticipations() {
  try {
    const results = await db
      .select({
        id: challengeParticipations.id,
        userId: challengeParticipations.userId,
        challengeId: challengeParticipations.challengeId,
        progress: challengeParticipations.progress,
        status: challengeParticipations.status,
        proofUrl: challengeParticipations.proofUrl,
        xpAwarded: challengeParticipations.xpAwarded,
        pointsAwarded: challengeParticipations.pointsAwarded,
        approvedById: challengeParticipations.approvedById,
        approvedAt: challengeParticipations.approvedAt,
        createdAt: challengeParticipations.createdAt,
        userName: users.name,
        challengeTitle: challenges.title,
      })
      .from(challengeParticipations)
      .leftJoin(users, eq(challengeParticipations.userId, users.id))
      .leftJoin(challenges, eq(challengeParticipations.challengeId, challenges.id))
      .orderBy(desc(challengeParticipations.createdAt));

    return results.length > 0 ? results : MOCK_CHALLENGE_PARTICIPATIONS;
  } catch (error) {
    console.warn("getChallengeParticipations query failed, using mock data:", error);
    return MOCK_CHALLENGE_PARTICIPATIONS;
  }
}

export async function getRewardRedemptions() {
  try {
    const results = await db
      .select({
        id: rewardRedemptions.id,
        userId: rewardRedemptions.userId,
        rewardId: rewardRedemptions.rewardId,
        redeemedAt: rewardRedemptions.redeemedAt,
        status: rewardRedemptions.status,
        pointsDeducted: rewardRedemptions.pointsDeducted,
        rewardTitle: rewards.title,
        userName: users.name,
      })
      .from(rewardRedemptions)
      .leftJoin(users, eq(rewardRedemptions.userId, users.id))
      .leftJoin(rewards, eq(rewardRedemptions.rewardId, rewards.id))
      .orderBy(desc(rewardRedemptions.redeemedAt));

    return results.length > 0 ? results : MOCK_REDEMPTIONS;
  } catch (error) {
    console.warn("getRewardRedemptions query failed, using mock data:", error);
    return MOCK_REDEMPTIONS;
  }
}

export async function getUserLeaderboard() {
  try {
    const results = await db
      .select({
        name: users.name,
        email: users.email,
        points: users.pointsBalance,
        xp: users.xpTotal,
        departmentName: departments.name,
      })
      .from(users)
      .leftJoin(departments, eq(users.departmentId, departments.id))
      .orderBy(desc(users.xpTotal))
      .limit(10);

    return results.length > 0
      ? results.map((u, i) => ({
          rank: i + 1,
          name: u.name || u.email,
          departmentName: u.departmentName || "Operations",
          points: u.points,
          xp: u.xp,
          avatar: u.name ? u.name[0].toUpperCase() : "U",
        }))
      : MOCK_USER_LEADERBOARD;
  } catch (error) {
    console.warn("getUserLeaderboard query failed, using mock data:", error);
    return MOCK_USER_LEADERBOARD;
  }
}

export async function getDepartmentLeaderboard() {
  try {
    // Select the most recent department scores
    const results = await db
      .select({
        name: departments.name,
        code: departments.code,
        score: departmentScores.overallScore,
      })
      .from(departmentScores)
      .leftJoin(departments, eq(departmentScores.departmentId, departments.id))
      .orderBy(desc(departmentScores.overallScore))
      .limit(6);

    return results.length > 0
      ? results.map((d, i) => ({
          rank: i + 1,
          name: d.name || "Division",
          code: d.code || "DEPT",
          score: d.score,
        }))
      : MOCK_DEPARTMENT_LEADERBOARD;
  } catch (error) {
    console.warn("getDepartmentLeaderboard query failed, using mock data:", error);
    return MOCK_DEPARTMENT_LEADERBOARD;
  }
}
