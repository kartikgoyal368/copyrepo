"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carbonTransactionSchema } from "../schemas";
import { createCarbonTransactionAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2 } from "lucide-react";

interface TransactionFormProps {
  departments: { id: number; name: string }[];
  onSuccess: (transaction: any) => void;
}

export default function CarbonTransactionForm({ departments, onSuccess }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carbonTransactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: "emission",
      departmentId: departments[0]?.id || 1,
      date: new Date().toISOString().split("T")[0],
      proofUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCarbonTransactionAction({
        ...data,
        amount: Number(data.amount),
        departmentId: Number(data.departmentId),
      });

      if (result.success) {
        onSuccess({
          id: Math.random(),
          title: data.title,
          amount: Number(data.amount),
          type: data.type,
          departmentId: Number(data.departmentId),
          departmentName: departments.find((d) => d.id === Number(data.departmentId))?.name || "Operations",
          date: new Date(data.date),
          proofUrl: data.proofUrl || null,
          createdAt: new Date(),
        });
        setOpen(false);
        reset();
      } else {
        setError(result.error || "Failed to log transaction.");
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
        <ClipboardList className="w-4 h-4" />
        Log Carbon Transaction
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Carbon Transaction</DialogTitle>
            <DialogDescription>
              Record an environmental carbon footprint impact or offset certificate purchase.
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
                Transaction Description
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly HQ Electricity Footprint or Wind Offset Cert"
                {...register("title")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.title && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Amount (kg CO2e)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  {...register("amount")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.amount && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.amount.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="emission">Emission (Output)</option>
                  <option value="offset">Offset (Mitigation)</option>
                </select>
                {errors.type && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.type.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.date && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.date.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Department
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

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Proof Document URL (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. https://utfs.io/f/offset_certificate.pdf"
                {...register("proofUrl")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.proofUrl && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.proofUrl.message}
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
                    Logging...
                  </>
                ) : (
                  "Log Transaction"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
