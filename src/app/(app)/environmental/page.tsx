import { requireUser } from "@/server/auth/session";
import {
  getEmissionFactors,
  getCarbonTransactions,
  getEnvironmentalGoals,
} from "@/features/environmental/queries";
import { getSettings, getDepartments } from "@/features/settings/queries";
import EnvironmentalShell from "@/features/environmental/components/environmental-shell";

export default async function EnvironmentalPage() {
  const user = await requireUser();
  const [factors, transactions, goals, depts, configs] = await Promise.all([
    getEmissionFactors(),
    getCarbonTransactions(),
    getEnvironmentalGoals(),
    getDepartments(),
    getSettings(),
  ]);

  const currentUser = {
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    role: user.role,
  };

  return (
    <EnvironmentalShell
      initialFactors={factors}
      initialTransactions={transactions}
      initialGoals={goals}
      departments={depts}
      isAutoCalculationEnabled={configs.autoEmissionCalculationEnabled === "true"}
      currentUser={currentUser}
    />
  );
}
