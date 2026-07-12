"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { csrActivitySchema } from "../schemas";
import { createCsrActivityAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";

interface ActivityFormProps {
  onSuccess: (activity: any) => void;
}

export default function CsrActivityForm({ onSuccess }: ActivityFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(csrActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      points: 50,
      xp: 100,
      evidenceRequired: true,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCsrActivityAction({
        ...data,
        points: Number(data.points),
        xp: Number(data.xp),
      });

      if (result.success) {
        onSuccess({
          id: Math.random(),
          title: data.title,
          description: data.description,
          date: new Date(data.date),
          location: data.location,
          points: Number(data.points),
          xp: Number(data.xp),
          evidenceRequired: data.evidenceRequired,
          createdAt: new Date(),
        });
        setOpen(false);
        reset();
      } else {
        setError(result.error || "Failed to create activity.");
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
        <Calendar className="w-4 h-4" />
        New CSR Activity
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create CSR Volunteer Activity</DialogTitle>
            <DialogDescription>
              Schedule a new volunteering drive, define points allocation and evidence uploading rules.
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
                Activity Title
              </label>
              <input
                type="text"
                placeholder="e.g. Local Beach Cleanup Campaign"
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
                placeholder="Describe scope, locations and scheduling details..."
                {...register("description")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                />
                {errors.date && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.date.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Shore Bay"
                  {...register("location")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.location && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Redeemable Points
                </label>
                <input
                  type="number"
                  placeholder="50"
                  {...register("points")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  XP Awarded
                </label>
                <input
                  type="number"
                  placeholder="100"
                  {...register("xp")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="evidenceRequired"
                type="checkbox"
                {...register("evidenceRequired")}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300"
              />
              <label
                htmlFor="evidenceRequired"
                className="text-xs font-bold text-neutral-600 dark:text-neutral-350 cursor-pointer"
              >
                Require proof file uploads for employee logging approvals
              </label>
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
                  "Create Activity"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
