"use client";

import { useState } from "react";
import { generateSocialReportData } from "../lib/social-report-data";
import { CsrActivity, EmployeeParticipation } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SocialReportProps {
  activities: CsrActivity[];
  participations: EmployeeParticipation[];
}

export default function SocialReport({ activities, participations }: SocialReportProps) {
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const options = {
    userId: userFilter !== "all" ? userFilter : undefined,
    startDate: dateStart ? new Date(dateStart) : undefined,
    endDate: dateEnd ? new Date(dateEnd) : undefined,
  };

  const { participations: filteredParts, summary } = generateSocialReportData(
    activities,
    participations,
    options
  );

  // Extract unique user accounts for filter list
  const uniqueUsers = Array.from(
    new Map(
      participations
        .map((p) => ({ id: p.userId, name: (p as any).userName || "Employee User" }))
        .map((u) => [u.id, u])
    ).values()
  );

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div>
              <CardTitle className="text-sm font-bold">Social Disclosures Statement</CardTitle>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                Generate disclosures reports for employee volunteering hours and training completions.
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Filters Panel */}
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-100 dark:border-neutral-850 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter Employee
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-250 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Employees</option>
              {uniqueUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Start Date
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-255 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-455 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              End Date
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-255 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
            />
          </div>
        </div>

        {/* Audit Disclosure Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Total Volunteered Hours
            </span>
            <span className="text-xl font-black text-neutral-800 dark:text-neutral-100 block mt-1.5">
              {new Intl.NumberFormat().format(summary.totalHours)} hrs
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Logged total hours</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Approved Volunteering Hours
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-1.5">
              {new Intl.NumberFormat().format(summary.approvedHours)} hrs
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Approved hours count</span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Pending Log Requests
            </span>
            <span className={`text-xl font-black block mt-1.5 ${summary.pendingCount > 0 ? "text-amber-500" : "text-neutral-500"}`}>
              {summary.pendingCount} logs
            </span>
            <span className="text-[9px] text-neutral-450 block mt-1">Awaiting validation</span>
          </div>
        </div>

        {/* Disclosed transactions summary table */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Disclosed Volunteering Logs ({filteredParts.length})
            </span>
          </div>
          <div className="divide-y divide-neutral-150 dark:divide-neutral-850">
            {filteredParts.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                No logs matching selected audit parameters.
              </div>
            ) : (
              filteredParts.map((part) => (
                <div key={part.id} className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-neutral-50/50">
                  <div>
                    <span className="font-bold text-neutral-850 dark:text-neutral-200 block">
                      {(part as any).userName || "Employee User"} - {(part as any).csrActivityTitle || "CSR Initiative"}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Submitted: {formatDate(part.createdAt)} | Status: <b className="uppercase">{part.status}</b>
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {part.hoursLogged} hrs
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
