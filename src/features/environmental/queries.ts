import { db } from "@/server/db/client";
import {
  emissionFactors,
  environmentalGoals,
  carbonTransactions,
  productEsgProfiles,
  departments,
} from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  MOCK_EMISSION_FACTORS,
  MOCK_ENVIRONMENTAL_GOALS,
  MOCK_CARBON_TRANSACTIONS,
  MOCK_PRODUCT_ESG_PROFILES,
} from "./demo-data";

export async function getEmissionFactors() {
  try {
    const result = await db.select().from(emissionFactors).orderBy(emissionFactors.name);
    return result.length > 0 ? result : MOCK_EMISSION_FACTORS;
  } catch (error) {
    console.warn("getEmissionFactors query failed, using mock data:", error);
    return MOCK_EMISSION_FACTORS;
  }
}

export async function getEnvironmentalGoals() {
  try {
    const goals = await db
      .select({
        id: environmentalGoals.id,
        title: environmentalGoals.title,
        description: environmentalGoals.description,
        targetValue: environmentalGoals.targetValue,
        currentValue: environmentalGoals.currentValue,
        unit: environmentalGoals.unit,
        deadline: environmentalGoals.deadline,
        status: environmentalGoals.status,
        departmentId: environmentalGoals.departmentId,
        createdAt: environmentalGoals.createdAt,
        departmentName: departments.name,
      })
      .from(environmentalGoals)
      .leftJoin(departments, eq(environmentalGoals.departmentId, departments.id))
      .orderBy(desc(environmentalGoals.createdAt));

    return goals.length > 0 ? goals : MOCK_ENVIRONMENTAL_GOALS;
  } catch (error) {
    console.warn("getEnvironmentalGoals query failed, using mock data:", error);
    return MOCK_ENVIRONMENTAL_GOALS;
  }
}

export async function getCarbonTransactions() {
  try {
    const transactions = await db
      .select({
        id: carbonTransactions.id,
        title: carbonTransactions.title,
        amount: carbonTransactions.amount,
        type: carbonTransactions.type,
        departmentId: carbonTransactions.departmentId,
        date: carbonTransactions.date,
        proofUrl: carbonTransactions.proofUrl,
        createdAt: carbonTransactions.createdAt,
        departmentName: departments.name,
      })
      .from(carbonTransactions)
      .leftJoin(departments, eq(carbonTransactions.departmentId, departments.id))
      .orderBy(desc(carbonTransactions.date));

    return transactions.length > 0 ? transactions : MOCK_CARBON_TRANSACTIONS;
  } catch (error) {
    console.warn("getCarbonTransactions query failed, using mock data:", error);
    return MOCK_CARBON_TRANSACTIONS;
  }
}

export async function getProductEsgProfiles() {
  try {
    const result = await db.select().from(productEsgProfiles).orderBy(desc(productEsgProfiles.createdAt));
    return result.length > 0 ? result : MOCK_PRODUCT_ESG_PROFILES;
  } catch (error) {
    console.warn("getProductEsgProfiles query failed, using mock data:", error);
    return MOCK_PRODUCT_ESG_PROFILES;
  }
}
