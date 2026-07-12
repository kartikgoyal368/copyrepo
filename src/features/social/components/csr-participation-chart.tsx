"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { EmployeeParticipation } from "../types";

export default function CsrParticipationChart({ participations }: { participations: EmployeeParticipation[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: Record<number, { monthName: string; hours: number }> = {};

    const currentMonth = new Date().getMonth();
    // Show last 5 months
    for (let i = 4; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      monthlyMap[mIdx] = { monthName: months[mIdx], hours: 0 };
    }

    participations.forEach((p) => {
      if (p.status === "approved") {
        const date = new Date(p.createdAt);
        const m = date.getMonth();
        if (monthlyMap[m] !== undefined) {
          monthlyMap[m].hours += p.hoursLogged;
        }
      }
    });

    return Object.values(monthlyMap);
  };

  const data = getChartData();

  if (!mounted) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading volunteering trend...</span>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Volunteering Hours Logged (Monthly)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="monthName" stroke="#a3a3a3" fontSize={10} tickLine={false} />
            <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(23, 23, 23, 0.95)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "11px",
              }}
            />
            <Line type="monotone" dataKey="hours" name="Hours Logged" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
