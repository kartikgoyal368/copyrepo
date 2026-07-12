import { requireUser } from "@/server/auth/session";
import {
  getEmissionFactors,
  getCarbonTransactions,
  getEnvironmentalGoals,
} from "@/features/environmental/queries";
import EnvironmentalShell from "@/features/environmental/components/environmental-shell";

export default async function EnvironmentalPage() {
  const user = await requireUser();
  const factors = await getEmissionFactors();
  const transactions = await getCarbonTransactions();
  const goals = await getEnvironmentalGoals();

  const currentUser = {
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    role: user.role,
  };

  return (
    <EnvironmentalShell
      factors={factors}
      transactions={transactions}
      goals={goals}
      currentUser={currentUser}
    />
  );
}
