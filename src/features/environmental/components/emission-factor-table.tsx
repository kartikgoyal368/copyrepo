import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EmissionFactor } from "../types";

interface FactorTableProps {
  factors: EmissionFactor[];
}

export default function EmissionFactorTable({ factors }: { factors: EmissionFactor[] }) {
  const categoryLabels: Record<string, string> = {
    electricity: "Electricity",
    gas: "Natural Gas",
    fuel: "Fleet Fuel",
    waste: "Waste Management",
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Factor Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Value (CO2e)</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Added Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {factors.map((factor) => (
            <TableRow key={factor.id}>
              <TableCell className="font-bold text-neutral-800 dark:text-neutral-200">
                {factor.name}
              </TableCell>
              <TableCell className="capitalize text-neutral-500">
                {categoryLabels[factor.category] || factor.category}
              </TableCell>
              <TableCell className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {factor.value}
              </TableCell>
              <TableCell className="text-neutral-500">{factor.unit}</TableCell>
              <TableCell className="text-neutral-400">
                {new Date(factor.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
