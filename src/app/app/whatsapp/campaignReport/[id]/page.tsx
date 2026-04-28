"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  DownloadIcon,
  Ban,
} from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { PageHeading } from "@/components/ui/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
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

const MESSAGES_PAGE_SIZE = 100;

const TERMINAL_STATUSES: WhatsappCampaignStatus[] = [
  "completed",
  "cancelled",
  "failed",
];

const statusBadgeVariant: Record<
  WhatsappCampaignStatus,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  draft: "secondary",
  queued: "pending",
  in_progress: "pending",
  completed: "active",
  cancelled: "inactive",
  failed: "rejected",
};

const statusLabel: Record<WhatsappCampaignStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  in_progress: "Sending",
  completed: "Completed",
  cancelled: "Cancelled",
  failed: "Failed",
};

const messageStatusVariant: Record<
  string,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  pending: "secondary",
  accepted: "default",
  sent: "pending",
  delivered: "active",
  read: "active",
  failed: "rejected",
  cancelled: "inactive",
};

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function percent(n: number, d: number) {
  if (d === 0) return 0;
  return Math.round((n / d) * 1000) / 10;
}

export default function WhatsappCampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

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

  const cancelMutation = useMutation({
    mutationFn: () => cancelCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaign", id] });
      queryClient.invalidateQueries({
        queryKey: ["whatsapp-campaign-messages", id],
      });
    },
  });

  const handleExport = () => {
    if (!campaign || messages.length === 0) return;
    exportToCSV<WhatsappCampaignMessage>({
      data: messages,
      filename: `campaign-${campaign.id}-${campaign.campaignName.replace(/\s+/g, "-")}-recipients.csv`,
      columns: [
        { header: "Phone", accessor: "recipientPhone" },
        { header: "Status", accessor: "status" },
        { header: "WAMID", accessor: "wamid" },
        {
          header: "Sent At",
          accessor: (row) => (row.sentAt ? new Date(row.sentAt).toLocaleString() : ""),
        },
        {
          header: "Delivered At",
          accessor: (row) =>
            row.deliveredAt ? new Date(row.deliveredAt).toLocaleString() : "",
        },
        {
          header: "Read At",
          accessor: (row) => (row.readAt ? new Date(row.readAt).toLocaleString() : ""),
        },
        { header: "Failure Reason", accessor: "failureReason" },
      ],
    });
  };

  if (campaignQuery.isLoading || !campaign) {
    return (
      <div className="space-y-6">
        <PageHeading title="Campaign" />
        <TableSkeleton rows={4} columns={5} />
      </div>
    );
  }

  const totalRecipients = campaign.totalRecipients;
  const deliveryRate = percent(campaign.delivered, totalRecipients);
  const readRate = percent(campaign.read, campaign.delivered);
  const sentRate = percent(campaign.sent, totalRecipients);
  const failedRate = percent(campaign.failed, totalRecipients);

  const canCancel = !isTerminal;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/app/whatsapp/campaignReport"
          className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> All campaigns
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {campaign.campaignName}
              </h1>
              <Badge variant={statusBadgeVariant[campaign.status]}>
                {statusLabel[campaign.status]}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Template <span className="font-medium text-gray-700">{campaign.templateName}</span>{" "}
              ({campaign.templateLanguage}) ·{" "}
              Created {formatTime(campaign.createdAt)}
              {campaign.startedAt && (
                <>
                  {" "}
                  · Started {formatTime(campaign.startedAt)}
                </>
              )}
              {campaign.completedAt && (
                <>
                  {" "}
                  · Ended {formatTime(campaign.completedAt)}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={messages.length === 0}
            >
              <span className="inline-flex items-center gap-2">
                <DownloadIcon className="w-4 h-4" /> Export recipients
              </span>
            </Button>
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={cancelMutation.isPending}>
                    <span className="inline-flex items-center gap-2">
                      <Ban className="w-4 h-4" />
                      {cancelMutation.isPending ? "Cancelling…" : "Cancel campaign"}
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {(cancelMutation.error as Error)?.message ?? "Failed to cancel campaign"}
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Total Recipients" value={totalRecipients} color="text-gray-900" />
        <MetricCard
          label="Sent"
          value={campaign.sent}
          sub={`${sentRate.toFixed(1)}%`}
          color="text-green-600"
        />
        <MetricCard
          label="Delivered"
          value={campaign.delivered}
          sub={`${deliveryRate.toFixed(1)}%`}
          color="text-blue-600"
        />
        <MetricCard
          label="Read"
          value={campaign.read}
          sub={`${readRate.toFixed(1)}% of delivered`}
          color="text-purple-600"
        />
        <MetricCard
          label="Failed"
          value={campaign.failed}
          sub={`${failedRate.toFixed(1)}%`}
          color="text-red-600"
        />
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Delivery Funnel
        </h2>
        <div className="space-y-3">
          {[
            { label: "Submitted", value: totalRecipients, color: "bg-gray-500" },
            { label: "Sent", value: campaign.sent, color: "bg-green-500" },
            { label: "Delivered", value: campaign.delivered, color: "bg-blue-500" },
            { label: "Read", value: campaign.read, color: "bg-purple-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                <div
                  className={`${item.color} h-4 rounded-full transition-all`}
                  style={{
                    width: `${
                      totalRecipients > 0
                        ? Math.min(100, (item.value / totalRecipients) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="w-20 text-right text-sm font-medium ml-4">
                {item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-recipient table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold text-gray-900">
            Recipients{" "}
            <span className="text-sm text-gray-500 font-normal">
              ({totalMessages.toLocaleString()})
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <Label className="text-sm text-gray-600">Status</Label>
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

        {messagesQuery.isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={6} columns={6} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Phone</Th>
                  <Th>Status</Th>
                  <Th>Sent</Th>
                  <Th>Delivered</Th>
                  <Th>Read</Th>
                  <Th>Error</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No recipients match this filter.
                    </td>
                  </tr>
                ) : (
                  messages.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {m.recipientPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={messageStatusVariant[m.status] ?? "default"}
                        >
                          {m.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(m.sentAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(m.deliveredAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(m.readAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                        {m.failureReason ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalMessages > MESSAGES_PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Showing {(page - 1) * MESSAGES_PAGE_SIZE + 1}–
              {Math.min(page * MESSAGES_PAGE_SIZE, totalMessages)} of{" "}
              {totalMessages.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
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

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
      {sub && <div className={`text-xs mt-1 ${color} opacity-80`}>{sub}</div>}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}
