import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building, Award } from "lucide-react";

interface DeptLeaderboardItem {
  rank: number;
  name: string;
  code: string;
  score: number;
}

interface DeptLeaderboardProps {
  leaderboard: DeptLeaderboardItem[];
}

export default function DepartmentLeaderboard({ leaderboard }: DeptLeaderboardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-sm font-bold">Department ESG Index Ranking</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {leaderboard.map((dept, index) => (
          <div
            key={`${dept.name}-${index}`}
            className="py-3.5 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 px-2 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-neutral-400 w-5 text-center">
                #{dept.rank}
              </span>
              <div>
                <span className="text-xs font-bold text-neutral-850 dark:text-neutral-200 block">
                  {dept.name}
                </span>
                <span className="text-[10px] text-neutral-450 font-bold block uppercase mt-0.5 tracking-wider font-mono">
                  {dept.code}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col text-right">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {dept.score}
                </span>
                <span className="text-[9px] text-neutral-450 mt-0.5 font-semibold uppercase tracking-wider">
                  ESG Index
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center border border-emerald-200/40">
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
