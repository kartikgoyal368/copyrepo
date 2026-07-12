export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  AUDITOR: "auditor",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const DEFAULT_ESG_CONFIG = {
  autoEmissionCalculationEnabled: true,
  evidenceRequiredEnabled: true,
  badgeAutoAwardEnabled: true,
  weightEnvironmental: 40,
  weightSocial: 30,
  weightGovernance: 30,
};

export const ESG_CATEGORIES = {
  ENVIRONMENTAL: "environmental",
  SOCIAL: "social",
  GOVERNANCE: "governance",
} as const;

export type EsgCategory = typeof ESG_CATEGORIES[keyof typeof ESG_CATEGORIES];

export const EMISSION_CATEGORIES = {
  ELECTRICITY: "electricity",
  GAS: "gas",
  FUEL: "fuel",
  WASTE: "waste",
} as const;

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const ISSUE_STATUS = {
  OPEN: "open",
  RESOLVED: "resolved",
} as const;

export const CHALLENGE_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  UNDER_REVIEW: "under_review",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;
