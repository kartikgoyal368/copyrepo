"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emissionFactorSchema } from "../schemas";
import { createEmissionFactorAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface FactorFormProps {
  onSuccess: (factor: any) => void;
}

export default function EmissionFactorForm({ onSuccess }: FactorFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emissionFactorSchema),
    defaultValues: {
      name: "",
      category: "electricity",
      value: 0,
      unit: "kg CO2e/kWh",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createEmissionFactorAction({
        ...data,
        value: Number(data.value),
      });

      if (result.success) {
        onSuccess({
          id: Math.random(),
          name: data.name,
          category: data.category,
          value: Number(data.value),
          unit: data.unit,
          createdAt: new Date(),
        });
        setOpen(false);
        reset();
      } else {
        setError(result.error || "Failed to create factor.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outline" className="flex items-center gap-1.5 cursor-pointer">
        <Plus className="w-4 h-4" />
        New Factor Factor
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emission Conversion Factor</DialogTitle>
            <DialogDescription>
              Log standard conversion variables to translate activity counts to CO2 equivalent weights.
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
                Factor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Grid Electricity (US East)"
                {...register("name")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.name && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="electricity">Electricity</option>
                  <option value="gas">Natural Gas</option>
                  <option value="fuel">Fleet Fuel</option>
                  <option value="waste">Waste Management</option>
                </select>
                {errors.category && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.category.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Conversion Value
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  {...register("value")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.value && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.value.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Unit Description
              </label>
              <input
                type="text"
                placeholder="e.g. kg CO2e/kWh or kg CO2e/liter"
                {...register("unit")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.unit && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.unit.message}
                </span>
              )}
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
                    Adding...
                  </>
                ) : (
                  "Add Coefficient Factor"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
