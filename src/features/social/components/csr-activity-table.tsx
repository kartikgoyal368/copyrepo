import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { CsrActivity } from "../types";
import { Check, X } from "lucide-react";

interface ActivityTableProps {
  activities: CsrActivity[];
}

export default function CsrActivityTable({ activities }: ActivityTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CSR Activity</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Points / XP</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Proof Required</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((act) => (
            <TableRow key={act.id}>
              <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                <div>
                  <span>{act.title}</span>
                  {act.description && (
                    <span className="block text-[10px] text-neutral-450 font-normal mt-0.5 line-clamp-1">
                      {act.description}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-neutral-500">{act.location}</TableCell>
              <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                {act.points} pts / {act.xp} XP
              </TableCell>
              <TableCell className="text-neutral-400">
                {new Date(act.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {act.evidenceRequired ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-200/50">
                    <Check className="w-3 h-3 text-amber-600" />
                    Required
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-neutral-450 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    <X className="w-3 h-3" />
                    None
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
