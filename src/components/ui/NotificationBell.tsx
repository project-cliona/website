"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/api/notifications";
import { useNotificationSocket } from "@/lib/socket";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationListResponse } from "@/lib/type";

const SEVERITY_ICON = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const SEVERITY_CLASS = {
  critical: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
  info: "text-primary-700 bg-primary-50",
} as const;

/** "3m ago" / "5h ago" / "2d ago" — short enough for a dropdown row. */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const queryClient = useQueryClient();

  const { data: unread = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadNotificationCount,
    staleTime: 1000 * 30,
  });

  const { data: list } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => fetchNotifications({ limit: 15 }),
    staleTime: 1000 * 30,
  });

  // Live push — prepend to the cached list and bump the badge without a refetch.
  const onIncoming = useCallback(
    (n: AppNotification) => {
      queryClient.setQueryData<NotificationListResponse | null>(
        ["notifications", "list"],
        (prev) =>
          prev
            ? { ...prev, items: [n, ...prev.items].slice(0, 15), total: prev.total + 1 }
            : { items: [n], total: 1, page: 1, limit: 15 }
      );
      queryClient.setQueryData<number>(
        ["notifications", "unread-count"],
        (prev) => (prev ?? 0) + 1
      );

      if (n.severity === "critical") notify.error(n.title, undefined, { description: n.body });
      else if (n.severity === "warning") notify.warning(n.title, { description: n.body });
    },
    [queryClient]
  );

  useNotificationSocket(onIncoming);

  const readOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const readAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const items = list?.items ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
          className="relative h-10 w-10 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary focus-ring"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold leading-4 text-center tabular-nums">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Notifications</span>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => readAll.mutate()}
              disabled={readAll.isPending}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            items.map((n) => {
              const Icon = SEVERITY_ICON[n.severity] ?? Info;
              const row = (
                <div
                  className={cn(
                    "flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/60 transition-colors",
                    !n.readAt && "bg-primary-50/40"
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
                      SEVERITY_CLASS[n.severity] ?? SEVERITY_CLASS.info
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.readAt && (
                    <span className="h-2 w-2 rounded-full bg-primary-600 shrink-0 mt-1.5" />
                  )}
                </div>
              );

              return n.link ? (
                <Link
                  key={n.id}
                  href={n.link}
                  onClick={() => !n.readAt && readOne.mutate(n.id)}
                  className="block"
                >
                  {row}
                </Link>
              ) : (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.readAt && readOne.mutate(n.id)}
                  className="block w-full text-left"
                >
                  {row}
                </button>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
