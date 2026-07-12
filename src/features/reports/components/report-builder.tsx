"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EnvironmentalReport from "@/features/environmental/components/environmental-report";
import SocialReport from "@/features/social/components/social-report";
import GovernanceReport from "@/features/governance/components/governance-report";
import GamificationReport from "@/features/gamification/components/gamification-report";

interface BuilderProps {
  factors: any[];
  transactions: any[];
  goals: any[];
  activities: any[];
  socialParts: any[];
  policies: any[];
  audits: any[];
  issues: any[];
  challenges: any[];
  gamificationParts: any[];
  redemptions: any[];
  departments: any[];
}

export default function ReportBuilder({
  factors,
  transactions,
  goals,
  activities,
  socialParts,
  policies,
  audits,
  issues,
  challenges,
  gamificationParts,
  redemptions,
  departments,
}: BuilderProps) {
  return (
    <Tabs defaultValue="environmental" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="environmental">Environmental Statement</TabsTrigger>
        <TabsTrigger value="social">Social Responsibility</TabsTrigger>
        <TabsTrigger value="governance">Corporate Governance</TabsTrigger>
        <TabsTrigger value="gamification">Engagement & Challenges</TabsTrigger>
      </TabsList>

      <TabsContent value="environmental" className="mt-4">
        <EnvironmentalReport factors={factors} transactions={transactions} goals={goals} departments={departments} />
      </TabsContent>

      <TabsContent value="social" className="mt-4">
        <SocialReport activities={activities} participations={socialParts} />
      </TabsContent>

      <TabsContent value="governance" className="mt-4">
        <GovernanceReport policies={policies} audits={audits} issues={issues} />
      </TabsContent>

      <TabsContent value="gamification" className="mt-4">
        <GamificationReport
          challenges={challenges}
          participations={gamificationParts}
          redemptions={redemptions}
        />
      </TabsContent>
    </Tabs>
  );
}
