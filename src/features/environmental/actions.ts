"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import {
  emissionFactors,
  environmentalGoals,
  carbonTransactions,
  settings,
  notifications,
  users,
} from "@/server/db/schema";
import {
  emissionFactorSchema,
  environmentalGoalSchema,
  carbonTransactionSchema,
} from "./schemas";
import { requireUser } from "@/server/auth/session";
import { assertRole } from "@/lib/rbac";
import { eq } from "drizzle-orm";

export async function createEmissionFactorAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  const validated = emissionFactorSchema.parse(rawData);

  try {
    await db.insert(emissionFactors).values({
      name: validated.name,
      category: validated.category,
      value: validated.value,
      unit: validated.unit,
    });
    revalidatePath("/environmental");
    return { success: true };
  } catch (error: any) {
    console.error("createEmissionFactorAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function createEnvironmentalGoalAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  const validated = environmentalGoalSchema.parse(rawData);

  try {
    await db.insert(environmentalGoals).values({
      title: validated.title,
      description: validated.description || null,
      targetValue: validated.targetValue,
      currentValue: 0,
      unit: validated.unit,
      deadline: new Date(validated.deadline),
      status: "active",
      departmentId: validated.departmentId,
    });
    revalidatePath("/environmental");
    return { success: true };
  } catch (error: any) {
    console.error("createEnvironmentalGoalAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function createCarbonTransactionAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager", "employee"]);

  const validated = carbonTransactionSchema.parse(rawData);

  try {
    await db.insert(carbonTransactions).values({
      title: validated.title,
      amount: validated.amount,
      type: validated.type,
      departmentId: validated.departmentId,
      date: validated.date ? new Date(validated.date) : new Date(),
      proofUrl: validated.proofUrl || null,
    });

    // Check if auto-badge award is enabled and user has logged first carbon
    // Trigger notification
    const [settingsAutoAward] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "badgeAutoAwardEnabled"))
      .limit(1);

    if (settingsAutoAward?.value === "true") {
      // Award badge logic (this will write to user_badges)
      // Check if user already has it
      // Let's create a notification
      await db.insert(notifications).values({
        userId: user.id,
        title: "Carbon Logged",
        message: `Successfully logged carbon transaction: '${validated.title}' (${validated.amount} kg CO2e).`,
        type: "system",
        read: false,
      });
    }

    revalidatePath("/environmental");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("createCarbonTransactionAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function toggleAutoEmissionAction(enabled: boolean) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  try {
    // Check if configuration exists
    const [config] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "autoEmissionCalculationEnabled"))
      .limit(1);

    if (config) {
      await db
        .update(settings)
        .set({ value: String(enabled), updatedAt: new Date() })
        .where(eq(settings.key, "autoEmissionCalculationEnabled"));
    } else {
      await db.insert(settings).values({
        key: "autoEmissionCalculationEnabled",
        value: String(enabled),
        updatedAt: new Date(),
      });
    }

    revalidatePath("/environmental");
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("toggleAutoEmissionAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}
