"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import {
  csrActivities,
  employeeParticipations,
  settings,
  users,
  notifications,
} from "@/server/db/schema";
import { csrActivitySchema, participationSchema } from "./schemas";
import { requireUser } from "@/server/auth/session";
import { assertRole } from "@/lib/rbac";
import { eq } from "drizzle-orm";

export async function createCsrActivityAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  const validated = csrActivitySchema.parse(rawData);

  try {
    await db.insert(csrActivities).values({
      title: validated.title,
      description: validated.description || null,
      date: new Date(validated.date),
      location: validated.location,
      points: validated.points,
      xp: validated.xp,
      evidenceRequired: validated.evidenceRequired,
    });
    revalidatePath("/social");
    return { success: true };
  } catch (error: any) {
    console.error("createCsrActivityAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function logParticipationAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager", "employee"]);

  const validated = participationSchema.parse(rawData);

  try {
    await db.insert(employeeParticipations).values({
      userId: user.id,
      csrActivityId: validated.csrActivityId,
      hoursLogged: Number(validated.hoursLogged),
      status: "pending",
      proofUrl: validated.proofUrl || null,
      remarks: validated.remarks || null,
    });

    revalidatePath("/social");
    return { success: true };
  } catch (error: any) {
    console.error("logParticipationAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function updateParticipationStatusAction(
  participationId: number,
  status: "approved" | "rejected",
  remarks?: string
) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  try {
    // 1. Get participation details
    const [participation] = await db
      .select()
      .from(employeeParticipations)
      .where(eq(employeeParticipations.id, participationId))
      .limit(1);

    if (!participation) {
      return { success: false, error: "Participation record not found." };
    }

    // 2. Fetch global config
    const [evidenceRequiredConfig] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "evidenceRequiredEnabled"))
      .limit(1);

    const evidenceRequiredEnabled = evidenceRequiredConfig?.value === "true";

    // 3. If evidence is required and action is approved, verify proof document
    if (status === "approved" && evidenceRequiredEnabled && !participation.proofUrl) {
      return {
        success: false,
        error: "Cannot approve participation: proof document/evidence is required under active ESG configurations.",
      };
    }

    // 4. Update status
    await db
      .update(employeeParticipations)
      .set({
        status,
        remarks: remarks || participation.remarks,
        approvedById: user.id,
        approvedAt: new Date(),
      })
      .where(eq(employeeParticipations.id, participationId));

    // 5. If approved, award points and XP
    if (status === "approved") {
      const [activity] = await db
        .select()
        .from(csrActivities)
        .where(eq(csrActivities.id, participation.csrActivityId))
        .limit(1);

      if (activity) {
        const [targetUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, participation.userId))
          .limit(1);

        if (targetUser) {
          await db
            .update(users)
            .set({
              pointsBalance: targetUser.pointsBalance + activity.points,
              xpTotal: targetUser.xpTotal + activity.xp,
            })
            .where(eq(users.id, participation.userId));
        }

        // Notify user of reward points
        await db.insert(notifications).values({
          userId: participation.userId,
          title: "CSR Volunteering Approved",
          message: `Your participation in '${activity.title}' was approved. You earned ${activity.points} points and ${activity.xp} XP!`,
          type: "csr",
          read: false,
        });
      }
    } else if (status === "rejected") {
      // Notify user of rejection
      await db.insert(notifications).values({
        userId: participation.userId,
        title: "CSR Volunteering Rejected",
        message: `Your participation in CSR was rejected. Reason: ${remarks || "Requirements unmet."}`,
        type: "csr",
        read: false,
      });
    }

    revalidatePath("/social");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateParticipationStatusAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}
