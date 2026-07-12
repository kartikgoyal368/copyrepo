"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Leaf,
  Users,
  Building,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    departmentId: number | null;
  };
}

export default function AppSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Environmental", href: "/environmental", icon: Leaf },
    { name: "Social", href: "/social", icon: Users },
    { name: "Governance", href: "/governance", icon: Building },
    { name: "Gamification", href: "/gamification", icon: Trophy },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  const hasSettingsAccess = user.role === "admin" || user.role === "manager";
  const displayItems = [...menuItems];
  if (hasSettingsAccess) {
    displayItems.push({ name: "Settings", href: "/settings", icon: Settings });
  }

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    manager: "Sustainability Mgr",
    employee: "Staff Employee",
    auditor: "Compliance Auditor",
  };

  return (
    <aside
      className={cn(
        "h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 text-neutral-300 z-30 shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Brand */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
          <div className={cn("flex items-center gap-2 overflow-hidden", collapsed && "justify-center w-full")}>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-none">
                <span className="font-bold text-base text-white tracking-tight">EcoSphere</span>
                <span className="block text-[10px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">
                  Management
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand toggle button */}
        {collapsed && (
          <div className="flex justify-center p-2 border-b border-neutral-800">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5">
          {displayItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 group relative",
                  active
                    ? "bg-emerald-600 text-white font-semibold"
                    : "hover:bg-neutral-800 hover:text-neutral-100 text-neutral-400"
                )}
              >
                <Icon className={cn("w-4.5 h-4.5 shrink-0", active ? "text-white" : "text-neutral-400 group-hover:text-neutral-200")} />
                {!collapsed && <span>{item.name}</span>}
                
                {/* Tooltip for collapsed states */}
                {collapsed && (
                  <div className="absolute left-16 bg-neutral-950 text-white text-xs font-semibold px-2.5 py-1.5 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-neutral-800 z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Details */}
      <div className="border-t border-neutral-800 p-3.5 space-y-3 bg-neutral-950/20">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700 text-white font-bold text-sm">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <span className="block text-sm font-semibold text-white truncate">{user.name || "Default User"}</span>
              <span className="block text-[10px] text-emerald-500 font-bold uppercase mt-0.5">
                {roleLabels[user.role] || user.role}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center gap-3.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 rounded-lg transition-colors cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
          {collapsed && (
            <div className="absolute left-16 bg-neutral-950 text-rose-400 text-xs font-semibold px-2.5 py-1.5 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-neutral-800 z-50">
              Sign out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
