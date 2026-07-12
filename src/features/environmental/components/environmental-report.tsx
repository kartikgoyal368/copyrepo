"use client";

import { useState } from "react";
import { generateEnvironmentalReportData } from "../lib/environmental-report-data";
import { CarbonTransaction, EnvironmentalGoal } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnvironmentalReportProps {
  transactions: CarbonTransaction[];
  goals: EnvironmentalGoal[];
  departments: { id: number; name: string }[];
}

export default function EnvironmentalReport({
  transactions,
  goals,
  departments,
}: EnvironmentalReportProps) {
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const options = {
    departmentId: deptFilter !== "all" ? Number(deptFilter) : undefined,
    startDate: dateStart ? new Date(dateStart) : undefined,
    endDate: dateEnd ? new Date(dateEnd) : undefined,
  };

  const { transactions: filteredTx, goals: filteredGoals, summary } = generateEnvironmentalReportData(
    goals,
    transactions,
    options
  );

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div>
              <CardTitle className="text-sm font-bold">Environmental Disclosures Statement</CardTitle>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                Generate disclosures reports for carbon outputs and targets audits.
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Filters Panel */}
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-100 dark:border-neutral-850 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter Division
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-250 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Divisions</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Start Date
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-250 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              End Date
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-250 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
            />
          </div>
        </div>

        {/* Audit Disclosure Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Disclosed Emissions
            </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 block mt-1.5">
              {new Intl.NumberFormat().format(summary.totalEmissions)} kg
            </span>
            <span className="text-[9px] text-neutral-400 block mt-1">CO2 equivalent</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Offsets Claimed
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-1.5">
              {new Intl.NumberFormat().format(summary.totalOffsets)} kg
            </span>
            <span className="text-[9px] text-neutral-400 block mt-1">Certified credits</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Net Disclosure
            </span>
            <span className={`text-xl font-black block mt-1.5 ${summary.netEmissions <= 0 ? "text-emerald-600" : "text-amber-500"}`}>
              {new Intl.NumberFormat().format(summary.netEmissions)} kg
            </span>
            <span className="text-[9px] text-neutral-400 block mt-1">Net footprint load</span>
          </div>
        </div>

        {/* Disclosed transactions summary table */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Disclosed Transaction Records ({filteredTx.length})
            </span>
          </div>
          <div className="divide-y divide-neutral-150 dark:divide-neutral-850">
            {filteredTx.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                No logs matching selected audit parameters.
              </div>
            ) : (
              filteredTx.map((tx) => (
                <div key={tx.id} className="p-3 px-4 flex items-center justify-between text-xs hover:bg-neutral-50/50">
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 block">{tx.title}</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Date: {new Date(tx.date).toLocaleDateString()} | Division: {(tx as any).departmentName || "General"}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${tx.type === "offset" ? "text-emerald-600" : "text-rose-600"}`}>
                    {tx.type === "offset" ? "-" : "+"}
                    {tx.amount} kg CO2e
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
