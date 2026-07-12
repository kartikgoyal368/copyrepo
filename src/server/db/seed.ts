import { db } from "./client";
import {
  departments,
  categories,
  users,
  emissionFactors,
  badges,
  rewards,
  challenges,
  environmentalGoals,
  carbonTransactions,
  csrActivities,
  esgPolicies,
  audits,
  complianceIssues,
  settings,
  departmentScores,
} from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding started...");

  // 1. Clean existing data
  // Due to foreign keys, delete in reverse order of reference
  console.log("Clearing existing records...");
  await db.delete(departmentScores);
  await db.delete(complianceIssues);
  await db.delete(audits);
  await db.delete(esgPolicies);
  await db.delete(csrActivities);
  await db.delete(carbonTransactions);
  await db.delete(environmentalGoals);
  await db.delete(challenges);
  await db.delete(rewards);
  await db.delete(badges);
  await db.delete(emissionFactors);
  await db.delete(settings);
  await db.delete(users);
  await db.delete(categories);
  await db.delete(departments);

  // 2. Insert Departments
  console.log("Seeding departments...");
  const [deptOps, deptSust, deptComp, deptHr, deptProd, deptExec] = await db
    .insert(departments)
    .values([
      { name: "Operations", code: "OPS" },
      { name: "Sustainability", code: "SUST" },
      { name: "Compliance", code: "COMP" },
      { name: "Human Resources", code: "HR" },
      { name: "Product Design", code: "PROD" },
      { name: "Executive Suite", code: "EXEC" },
    ])
    .returning();

  // 3. Insert Categories
  console.log("Seeding ESG categories...");
  await db.insert(categories).values([
    { name: "Carbon & Climate Change", code: "CARBON", type: "environmental" },
    { name: "Waste Management", code: "WASTE", type: "environmental" },
    { name: "Water Stewardship", code: "WATER", type: "environmental" },
    { name: "Labor Practices", code: "LABOR", type: "social" },
    { name: "Community Engagement", code: "COMMUNITY", type: "social" },
    { name: "Diversity & Inclusion", code: "DIVERSITY", type: "social" },
    { name: "Business Ethics", code: "ETHICS", type: "governance" },
    { name: "Data Security", code: "SECURITY", type: "governance" },
    { name: "Compliance & Risk", code: "COMPLIANCE", type: "governance" },
  ]);

  // 4. Insert Users
  console.log("Seeding demo users...");
  const hashedPassword = bcrypt.hashSync("password123", 10);

  const [adminUser, managerUser, employeeUser, auditorUser] = await db
    .insert(users)
    .values([
      {
        id: "usr_admin",
        name: "Admin User",
        email: "admin@ecosphere.dev",
        password: hashedPassword,
        role: "admin",
        departmentId: deptOps.id,
        pointsBalance: 1250,
        xpTotal: 2500,
      },
      {
        id: "usr_manager",
        name: "Sustainability Manager",
        email: "manager@ecosphere.dev",
        password: hashedPassword,
        role: "manager",
        departmentId: deptSust.id,
        pointsBalance: 850,
        xpTotal: 1800,
      },
      {
        id: "usr_employee",
        name: "Employee User",
        email: "employee@ecosphere.dev",
        password: hashedPassword,
        role: "employee",
        departmentId: deptHr.id,
        pointsBalance: 320,
        xpTotal: 900,
      },
      {
        id: "usr_auditor",
        name: "Auditor User",
        email: "auditor@ecosphere.dev",
        password: hashedPassword,
        role: "auditor",
        departmentId: deptComp.id,
        pointsBalance: 0,
        xpTotal: 50,
      },
    ])
    .returning();

  // 5. Insert Emission Factors
  console.log("Seeding emission factors...");
  await db.insert(emissionFactors).values([
    { name: "Grid Electricity", category: "electricity", value: 0.385, unit: "kg CO2e/kWh" },
    { name: "Natural Gas", category: "gas", value: 2.03, unit: "kg CO2e/m³" },
    { name: "Fleet Fuel (Petrol)", category: "fuel", value: 2.31, unit: "kg CO2e/liter" },
    { name: "Fleet Fuel (Diesel)", category: "fuel", value: 2.68, unit: "kg CO2e/liter" },
    { name: "Landfill Waste", category: "waste", value: 0.45, unit: "kg CO2e/kg" },
    { name: "Recycled Paper/Plastic", category: "waste", value: 0.02, unit: "kg CO2e/kg" },
  ]);

  // 6. Insert Badges
  console.log("Seeding badges...");
  await db.insert(badges).values([
    {
      name: "Eco Pioneer",
      description: "Unlocked by logging your first carbon transaction.",
      iconUrl: "leaf",
      unlockRule: "first_emission_logged",
    },
    {
      name: "Carbon Warrior",
      description: "Logged offset transactions exceeding 5,000 kg CO2e.",
      iconUrl: "shield",
      unlockRule: "offset_5k",
    },
    {
      name: "Compliance Champion",
      description: "Completed acknowledgement of all active compliance policies.",
      iconUrl: "award",
      unlockRule: "all_policies_read",
    },
    {
      name: "CSR Leader",
      description: "Participated in 3 or more approved CSR activities.",
      iconUrl: "flame",
      unlockRule: "three_csr",
    },
    {
      name: "Reward Collector",
      description: "Redeemed your first reward item from the platform catalog.",
      iconUrl: "gift",
      unlockRule: "first_redemption",
    },
  ]);

  // 7. Insert Rewards
  console.log("Seeding rewards catalog...");
  await db.insert(rewards).values([
    {
      title: "Tree Planting Initiative",
      description: "Plant a native tree in your name via our forestry partner.",
      pointsCost: 300,
      stock: 150,
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=60",
    },
    {
      title: "Eco Coffee Mug",
      description: "Reusable, thermal insulated coffee mug made of organic bamboo fiber.",
      pointsCost: 600,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=60",
    },
    {
      title: "Extra Paid Day Off",
      description: "One additional paid day off added to your leave balance.",
      pointsCost: 3000,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&auto=format&fit=crop&q=60",
    },
    {
      title: "EV Charging Voucher",
      description: "A voucher for 50 kWh of free charging at public EV stations.",
      pointsCost: 1000,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&auto=format&fit=crop&q=60",
    },
  ]);

  // 8. Insert Challenges
  console.log("Seeding challenges...");
  const challengeStartDate = new Date();
  challengeStartDate.setDate(challengeStartDate.getDate() - 15);
  const challengeEndDate = new Date();
  challengeEndDate.setDate(challengeEndDate.getDate() + 15);

  await db.insert(challenges).values([
    {
      title: "Plastic-Free July",
      description: "Commit to using no single-use plastic cups, water bottles, or food packaging.",
      startDate: challengeStartDate,
      endDate: challengeEndDate,
      points: 200,
      xp: 300,
      status: "active",
      evidenceRequired: true,
    },
    {
      title: "Carpool & Transit Week",
      description: "Commute to work via public transit, cycling, or carpooling.",
      startDate: challengeStartDate,
      endDate: challengeEndDate,
      points: 150,
      xp: 200,
      status: "active",
      evidenceRequired: false,
    },
    {
      title: "Energy Conservation Drive",
      description: "Turn off monitors, standby systems, and desk lights at the end of every day.",
      startDate: challengeStartDate,
      endDate: challengeEndDate,
      points: 250,
      xp: 350,
      status: "active",
      evidenceRequired: true,
    },
  ]);

  // 9. Insert Environmental Goals
  console.log("Seeding environmental goals...");
  const goalDeadline = new Date();
  goalDeadline.setMonth(goalDeadline.getMonth() + 6);

  await db.insert(environmentalGoals).values([
    {
      title: "Reduce Fleet Diesel Consumption",
      description: "Optimize shipping routes and encourage EV fleet transitions.",
      targetValue: 8000,
      currentValue: 3200,
      unit: "liters",
      deadline: goalDeadline,
      status: "active",
      departmentId: deptOps.id,
    },
    {
      title: "Increase Recycled Content",
      description: "Design product cases using at least 50% PCR materials.",
      targetValue: 50,
      currentValue: 35,
      unit: "%",
      deadline: goalDeadline,
      status: "active",
      departmentId: deptProd.id,
    },
    {
      title: "Minimize HQ Electricity Footprint",
      description: "Convert office lighting to LED and implement automatic smart sensors.",
      targetValue: 40000,
      currentValue: 38000,
      unit: "kWh",
      deadline: goalDeadline,
      status: "active",
      departmentId: deptOps.id,
    },
  ]);

  // 10. Insert Carbon Transactions
  console.log("Seeding carbon transactions...");
  await db.insert(carbonTransactions).values([
    {
      title: "HQ Monthly Electricity Usage",
      amount: 14500.5,
      type: "emission",
      departmentId: deptOps.id,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Fleet Fuel Fill-up (Diesel)",
      amount: 4320.2,
      type: "emission",
      departmentId: deptOps.id,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Wind Power Offset Purchase",
      amount: 10000,
      type: "offset",
      departmentId: deptSust.id,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      proofUrl: "https://utfs.io/f/wind_offset_cert.pdf",
    },
    {
      title: "Gold Standard Forestation Offset",
      amount: 8000,
      type: "offset",
      departmentId: deptSust.id,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      proofUrl: "https://utfs.io/f/forest_offset_cert.pdf",
    },
  ]);

  // 11. Insert CSR Activities
  console.log("Seeding CSR activities...");
  const csrDate1 = new Date();
  csrDate1.setDate(csrDate1.getDate() - 10);
  const csrDate2 = new Date();
  csrDate2.setDate(csrDate2.getDate() + 10);

  await db.insert(csrActivities).values([
    {
      title: "Urban Reforestation Day",
      description: "Volunteer to plant native trees in the metropolitan city park.",
      date: csrDate1,
      location: "Central Park West",
      points: 100,
      xp: 150,
      evidenceRequired: true,
    },
    {
      title: "Coastal Plastic Cleanup",
      description: "Help clean plastic debris, micro-particles and waste along the beach coastline.",
      date: csrDate2,
      location: "Sunset Bay Coastline",
      points: 150,
      xp: 200,
      evidenceRequired: true,
    },
    {
      title: "Green Tech Mentorship",
      description: "Teach basic coding and environmental science projects to local under-resourced schools.",
      date: csrDate2,
      location: "Westside Community Center",
      points: 80,
      xp: 100,
      evidenceRequired: false,
    },
  ]);

  // 12. Insert ESG Policies
  console.log("Seeding ESG policies...");
  const policyDate = new Date();
  policyDate.setMonth(policyDate.getMonth() - 2);

  await db.insert(esgPolicies).values([
    {
      title: "Code of Business Conduct & Integrity",
      description: "Our core ethical parameters outlining compliance with local anti-bribery, ethics, and standard operational laws.",
      category: "governance",
      version: "2.3",
      effectiveDate: policyDate,
      createdById: adminUser.id,
    },
    {
      title: "Zero Single-Use Plastic Policy",
      description: "Internal company directive banning the stocking, purchase, and provisioning of single-use plastics inside corporate facilities.",
      category: "environmental",
      version: "1.0",
      effectiveDate: policyDate,
      createdById: managerUser.id,
    },
    {
      title: "Supplier Diversity & Inclusion Charter",
      description: "A framework prioritizing minority, woman, and veteran-owned vendors throughout corporate procurement operations.",
      category: "social",
      version: "1.2",
      effectiveDate: policyDate,
      createdById: adminUser.id,
    },
  ]);

  // 13. Insert Audits
  console.log("Seeding audits...");
  const auditDateCompleted = new Date();
  auditDateCompleted.setMonth(auditDateCompleted.getMonth() - 1);
  const auditDatePlanned = new Date();
  auditDatePlanned.setMonth(auditDatePlanned.getMonth() + 2);

  await db.insert(audits).values([
    {
      title: "Q1 Governance & Compliance Check",
      scope: "Internal audits of policy logs, disclosures and risk registers.",
      auditorName: "Auditor User",
      auditDate: auditDateCompleted,
      status: "completed",
      findingsCount: 1,
      rating: "Excellent",
      reportUrl: "https://utfs.io/f/q1_gov_report.pdf",
    },
    {
      title: "Annual Carbon Footprint Audit",
      scope: "External verification of utility logs, travel records and carbon offset calculations.",
      auditorName: "GreenTrust Auditing Solutions",
      auditDate: auditDatePlanned,
      status: "planned",
      findingsCount: 0,
    },
  ]);

  // 14. Insert Compliance Issues
  console.log("Seeding compliance issues...");
  const issuePastDue = new Date();
  issuePastDue.setDate(issuePastDue.getDate() - 5);
  const issueFutureDue = new Date();
  issueFutureDue.setDate(issueFutureDue.getDate() + 15);

  await db.insert(complianceIssues).values([
    {
      title: "Hazardous Waste Labeling Discrepancy",
      description: "Recycling drums in Warehouse B found missing updated EPA hazard warnings labels.",
      severity: "critical",
      status: "open",
      ownerId: managerUser.id,
      dueDate: issuePastDue, // Overdue compliance item
    },
    {
      title: "Policy Acknowledgement Below Threshold",
      description: "Supplier D&I policy acknowledgements in HR are currently at 65%, which is below the target threshold of 95%.",
      severity: "medium",
      status: "open",
      ownerId: employeeUser.id,
      dueDate: issueFutureDue,
    },
    {
      title: "Anti-Bribery Certification Overdue",
      description: "Compliance certification has not been logged for three board members.",
      severity: "high",
      status: "resolved",
      ownerId: adminUser.id,
      dueDate: issuePastDue,
      resolvedAt: new Date(),
      resolvedById: adminUser.id,
    },
  ]);

  // 15. Insert Settings Configuration
  console.log("Seeding default settings...");
  await db.insert(settings).values([
    { key: "autoEmissionCalculationEnabled", value: "true" },
    { key: "evidenceRequiredEnabled", value: "true" },
    { key: "badgeAutoAwardEnabled", value: "true" },
    { key: "weightEnvironmental", value: "40" },
    { key: "weightSocial", value: "30" },
    { key: "weightGovernance", value: "30" },
  ]);

  // 16. Insert Department Scores
  console.log("Seeding historical department scores...");
  const scoresData = [
    { dept: deptOps, env: 72.5, soc: 80.0, gov: 85.0, period: "2026-Q1" },
    { dept: deptOps, env: 78.0, soc: 84.0, gov: 85.0, period: "2026-Q2" },
    { dept: deptSust, env: 88.0, soc: 85.0, gov: 90.0, period: "2026-Q1" },
    { dept: deptSust, env: 92.5, soc: 88.5, gov: 90.0, period: "2026-Q2" },
    { dept: deptComp, env: 65.0, soc: 75.0, gov: 92.0, period: "2026-Q1" },
    { dept: deptComp, env: 68.0, soc: 78.0, gov: 95.0, period: "2026-Q2" },
    { dept: deptHr, env: 60.0, soc: 90.0, gov: 80.0, period: "2026-M06" },
    { dept: deptHr, env: 62.0, soc: 94.0, gov: 80.0, period: "2026-M07" },
    { dept: deptProd, env: 70.0, soc: 72.0, gov: 78.0, period: "2026-Q1" },
    { dept: deptProd, env: 75.5, soc: 74.0, gov: 80.0, period: "2026-Q2" },
    { dept: deptExec, env: 80.0, soc: 85.0, gov: 95.0, period: "2026-Q2" },
  ];

  for (const item of scoresData) {
    const overall = Math.round((item.env * 0.4 + item.soc * 0.3 + item.gov * 0.3) * 10) / 10;
    await db.insert(departmentScores).values({
      departmentId: item.dept.id,
      environmentalScore: item.env,
      socialScore: item.soc,
      governanceScore: item.gov,
      overallScore: overall,
      period: item.period,
    });
  }

  console.log("Seeding completed successfully!");
}

main().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
