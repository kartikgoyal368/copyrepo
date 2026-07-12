import { Reward } from "../types";

export function canUserRedeem(
  userPoints: number,
  reward: Reward
): { eligible: boolean; reason?: string } {
  if (reward.stock <= 0) {
    return { eligible: false, reason: "Item is out of stock." };
  }
  if (userPoints < reward.pointsCost) {
    return { eligible: false, reason: `Requires ${reward.pointsCost} points (Balance: ${userPoints}).` };
  }
  return { eligible: true };
}
