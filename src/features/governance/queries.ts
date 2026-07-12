import { db } from "@/server/db/client";
import {
  esgPolicies,
  policyAcknowledgements,
  audits,
  complianceIssues,
  users,
} from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  MOCK_POLICIES,
  MOCK_AUDITS,
  MOCK_COMPLIANCE_ISSUES,
} from "./demo-data";

export async function getEsgPolicies() {
  try {
    const result = await db.select().from(esgPolicies).orderBy(desc(esgPolicies.effectiveDate));
    return result.length > 0 ? result : MOCK_POLICIES;
  } catch (error) {
    console.warn("getEsgPolicies query failed, using mock data:", error);
    return MOCK_POLICIES;
  }
}

export async function getAudits() {
  try {
    const result = await db.select().from(audits).orderBy(desc(audits.auditDate));
    return result.length > 0 ? result : MOCK_AUDITS;
  } catch (error) {
    console.warn("getAudits query failed, using mock data:", error);
    return MOCK_AUDITS;
  }
}

export async function getComplianceIssues() {
  try {
    const results = await db
      .select({
        id: complianceIssues.id,
        title: complianceIssues.title,
        description: complianceIssues.description,
        severity: complianceIssues.severity,
        status: complianceIssues.status,
        ownerId: complianceIssues.ownerId,
        dueDate: complianceIssues.dueDate,
        resolvedAt: complianceIssues.resolvedAt,
        resolvedById: complianceIssues.resolvedById,
        createdAt: complianceIssues.createdAt,
        ownerName: users.name,
      })
      .from(complianceIssues)
      .leftJoin(users, eq(complianceIssues.ownerId, users.id))
      .orderBy(desc(complianceIssues.dueDate));

    return results.length > 0 ? results : MOCK_COMPLIANCE_ISSUES;
  } catch (error) {
    console.warn("getComplianceIssues query failed, using mock data:", error);
    return MOCK_COMPLIANCE_ISSUES;
  }
}
