"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CarbonTransaction } from "../types";
import { groupEmissionsByDepartment } from "../lib/calculate-emissions";

export default function DepartmentCarbonChart({ transactions }: { transactions: CarbonTransaction[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawData = groupEmissionsByDepartment(transactions);
  const data = rawData.map((d) => ({
    ...d,
    emissions: Math.round((d.emissions / 1000) * 10) / 10, // convert to tonnes
    offsets: Math.round((d.offsets / 1000) * 10) / 10,
    net: Math.round((d.net / 1000) * 10) / 10,
  }));

  if (!mounted) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading department footprint...</span>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Net Emissions by Division (t CO2e)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
            <XAxis type="number" stroke="#a3a3a3" fontSize={10} tickLine={false} />
            <YAxis dataKey="name" type="category" stroke="#a3a3a3" fontSize={10} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{
                background: "rgba(23, 23, 23, 0.95)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="net" name="Net Footprint" fill="#ef4444" radius={[0, 4, 4, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
