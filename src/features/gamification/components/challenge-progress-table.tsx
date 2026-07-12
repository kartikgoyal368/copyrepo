import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ChallengeParticipation } from "../types";
import { Button } from "@/components/ui/button";
import { approveChallengeParticipationAction } from "../actions";
import { useState } from "react";
import { CheckCircle2, FileText, Loader2, AlertCircle } from "lucide-react";

interface TableProps {
  participations: ChallengeParticipation[];
  currentUser: { role: string };
  onProgressUpdated: (partId: number, progress: number, proofUrl: string) => void;
  onApproved: (partId: number, status: "completed" | "abandoned") => void;
}

export default function ChallengeProgressTable({
  participations,
  currentUser,
  onApproved,
}: TableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAuthorized = currentUser.role === "admin" || currentUser.role === "manager";

  const handleApprove = async (partId: number) => {
    setLoadingId(partId);
    setErrorMsg(null);
    try {
      const res = await approveChallengeParticipationAction(partId, "completed");
      if (res.success) {
        onApproved(partId, "completed");
      } else {
        setErrorMsg(res.error || "Approval failed.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    abandoned: "bg-rose-50 text-rose-750 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30",
  };

  return (
    <div className="w-full space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Challenge Campaign</TableHead>
            <TableHead>Progress Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participations.map((part) => {
            const showApprove =
              isAuthorized && part.status === "active" && part.progress >= 100;

            return (
              <TableRow key={part.id}>
                <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                  {(part as any).userName || "Employee User"}
                </TableCell>
                <TableCell className="text-neutral-600 dark:text-neutral-350">
                  {(part as any).challengeTitle || `Challenge ID ${part.challengeId}`}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5"
                        style={{ width: `${part.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold">{part.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    statusColors[part.status]
                  }`}>
                    {part.status}
                  </span>
                </TableCell>
                <TableCell>
                  {part.proofUrl ? (
                    <a
                      href={part.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-[10px] font-semibold hover:underline cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Verify Evidence
                    </a>
                  ) : (
                    <span className="text-[10px] text-neutral-450 italic">No proof uploaded</span>
                  )}
                </TableCell>
                <TableCell>
                  {part.status === "completed" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Approved
                    </span>
                  ) : showApprove ? (
                    <Button
                      size="sm"
                      disabled={loadingId === part.id}
                      onClick={() => handleApprove(part.id)}
                      className="text-[10px] h-7 bg-emerald-600 text-white cursor-pointer"
                    >
                      {loadingId === part.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Approve Completion"
                      )}
                    </Button>
                  ) : (
                    <span className="text-[10px] text-neutral-450 italic">Active</span>
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
