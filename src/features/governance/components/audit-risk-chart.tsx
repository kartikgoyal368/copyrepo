"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Audit } from "../types";

export default function AuditRiskChart({ audits }: { audits: Audit[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getChartData = () => {
    // Sort audits by date ascending
    const sorted = [...audits]
      .filter((a) => a.status === "completed")
      .sort((a, b) => new Date(a.auditDate).getTime() - new Date(b.auditDate).getTime());

    return sorted.map((a) => ({
      name: a.title.replace("Compliance Check", "").replace("Audit", "").trim(),
      findings: a.findingsCount,
    }));
  };

  const data = getChartData();

  if (!mounted) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading audit history...</span>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Findings Count by Audit Campaign
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-450 italic">
              No completed audit records available.
            </div>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" stroke="#a3a3a3" fontSize={9} tickLine={false} />
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
              <Bar dataKey="findings" name="Findings Count" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
