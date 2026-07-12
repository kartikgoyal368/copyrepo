"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import {
  challenges,
  challengeParticipations,
  rewards,
  rewardRedemptions,
  users,
  settings,
  notifications,
} from "@/server/db/schema";
import { challengeSchema, challengeParticipationSchema } from "./schemas";
import { requireUser } from "@/server/auth/session";
import { assertRole } from "@/lib/rbac";
import { eq, and } from "drizzle-orm";

export async function createChallengeAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  const validated = challengeSchema.parse(rawData);

  try {
    await db.insert(challenges).values({
      title: validated.title,
      description: validated.description || null,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      points: validated.points,
      xp: validated.xp,
      status: validated.status,
      evidenceRequired: validated.evidenceRequired,
    });
    revalidatePath("/gamification");
    return { success: true };
  } catch (error: any) {
    console.error("createChallengeAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function joinChallengeAction(challengeId: number) {
  const user = await requireUser();

  try {
    // Check if already joined
    const [existing] = await db
      .select()
      .from(challengeParticipations)
      .where(
        and(
          eq(challengeParticipations.userId, user.id),
          eq(challengeParticipations.challengeId, challengeId)
        )
      )
      .limit(1);

    if (existing) {
      return { success: false, error: "Already joined this challenge." };
    }

    await db.insert(challengeParticipations).values({
      userId: user.id,
      challengeId,
      progress: 0,
      status: "active",
    });

    revalidatePath("/gamification");
    return { success: true };
  } catch (error: any) {
    console.error("joinChallengeAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function updateChallengeProgressAction(rawData: any) {
  const user = await requireUser();
  const validated = challengeParticipationSchema.parse(rawData);

  try {
    // Find active participation
    const [participation] = await db
      .select()
      .from(challengeParticipations)
      .where(
        and(
          eq(challengeParticipations.userId, user.id),
          eq(challengeParticipations.challengeId, validated.challengeId)
        )
      )
      .limit(1);

    if (!participation) {
      return { success: false, error: "Participation not found. Join the challenge first." };
    }

    await db
      .update(challengeParticipations)
      .set({
        progress: Number(validated.progress),
        proofUrl: validated.proofUrl || participation.proofUrl,
        status: Number(validated.progress) >= 100 ? "active" : "active", // remains active until approved
      })
      .where(eq(challengeParticipations.id, participation.id));

    revalidatePath("/gamification");
    return { success: true };
  } catch (error: any) {
    console.error("updateChallengeProgressAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function approveChallengeParticipationAction(
  participationId: number,
  status: "completed" | "abandoned"
) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  try {
    const [participation] = await db
      .select()
      .from(challengeParticipations)
      .where(eq(challengeParticipations.id, participationId))
      .limit(1);

    if (!participation) {
      return { success: false, error: "Record not found." };
    }

    // Fetch config
    const [evidenceConfig] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "evidenceRequiredEnabled"))
      .limit(1);
    
    const evidenceRequiredEnabled = evidenceConfig?.value === "true";

    // If evidence is required and action is complete, check proof document
    if (status === "completed" && evidenceRequiredEnabled && !participation.proofUrl) {
      return {
        success: false,
        error: "Cannot approve challenge: upload proof document first under active ESG configurations.",
      };
    }

    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, participation.challengeId))
      .limit(1);

    if (!challenge) {
      return { success: false, error: "Linked challenge not found." };
    }

    await db
      .update(challengeParticipations)
      .set({
        status,
        xpAwarded: status === "completed" ? challenge.xp : 0,
        pointsAwarded: status === "completed" ? challenge.points : 0,
        approvedById: user.id,
        approvedAt: new Date(),
        progress: status === "completed" ? 100 : participation.progress,
      })
      .where(eq(challengeParticipations.id, participationId));

    if (status === "completed") {
      const [targetUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, participation.userId))
        .limit(1);

      if (targetUser) {
        await db
          .update(users)
          .set({
            pointsBalance: targetUser.pointsBalance + challenge.points,
            xpTotal: targetUser.xpTotal + challenge.xp,
          })
          .where(eq(users.id, participation.userId));
      }

      // Notify employee
      await db.insert(notifications).values({
        userId: participation.userId,
        title: "Challenge Approved!",
        message: `Your participation in '${challenge.title}' was approved. You earned ${challenge.points} points and ${challenge.xp} XP!`,
        type: "challenge",
        read: false,
      });
    }

    revalidatePath("/gamification");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("approveChallengeParticipationAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function redeemRewardAction(rewardId: number) {
  const user = await requireUser();

  try {
    const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1);
    if (!reward) {
      return { success: false, error: "Reward item not found." };
    }

    if (reward.stock <= 0) {
      return { success: false, error: "Out of stock." };
    }

    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!dbUser) {
      return { success: false, error: "User not found." };
    }

    if (dbUser.pointsBalance < reward.pointsCost) {
      return { success: false, error: `Insufficient points balance. Requires ${reward.pointsCost} points.` };
    }

    // Update db
    await db
      .update(rewards)
      .set({ stock: reward.stock - 1 })
      .where(eq(rewards.id, rewardId));

    await db
      .update(users)
      .set({ pointsBalance: dbUser.pointsBalance - reward.pointsCost })
      .where(eq(users.id, user.id));

    await db.insert(rewardRedemptions).values({
      userId: user.id,
      rewardId,
      status: "pending",
      pointsDeducted: reward.pointsCost,
    });

    await db.insert(notifications).values({
      userId: user.id,
      title: "Reward Redeemed",
      message: `You successfully redeemed '${reward.title}' for ${reward.pointsCost} points. Stock updated.`,
      type: "system",
      read: false,
    });

    revalidatePath("/gamification");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("redeemRewardAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}
