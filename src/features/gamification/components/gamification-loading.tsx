import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function GamificationLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 h-16 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-12 gap-6">
        <Card className="md:col-span-8 h-80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            <span className="text-xs text-neutral-400">Loading campaign stats...</span>
          </div>
        </Card>
        <Card className="md:col-span-4 h-80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            <span className="text-xs text-neutral-400">Updating leaderboards rankings...</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
