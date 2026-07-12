import { requireUser } from "@/server/auth/session";
import { getEsgPolicies, getAudits, getComplianceIssues } from "@/features/governance/queries";
import GovernanceShell from "@/features/governance/components/governance-shell";
import { db } from "@/server/db/client";
import { users as usersTable } from "@/server/db/schema";

export default async function GovernancePage() {
  const user = await requireUser();
  const policies = await getEsgPolicies();
  const audits = await getAudits();
  const issues = await getComplianceIssues();

  let dbUsers = [];
  try {
    dbUsers = await db
      .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
      .from(usersTable);
  } catch (e) {
    console.warn("Failed to fetch users list for dropdown options:", e);
    dbUsers = [
      { id: "usr_admin", name: "Admin User", email: "admin@ecosphere.dev" },
      { id: "usr_manager", name: "Sustainability Manager", email: "manager@ecosphere.dev" },
      { id: "usr_employee", name: "Employee User", email: "employee@ecosphere.dev" },
    ];
  }

  const currentUser = {
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    role: user.role,
  };

  return (
    <GovernanceShell
      policies={policies}
      audits={audits}
      issues={issues}
      users={dbUsers}
      currentUser={currentUser}
    />
  );
}
