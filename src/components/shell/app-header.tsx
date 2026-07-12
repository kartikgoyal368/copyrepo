"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    departmentId: number | null;
  };
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function AppHeader({ user }: HeaderProps) {
  const pathname = usePathname();
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive page titles
  const getPageTitle = (path: string) => {
    if (path === "/") return "Executive ESG Dashboard";
    if (path.startsWith("/environmental")) return "Environmental Management";
    if (path.startsWith("/social")) return "Social Responsibility & Diversity";
    if (path.startsWith("/governance")) return "Governance, Risk & Compliance";
    if (path.startsWith("/gamification")) return "Engagement & Gamification Hub";
    if (path.startsWith("/reports")) return "ESG Reporting & Analytics";
    if (path.startsWith("/settings")) return "System Configurations";
    return "ESG Management Platform";
  };

  const getBreadcrumb = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Dashboard", href: "/" }];
    return [
      { label: "Dashboard", href: "/" },
      ...segments.map((seg, idx) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, idx + 1).join("/"),
      })),
    ];
  };

  const breadcrumbs = getBreadcrumb(pathname);
  const unreadCount = notificationsList.filter((n) => !n.read).length;

  // Set up mock notification listener/poller or initial load
  useEffect(() => {
    // Standard seeded notifications to look active
    const demoNotifications: NotificationItem[] = [
      {
        id: 1,
        title: "Overdue Compliance Issue",
        message: "HQ Recycling Station Signage Missing is past due date.",
        type: "compliance",
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        title: "CSR Approved",
        message: "Your beach cleanup volunteering participation was approved by Manager.",
        type: "csr",
        read: false,
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
      {
        id: 3,
        title: "Badge Unlocked!",
        message: "You have unlocked the 'Eco Pioneer' badge.",
        type: "badge",
        read: true,
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
    ];
    setNotificationsList(demoNotifications);
  }, []);

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between shrink-0 z-20 relative">
      {/* Breadcrumbs and titles */}
      <div className="flex items-center gap-4 overflow-hidden">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white hidden md:block">
          {getPageTitle(pathname)}
        </h2>
        <span className="text-neutral-300 dark:text-neutral-700 hidden md:block">|</span>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          {breadcrumbs.map((item, idx) => (
            <div key={item.href} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />}
              <span className={cn(idx === breadcrumbs.length - 1 ? "text-neutral-800 dark:text-neutral-200 font-semibold" : "truncate max-w-[100px]")}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications bell panel */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center relative border border-neutral-200 dark:border-neutral-800 cursor-pointer text-neutral-600 dark:text-neutral-300"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 border-2 border-white dark:border-neutral-900 rounded-full flex items-center justify-center text-[9px] text-white font-bold leading-none">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Recent Notifications ({unreadCount} unread)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900">
              {notificationsList.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No notifications found
                </div>
              ) : (
                notificationsList.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3.5 transition-colors",
                      !notif.read ? "bg-emerald-50/20 dark:bg-emerald-950/5" : "hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={cn("text-xs font-bold", !notif.read ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400")}>
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-neutral-400 block mt-2">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
