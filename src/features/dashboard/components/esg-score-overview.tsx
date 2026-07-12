"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scale, Heart, Leaf, Trophy, ShieldAlert, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface OverviewProps {
  overallScore: number;
  overallGrade: string;
  gradeBadgeClass: string;
  scoreE: number;
  scoreS: number;
  scoreG: number;
  weightE: number;
  weightS: number;
  weightG: number;
  openComplianceCount: number;
  userName: string;
  userRole: string;
  pointsBalance: number;
  xpTotal: number;
  level: number;
  nextLevelXp: number;
  xpProgress: number;
}

export default function EsgScoreOverview({
  overallScore,
  overallGrade,
  gradeBadgeClass,
  scoreE,
  scoreS,
  scoreG,
  weightE,
  weightS,
  weightG,
  openComplianceCount,
  userName,
  userRole,
  pointsBalance,
  xpTotal,
  level,
  nextLevelXp,
  xpProgress,
}: OverviewProps) {
  const getEsgGrade = (s: number) => {
    if (s >= 90) return "AAA";
    if (s >= 80) return "AA";
    if (s >= 70) return "A";
    if (s >= 60) return "BBB";
    return "BB";
  };

  const modules = [
    {
      title: "Environmental Index (E)",
      score: scoreE,
      grade: getEsgGrade(scoreE),
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      link: "/environmental",
      desc: "Carbon footprint tracking and reduction goals",
      icon: Leaf,
    },
    {
      title: "Social Responsibility (S)",
      score: scoreS,
      grade: getEsgGrade(scoreS),
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/20",
      link: "/social",
      desc: "Inclusion index and community volunteering hours",
      icon: Heart,
    },
    {
      title: "Governance Index (G)",
      score: scoreG,
      grade: getEsgGrade(scoreG),
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      link: "/governance",
      desc: "Policies registries, risk tracking and audits logs",
      icon: Scale,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main score panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Executive ESG Index Dial card */}
        <Card className="md:col-span-8 border-2 border-emerald-500/20 bg-radial-gradient flex flex-col justify-between overflow-hidden shadow-md">
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Corporate ESG Rating Index
              </span>
              <h2 className="text-3xl font-black text-neutral-850 dark:text-white leading-tight">
                Platform Sustainability Score
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm leading-normal">
                Overall rating index calculated based on operational carbon footprint, volunteering hours, and policy checklists compliance.
              </p>
            </div>

            <div className="text-center shrink-0 space-y-3">
              <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 flex flex-col items-center justify-center bg-emerald-500/5 shadow-inner">
                <span className="text-4xl font-black text-neutral-900 dark:text-white">
                  {overallScore}
                </span>
                <span className="text-[10px] text-neutral-455 font-bold uppercase tracking-wider mt-0.5">
                  Out of 100
                </span>
              </div>
              <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-extrabold ${gradeBadgeClass}`}>
                Corporate Rating: {overallGrade}
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800/80 px-6 py-4 flex flex-wrap gap-6 text-xs font-semibold">
            <div>
              <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                Configured Weights
              </span>
              <span className="text-neutral-700 dark:text-neutral-350 block mt-0.5">
                E: {weightE * 100}% | S: {weightS * 100}% | G: {weightG * 100}%
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                Open Risks
              </span>
              <span className="text-rose-500 block mt-0.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {openComplianceCount} active compliance items
              </span>
            </div>
          </div>
        </Card>

        {/* Gamification widget panel */}
        <Card className="md:col-span-4 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              My Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-black text-neutral-800 dark:text-white">
                  {userName || "Employee User"}
                </span>
                <span className="block text-[10px] text-neutral-455 uppercase font-bold tracking-wider mt-0.5">
                  Role: {userRole}
                </span>
              </div>
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex justify-between text-xs font-semibold">
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                  Points Balance
                </span>
                <span className="text-emerald-600 font-extrabold block mt-0.5">
                  {pointsBalance} pts
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                  Total XP
                </span>
                <span className="text-neutral-800 dark:text-neutral-250 font-extrabold block mt-0.5">
                  {xpTotal} XP
                </span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/80">
            <Link href="/gamification" className="w-full">
              <Button size="sm" className="w-full text-xs bg-emerald-600 text-white cursor-pointer">
                Go to Engagement Hub
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Level bar card */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-spin" />
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Employee Rating Level: Lvl {level}
          </span>
        </div>
        <div className="flex-1 max-w-md w-full">
          <Progress value={xpProgress} />
        </div>
        <span className="text-[10px] text-neutral-450 font-bold shrink-0">
          {xpTotal} / {nextLevelXp} XP to next level
        </span>
      </Card>

      {/* Modules Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${m.bg}`}>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Score: {m.score} / 100
                  </span>
                </div>
                <CardTitle className="text-sm font-extrabold mt-4 block">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-xs text-neutral-500 leading-normal">{m.desc}</p>
              </CardContent>
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/80">
                <Link href={m.link}>
                  <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-neutral-600 hover:text-emerald-600 justify-between cursor-pointer">
                    Explore Index
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
