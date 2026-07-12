import { Badge } from "../types";

export function checkBadgeUnlockEligibility(
  userState: {
    loggedEmissionsCount: number;
    offsetAmountTotal: number;
    policiesReadCount: number;
    csrActivitiesCount: number;
    redemptionsCount: number;
  },
  badge: Badge
): boolean {
  switch (badge.unlockRule) {
    case "first_emission_logged":
      return userState.loggedEmissionsCount > 0;
    case "offset_5k":
      return userState.offsetAmountTotal >= 5000;
    case "all_policies_read":
      return userState.policiesReadCount >= 3;
    case "three_csr":
      return userState.csrActivitiesCount >= 3;
    case "first_redemption":
      return userState.redemptionsCount > 0;
    default:
      return false;
  }
}
