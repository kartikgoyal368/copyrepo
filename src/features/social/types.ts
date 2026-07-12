import {
  csrActivities,
  employeeParticipations,
  diversityMetrics,
  trainingCompletions,
} from "@/server/db/schema";

export type CsrActivity = typeof csrActivities.$inferSelect;
export type EmployeeParticipation = typeof employeeParticipations.$inferSelect;
export type DiversityMetric = typeof diversityMetrics.$inferSelect;
export type TrainingCompletion = typeof trainingCompletions.$inferSelect;

export interface SocialKPIs {
  volunteerHoursTotal: number;
  csrActivitiesCount: number;
  diversityIndex: number;
  trainingCompletionRate: number;
}
