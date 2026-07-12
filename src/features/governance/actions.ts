"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db/client";
import {
  esgPolicies,
  policyAcknowledgements,
  audits,
  complianceIssues,
  notifications,
} from "@/server/db/schema";
import { esgPolicySchema, auditSchema, complianceIssueSchema } from "./schemas";
import { requireUser } from "@/server/auth/session";
import { assertRole } from "@/lib/rbac";
import { eq, and } from "drizzle-orm";

export async function createEsgPolicyAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager"]);

  const validated = esgPolicySchema.parse(rawData);

  try {
    await db.insert(esgPolicies).values({
      title: validated.title,
      description: validated.description || null,
      category: validated.category,
      version: validated.version,
      effectiveDate: new Date(validated.effectiveDate),
      createdById: user.id,
    });

    revalidatePath("/governance");
    return { success: true };
  } catch (error: any) {
    console.error("createEsgPolicyAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function acknowledgePolicyAction(policyId: number) {
  const user = await requireUser();

  try {
    // Check if already acknowledged
    const [existing] = await db
      .select()
      .from(policyAcknowledgements)
      .where(
        and(
          eq(policyAcknowledgements.userId, user.id),
          eq(policyAcknowledgements.policyId, policyId)
        )
      )
      .limit(1);

    if (existing) {
      return { success: true };
    }

    await db.insert(policyAcknowledgements).values({
      userId: user.id,
      policyId,
      acknowledgedAt: new Date(),
    });

    revalidatePath("/governance");
    return { success: true };
  } catch (error: any) {
    console.error("acknowledgePolicyAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function createAuditAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "auditor"]);

  const validated = auditSchema.parse(rawData);

  try {
    await db.insert(audits).values({
      title: validated.title,
      scope: validated.scope,
      auditorName: validated.auditorName,
      auditDate: new Date(validated.auditDate),
      status: validated.status,
      findingsCount: Number(validated.findingsCount),
      rating: validated.rating || null,
      reportUrl: validated.reportUrl || null,
    });

    revalidatePath("/governance");
    return { success: true };
  } catch (error: any) {
    console.error("createAuditAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function createComplianceIssueAction(rawData: any) {
  const user = await requireUser();
  assertRole(user.role, ["admin", "manager", "auditor"]);

  const validated = complianceIssueSchema.parse(rawData);

  try {
    await db.insert(complianceIssues).values({
      title: validated.title,
      description: validated.description || null,
      severity: validated.severity,
      status: "open",
      ownerId: validated.ownerId,
      dueDate: new Date(validated.dueDate),
    });

    // Notify issue owner
    await db.insert(notifications).values({
      userId: validated.ownerId,
      title: "New Compliance Issue Raised",
      message: `Compliance issue '${validated.title}' has been raised and assigned to you. Due date: ${new Date(validated.dueDate).toLocaleDateString()}`,
      type: "compliance",
      read: false,
    });

    revalidatePath("/governance");
    return { success: true };
  } catch (error: any) {
    console.error("createComplianceIssueAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}

export async function resolveComplianceIssueAction(issueId: number) {
  const user = await requireUser();

  try {
    const [issue] = await db
      .select()
      .from(complianceIssues)
      .where(eq(complianceIssues.id, issueId))
      .limit(1);

    if (!issue) {
      return { success: false, error: "Issue not found." };
    }

    // Resolve eligibility check
    if (
      user.role !== "admin" &&
      user.role !== "manager" &&
      user.role !== "auditor" &&
      issue.ownerId !== user.id
    ) {
      return { success: false, error: "Unauthorized to resolve this issue." };
    }

    await db
      .update(complianceIssues)
      .set({
        status: "resolved",
        resolvedAt: new Date(),
        resolvedById: user.id,
      })
      .where(eq(complianceIssues.id, issueId));

    revalidatePath("/governance");
    return { success: true };
  } catch (error: any) {
    console.error("resolveComplianceIssueAction failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database write failed" };
  }
}
