import { CsrActivity, EmployeeParticipation } from "../types";

export interface SocialReportOptions {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export function generateSocialReportData(
  activities: CsrActivity[],
  participations: EmployeeParticipation[],
  options: SocialReportOptions = {}
) {
  let filteredTx = [...participations];
  let filteredActivities = [...activities];

  if (options.userId) {
    filteredTx = filteredTx.filter((t) => t.userId === options.userId);
  }

  if (options.startDate) {
    const start = new Date(options.startDate).getTime();
    filteredTx = filteredTx.filter((t) => new Date(t.createdAt).getTime() >= start);
  }

  if (options.endDate) {
    const end = new Date(options.endDate).getTime();
    filteredTx = filteredTx.filter((t) => new Date(t.createdAt).getTime() <= end);
  }

  let totalHours = 0;
  let approvedHours = 0;
  let pendingCount = 0;

  filteredTx.forEach((p) => {
    totalHours += p.hoursLogged;
    if (p.status === "approved") {
      approvedHours += p.hoursLogged;
    } else if (p.status === "pending") {
      pendingCount++;
    }
  });

  return {
    participations: filteredTx,
    activities: filteredActivities,
    summary: {
      totalHours: Math.round(totalHours * 10) / 10,
      approvedHours: Math.round(approvedHours * 10) / 10,
      pendingCount,
      totalParticipations: filteredTx.length,
      approvedCount: filteredTx.filter((p) => p.status === "approved").length,
    },
  };
}
