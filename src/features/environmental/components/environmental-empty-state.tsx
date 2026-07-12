import { Leaf, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnvironmentalEmptyState({
  title = "No environmental logs",
  description = "Start tracking by recording your first emissions/offsets transaction or target goal.",
  onAction,
}: {
  title?: string;
  description?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl min-h-[250px] bg-white/40 dark:bg-neutral-900/10">
      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
        <Leaf className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-200">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs leading-normal">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} size="sm" className="mt-4 flex items-center gap-1 bg-emerald-600 text-white cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          Log Transaction
        </Button>
      )}
    </div>
  );
}
