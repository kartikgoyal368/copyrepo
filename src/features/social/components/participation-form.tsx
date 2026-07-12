"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { participationSchema } from "../schemas";
import { logParticipationAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProofUpload from "./proof-upload";
import { UserCheck, Loader2 } from "lucide-react";
import { CsrActivity } from "../types";

interface FormProps {
  activities: CsrActivity[];
  onSuccess: (part: any) => void;
}

export default function ParticipationForm({ activities, onSuccess }: FormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proofUrlValue, setProofUrlValue] = useState("");

  const activeActivities = activities.filter((a) => new Date(a.date).getTime() >= Date.now() - 30 * 24 * 3600 * 1000);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(participationSchema),
    defaultValues: {
      csrActivityId: activities[0]?.id || 1,
      hoursLogged: 1,
      proofUrl: "",
      remarks: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        csrActivityId: Number(data.csrActivityId),
        hoursLogged: Number(data.hoursLogged),
        proofUrl: proofUrlValue || null,
      };

      const result = await logParticipationAction(payload);

      if (result.success) {
        onSuccess({
          id: Math.random(),
          userId: "usr_employee",
          userName: "Current User",
          csrActivityId: Number(data.csrActivityId),
          csrActivityTitle: activities.find((a) => a.id === Number(data.csrActivityId))?.title || "CSR Activity",
          hoursLogged: Number(data.hoursLogged),
          status: "pending",
          proofUrl: proofUrlValue || null,
          remarks: data.remarks || null,
          approvedById: null,
          approvedAt: null,
          createdAt: new Date(),
        });
        setOpen(false);
        setProofUrlValue("");
        reset();
      } else {
        setError(result.error || "Failed to log hours.");
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
        <UserCheck className="w-4 h-4" />
        Log Volunteer Hours
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Volunteer Hours</DialogTitle>
            <DialogDescription>
              Submit participation logs and volunteering certificate file.
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
                Select CSR Activity
              </label>
              <select
                {...register("csrActivityId")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {activities.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Volunteering Hours Spent
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="1.0"
                {...register("hoursLogged")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.hoursLogged && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.hoursLogged.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Activity Details / Notes
              </label>
              <textarea
                placeholder="Details of your volunteering contributions..."
                {...register("remarks")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Provide Upload Evidence
              </label>
              <ProofUpload onUploadComplete={(url) => setProofUrlValue(url)} />
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
                    Submitting...
                  </>
                ) : (
                  "Submit Volunteer Log"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
