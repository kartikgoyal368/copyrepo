import {
  environmentalGoals,
  carbonTransactions,
  emissionFactors,
  productEsgProfiles,
} from "@/server/db/schema";

export type EnvironmentalGoal = typeof environmentalGoals.$inferSelect;
export type CarbonTransaction = typeof carbonTransactions.$inferSelect;
export type EmissionFactor = typeof emissionFactors.$inferSelect;
export type ProductEsgProfile = typeof productEsgProfiles.$inferSelect;

export interface EnvironmentalKPIs {
  totalEmissions: number;
  totalOffsets: number;
  netEmissions: number;
  goalsAchievedCount: number;
  goalsTotalCount: number;
  goalsProgressPercentage: number;
  activeEmissionFactorsCount: number;
  averageProductFootprint: number;
}
