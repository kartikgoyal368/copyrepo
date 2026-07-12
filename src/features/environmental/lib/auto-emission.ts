import { EmissionFactor } from "../types";

export interface ActivityRecord {
  type: "fleet" | "electricity" | "expense" | "manufacturing";
  value: number; // liters, kWh, currency, or kg
  details: string;
}

export function autoCalculateEmissions(
  activities: ActivityRecord[],
  factors: EmissionFactor[]
): number {
  let totalCalculated = 0;

  activities.forEach((act) => {
    let factorValue = 0;
    if (act.type === "fleet") {
      const factor = factors.find((f) => f.name.includes("Diesel") || f.category === "fuel");
      factorValue = factor ? factor.value : 2.68;
    } else if (act.type === "electricity") {
      const factor = factors.find((f) => f.name.includes("Electricity") || f.category === "electricity");
      factorValue = factor ? factor.value : 0.385;
    } else if (act.type === "manufacturing") {
      const factor = factors.find((f) => f.name.includes("Landfill") || f.category === "waste");
      factorValue = factor ? factor.value : 0.45;
    } else {
      factorValue = 0.15; // default benchmark value per dollar spent
    }
    totalCalculated += act.value * factorValue;
  });

  return Math.round(totalCalculated * 10) / 10;
}

export const MOCK_OPERATIONAL_ACTIVITIES: ActivityRecord[] = [
  { type: "fleet", value: 1200, details: "Fleet logistics shipping diesel logs" },
  { type: "electricity", value: 15400, details: "Office HQ building lighting electricity" },
  { type: "manufacturing", value: 850, details: "Factory mechanical scrap metal waste" },
  { type: "expense", value: 4500, details: "Business flights and vendor procurement travel expenses" },
];
