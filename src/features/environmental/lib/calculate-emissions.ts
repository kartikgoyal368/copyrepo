import { CarbonTransaction } from "../types";

export function calculateNetEmissions(transactions: CarbonTransaction[]) {
  let totalEmissions = 0;
  let totalOffsets = 0;

  transactions.forEach((tx) => {
    if (tx.type === "emission") {
      totalEmissions += tx.amount;
    } else if (tx.type === "offset") {
      totalOffsets += tx.amount;
    }
  });

  return {
    totalEmissions: Math.round(totalEmissions * 10) / 10,
    totalOffsets: Math.round(totalOffsets * 10) / 10,
    netEmissions: Math.round((totalEmissions - totalOffsets) * 10) / 10,
  };
}

export function groupEmissionsByDepartment(transactions: CarbonTransaction[]) {
  const map: Record<string, { name: string; emissions: number; offsets: number }> = {};

  transactions.forEach((tx) => {
    const deptName = (tx as any).departmentName || "General";
    if (!map[deptName]) {
      map[deptName] = { name: deptName, emissions: 0, offsets: 0 };
    }
    if (tx.type === "emission") {
      map[deptName].emissions += tx.amount;
    } else {
      map[deptName].offsets += tx.amount;
    }
  });

  return Object.values(map).map((item) => ({
    name: item.name,
    emissions: Math.round(item.emissions),
    offsets: Math.round(item.offsets),
    net: Math.round(item.emissions - item.offsets),
  }));
}
