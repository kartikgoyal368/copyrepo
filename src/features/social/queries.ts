import { db } from "@/server/db/client";
import {
  csrActivities,
  employeeParticipations,
  diversityMetrics,
  trainingCompletions,
  users,
} from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  MOCK_CSR_ACTIVITIES,
  MOCK_PARTICIPATIONS,
  MOCK_DIVERSITY_METRICS,
  MOCK_TRAINING_COMPLETIONS,
} from "./demo-data";

export async function getCsrActivities() {
  try {
    const result = await db.select().from(csrActivities).orderBy(desc(csrActivities.date));
    return result.length > 0 ? result : MOCK_CSR_ACTIVITIES;
  } catch (error) {
    console.warn("getCsrActivities query failed, using mock data:", error);
    return MOCK_CSR_ACTIVITIES;
  }
}

export async function getEmployeeParticipations() {
  try {
    const results = await db
      .select({
        id: employeeParticipations.id,
        userId: employeeParticipations.userId,
        csrActivityId: employeeParticipations.csrActivityId,
        hoursLogged: employeeParticipations.hoursLogged,
        status: employeeParticipations.status,
        proofUrl: employeeParticipations.proofUrl,
        remarks: employeeParticipations.remarks,
        approvedById: employeeParticipations.approvedById,
        approvedAt: employeeParticipations.approvedAt,
        createdAt: employeeParticipations.createdAt,
        userName: users.name,
        csrActivityTitle: csrActivities.title,
      })
      .from(employeeParticipations)
      .leftJoin(users, eq(employeeParticipations.userId, users.id))
      .leftJoin(csrActivities, eq(employeeParticipations.csrActivityId, csrActivities.id))
      .orderBy(desc(employeeParticipations.createdAt));

    return results.length > 0 ? results : MOCK_PARTICIPATIONS;
  } catch (error) {
    console.warn("getEmployeeParticipations query failed, using mock data:", error);
    return MOCK_PARTICIPATIONS;
  }
}

export async function getDiversityMetrics() {
  try {
    const result = await db.select().from(diversityMetrics).orderBy(desc(diversityMetrics.createdAt));
    return result.length > 0 ? result : MOCK_DIVERSITY_METRICS;
  } catch (error) {
    console.warn("getDiversityMetrics query failed, using mock data:", error);
    return MOCK_DIVERSITY_METRICS;
  }
}

export async function getTrainingCompletions() {
  try {
    const results = await db
      .select({
        id: trainingCompletions.id,
        userId: trainingCompletions.userId,
        trainingName: trainingCompletions.trainingName,
        completionDate: trainingCompletions.completionDate,
        status: trainingCompletions.status,
        createdAt: trainingCompletions.createdAt,
        userName: users.name,
      })
      .from(trainingCompletions)
      .leftJoin(users, eq(trainingCompletions.userId, users.id))
      .orderBy(desc(trainingCompletions.completionDate));

    return results.length > 0 ? results : MOCK_TRAINING_COMPLETIONS;
  } catch (error) {
    console.warn("getTrainingCompletions query failed, using mock data:", error);
    return MOCK_TRAINING_COMPLETIONS;
  }
}
