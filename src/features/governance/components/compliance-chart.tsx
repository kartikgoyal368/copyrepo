"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ComplianceIssue } from "../types";

export default function ComplianceChart({ issues }: { issues: ComplianceIssue[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getChartData = () => {
    const severities = ["low", "medium", "high", "critical"];
    const map: Record<string, { name: string; count: number; fill: string }> = {
      low: { name: "Low Risk", count: 0, fill: "#a3a3a3" },
      medium: { name: "Medium Risk", count: 0, fill: "#eab308" },
      high: { name: "High Risk", count: 0, fill: "#f97316" },
      critical: { name: "Critical Risk", count: 0, fill: "#ef4444" },
    };

    issues.forEach((issue) => {
      if (issue.status === "open" && map[issue.severity]) {
        map[issue.severity].count += 1;
      }
    });

    return severities.map((s) => map[s]);
  };

  const data = getChartData();

  if (!mounted) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading risk scores...</span>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Active Issues by Risk Level
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} tickLine={false} />
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
            <Bar dataKey="count" name="Open Issues" radius={[4, 4, 0, 0]} maxBarSize={30}>
              {data.map((entry, index) => (
                <path key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
