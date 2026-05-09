"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, Plus, Search, Layers, CheckCircle, Loader, XCircle } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import type { VariantProps } from "class-variance-authority";

import { fetchCampaigns } from "@/lib/api/whatsapp/campaigns";
import type { WhatsappCampaign, WhatsappCampaignStatus } from "@/lib/type";
import { exportToCSV } from "@/lib/utils";
import { StatsCard } from "@/components/ui/StatsCard";

const PAGE_SIZE = 20;

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

function rateColor(rate: number) {
  if (rate >= 95) return "text-green-600";
  if (rate >= 85) return "text-yellow-600";
  return "text-red-600";
}

function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function WhatsappCampaignReports() {
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [dateType, setDateType] = useState<"All" | "Day" | "Range">("All");
  const [startDate, setStartDate] = useState<string>(
    formatDateLocal(new Date())
  );
  const [endDate, setEndDate] = useState<string>(formatDateLocal(new Date()));
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      status: status === "all" ? undefined : status || undefined,
      search: search || undefined,
      from:
        dateType === "All"
          ? undefined
          : startDate || undefined,
      to:
        dateType === "All"
          ? undefined
          : dateType === "Range"
            ? endDate || undefined
            : startDate || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [status, search, dateType, startDate, endDate, page]
  );

  const { data, isLoading } = useQuery({
    // Poll a bit so in-progress campaigns show fresh counters in the list view.
    refetchInterval: 10_000,
    queryKey: ["whatsapp-campaigns", filters],
    queryFn: () => fetchCampaigns(filters),
  });

  const campaigns = data?.campaigns ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Summary based on the currently-loaded page — cheap and good enough for a list view.
  // The detail page shows accurate numbers for individual campaigns.
  const summary = useMemo(() => {
    return {
      total,
      completed: campaigns.filter((c) => c.status === "completed").length,
      inFlight: campaigns.filter(
        (c) => c.status === "in_progress" || c.status === "queued"
      ).length,
      failed: campaigns.filter((c) => c.status === "failed").length,
    };
  }, [campaigns, total]);

  const handleExport = () => {
    if (campaigns.length === 0) return;
    exportToCSV<WhatsappCampaign>({
      data: campaigns,
      filename: `whatsapp-campaigns-${formatDateLocal(new Date())}.csv`,
      columns: [
        { header: "ID", accessor: "id" },
        { header: "Campaign Name", accessor: "campaignName" },
        { header: "Template", accessor: "templateName" },
        { header: "Language", accessor: "templateLanguage" },
        { header: "Total", accessor: "totalRecipients" },
        { header: "Sent", accessor: "sent" },
        { header: "Delivered", accessor: "delivered" },
        { header: "Read", accessor: "read" },
        { header: "Failed", accessor: "failed" },
        { header: "Status", accessor: "status" },
        {
          header: "Created",
          accessor: (row) => new Date(row.createdAt).toLocaleString(),
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeading
          title="Campaign Reports"
          subtitle="Track performance across every WhatsApp campaign"
        />
        <Link href="/app/whatsapp/sendMessage">
          <Button>
            <span className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Campaign
            </span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </Label>
            <Select
              value={status || "all"}
              onValueChange={(v) => {
                setStatus(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="in_progress">Sending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </Label>
            <Select
              value={dateType}
              onValueChange={(v) => {
                setDateType(v as typeof dateType);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All time</SelectItem>
                <SelectItem value="Day">Specific day</SelectItem>
                <SelectItem value="Range">Date range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateType !== "All" && (
            <div className="flex flex-col">
              <Label className="mb-2">
                {dateType === "Day" ? "Date" : "Start date"}
              </Label>
              <div className="w-[220px]">
                <DatePicker
                  value={startDate ? new Date(startDate) : undefined}
                  onChange={(d) => {
                    setStartDate(d ? formatDateLocal(d) : "");
                    setPage(1);
                  }}
                />
              </div>
            </div>
          )}

          {dateType === "Range" && (
            <div className="flex flex-col">
              <Label className="mb-2">End date</Label>
              <div className="w-[220px]">
                <DatePicker
                  value={endDate ? new Date(endDate) : undefined}
                  onChange={(d) => {
                    setEndDate(d ? formatDateLocal(d) : "");
                    setPage(1);
                  }}
                />
              </div>
            </div>
          )}

          <div className={dateType === "All" ? "md:col-span-2" : ""}>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </Label>
            <div className="relative w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search campaign name…"
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Campaigns"
          value={summary.total.toLocaleString()}
          icon={<Layers className="text-gray-700 w-5 h-5" />}
          tooltip="Total number of campaigns"
        />

        <StatsCard
          title="Completed"
          value={summary.completed.toLocaleString()}
          icon={<CheckCircle className="text-green-600 w-5 h-5" />}
          tooltip="Campaigns that completed successfully"
        />

        <StatsCard
          title="In Flight"
          value={summary.inFlight.toLocaleString()}
          icon={<Loader className="text-yellow-600 w-5 h-5" />}
          tooltip="Campaigns currently running"
        />

        <StatsCard
          title="Failed"
          value={summary.failed.toLocaleString()}
          icon={<XCircle className="text-red-600 w-5 h-5" />}
          tooltip="Campaigns that failed"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All campaigns</h2>
          <Button onClick={handleExport} disabled={campaigns.length === 0} variant="outline">
            <span className="inline-flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" /> Export page
            </span>
          </Button>
        </div>

        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={8} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Campaign</Th>
                  <Th>Template</Th>
                  <Th align="right">Recipients</Th>
                  <Th align="right">Delivery</Th>
                  <Th align="right">Read</Th>
                  <Th align="right">Failed</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {campaigns.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No campaigns yet. Click &quot;New Campaign&quot; to send
                      your first WhatsApp blast.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c) => {
                    const deliveryRate =
                      c.totalRecipients > 0
                        ? Math.round((c.delivered / c.totalRecipients) * 1000) / 10
                        : 0;
                    const readRate =
                      c.delivered > 0
                        ? Math.round((c.read / c.delivered) * 1000) / 10
                        : 0;
                    return (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/app/whatsapp/campaignReport/${c.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {c.campaignName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {c.templateName}
                          <span className="ml-1 text-xs text-gray-500">
                            ({c.templateLanguage})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {c.totalRecipients.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {c.totalRecipients > 0 ? (
                            <span className={`font-medium ${rateColor(deliveryRate)}`}>
                              {deliveryRate.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {c.delivered > 0 ? (
                            <span className={`font-medium ${rateColor(readRate)}`}>
                              {readRate.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {c.failed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={statusBadgeVariant[c.status]}>
                            {statusLabel[c.status]}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(c.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
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

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
    >
      {children}
    </th>
  );
}
