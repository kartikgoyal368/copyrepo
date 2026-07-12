import { DEFAULT_ESG_CONFIG } from "./constants";

export interface ScoreWeights {
  weightEnvironmental: number;
  weightSocial: number;
  weightGovernance: number;
}

export function calculateOverallScore(
  eScore: number,
  sScore: number,
  gScore: number,
  weights: ScoreWeights = DEFAULT_ESG_CONFIG
): number {
  const totalWeight = weights.weightEnvironmental + weights.weightSocial + weights.weightGovernance;
  if (totalWeight === 0) return 0;
  
  const weightedSum =
    eScore * weights.weightEnvironmental +
    sScore * weights.weightSocial +
    gScore * weights.weightGovernance;
    
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

// ESG score conversion grading
export function getEsgGrade(score: number): string {
  if (score >= 90) return "AAA";
  if (score >= 80) return "AA";
  if (score >= 70) return "A";
  if (score >= 60) return "BBB";
  if (score >= 50) return "BB";
  if (score >= 40) return "B";
  return "CCC";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-rose-600 dark:text-rose-400";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
  if (score >= 60) return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900";
  return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-900";
}
