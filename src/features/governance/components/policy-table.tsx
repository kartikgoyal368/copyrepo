import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EsgPolicy } from "../types";
import { Button } from "@/components/ui/button";
import { acknowledgePolicyAction } from "../actions";
import { useState } from "react";
import { CheckCircle2, Bookmark } from "lucide-react";

interface PolicyTableProps {
  policies: EsgPolicy[];
}

export default function PolicyTable({ policies }: PolicyTableProps) {
  const [acknowledgedList, setAcknowledgedList] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAcknowledge = async (policyId: number) => {
    setLoadingId(policyId);
    try {
      const res = await acknowledgePolicyAction(policyId);
      if (res.success) {
        setAcknowledgedList((prev) => [...prev, policyId]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const categoryLabels: Record<string, string> = {
    environmental: "Environmental",
    social: "Social",
    governance: "Governance",
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => {
            const acknowledged = acknowledgedList.includes(policy.id);
            return (
              <TableRow key={policy.id}>
                <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                  <div>
                    <span>{policy.title}</span>
                    {policy.description && (
                      <span className="block text-[10px] text-neutral-450 font-normal mt-0.5 line-clamp-1">
                        {policy.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize text-neutral-500">
                  {categoryLabels[policy.category] || policy.category}
                </TableCell>
                <TableCell className="font-semibold text-neutral-800 dark:text-neutral-200">
                  v{policy.version}
                </TableCell>
                <TableCell className="text-neutral-400">
                  {new Date(policy.effectiveDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {acknowledged ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Acknowledged
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingId === policy.id}
                      onClick={() => handleAcknowledge(policy.id)}
                      className="text-[10px] h-7 font-bold text-neutral-600 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 mr-1" />
                      Read & Acknowledge
                    </Button>
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
