"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/lib/api/whatsapp/dlr";
import type { WhatsappMessage } from "@/lib/type";
import { VariantProps } from "class-variance-authority";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { exportToCSV } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Mail, Send, CheckCircle, Eye, XCircle, DownloadIcon } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
const statusVariantMap: Record<
  string,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  accepted: "default",
  sent: "pending",
  delivered: "active",
  read: "active",
  failed: "rejected",
};

export default function WhatsappDeliveryReports() {
  const [filters, setFilters] = useState({
    dateType: "Day",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: "",
    page: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp-dlr", filters],
    queryFn: () =>
      fetchMessages({
        status: filters.status === "all" ? undefined : filters.status,
        from: filters.startDate,
        to: filters.dateType === "Range" ? filters.endDate : filters.startDate,
        page: filters.page,
        limit: 50,
      }),
  });

  const messages = data?.messages ?? [];
  const total = data?.total ?? 0;

  // Compute summary stats from messages
  const summary = {
    totalSubmitted: total,

    sent: messages.filter((m) => m.status === "sent").length,
    delivered: messages.filter((m) => m.status === "delivered").length,
    read: messages.filter((m) => m.status === "read").length,
    failed: messages.filter((m) => m.status === "failed").length,
  };

  const getRate = (count: number) => {
    if (summary.totalSubmitted === 0) return "0";
    return ((count / summary.totalSubmitted) * 100).toFixed(1);
  };
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleDownload = () => {
    exportToCSV({
      data: messages,
      filename: `dlr-${filters.startDate}-to-${filters.endDate}.csv`,
      columns: [
        { header: "ID", accessor: "id" },
        { header: "Recipient", accessor: "recipientPhone" },
        { header: "Template", accessor: (row) => row.templateName || row.type },
        { header: "Status", accessor: "status" },
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
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeading
          title="Delivery Reports"
          subtitle="Track your WhatsApp message delivery performance"
        />
        <TableSkeleton rows={5} columns={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Delivery Reports"
        subtitle="Track your WhatsApp message delivery performance"
      />

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Date Type
            </Label>
            <Select
              value={filters.dateType}
              onValueChange={(value) => handleFilterChange("dateType", value)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select Date Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Day">Day</SelectItem>
                <SelectItem value="Range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              {filters.dateType === "Day" ? "Date" : "Start Date"}
            </Label>
            <div className="w-[220px]">
              <DatePicker
                value={filters.startDate ? new Date(filters.startDate) : undefined}
                onChange={(date) =>
                  handleFilterChange(
                    "startDate",
                    date ? formatDateLocal(date) : ""
                  )
                }
              />
            </div>
          </div>

          {filters.dateType === "Range" && (
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </Label>
              <div className="w-[220px]">
                <DatePicker
                  value={filters.endDate ? new Date(filters.endDate) : undefined}
                  onChange={(date) =>
                    handleFilterChange(
                      "endDate",
                      date ? formatDateLocal(date) : ""
                    )
                  }
                />
              </div>
            </div>
          )}

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          title="Total Messages"
          value={summary.totalSubmitted.toLocaleString()}
          icon={<Mail className="text-blue-600 w-5 h-5" />}
          tooltip="Total number of messages submitted"
        />

        <StatsCard
          title="Sent"
          value={summary.sent.toLocaleString()}
          icon={<Send className="text-green-600 w-5 h-5" />}
          trend={summary.sent > 0
            ? `${getRate(summary.sent)}%`
            : undefined}
          trendUp={true}
          tooltip="Messages successfully sent"
        />

        <StatsCard
          title="Delivered"
          value={summary.delivered.toLocaleString()}
          icon={<CheckCircle className="text-blue-600 w-5 h-5" />}
          trend={summary.delivered > 0
            ? `${getRate(summary.delivered)}%`
            : undefined}
          trendUp={true}
          tooltip="Messages delivered to recipients"
        />

        <StatsCard
          title="Read"
          value={summary.read.toLocaleString()}
          icon={<Eye className="text-purple-600 w-5 h-5" />}
          trend={summary.read > 0
            ? `${getRate(summary.read)}%`
            : undefined}
          trendUp={true}
          tooltip="Messages read by users"
        />

        <StatsCard
          title="Failed"
          value={summary.failed.toLocaleString()}
          icon={<XCircle className="text-red-600 w-5 h-5" />}
          trend={
            summary.failed > 0
              ? `${getRate(summary.failed)}%`
              : undefined
          }
          trendUp={false}
          tooltip="Messages that failed to send"
        />
      </div>

      {/* Delivery Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Delivery Funnel
        </h2>
        <div className="space-y-3">
          {[
            { label: "Submitted", value: summary.totalSubmitted, color: "bg-blue-500" },
            { label: "Sent", value: summary.sent, color: "bg-green-500" },
            { label: "Delivered", value: summary.delivered, color: "bg-blue-500" },
            { label: "Read", value: summary.read, color: "bg-purple-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                <div
                  className={`${item.color} h-4 rounded-full`}
                  style={{
                    width: `${summary.totalSubmitted > 0
                      ? (item.value / summary.totalSubmitted) * 100
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

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Message Details
          </h2>

          <Button
            onClick={handleDownload}
          >
            <span className="flex gap-2 items-center"><DownloadIcon /> Download CSV</span>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivered At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No messages found for the selected filters.
                  </td>
                </tr>
              ) : (
                messages.map((msg: WhatsappMessage) => (
                  <tr key={msg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {msg.recipientPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {msg.templateName || msg.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusVariantMap[msg.status] || "default"}>
                        {msg.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(msg.sentAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(msg.deliveredAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(msg.readAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                      {msg.failureReason || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 50 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(filters.page - 1) * 50 + 1}-
              {Math.min(filters.page * 50, total)} of {total}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                disabled={filters.page * 50 >= total}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
