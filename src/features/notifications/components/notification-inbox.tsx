"use client";

import { useState } from "react";
import { Notification } from "../types";
import { markNotificationReadAction } from "../actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, MailOpen } from "lucide-react";

interface InboxProps {
  initialNotifications: Notification[];
}

export default function NotificationInbox({ initialNotifications }: InboxProps) {
  const [list, setList] = useState<Notification[]>(initialNotifications);

  const handleMarkRead = async (id: number) => {
    try {
      const res = await markNotificationReadAction(id);
      if (res.success) {
        setList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const unread = list.filter((n) => !n.read);

  return (
    <Card className="max-w-md w-80">
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-850 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-emerald-600" />
          <CardTitle className="text-xs font-extrabold uppercase">Notifications ({unread.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-60 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850">
        {list.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-400">
            No system notifications logged.
          </div>
        ) : (
          list.map((item) => (
            <div
              key={item.id}
              className={`p-3 text-xs flex justify-between gap-3 ${
                item.read ? "opacity-60" : "bg-emerald-500/5"
              }`}
            >
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-800 dark:text-neutral-200 block">
                  {item.title}
                </span>
                <p className="text-[10px] text-neutral-500 leading-normal">{item.message}</p>
                <span className="text-[8px] text-neutral-450 block">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>
              {!item.read && (
                <Button
                  onClick={() => handleMarkRead(item.id)}
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6 shrink-0 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
