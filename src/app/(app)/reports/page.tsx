import { requireUser } from "@/server/auth/session";
import {
  getEmissionFactors,
  getCarbonTransactions,
  getEnvironmentalGoals,
} from "@/features/environmental/queries";
import { getCsrActivities, getEmployeeParticipations } from "@/features/social/queries";
import { getEsgPolicies, getAudits, getComplianceIssues } from "@/features/governance/queries";
import {
  getChallenges,
  getChallengeParticipations,
  getRewardRedemptions,
} from "@/features/gamification/queries";

import EnvironmentalReport from "@/features/environmental/components/environmental-report";
import SocialReport from "@/features/social/components/social-report";
import GovernanceReport from "@/features/governance/components/governance-report";
import GamificationReport from "@/features/gamification/components/gamification-report";

import PageShell from "@/components/shell/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

export default async function ReportsPage() {
  const user = await requireUser();

  // Environmental data
  const factors = await getEmissionFactors();
  const transactions = await getCarbonTransactions();
  const goals = await getEnvironmentalGoals();

  // Social data
  const activities = await getCsrActivities();
  const socialParts = await getEmployeeParticipations();

  // Governance data
  const policies = await getEsgPolicies();
  const audits = await getAudits();
  const issues = await getComplianceIssues();

  // Gamification data
  const challenges = await getChallenges();
  const gamificationParts = await getChallengeParticipations();
  const redemptions = await getRewardRedemptions();

  return (
    <PageShell
      title="ESG Disclosure Builder"
      description="Compile custom sustainability audits, select modules metrics, and download certified ESG declaration reports."
    >
      <div className="space-y-6">
        {/* Export Row card */}
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="block text-xs font-bold text-neutral-850 dark:text-neutral-100">
                Direct Audit Exporters
              </span>
              <span className="block text-[11px] text-neutral-500 mt-0.5">
                Download current ESG statement in CSV, Excel, or PDF formats.
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/api/reports/csv" download>
                <Button size="sm" variant="outline" className="text-xs bg-white dark:bg-neutral-950 cursor-pointer">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export CSV
                </Button>
              </a>
              <a href="/api/reports/xlsx" download>
                <Button size="sm" variant="outline" className="text-xs bg-white dark:bg-neutral-950 cursor-pointer">
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Export Excel
                </Button>
              </a>
              <a href="/api/reports/pdf" target="_blank" rel="noreferrer">
                <Button size="sm" className="text-xs bg-emerald-600 text-white cursor-pointer">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  View PDF
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Modular report compiler tabs */}
        <Tabs defaultValue="environmental" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="environmental">Environmental Statement</TabsTrigger>
            <TabsTrigger value="social">Social Responsibility</TabsTrigger>
            <TabsTrigger value="governance">Corporate Governance</TabsTrigger>
            <TabsTrigger value="gamification">Engagement & Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="environmental" className="mt-4">
            <EnvironmentalReport
              factors={factors}
              transactions={transactions}
              goals={goals}
            />
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <SocialReport
              activities={activities}
              participations={socialParts}
            />
          </TabsContent>

          <TabsContent value="governance" className="mt-4">
            <GovernanceReport
              policies={policies}
              audits={audits}
              issues={issues}
            />
          </TabsContent>

          <TabsContent value="gamification" className="mt-4">
            <GamificationReport
              challenges={challenges}
              participations={gamificationParts}
              redemptions={redemptions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
