"use client";

import { useState } from "react";
import PageShell from "@/components/shell/page-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateSettingAction, createDepartmentAction } from "../actions";
import { Sliders, Building, CheckSquare, Save, Loader2, Plus, Info } from "lucide-react";

interface SettingsShellProps {
  settings: Record<string, string>;
  departments: { id: number; name: string; code: string }[];
  currentUser: { role: string };
}

export default function SettingsShell({
  settings,
  departments: initialDepartments,
  currentUser,
}: SettingsShellProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // General settings state
  const [evidenceRequired, setEvidenceRequired] = useState(settings.evidenceRequiredEnabled === "true");
  const [badgeAutoAward, setBadgeAutoAward] = useState(settings.badgeAutoAwardEnabled === "true");

  // Weights state
  const [weightE, setWeightE] = useState(Number(settings.weightEnvironmental || 40));
  const [weightS, setWeightS] = useState(Number(settings.weightSocial || 30));
  const [weightG, setWeightG] = useState(Number(settings.weightGovernance || 30));

  // Departments state
  const [departmentsList, setDepartmentsList] = useState(initialDepartments);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);

  const isAuthorized = currentUser.role === "admin";

  const handleSaveGeneral = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await updateSettingAction("evidenceRequiredEnabled", String(evidenceRequired));
      await updateSettingAction("badgeAutoAwardEnabled", String(badgeAutoAward));
      setSuccessMsg("General settings updated successfully.");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to save general settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeights = async () => {
    if (weightE + weightS + weightG !== 100) {
      setErrorMsg("Weights allocation total must sum up to precisely 100%.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await updateSettingAction("weightEnvironmental", String(weightE));
      await updateSettingAction("weightSocial", String(weightS));
      await updateSettingAction("weightGovernance", String(weightG));
      setSuccessMsg("Weights settings updated successfully.");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to save weights.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    setDeptLoading(true);
    setErrorMsg(null);
    try {
      const res = await createDepartmentAction(newDeptName, newDeptCode);
      if (res.success) {
        setDepartmentsList((prev) => [...prev, { id: Math.random(), name: newDeptName, code: newDeptCode }]);
        setNewDeptName("");
        setNewDeptCode("");
        setSuccessMsg("Department added successfully.");
      } else {
        setErrorMsg(res.error || "Failed to create department.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setDeptLoading(false);
    }
  };

  return (
    <PageShell
      title="System Settings"
      description="Configure platform rules, ESG weighting indices, and corporate department registration tables."
    >
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9 space-y-6">
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 text-xs text-rose-700 dark:text-rose-400 font-semibold">
              {errorMsg}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="general">Verification & Badges</TabsTrigger>
              <TabsTrigger value="scoring">Weights Allocation</TabsTrigger>
              <TabsTrigger value="departments">Departments Editor</TabsTrigger>
            </TabsList>

            {/* General Policy Toggles */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Verification Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <input
                      id="evidenceEnabled"
                      type="checkbox"
                      checked={evidenceRequired}
                      disabled={!isAuthorized}
                      onChange={(e) => setEvidenceRequired(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500"
                    />
                    <div className="space-y-1">
                      <label htmlFor="evidenceEnabled" className="text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                        Require Proof Uploads
                      </label>
                      <p className="text-[10px] text-neutral-500 leading-normal">
                        If enabled, employee volunteering entries and challenge participations require digital certificate uploads before managers can approve them.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-neutral-100 dark:border-neutral-800 pt-6">
                    <input
                      id="badgeAutoAward"
                      type="checkbox"
                      checked={badgeAutoAward}
                      disabled={!isAuthorized}
                      onChange={(e) => setBadgeAutoAward(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500"
                    />
                    <div className="space-y-1">
                      <label htmlFor="badgeAutoAward" className="text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                        Enable Automatic Badge Awarding
                      </label>
                      <p className="text-[10px] text-neutral-500 leading-normal">
                        Triggers background evaluation criteria to grant pioneering certifications to staff immediately upon satisfying environmental offset or policy read conditions.
                      </p>
                    </div>
                  </div>

                  {isAuthorized && (
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                      <Button onClick={handleSaveGeneral} disabled={loading} size="sm" className="bg-emerald-600 text-white cursor-pointer">
                        {loading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Save General Configuration
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weights Allocation */}
            <TabsContent value="scoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Index Scoring Allocation Weight %</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-100 dark:border-neutral-850 text-[10px] text-neutral-500 leading-normal flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Determine percentage allocation weights for E, S, and G module scores when compiling the platform's Executive ESG Index. All weights combined must total 100%.
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Environmental Index Weight
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={weightE}
                          disabled={!isAuthorized}
                          onChange={(e) => setWeightE(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-bold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Social Index Weight
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={weightS}
                          disabled={!isAuthorized}
                          onChange={(e) => setWeightS(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-bold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Governance Index Weight
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={weightG}
                          disabled={!isAuthorized}
                          onChange={(e) => setWeightG(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800 pt-6">
                    <span className="text-xs font-semibold text-neutral-500">
                      Total Calculated Weights:{" "}
                      <b className={weightE + weightS + weightG === 100 ? "text-emerald-600" : "text-rose-500"}>
                        {weightE + weightS + weightG}%
                      </b>
                    </span>

                    {isAuthorized && (
                      <Button onClick={handleSaveWeights} disabled={loading} size="sm" className="bg-emerald-600 text-white cursor-pointer">
                        {loading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Save Weights
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Department Registration Editor */}
            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Corporate Departments Ledger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isAuthorized && (
                    <form onSubmit={handleAddDept} className="flex gap-3 items-end p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-850">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                          Department Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Facilities Management"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                          Code Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. FACM"
                          value={newDeptCode}
                          onChange={(e) => setNewDeptCode(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
                        />
                      </div>

                      <Button type="submit" disabled={deptLoading || !newDeptName || !newDeptCode} size="sm" className="bg-emerald-600 text-white cursor-pointer h-9">
                        {deptLoading ? <Loader2 className="w-3 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                        Add Dept
                      </Button>
                    </form>
                  )}

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <div className="divide-y divide-neutral-150 dark:divide-neutral-850 text-xs">
                      {departmentsList.map((dept) => (
                        <div key={dept.id} className="p-3 px-4 flex justify-between items-center hover:bg-neutral-50/50">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">{dept.name}</span>
                          <span className="font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {dept.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Info card (3 cols) */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Settings Info
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs text-neutral-500 leading-normal space-y-3">
              <p>
                Platform features settings are checked live by backend Server Actions to maintain data integrity constraints.
              </p>
              <p>
                Only administrative roles (<code>admin</code>) possess clearance to mutate global settings toggles and indices allocations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
