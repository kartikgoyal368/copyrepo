"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import { notifications } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/server/auth/session";

export async function getNotificationsAction() {
  const user = await requireUser();
  try {
    const results = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(notifications.createdAt);
    return { success: true, notifications: results };
  } catch (error: any) {
    console.error("getNotificationsAction failed:", error);
    return { success: false, error: error.message, notifications: [] };
  }
}

export async function markNotificationReadAction(notificationId: number) {
  const user = await requireUser();
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, user.id)
        )
      );
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("markNotificationReadAction failed:", error);
    return { success: false, error: error.message };
  }
}
