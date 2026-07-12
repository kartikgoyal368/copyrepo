"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ComplianceIssue } from "../types";
import { Button } from "@/components/ui/button";
import { resolveComplianceIssueAction } from "../actions";
import { isIssueOverdue } from "../lib/overdue-issues";
import { useState } from "react";
import { Check, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

interface TableProps {
  issues: ComplianceIssue[];
  currentUser: { id: string; role: string };
  onResolve: (issueId: number) => void;
}

export default function ComplianceIssueTable({
  issues,
  currentUser,
  onResolve,
}: TableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleResolve = async (issueId: number) => {
    setLoadingId(issueId);
    try {
      const res = await resolveComplianceIssueAction(issueId);
      if (res.success) {
        onResolve(issueId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const severityStyles: Record<string, string> = {
    low: "bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-350 dark:border-neutral-700",
    medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30",
    critical: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 animate-pulse",
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Compliance Issue</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Timeline Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => {
            const overdue = isIssueOverdue(issue);
            const canResolve =
              currentUser.role === "admin" ||
              currentUser.role === "manager" ||
              currentUser.role === "auditor" ||
              issue.ownerId === currentUser.id;

            return (
              <TableRow key={issue.id}>
                <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                  <div>
                    <span>{issue.title}</span>
                    {issue.description && (
                      <span className="block text-[10px] text-neutral-450 font-normal mt-0.5 line-clamp-1">
                        {issue.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    severityStyles[issue.severity]
                  }`}>
                    {issue.severity}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-600 dark:text-neutral-350">
                  {(issue as any).ownerName || "Staff Owner"}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span className="block text-xs font-semibold text-neutral-500">
                      Due: {new Date(issue.dueDate).toLocaleDateString()}
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-200/50">
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                        Overdue
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {issue.status === "resolved" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Resolved
                    </span>
                  ) : canResolve ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingId === issue.id}
                      onClick={() => handleResolve(issue.id)}
                      className="text-[10px] h-7 font-bold text-neutral-600 cursor-pointer border-neutral-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {loadingId === issue.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Mark Resolved"
                      )}
                    </Button>
                  ) : (
                    <span className="text-[10px] text-neutral-450 italic">Assigned</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
