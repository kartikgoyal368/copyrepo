"use client";

import { useState } from "react";
import { updateParticipationStatusAction } from "../actions";
import { EmployeeParticipation } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Loader2, AlertCircle } from "lucide-react";

interface PanelProps {
  participations: EmployeeParticipation[];
  onStatusUpdated: (partId: number, status: "approved" | "rejected", remarks?: string) => void;
}

export default function ApprovalPanel({ participations, onStatusUpdated }: PanelProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingList = participations.filter((p) => p.status === "pending");

  const handleDecision = async (partId: number, decision: "approved" | "rejected", reason?: string) => {
    setLoadingId(partId);
    setErrorMsg(null);
    try {
      const res = await updateParticipationStatusAction(partId, decision, reason);
      if (res.success) {
        onStatusUpdated(partId, decision, reason);
        setRejectionId(null);
        setRejectionReason("");
      } else {
        setErrorMsg(res.error || "Decision execution failed.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      {pendingList.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-xs text-neutral-400">
            No volunteering logs awaiting review approvals.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingList.map((part) => (
            <Card key={part.id} className="border-amber-250 dark:border-amber-900/30 shadow-xs">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-850 dark:text-white">
                      {(part as any).userName || "Employee User"}
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350">
                    Logged <b className="text-neutral-850 dark:text-white">{part.hoursLogged} hours</b> for{" "}
                    <span className="underline">{(part as any).csrActivityTitle || "CSR Activity"}</span>
                  </p>
                  {part.remarks && (
                    <p className="text-[10px] text-neutral-450 italic mt-1 leading-normal">
                      &ldquo;{part.remarks}&rdquo;
                    </p>
                  )}
                  <div className="pt-1.5 flex items-center gap-2">
                    {part.proofUrl ? (
                      <a
                        href={part.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-[10px] font-semibold hover:underline cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Verify Upload Document
                      </a>
                    ) : (
                      <span className="text-[10px] text-rose-500 font-semibold italic">
                        Missing document evidence upload
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rejectionId === part.id ? (
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        placeholder="Rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-neutral-300 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRejectionId(null)}
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={loadingId === part.id}
                          onClick={() => handleDecision(part.id, "rejected", rejectionReason)}
                          className="text-xs h-7"
                        >
                          Confirm Reject
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loadingId === part.id}
                        onClick={() => setRejectionId(part.id)}
                        className="text-xs text-neutral-600 border-neutral-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-neutral-450 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        disabled={loadingId === part.id}
                        onClick={() => handleDecision(part.id, "approved")}
                        className="text-xs bg-emerald-600 text-white cursor-pointer"
                      >
                        {loadingId === part.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5 mr-1" />
                        )}
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
