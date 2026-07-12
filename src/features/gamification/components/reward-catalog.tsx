"use client";

import { useState } from "react";
import { Reward } from "../types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redeemRewardAction } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Gift, Loader2, AlertCircle } from "lucide-react";

interface CatalogProps {
  rewards: Reward[];
  userPoints: number;
  onRedeemed: (rewardId: number, pointsCost: number) => void;
}

export default function RewardCatalog({ rewards, userPoints, onRedeemed }: CatalogProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedeem = async () => {
    if (!selectedReward) return;
    setLoading(true);
    setError(null);
    try {
      const res = await redeemRewardAction(selectedReward.id);
      if (res.success) {
        onRedeemed(selectedReward.id, selectedReward.pointsCost);
        setSelectedReward(null);
      } else {
        setError(res.error || "Failed to redeem reward.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const outOfStock = reward.stock <= 0;
          const insufficient = userPoints < reward.pointsCost;

          return (
            <Card key={reward.id} className="overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                {reward.imageUrl && (
                  <div className="h-40 overflow-hidden relative bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow">
                      {reward.pointsCost} pts
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-extrabold">{reward.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-xs text-neutral-500 leading-normal mb-3">
                    {reward.description}
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    outOfStock ? "text-rose-500 font-black" : "text-neutral-450"
                  }`}>
                    {outOfStock ? "Out of Stock" : `Stock remaining: ${reward.stock} units`}
                  </span>
                </CardContent>
              </div>

              <CardFooter className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <Button
                  onClick={() => setSelectedReward(reward)}
                  disabled={outOfStock || insufficient}
                  className="w-full text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 mr-1" />
                  Redeem Reward
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={selectedReward !== null} onOpenChange={(o) => !o && setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reward Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem <b className="text-neutral-850 dark:text-white">{selectedReward?.title}</b>?
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Point Cost:</span>
                <span className="font-extrabold text-emerald-600">{selectedReward.pointsCost} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Your Points:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{userPoints} pts</span>
              </div>
              <div className="flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800 pt-2 font-bold">
                <span className="text-neutral-700 dark:text-neutral-350">Balance After:</span>
                <span className="text-neutral-900 dark:text-white">{userPoints - selectedReward.pointsCost} pts</span>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedReward(null)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRedeem}
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
    </div>
  );
}
