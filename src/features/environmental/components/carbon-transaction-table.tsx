import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { CarbonTransaction } from "../types";
import { FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionTableProps {
  transactions: CarbonTransaction[];
}

export default function CarbonTransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount (kg CO2e)</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Evidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                {tx.title}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                  tx.type === "offset"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}>
                  {tx.type === "offset" ? (
                    <>
                      <ArrowDownLeft className="w-3 h-3" />
                      Offset
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3 h-3" />
                      Emission
                    </>
                  )}
                </span>
              </TableCell>
              <TableCell className={`font-mono font-bold ${
                tx.type === "offset" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}>
                {tx.type === "offset" ? "-" : "+"}
                {new Intl.NumberFormat().format(tx.amount)}
              </TableCell>
              <TableCell className="text-neutral-500">
                {(tx as any).departmentName || "Operations"}
              </TableCell>
              <TableCell className="text-neutral-400">
                {new Date(tx.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {tx.proofUrl ? (
                  <a
                    href={tx.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline text-[10px] font-semibold cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Verify Cert
                  </a>
                ) : (
                  <span className="text-[10px] text-neutral-450 italic">No proof URL</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
