"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleAutoEmissionAction, createCarbonTransactionAction } from "../actions";
import { autoCalculateEmissions, MOCK_OPERATIONAL_ACTIVITIES } from "../lib/auto-emission";
import { EmissionFactor } from "../types";
import { Cpu, RefreshCw, CheckCircle, Info } from "lucide-react";

interface AutoEmissionToggleCardProps {
  enabled: boolean;
  factors: EmissionFactor[];
  departments: { id: number; name: string }[];
  userRole: string;
  onEmissionLogged: (tx: any) => void;
}

export default function AutoEmissionToggleCard({
  enabled,
  factors,
  departments,
  userRole,
  onEmissionLogged,
}: AutoEmissionToggleCardProps) {
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const calculatedAmount = autoCalculateEmissions(MOCK_OPERATIONAL_ACTIVITIES, factors);
  const isAuthorized = userRole === "admin" || userRole === "manager";

  const handleToggle = async () => {
    if (!isAuthorized) return;
    setToggleLoading(true);
    setSuccessMsg(null);
    try {
      const result = await toggleAutoEmissionAction(!isEnabled);
      if (result.success) {
        setIsEnabled(!isEnabled);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleRunCompiler = async () => {
    setLoading(true);
    setSuccessMsg(null);
    try {
      const opsDept = departments.find((d) => d.name === "Operations") || departments[0] || { id: 1 };
      const res = await createCarbonTransactionAction({
        title: "Auto-Calculated Operational Footprint",
        amount: calculatedAmount,
        type: "emission",
        departmentId: opsDept.id,
        date: new Date(),
      });

      if (res.success) {
        setSuccessMsg(`Success: Computed operational logs! Added ${calculatedAmount} kg CO2e to ledger.`);
        // Reload to update state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-emerald-500/10 dark:border-emerald-500/5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Auto-Emission Calculations</CardTitle>
              <CardDescription>
                Compile carbon scores automatically from fleet fuel and energy usage logs.
              </CardDescription>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              disabled={toggleLoading || !isAuthorized}
              onClick={handleToggle}
              className="text-xs"
            >
              {toggleLoading ? "Toggling..." : isEnabled ? "Disable Auto-Calc" : "Enable Auto-Calc"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMsg && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-3">
            Pending Activity Queue (Awaiting Compilation)
          </span>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {MOCK_OPERATIONAL_ACTIVITIES.map((act) => (
              <div key={act.details} className="p-3 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50">
                <span className="text-[10px] text-neutral-400 font-semibold capitalize block">
                  {act.type} Record
                </span>
                <span className="text-sm font-extrabold text-neutral-850 dark:text-white block mt-1">
                  {act.value} {act.type === "fleet" ? "L" : act.type === "electricity" ? "kWh" : act.type === "manufacturing" ? "kg" : "USD"}
                </span>
                <span className="text-[9px] text-neutral-400 block truncate mt-1">
                  {act.details}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isEnabled ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <Info className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
              <span>
                Estimated Carbon Impact: <b className="text-neutral-800 dark:text-neutral-200">{calculatedAmount} kg CO2e</b>
              </span>
            </div>
            <Button
              disabled={loading}
              onClick={handleRunCompiler}
              className="text-xs bg-emerald-600 text-white cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Compiling...
                </>
              ) : (
                "Compile and Log Emissions"
              )}
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30 rounded-lg text-xs text-amber-800 dark:text-amber-400">
            Auto-Emission Calculations are currently disabled. Enable to run the automated background log compiler.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
