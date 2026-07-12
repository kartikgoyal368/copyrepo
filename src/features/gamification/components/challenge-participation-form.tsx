"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { challengeParticipationSchema } from "../schemas";
import { updateChallengeProgressAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChallengeProofUpload from "./challenge-proof-upload";
import { Edit3, Loader2 } from "lucide-react";
import { Challenge, ChallengeParticipation } from "../types";

interface FormProps {
  challenges: Challenge[];
  participations: ChallengeParticipation[];
  onSuccess: (updatedPart: any) => void;
}

export default function ChallengeParticipationForm({
  challenges,
  participations,
  onSuccess,
}: FormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proofUrlValue, setProofUrlValue] = useState("");

  const enrolledParts = participations.filter((p) => p.status === "active");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(challengeParticipationSchema),
    defaultValues: {
      challengeId: enrolledParts[0]?.challengeId || 1,
      progress: 0,
      proofUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        challengeId: Number(data.challengeId),
        progress: Number(data.progress),
        proofUrl: proofUrlValue || null,
      };

      const result = await updateChallengeProgressAction(payload);

      if (result.success) {
        // Find existing participation and update
        const existing = participations.find((p) => p.challengeId === payload.challengeId);
        if (existing) {
          onSuccess({
            ...existing,
            progress: payload.progress,
            proofUrl: payload.proofUrl || existing.proofUrl,
          });
        }
        setOpen(false);
        setProofUrlValue("");
        reset();
      } else {
        setError(result.error || "Failed to log progress.");
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
        <Edit3 className="w-4 h-4" />
        Log Progress
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Campaign Progress</DialogTitle>
            <DialogDescription>
              Update your task progress completion rate and upload confirmation logs.
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
                Active Campaigns
              </label>
              {enrolledParts.length === 0 ? (
                <div className="p-3 text-xs bg-neutral-100 rounded text-neutral-500 italic">
                  You are not enrolled in any active challenges. Join one from the list.
                </div>
              ) : (
                <select
                  {...register("challengeId")}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  {enrolledParts.map((part) => (
                    <option key={part.id} value={part.challengeId}>
                      {(part as any).challengeTitle || `Challenge ID ${part.challengeId}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Progress Percentage (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                {...register("progress")}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
              />
              {errors.progress && (
                <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                  {errors.progress.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Upload Verification Evidence
              </label>
              <ChallengeProofUpload onUploadComplete={(url) => setProofUrlValue(url)} />
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
              <Button
                type="submit"
                disabled={loading || enrolledParts.length === 0}
                className="text-xs bg-emerald-600 text-white cursor-pointer animate-pulse"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Progress Logs"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
