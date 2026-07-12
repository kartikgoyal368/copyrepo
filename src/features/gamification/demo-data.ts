import { Badge, Reward, Challenge, ChallengeParticipation, RewardRedemption } from "./types";

export const MOCK_BADGES: Badge[] = [
  { id: 1, name: "Eco Pioneer", description: "Unlocked by logging your first carbon transaction.", iconUrl: "leaf", unlockRule: "first_emission_logged", createdAt: new Date() },
  { id: 2, name: "Carbon Warrior", description: "Logged offset transactions exceeding 5,000 kg CO2e.", iconUrl: "shield", unlockRule: "offset_5k", createdAt: new Date() },
  { id: 3, name: "Compliance Champion", description: "Completed acknowledgement of all active compliance policies.", iconUrl: "award", unlockRule: "all_policies_read", createdAt: new Date() },
  { id: 4, name: "CSR Leader", description: "Participated in 3 or more approved CSR activities.", iconUrl: "flame", unlockRule: "three_csr", createdAt: new Date() },
  { id: 5, name: "Reward Collector", description: "Redeemed your first reward item from the platform catalog.", iconUrl: "gift", unlockRule: "first_redemption", createdAt: new Date() },
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 1,
    title: "Tree Planting Initiative",
    description: "Plant a native tree in your name via our forestry partner.",
    pointsCost: 300,
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Eco Coffee Mug",
    description: "Reusable, thermal insulated coffee mug made of organic bamboo fiber.",
    pointsCost: 600,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Extra Paid Day Off",
    description: "One additional paid day off added to your leave balance.",
    pointsCost: 3000,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Plastic-Free July",
    description: "Commit to using no single-use plastic cups, water bottles, or packaging.",
    startDate: new Date(Date.now() - 15 * 24 * 3600 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 3600 * 1000),
    points: 200,
    xp: 300,
    status: "active",
    evidenceRequired: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Carpool & Transit Week",
    description: "Commute to work via public transit, cycling, or carpooling.",
    startDate: new Date(Date.now() - 15 * 24 * 3600 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 3600 * 1000),
    points: 150,
    xp: 200,
    status: "active",
    evidenceRequired: false,
    createdAt: new Date(),
  },
];

export const MOCK_CHALLENGE_PARTICIPATIONS: (ChallengeParticipation & { userName?: string; challengeTitle?: string })[] = [
  {
    id: 1,
    userId: "usr_employee",
    userName: "Employee User",
    challengeId: 1,
    challengeTitle: "Plastic-Free July",
    progress: 75,
    status: "active",
    proofUrl: null,
    xpAwarded: 0,
    pointsAwarded: 0,
    approvedById: null,
    approvedAt: null,
    createdAt: new Date(),
  },
  {
    id: 2,
    userId: "usr_manager",
    userName: "Sustainability Manager",
    challengeId: 2,
    challengeTitle: "Carpool & Transit Week",
    progress: 100,
    status: "completed",
    proofUrl: "https://utfs.io/f/carpool_log.png",
    xpAwarded: 200,
    pointsAwarded: 150,
    approvedById: "usr_admin",
    approvedAt: new Date(),
    createdAt: new Date(),
  },
];

export const MOCK_REDEMPTIONS: (RewardRedemption & { rewardTitle?: string; userName?: string })[] = [
  {
    id: 1,
    userId: "usr_employee",
    userName: "Employee User",
    rewardId: 1,
    rewardTitle: "Tree Planting Initiative",
    redeemedAt: new Date(),
    status: "delivered",
    pointsDeducted: 300,
  },
];

export const MOCK_USER_LEADERBOARD = [
  { rank: 1, name: "Admin User", departmentName: "Operations", points: 1250, xp: 2500, avatar: "A" },
  { rank: 2, name: "Sustainability Manager", departmentName: "Sustainability", points: 850, xp: 1800, avatar: "M" },
  { rank: 3, name: "Employee User", departmentName: "Human Resources", points: 320, xp: 900, avatar: "E" },
  { rank: 4, name: "Auditor User", departmentName: "Compliance", points: 0, xp: 50, avatar: "U" },
];

export const MOCK_DEPARTMENT_LEADERBOARD = [
  { rank: 1, name: "Sustainability", score: 90.3, code: "SUST" },
  { rank: 2, name: "Compliance", score: 80.3, code: "COMP" },
  { rank: 3, name: "Operations", score: 79.7, code: "OPS" },
  { rank: 4, name: "Executive Suite", score: 78.5, code: "EXEC" },
  { rank: 5, name: "Product Design", score: 74.3, code: "PROD" },
  { rank: 6, name: "Human Resources", score: 69.7, code: "HR" },
];
