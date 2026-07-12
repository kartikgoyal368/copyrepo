import { CsrActivity, EmployeeParticipation, DiversityMetric, TrainingCompletion } from "./types";

export const MOCK_CSR_ACTIVITIES: CsrActivity[] = [
  {
    id: 1,
    title: "Urban Reforestation Day",
    description: "Volunteer to plant native trees in the metropolitan city park.",
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    location: "Central Park West",
    points: 100,
    xp: 150,
    evidenceRequired: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Coastal Plastic Cleanup",
    description: "Help clean plastic debris, micro-particles and waste along the beach coastline.",
    date: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    location: "Sunset Bay Coastline",
    points: 150,
    xp: 200,
    evidenceRequired: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Green Tech Mentorship",
    description: "Teach basic coding and environmental science projects to local under-resourced schools.",
    date: new Date(Date.now() + 15 * 24 * 3600 * 1000),
    location: "Westside Community Center",
    points: 80,
    xp: 100,
    evidenceRequired: false,
    createdAt: new Date(),
  },
];

export const MOCK_PARTICIPATIONS: (EmployeeParticipation & { userName?: string; csrActivityTitle?: string })[] = [
  {
    id: 1,
    userId: "usr_employee",
    userName: "Employee User",
    csrActivityId: 1,
    csrActivityTitle: "Urban Reforestation Day",
    hoursLogged: 4,
    status: "approved",
    proofUrl: "https://utfs.io/f/volunteering_proof1.jpg",
    remarks: "Planted 5 oak saplings with the team.",
    approvedById: "usr_manager",
    approvedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: 2,
    userId: "usr_admin",
    userName: "Admin User",
    csrActivityId: 1,
    csrActivityTitle: "Urban Reforestation Day",
    hoursLogged: 3,
    status: "pending",
    proofUrl: "https://utfs.io/f/volunteering_proof2.jpg",
    remarks: "Coordinate tools distribution and transport.",
    approvedById: null,
    approvedAt: null,
    createdAt: new Date(),
  },
];

export const MOCK_DIVERSITY_METRICS: DiversityMetric[] = [
  {
    id: 1,
    departmentId: 1,
    genderRatio: "55:45",
    diversityPercentage: 35.5,
    ageDistribution: JSON.stringify({ "18-25": 15, "26-35": 45, "36-50": 30, "50+": 10 }),
    period: "2026",
    createdAt: new Date(),
  },
];

export const MOCK_TRAINING_COMPLETIONS: (TrainingCompletion & { userName?: string })[] = [
  { id: 1, userId: "usr_employee", userName: "Employee User", trainingName: "Cybersecurity & Data Privacy Basics", completionDate: new Date(), status: "completed", createdAt: new Date() },
  { id: 2, userId: "usr_manager", userName: "Sustainability Manager", trainingName: "Ethical Procurement & Anti-Bribery Standards", completionDate: new Date(), status: "completed", createdAt: new Date() },
  { id: 3, userId: "usr_admin", userName: "Admin User", trainingName: "Health, Safety & Environmental Auditing", completionDate: new Date(), status: "completed", createdAt: new Date() },
];
