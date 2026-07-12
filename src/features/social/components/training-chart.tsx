"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { TrainingCompletion } from "../types";

export default function TrainingChart({ training }: { training: TrainingCompletion[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getChartData = () => {
    const map: Record<string, { name: string; completed: number; pending: number }> = {};

    training.forEach((t) => {
      if (!map[t.trainingName]) {
        map[t.trainingName] = { name: t.trainingName, completed: 0, pending: 0 };
      }
      if (t.status === "completed") {
        map[t.trainingName].completed += 1;
      } else {
        map[t.trainingName].pending += 1;
      }
    });

    return Object.values(map);
  };

  const data = getChartData();

  if (!mounted) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading training logs...</span>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-neutral-850 dark:text-white">
          Workforce Compliance Training Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
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
            <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
            <Bar dataKey="completed" name="Completed" fill="#10b981" stackId="a" maxBarSize={30} />
            <Bar dataKey="pending" name="Pending Review" fill="#f59e0b" stackId="a" maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
