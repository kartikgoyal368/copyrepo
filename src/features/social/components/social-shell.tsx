"use client";

import { useState } from "react";
import PageShell from "@/components/shell/page-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SocialKPIsPanel from "./social-kpis";
import SocialScoreCard from "./social-score-card";
import TrainingChart from "./training-chart";
import CsrParticipationChart from "./csr-participation-chart";
import DiversityMetricsPanel from "./diversity-metrics-panel";
import CsrActivityForm from "./csr-activity-form";
import CsrActivityTable from "./csr-activity-table";
import ParticipationForm from "./participation-form";
import ParticipationTable from "./participation-table";
import ApprovalPanel from "./approval-panel";
import { CsrActivity, EmployeeParticipation, DiversityMetric, TrainingCompletion } from "../types";

interface SocialShellProps {
  activities: CsrActivity[];
  participations: EmployeeParticipation[];
  diversity: DiversityMetric[];
  training: TrainingCompletion[];
  currentUser: { id: string; name: string | null; email: string; role: string };
}

export default function SocialShell({
  activities,
  participations,
  diversity,
  training,
  currentUser,
}: SocialShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [localActivities, setLocalActivities] = useState<CsrActivity[]>(activities);
  const [localParticipations, setLocalParticipations] = useState<EmployeeParticipation[]>(participations);

  const isAuthorized = currentUser.role === "admin" || currentUser.role === "manager";

  return (
    <PageShell
      title="Social Performance"
      description="Track corporate social responsibility (CSR) activities, employee volunteering, diversity demographics, and workforce compliance training."
    >
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* KPI Panel and Tabs (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <SocialKPIsPanel participations={localParticipations} training={training} diversity={diversity} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Diversity & Training</TabsTrigger>
              <TabsTrigger value="activities">CSR Activities</TabsTrigger>
              <TabsTrigger value="participations">Volunteer Logs</TabsTrigger>
              {isAuthorized && <TabsTrigger value="approvals">Awaiting Review</TabsTrigger>}
            </TabsList>

            {/* Overview Analytics */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <TrainingChart training={training} />
                <CsrParticipationChart participations={localParticipations} />
              </div>
              <DiversityMetricsPanel metrics={diversity} />
            </TabsContent>

            {/* CSR Activities */}
            <TabsContent value="activities" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Corporate Social Responsibility Initiatives
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Active volunteer schedules, environmental cleanup campaigns and mentorship drives.
                  </p>
                </div>
                {isAuthorized && (
                  <CsrActivityForm
                    onSuccess={(newActivity) => {
                      setLocalActivities((prev) => [newActivity, ...prev]);
                    }}
                  />
                )}
              </div>
              <CsrActivityTable activities={localActivities} />
            </TabsContent>

            {/* Volunteer Logs */}
            <TabsContent value="participations" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Volunteering Logs & Hours Ledger
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Employee volunteering registrations and hours logged.
                  </p>
                </div>
                <ParticipationForm
                  activities={localActivities}
                  onSuccess={(newPart) => {
                    setLocalParticipations((prev) => [newPart, ...prev]);
                  }}
                />
              </div>
              <ParticipationTable participations={localParticipations} />
            </TabsContent>

            {/* Awaiting Review Approvals */}
            {isAuthorized && (
              <TabsContent value="approvals" className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-200">
                    Volunteering Approvals Check
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Review and verify uploaded evidence before awarding XP/points to employees.
                  </p>
                </div>
                <ApprovalPanel
                  participations={localParticipations}
                  onStatusUpdated={(partId, status, remarks) => {
                    setLocalParticipations((prev) =>
                      prev.map((p) =>
                        p.id === partId
                          ? { ...p, status, remarks, approvedAt: new Date(), approvedById: currentUser.id }
                          : p
                      )
                    );
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Scoring Card (3 cols) */}
        <div className="lg:col-span-3">
          <SocialScoreCard participations={localParticipations} training={training} diversity={diversity} />
        </div>
      </div>
    </PageShell>
  );
}
