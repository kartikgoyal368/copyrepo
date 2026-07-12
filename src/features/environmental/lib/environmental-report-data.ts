import { EnvironmentalGoal, CarbonTransaction } from "../types";

export interface EnvironmentalReportOptions {
  departmentId?: number;
  startDate?: Date;
  endDate?: Date;
}

export function generateEnvironmentalReportData(
  goals: EnvironmentalGoal[],
  transactions: CarbonTransaction[],
  options: EnvironmentalReportOptions = {}
) {
  let filteredTx = [...transactions];
  let filteredGoals = [...goals];

  if (options.departmentId) {
    filteredTx = filteredTx.filter((t) => t.departmentId === options.departmentId);
    filteredGoals = filteredGoals.filter((g) => g.departmentId === options.departmentId);
  }

  if (options.startDate) {
    const start = new Date(options.startDate).getTime();
    filteredTx = filteredTx.filter((t) => new Date(t.date).getTime() >= start);
  }

  if (options.endDate) {
    const end = new Date(options.endDate).getTime();
    filteredTx = filteredTx.filter((t) => new Date(t.date).getTime() <= end);
  }

  let totalEmissions = 0;
  let totalOffsets = 0;

  filteredTx.forEach((tx) => {
    if (tx.type === "emission") {
      totalEmissions += tx.amount;
    } else {
      totalOffsets += tx.amount;
    }
  });

  return {
    transactions: filteredTx,
    goals: filteredGoals,
    summary: {
      totalEmissions: Math.round(totalEmissions * 10) / 10,
      totalOffsets: Math.round(totalOffsets * 10) / 10,
      netEmissions: Math.round((totalEmissions - totalOffsets) * 10) / 10,
      goalCount: filteredGoals.length,
      achievedGoals: filteredGoals.filter((g) => g.status === "achieved" || g.currentValue >= g.targetValue).length,
    },
  };
}
