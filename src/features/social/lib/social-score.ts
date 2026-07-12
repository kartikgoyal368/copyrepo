import { EmployeeParticipation, TrainingCompletion, DiversityMetric } from "../types";

export function calculateSocialScore(
  participations: EmployeeParticipation[],
  training: TrainingCompletion[],
  diversity: DiversityMetric[]
): number {
  // 1. Volunteer Hours Score (40% weight)
  // Target benchmark: 50 approved hours across the workspace
  const volunteerHours = participations.reduce(
    (acc, p) => (p.status === "approved" ? acc + p.hoursLogged : acc),
    0
  );
  const volunteerScore = Math.min(100, (volunteerHours / 50) * 100);

  // 2. Training Completion Rate (30% weight)
  let trainingScore = 0;
  if (training.length > 0) {
    const completed = training.filter((t) => t.status === "completed").length;
    trainingScore = (completed / training.length) * 100;
  } else {
    trainingScore = 80;
  }

  // 3. Diversity Score (30% weight)
  let diversityScore = 75; // Default benchmark if no records exists
  if (diversity.length > 0) {
    diversityScore = diversity[0].diversityPercentage;
  }

  const overall = volunteerScore * 0.4 + trainingScore * 0.3 + diversityScore * 0.3;
  return Math.round(overall * 10) / 10;
}
