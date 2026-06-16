"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DownloadIcon,
  Ban,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
  TableActions,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  fetchCampaignById,
  fetchCampaignMessages,
  cancelCampaign,
} from "@/lib/api/whatsapp/campaigns";
import type {
  WhatsappCampaign,
  WhatsappCampaignMessage,
  WhatsappCampaignStatus,
} from "@/lib/type";
import { exportToCSV } from "@/lib/utils";
import { usePageSearch } from "@/providers/searchProvider";
import { notify } from "@/lib/toast";

const MESSAGES_PAGE_SIZE = 100;

const TERMINAL_STATUSES: WhatsappCampaignStatus[] = [
  "completed",
  "cancelled",
  "failed",
];

const statusLabel: Record<WhatsappCampaignStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  in_progress: "Sending",
  completed: "Completed",
  cancelled: "Cancelled",
  failed: "Failed",
};

const messageStatusLabel: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
  cancelled: "Cancelled",
};

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function formatTimeShort(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WhatsappCampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [page, setPage] = useState(1);

  usePageSearch({
    placeholder: "Search recipients",
    onChange: (value) => {
      setRecipientSearch(value);
      setPage(1);
    },
  });

  const campaignQuery = useQuery<WhatsappCampaign>({
    queryKey: ["whatsapp-campaign", id],
    queryFn: () => fetchCampaignById(id),
    refetchInterval: (query) => {
      const c = query.state.data;
      if (!c) return 5000;
      return TERMINAL_STATUSES.includes(c.status) ? false : 5000;
    },
  });

  const campaign = campaignQuery.data;
  const isTerminal = campaign
    ? TERMINAL_STATUSES.includes(campaign.status)
    : false;

  const messagesFilters = useMemo(
    () => ({
      status: statusFilter || undefined,
      page,
      limit: MESSAGES_PAGE_SIZE,
    }),
    [statusFilter, page]
  );

  const messagesQuery = useQuery({
    queryKey: ["whatsapp-campaign-messages", id, messagesFilters],
    queryFn: () => fetchCampaignMessages(id, messagesFilters),
    // Keep polling messages while the campaign is still moving so the per-recipient statuses update live.
    refetchInterval: isTerminal ? false : 5000,
  });

  const messages = messagesQuery.data?.messages ?? [];
  const totalMessages = messagesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalMessages / MESSAGES_PAGE_SIZE));

  const visibleMessages = useMemo(() => {
    if (!recipientSearch) return messages;
    const needle = recipientSearch.trim().toLowerCase();
    if (!needle) return messages;
    return messages.filter((m) =>
      m.recipientPhone.toLowerCase().includes(needle)
    );
  }, [messages, recipientSearch]);

  const cancelMutation = useMutation({
    mutationFn: () => cancelCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaign", id] });
      queryClient.invalidateQueries({
        queryKey: ["whatsapp-campaign-messages", id],
      });
      notify.success("Campaign cancelled");
    },
    onError: (err) => notify.error(err, "Could not cancel campaign"),
  });

  const handleExport = () => {
    if (!campaign || messages.length === 0) {
      notify.error("No recipients to export yet");
      return;
    }
    exportToCSV<WhatsappCampaignMessage>({
      data: messages,
      filename: `campaign-${campaign.id}-${campaign.campaignName.replace(/\s+/g, "-")}-recipients.csv`,
      columns: [
        { header: "Phone", accessor: "recipientPhone" },
        { header: "Status", accessor: "status" },
        { header: "WAMID", accessor: "wamid" },
        {
          header: "Sent At",
          accessor: (row) =>
            row.sentAt ? new Date(row.sentAt).toLocaleString() : "",
        },
        {
          header: "Delivered At",
          accessor: (row) =>
            row.deliveredAt ? new Date(row.deliveredAt).toLocaleString() : "",
        },
        {
          header: "Read At",
          accessor: (row) =>
            row.readAt ? new Date(row.readAt).toLocaleString() : "",
        },
        { header: "Failure Reason", accessor: "failureReason" },
      ],
    });
    notify.success("Recipients exported");
  };

  if (campaignQuery.isLoading || !campaign) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/app/whatsapp/campaignReport"
            className="text-caption text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> All campaigns
          </Link>
          <h1 className="text-h1 text-foreground">Campaign</h1>
        </div>
        <div className="rounded-lg border border-border bg-card shadow-e1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableLoading rows={5} columns={5} />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const totalRecipients = campaign.totalRecipients;
  const sentBase = campaign.sent || totalRecipients || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/app/whatsapp/campaignReport"
          className="text-caption text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> All campaigns
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-h1 text-foreground truncate">
              {campaign.campaignName}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-caption text-muted-foreground flex-wrap">
              <span>
                Template{" "}
                <span className="font-medium text-foreground">
                  {campaign.templateName}
                </span>{" "}
                ({campaign.templateLanguage})
              </span>
              <span>·</span>
              <span>Created {formatTime(campaign.createdAt)}</span>
              {campaign.startedAt && (
                <>
                  <span>·</span>
                  <span>Started {formatTime(campaign.startedAt)}</span>
                </>
              )}
              {campaign.completedAt && (
                <>
                  <span>·</span>
                  <span>Ended {formatTime(campaign.completedAt)}</span>
                </>
              )}
              <span>·</span>
              <span>{totalRecipients.toLocaleString()} recipients</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusPill status={campaign.status}>
              {statusLabel[campaign.status]}
            </StatusPill>
            {campaign.status === "in_progress" && (
              <span className="inline-flex items-center gap-1.5 text-caption text-primary-700">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse-dot" />
                Updating live
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={messages.length === 0}
            >
              <span className="inline-flex items-center gap-2">
                <DownloadIcon className="w-4 h-4" /> Export
              </span>
            </Button>
            {!isTerminal && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={cancelMutation.isPending}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Ban className="w-4 h-4" />
                      {cancelMutation.isPending ? "Cancelling…" : "Cancel"}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this campaign?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Pending recipients will be marked as cancelled and no further
                      messages will be sent. Messages already handed off to WhatsApp
                      will keep their delivery tracking — you cannot recall those.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep sending</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelMutation.mutate()}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Yes, cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {cancelMutation.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {(cancelMutation.error as Error)?.message ??
            "Failed to cancel campaign"}
        </div>
      )}

      {/* Funnel */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-e1">
        <h2 className="text-h2 mb-4">Funnel</h2>
        <Funnel
          steps={[
            {
              label: "Submitted",
              count: totalRecipients,
              total: totalRecipients || 1,
            },
            {
              label: "Sent",
              count: campaign.sent,
              total: totalRecipients || 1,
            },
            {
              label: "Delivered",
              count: campaign.delivered,
              total: sentBase,
            },
            {
              label: "Read",
              count: campaign.read,
              total: sentBase,
            },
          ]}
        />
      </div>

      {/* Per-recipient table */}
      <div className="rounded-lg border border-border bg-card shadow-e1">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-h3">
            Recipients{" "}
            <span className="text-caption text-muted-foreground font-normal">
              ({totalMessages.toLocaleString()})
            </span>
          </h3>
          <div className="flex items-center gap-3">
            <Label className="text-caption text-muted-foreground">Status</Label>
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => {
                setStatusFilter(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Read</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messagesQuery.isLoading ? (
              <TableLoading rows={6} columns={6} />
            ) : visibleMessages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-caption text-muted-foreground"
                >
                  No recipients match this filter.
                </TableCell>
              </TableRow>
            ) : (
              visibleMessages.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-sm">
                    {m.recipientPhone}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={m.status}>
                      {messageStatusLabel[m.status] ?? m.status}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTimeShort(m.sentAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTimeShort(m.deliveredAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTimeShort(m.readAt)}
                  </TableCell>
                  <TableCell>
                    <TableActions>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary focus-ring"
                            aria-label="More"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {m.status === "failed" && m.failureReason && (
                            <DropdownMenuItem
                              disabled
                              className="whitespace-pre-wrap max-w-xs"
                            >
                              {m.failureReason}
                            </DropdownMenuItem>
                          )}
                          {m.wamid && (
                            <DropdownMenuItem
                              onSelect={() => {
                                if (typeof navigator !== "undefined" && m.wamid) {
                                  navigator.clipboard?.writeText(m.wamid);
                                  notify.success("WAMID copied");
                                }
                              }}
                            >
                              Copy WAMID
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onSelect={() => {
                              if (typeof navigator !== "undefined") {
                                navigator.clipboard?.writeText(m.recipientPhone);
                                notify.success("Phone number copied");
                              }
                            }}
                          >
                            Copy phone
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalMessages > MESSAGES_PAGE_SIZE && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between text-caption">
            <span className="text-muted-foreground">
              Showing {(page - 1) * MESSAGES_PAGE_SIZE + 1}–
              {Math.min(page * MESSAGES_PAGE_SIZE, totalMessages)} of{" "}
              {totalMessages.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FunnelStep {
  label: string;
  count: number;
  total: number;
}

function Funnel({ steps }: { steps: FunnelStep[] }) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((s, i) => {
        const pct = s.total > 0 ? (s.count / s.total) * 100 : 0;
        const clamped = Math.min(100, Math.max(0, pct));
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-24 text-small text-muted-foreground">
              {s.label}
            </div>
            <div className="flex-1 h-7 rounded-md bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clamped}%` }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full rounded-md bg-primary-600"
              />
            </div>
            <div className="w-32 text-right text-small tabular-nums">
              <span className="font-semibold">
                {s.count.toLocaleString()}
              </span>
              <span className="text-muted-foreground ml-1">
                ({pct.toFixed(1)}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
