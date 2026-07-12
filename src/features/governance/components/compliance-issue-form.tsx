"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { complianceIssueSchema } from "../schemas";
import { createComplianceIssueAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2 } from "lucide-react";

interface IssueFormProps {
  users: { id: string; name: string | null; email: string }[];
  onSuccess: (issue: any) => void;
}

export default function ComplianceIssueForm({ users, onSuccess }: IssueFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(complianceIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "medium",
      ownerId: users[0]?.id || "",
      dueDate: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createComplianceIssueAction(data);

      if (result.success) {
        onSuccess({
          id: Math.random(),
          title: data.title,
          description: data.description,
          severity: data.severity,
          status: "open",
          ownerId: data.ownerId,
          ownerName: users.find((u) => u.id === data.ownerId)?.name || "Employee User",
          dueDate: new Date(data.dueDate),
          resolvedAt: null,
          resolvedById: null,
          createdAt: new Date(),
        });
        setOpen(false);
        reset();
      } else {
        setError(result.error || "Failed to log issue.");
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
        <ShieldAlert className="w-4 h-4" />
        Raise Compliance Issue
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Compliance Issue</DialogTitle>
            <DialogDescription>
              Record an observed compliance hazard, define severity rating, assign owner and set timeline target.
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
                Issue Summary
              </label>
              <input
                type="text"
                placeholder="e.g. Chemical Storage Leakage Risks in Block C"
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
                Description / Actions
              </label>
              <textarea
                placeholder="Describe observations, guidelines and expected corrective actions..."
                {...register("description")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Severity Rating
                </label>
                <select
                  {...register("severity")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Assign Owner
                </label>
                <select
                  {...register("ownerId")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Remediation Due
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                />
                {errors.dueDate && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.dueDate.message}
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
              <Button type="submit" disabled={loading} className="text-xs bg-emerald-600 text-white animate-pulse">
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Raising ticket...
                  </>
                ) : (
                  "Log Risk Issue"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
