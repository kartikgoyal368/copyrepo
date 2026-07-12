"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Reward } from "../types";

interface DialogProps {
  reward: Reward | null;
  userPoints: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function RedeemRewardDialog({
  reward,
  userPoints,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: DialogProps) {
  if (!reward) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Reward Redemption</DialogTitle>
          <DialogDescription>
            Are you sure you want to redeem <b className="text-neutral-850 dark:text-white">{reward.title}</b>?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Point Cost:</span>
            <span className="font-extrabold text-emerald-600">{reward.pointsCost} pts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Your Points:</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{userPoints} pts</span>
          </div>
          <div className="flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800 pt-2 font-bold">
            <span className="text-neutral-700 dark:text-neutral-350">Balance After:</span>
            <span className="text-neutral-900 dark:text-white">{userPoints - reward.pointsCost} pts</span>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="text-xs bg-emerald-600 text-white cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Redemption"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
