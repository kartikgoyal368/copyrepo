"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import { settings, departments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/server/auth/session";
import { assertRole } from "@/lib/rbac";

export async function updateSettingAction(key: string, value: string) {
  const user = await requireUser();
  assertRole(user.role, ["admin"]);

  try {
    const [existing] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);

    if (existing) {
      await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }

    revalidatePath("/settings");
    revalidatePath("/environmental");
    revalidatePath("/social");
    revalidatePath("/governance");
    revalidatePath("/gamification");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateSettingAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function createDepartmentAction(name: string, code: string) {
  const user = await requireUser();
  assertRole(user.role, ["admin"]);

  try {
    await db.insert(departments).values({ name, code });
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("createDepartmentAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}
