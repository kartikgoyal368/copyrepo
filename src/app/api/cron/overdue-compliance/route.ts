import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { complianceIssues, notifications } from "@/server/db/schema";
import { eq, lt, and } from "drizzle-orm";

export async function GET() {
  try {
    const overdueList = await db
      .select()
      .from(complianceIssues)
      .where(
        and(
          eq(complianceIssues.status, "open"),
          lt(complianceIssues.dueDate, new Date())
        )
      );

    const notifiedIds: string[] = [];

    for (const issue of overdueList) {
      await db.insert(notifications).values({
        userId: issue.ownerId,
        title: "Compliance Issue OVERDUE",
        message: `Your assigned compliance issue '${issue.title}' is overdue! Please resolve immediately.`,
        type: "compliance",
        read: false,
      });
      notifiedIds.push(issue.ownerId);
    }

    return NextResponse.json({
      success: true,
      flaggedCount: overdueList.length,
      notifiedUsers: notifiedIds,
    });
  } catch (error: any) {
    console.error("Overdue cron handler execution failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database select failed" },
      { status: 500 }
    );
  }
}
