"use client";

import { useState } from "react";
import PageShell from "@/components/shell/page-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EnvironmentalKPIsPanel from "./environmental-kpis";
import EnvironmentalScoreCard from "./environmental-score-card";
import EmissionsChart from "./emissions-chart";
import DepartmentCarbonChart from "./department-carbon-chart";
import AutoEmissionToggleCard from "./auto-emission-toggle-card";
import CarbonTransactionTable from "./carbon-transaction-table";
import CarbonTransactionForm from "./carbon-transaction-form";
import EnvironmentalGoalForm from "./environmental-goal-form";
import EmissionFactorTable from "./emission-factor-table";
import EmissionFactorForm from "./emission-factor-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Leaf, Award, Calendar, ShieldCheck, Database } from "lucide-react";
import { EnvironmentalGoal, CarbonTransaction, EmissionFactor } from "../types";

interface EnvironmentalShellProps {
  initialTransactions: CarbonTransaction[];
  initialGoals: EnvironmentalGoal[];
  initialFactors: EmissionFactor[];
  departments: { id: number; name: string; code: string }[];
  isAutoCalculationEnabled: boolean;
  currentUser: { id: string; name: string | null; email: string; role: string };
}

export default function EnvironmentalShell({
  initialTransactions,
  initialGoals,
  initialFactors,
  departments,
  isAutoCalculationEnabled,
  currentUser,
}: EnvironmentalShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [goals, setGoals] = useState(initialGoals);
  const [factors, setFactors] = useState(initialFactors);

  return (
    <PageShell
      title="Environmental Performance"
      description="Track greenhouse gas emissions, offset purchases, regulatory targets, and operational carbon efficiency ratings."
    >
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* KPI Panel and Tabs (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <EnvironmentalKPIsPanel transactions={transactions} goals={goals} factors={factors} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
              <TabsTrigger value="transactions">Carbon Transactions</TabsTrigger>
              <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
              <TabsTrigger value="factors">Emission Factors</TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <EmissionsChart transactions={transactions} />
                <DepartmentCarbonChart transactions={transactions} />
              </div>

              {/* Dynamic calculations toggler card */}
              <AutoEmissionToggleCard
                enabled={isAutoCalculationEnabled}
                factors={factors}
                onEmissionLogged={(newTx) => {
                  setTransactions((prev) => [newTx, ...prev]);
                }}
                departments={departments}
                userRole={currentUser.role}
              />
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Carbon Offsets & Emissions Ledger
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Audit-ready records of carbon outputs and registered offsets.
                  </p>
                </div>
                {(currentUser.role === "admin" || currentUser.role === "manager" || currentUser.role === "employee") && (
                  <CarbonTransactionForm
                    departments={departments}
                    onSuccess={(newTx) => {
                      setTransactions((prev) => [newTx, ...prev]);
                    }}
                  />
                )}
              </div>
              <CarbonTransactionTable transactions={transactions} />
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Department Environmental Goals
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Environmental targets and reduction thresholds assigned to company divisions.
                  </p>
                </div>
                {(currentUser.role === "admin" || currentUser.role === "manager") && (
                  <EnvironmentalGoalForm
                    departments={departments}
                    onSuccess={(newGoal) => {
                      setGoals((prev) => [newGoal, ...prev]);
                    }}
                  />
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                  return (
                    <Card key={goal.id} className="hover:border-emerald-200 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-sm font-bold text-neutral-800 dark:text-white">
                            {goal.title}
                          </CardTitle>
                          <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                            goal.status === "achieved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                          }`}>
                            {goal.status.toUpperCase()}
                          </span>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">{goal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-neutral-500">Progress</span>
                          <span>
                            {goal.currentValue} / {goal.targetValue} {goal.unit} ({progress}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          Target Date: {new Date(goal.deadline).toLocaleDateString()}
                          <span className="mx-1">•</span>
                          Dept: {(goal as any).departmentName || "Global"}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Emission Factors Tab */}
            <TabsContent value="factors" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Carbon Conversion Coefficients
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Conversion coefficients matching consumption (kWh, liters, kg) to kg CO2e.
                  </p>
                </div>
                {(currentUser.role === "admin" || currentUser.role === "manager") && (
                  <EmissionFactorForm
                    onSuccess={(newFactor) => {
                      setFactors((prev) => [...prev, newFactor]);
                    }}
                  />
                )}
              </div>
              <EmissionFactorTable factors={factors} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Scoring Card and static side panel (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <EnvironmentalScoreCard goals={goals} transactions={transactions} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                Auditor Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    EPA Compliant
                  </span>
                  <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                    Factors match standard EPA regulatory multipliers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Audit Ledger
                  </span>
                  <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
                    Immutable history records support third-party auditor exports.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
