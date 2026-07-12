import { EnvironmentalGoal, CarbonTransaction } from "../types";

export function calculateEnvironmentalScore(
  goals: EnvironmentalGoal[],
  transactions: CarbonTransaction[]
): number {
  // 1. Goal Progress (50% weight)
  let goalScore = 0;
  if (goals.length > 0) {
    const totalProgress = goals.reduce((acc, goal) => {
      if (goal.status === "achieved") return acc + 100;
      if (goal.status === "missed") return acc + 0;
      const progress = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
      return acc + progress;
    }, 0);
    goalScore = totalProgress / goals.length;
  } else {
    goalScore = 80; // Default baseline if no goals set
  }

  // 2. Carbon Footprint Offset Efficiency (50% weight)
  let offsetScore = 0;
  let totalEmissions = 0;
  let totalOffsets = 0;

  transactions.forEach((tx) => {
    if (tx.type === "emission") {
      totalEmissions += tx.amount;
    } else {
      totalOffsets += tx.amount;
    }
  });

  if (totalEmissions > 0) {
    offsetScore = Math.min(100, (totalOffsets / totalEmissions) * 100);
  } else if (totalOffsets > 0) {
    offsetScore = 100;
  } else {
    offsetScore = 75; // Default baseline if no data logged
  }

  const overall = goalScore * 0.5 + offsetScore * 0.5;
  return Math.round(overall * 10) / 10;
}
