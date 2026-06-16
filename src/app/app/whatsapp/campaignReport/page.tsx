"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DownloadIcon,
  Plus,
  Mail,
  MoreHorizontal,
  Send,
  CheckCircle2,
  Eye,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
  TableSubject,
  TableActions,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { fetchCampaigns } from "@/lib/api/whatsapp/campaigns";
import type { WhatsappCampaign, WhatsappCampaignStatus } from "@/lib/type";
import { exportToCSV } from "@/lib/utils";
import { usePageSearch } from "@/providers/searchProvider";

const PAGE_SIZE = 20;

const statusLabel: Record<WhatsappCampaignStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  in_progress: "Sending",
  completed: "Completed",
  cancelled: "Cancelled",
  failed: "Failed",
};

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

  usePageSearch({
    placeholder: "Search campaigns",
    onChange: (value) => {
      setSearch(value);
      setPage(1);
    },
  });

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
    const totalDelivered = campaigns.reduce((acc, c) => acc + c.delivered, 0);
    const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
    const totalRead = campaigns.reduce((acc, c) => acc + c.read, 0);
    const deliveryRate =
      totalSent > 0 ? Math.round((totalDelivered / totalSent) * 1000) / 10 : 0;
    const readRate =
      totalDelivered > 0
        ? Math.round((totalRead / totalDelivered) * 1000) / 10
        : 0;
    return {
      total,
      sentToday: totalSent,
      deliveryRate,
      readRate,
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
      <PageHeading
        title="Campaigns"
        subtitle="Track your sent and scheduled campaigns"
        actions={
          <Button asChild>
            <Link href="/app/whatsapp/sendMessage">
              <Plus className="h-4 w-4" /> New Campaign
            </Link>
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Send className="h-4 w-4" />}
          label="Sent (page)"
          value={summary.sentToday.toLocaleString()}
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Delivery rate"
          value={`${summary.deliveryRate.toFixed(1)}%`}
          trend={{ value: "+1.4%", positive: true }}
        />
        <StatsCard
          icon={<Eye className="h-4 w-4" />}
          label="Read rate"
          value={`${summary.readRate.toFixed(1)}%`}
          trend={{ value: "+3.2%", positive: true }}
        />
        <StatsCard
          icon={<Calendar className="h-4 w-4" />}
          label="Total campaigns"
          value={summary.total.toLocaleString()}
          trend={{ value: "+8%", positive: true }}
          accent
        />
      </div>

      {/* Filters + table */}
      <div className="rounded-lg border border-border bg-card shadow-e1">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-h3">All Campaigns</h3>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="block text-caption text-muted-foreground mb-1">
                Status
              </Label>
              <Select
                value={status || "all"}
                onValueChange={(v) => {
                  setStatus(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
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
              <Label className="block text-caption text-muted-foreground mb-1">
                Date
              </Label>
              <Select
                value={dateType}
                onValueChange={(v) => {
                  setDateType(v as typeof dateType);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[160px]">
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
              <div>
                <Label className="block text-caption text-muted-foreground mb-1">
                  {dateType === "Day" ? "Date" : "Start date"}
                </Label>
                <div className="w-[180px]">
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
              <div>
                <Label className="block text-caption text-muted-foreground mb-1">
                  End date
                </Label>
                <div className="w-[180px]">
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

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={campaigns.length === 0}
            >
              <DownloadIcon className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead className="text-right">Delivered</TableHead>
              <TableHead className="text-right">Read</TableHead>
              <TableHead className="text-right">Failed</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading rows={5} columns={8} />
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No campaigns yet. Click &quot;New Campaign&quot; to send your
                  first WhatsApp blast.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/app/whatsapp/campaignReport/${c.id}`}
                      className="focus-ring rounded-md inline-block"
                    >
                      <TableSubject
                        avatar={
                          <div className="h-8 w-8 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center">
                            <Mail className="h-4 w-4" />
                          </div>
                        }
                        primary={c.campaignName}
                        secondary={`${c.templateName} (${c.templateLanguage})`}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={c.status}>
                      {statusLabel[c.status]}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="tabular-nums text-right">
                    {c.sent.toLocaleString()}
                  </TableCell>
                  <TableCell className="tabular-nums text-right">
                    {c.delivered.toLocaleString()}
                  </TableCell>
                  <TableCell className="tabular-nums text-right">
                    {c.read.toLocaleString()}
                  </TableCell>
                  <TableCell className="tabular-nums text-right">
                    {c.failed.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(c.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <TableActions>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary focus-ring"
                            aria-label="More"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/app/whatsapp/campaignReport/${c.id}`}
                            >
                              View details
                            </Link>
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

        <div className="px-5 py-4">
          <Pagination
            page={page}
            pageCount={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
