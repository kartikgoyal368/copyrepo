"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { CarbonTransaction } from "../types";

export default function EmissionsChart({ transactions }: { transactions: CarbonTransaction[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: Record<number, { monthName: string; emissions: number; offsets: number }> = {};

    // Show last 5 months
    const currentMonth = new Date().getMonth();
    for (let i = 4; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      monthlyMap[mIdx] = { monthName: months[mIdx], emissions: 0, offsets: 0 };
    }

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const m = date.getMonth();
      if (monthlyMap[m] !== undefined) {
        if (tx.type === "emission") {
          monthlyMap[m].emissions += tx.amount / 1000; // convert to tonnes
        } else {
          monthlyMap[m].offsets += tx.amount / 1000;
        }
      }
    });

    return Object.values(monthlyMap);
  };

  const data = getChartData();

  if (!mounted) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading trend analysis...</span>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Footprint Over Time (t CO2e)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOffsets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
            <Area
              type="monotone"
              dataKey="emissions"
              name="Gross Emissions"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorEmissions)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="offsets"
              name="Mitigated Offsets"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorOffsets)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
