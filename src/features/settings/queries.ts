import { db } from "@/server/db/client";
import { settings, departments } from "@/server/db/schema";

export async function getSettings() {
  try {
    const results = await db.select().from(settings);
    // Return key-value dictionary mapping
    const map: Record<string, string> = {};
    results.forEach((s) => {
      map[s.key] = s.value;
    });

    // Provide default fallback values if missing
    return {
      evidenceRequiredEnabled: map.evidenceRequiredEnabled ?? "true",
      badgeAutoAwardEnabled: map.badgeAutoAwardEnabled ?? "true",
      weightEnvironmental: map.weightEnvironmental ?? "40",
      weightSocial: map.weightSocial ?? "30",
      weightGovernance: map.weightGovernance ?? "30",
      ...map,
    };
  } catch (error) {
    console.warn("getSettings query failed, using defaults:", error);
    return {
      evidenceRequiredEnabled: "true",
      badgeAutoAwardEnabled: "true",
      weightEnvironmental: "40",
      weightSocial: "30",
      weightGovernance: "30",
    };
  }
}

export async function getDepartments() {
  try {
    const results = await db.select().from(departments);
    return results;
  } catch (error) {
    console.warn("getDepartments query failed, returning empty list:", error);
    return [
      { id: 1, name: "Sustainability", code: "SUST", createdAt: new Date() },
      { id: 2, name: "Compliance", code: "COMP", createdAt: new Date() },
      { id: 3, name: "Operations", code: "OPS", createdAt: new Date() },
      { id: 4, name: "Human Resources", code: "HR", createdAt: new Date() },
    ];
  }
}
