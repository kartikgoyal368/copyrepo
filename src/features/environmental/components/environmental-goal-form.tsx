"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { environmentalGoalSchema } from "../schemas";
import { createEnvironmentalGoalAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, Loader2 } from "lucide-react";

interface GoalFormProps {
  departments: { id: number; name: string }[];
  onSuccess: (goal: any) => void;
}

export default function EnvironmentalGoalForm({ departments, onSuccess }: GoalFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(environmentalGoalSchema),
    defaultValues: {
      title: "",
      description: "",
      targetValue: 0,
      unit: "t CO2e",
      deadline: "",
      departmentId: departments[0]?.id || 1,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createEnvironmentalGoalAction({
        ...data,
        targetValue: Number(data.targetValue),
        departmentId: Number(data.departmentId),
      });

      if (result.success) {
        onSuccess({
          id: Math.random(),
          title: data.title,
          description: data.description,
          targetValue: Number(data.targetValue),
          currentValue: 0,
          unit: data.unit,
          deadline: new Date(data.deadline),
          status: "active",
          departmentId: Number(data.departmentId),
          departmentName: departments.find((d) => d.id === Number(data.departmentId))?.name || "Operations",
          createdAt: new Date(),
        });
        setOpen(false);
        reset();
      } else {
        setError(result.error || "Failed to create target goal.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="flex items-center gap-1.5 cursor-pointer">
        <Target className="w-4 h-4" />
        New Environmental Goal
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Environmental Target</DialogTitle>
            <DialogDescription>
              Define target metric limits, deadline dates and assign them to departments.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-3 rounded bg-rose-50 dark:bg-rose-950/20 text-xs text-rose-600 dark:text-rose-400 font-semibold border border-rose-200/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Goal Title
              </label>
              <input
                type="text"
                placeholder="e.g. Reduce Grid Power Consumption"
                {...register("title")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.title && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe scope, policies and logistics tracking rules..."
                {...register("description")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Target Value
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  {...register("targetValue")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.targetValue && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.targetValue.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. kWh, liters, kg CO2e"
                  {...register("unit")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.unit && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.unit.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Deadline Date
                </label>
                <input
                  type="date"
                  {...register("deadline")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.deadline && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.deadline.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Assigned Department
                </label>
                <select
                  {...register("departmentId")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.departmentId.message}
                  </span>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="text-xs bg-emerald-600 text-white">
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Target Goal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
