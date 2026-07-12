import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Challenge, ChallengeParticipation } from "../types";
import { Button } from "@/components/ui/button";
import { joinChallengeAction } from "../actions";
import { useState } from "react";
import { Check, Flame, Loader2 } from "lucide-react";

interface TableProps {
  challenges: Challenge[];
  participations: ChallengeParticipation[];
  onJoined: (part: any) => void;
}

export default function ChallengeTable({
  challenges,
  participations,
  onJoined,
}: TableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleJoin = async (challengeId: number) => {
    setLoadingId(challengeId);
    try {
      const res = await joinChallengeAction(challengeId);
      if (res.success) {
        onJoined({
          id: Math.random(),
          userId: "usr_employee",
          challengeId,
          progress: 0,
          status: "active",
          proofUrl: null,
          xpAwarded: 0,
          pointsAwarded: 0,
          createdAt: new Date(),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Challenge Campaign</TableHead>
            <TableHead>Reward Credits</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Enrollment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((chal) => {
            const hasJoined = participations.some((p) => p.challengeId === chal.id);

            return (
              <TableRow key={chal.id}>
                <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                  <div>
                    <span>{chal.title}</span>
                    {chal.description && (
                      <span className="block text-[10px] text-neutral-450 font-normal mt-0.5 line-clamp-1">
                        {chal.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {chal.points} pts / {chal.xp} XP
                  </span>
                </TableCell>
                <TableCell className="text-neutral-400">
                  {new Date(chal.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-neutral-400">
                  {new Date(chal.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {hasJoined ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Enrolled
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingId === chal.id}
                      onClick={() => handleJoin(chal.id)}
                      className="text-[10px] h-7 font-bold text-neutral-600 border-neutral-200 hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
                    >
                      {loadingId === chal.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Join Challenge"
                      )}
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
