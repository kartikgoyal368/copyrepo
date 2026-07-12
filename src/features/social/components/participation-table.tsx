import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EmployeeParticipation } from "../types";
import { FileText, Clock } from "lucide-react";

interface TableProps {
  participations: EmployeeParticipation[];
}

export default function ParticipationTable({ participations }: TableProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-850 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
    approved: "bg-emerald-100 text-emerald-850 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
    rejected: "bg-rose-100 text-rose-850 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/30",
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>CSR Activity</TableHead>
            <TableHead>Hours Spent</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Evidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participations.map((part) => (
            <TableRow key={part.id}>
              <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                {(part as any).userName || "Employee User"}
              </TableCell>
              <TableCell className="text-neutral-600 dark:text-neutral-350">
                {(part as any).csrActivityTitle || "CSR Initiative"}
              </TableCell>
              <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  {part.hoursLogged} hours
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  statusColors[part.status]
                }`}>
                  {part.status}
                </span>
              </TableCell>
              <TableCell className="text-neutral-400">
                {new Date(part.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {part.proofUrl ? (
                  <a
                    href={part.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline text-[10px] font-semibold cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Verify Proof
                  </a>
                ) : (
                  <span className="text-[10px] text-neutral-455 italic">No proof uploaded</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
