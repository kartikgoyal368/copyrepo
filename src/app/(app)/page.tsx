import { requireUser } from "@/server/auth/session";
import { getCarbonTransactions } from "@/features/environmental/queries";
import {
  getEmployeeParticipations,
  getDiversityMetrics,
  getTrainingCompletions,
} from "@/features/social/queries";
import { getComplianceIssues, getAudits } from "@/features/governance/queries";
import { getSettings } from "@/features/settings/queries";
import { db } from "@/server/db/client";
import { users as usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import PageShell from "@/components/shell/page-shell";
import EsgScoreOverview from "@/features/dashboard/components/esg-score-overview";
import { calculateEnvironmentalScore } from "@/features/environmental/lib/environmental-score";
import { calculateSocialScore } from "@/features/social/lib/social-score";
import { calculateGovernanceScore } from "@/features/governance/lib/governance-score";
import { getEsgGrade, getScoreBg } from "@/lib/scoring";

export default async function DashboardPage() {
  const user = await requireUser();

  // Load datasets asynchronously
  const emissions = await getCarbonTransactions();
  const socialParts = await getEmployeeParticipations();
  const diversity = await getDiversityMetrics();
  const training = await getTrainingCompletions();
  const issues = await getComplianceIssues();
  const audits = await getAudits();
  const configs = await getSettings();

  // Fetch live user points/XP
  let dbUser = null;
  try {
    const [found] = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1);
    dbUser = found;
  } catch (e) {
    console.warn("Failed to fetch live user statistics:", e);
  }

  const currentUser = {
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    role: user.role,
    pointsBalance: dbUser?.pointsBalance ?? 0,
    xpTotal: dbUser?.xpTotal ?? 0,
  };

  // Compute sub-index scores
  const scoreE = calculateEnvironmentalScore(emissions);
  const scoreS = calculateSocialScore(socialParts, training, diversity);
  const scoreG = calculateGovernanceScore(issues, audits);

  // Load weights
  const weightE = Number(configs.weightEnvironmental) / 100;
  const weightS = Number(configs.weightSocial) / 100;
  const weightG = Number(configs.weightGovernance) / 100;

  // Calculate overall corporate score
  const overallScore = Math.round((scoreE * weightE + scoreS * weightS + scoreG * weightG) * 10) / 10;
  const overallGrade = getEsgGrade(overallScore);
  const gradeBadgeClass = getScoreBg(overallScore);

  const openComplianceCount = issues.filter((i) => i.status === "open").length;

  // Calculate Level statistics
  const xpTotal = currentUser.xpTotal;
  const level = Math.floor(xpTotal / 1000) + 1;
  const nextLevelXp = level * 1000;
  const prevLevelXp = (level - 1) * 1000;
  const xpProgress = Math.max(0, Math.min(100, ((xpTotal - prevLevelXp) / 1000) * 100));

  return (
    <PageShell
      title="Executive ESG Dashboard"
      description="Holistic tracking of corporate Environmental, Social, and Governance performance compliance metrics."
    >
      <EsgScoreOverview
        overallScore={overallScore}
        overallGrade={overallGrade}
        gradeBadgeClass={gradeBadgeClass}
        scoreE={scoreE}
        scoreS={scoreS}
        scoreG={scoreG}
        weightE={weightE}
        weightS={weightS}
        weightG={weightG}
        openComplianceCount={openComplianceCount}
        userName={currentUser.name || "Employee User"}
        userRole={currentUser.role}
        pointsBalance={currentUser.pointsBalance}
        xpTotal={xpTotal}
        level={level}
        nextLevelXp={nextLevelXp}
        xpProgress={xpProgress}
      />
    </PageShell>
  );
}
