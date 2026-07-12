import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Award, Medal } from "lucide-react";

interface LeaderboardItem {
  rank: number;
  name: string;
  departmentName: string;
  points: number;
  xp: number;
  avatar: string;
}

interface LeaderboardProps {
  leaderboard: LeaderboardItem[];
  currentUserId?: string;
}

export default function Leaderboard({ leaderboard, currentUserId }: LeaderboardProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-amber-500 fill-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400 fill-slate-450" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />;
    return <span className="text-xs font-bold text-neutral-400 w-5 text-center">{rank}</span>;
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-sm font-bold">Individual ESG Leaderboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {leaderboard.map((user) => (
          <div
            key={user.name}
            className="py-3 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 px-2 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getRankBadge(user.rank)}
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user.avatar}
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-850 dark:text-neutral-200 block">
                  {user.name}
                </span>
                <span className="text-[10px] text-neutral-450 block">
                  {user.departmentName}
                </span>
              </div>
            </div>

            <div className="text-right font-semibold text-xs">
              <span className="block text-emerald-600 dark:text-emerald-400 font-extrabold">
                {user.xp} XP
              </span>
              <span className="block text-[10px] text-neutral-450 mt-0.5">
                {user.points} points
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
