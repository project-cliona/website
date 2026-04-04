"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/lib/api/whatsapp/dlr";
import type { WhatsappMessage } from "@/lib/type";
import { VariantProps } from "class-variance-authority";

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
        status: filters.status || undefined,
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
    sent: messages.filter((m) =>
      ["sent", "delivered", "read"].includes(m.status)
    ).length,
    delivered: messages.filter((m) =>
      ["delivered", "read"].includes(m.status)
    ).length,
    read: messages.filter((m) => m.status === "read").length,
    failed: messages.filter((m) => m.status === "failed").length,
  };

  const getDeliveryRate = () => {
    if (summary.sent === 0) return "0";
    return ((summary.delivered / summary.sent) * 100).toFixed(1);
  };

  const getReadRate = () => {
    if (summary.delivered === 0) return "0";
    return ((summary.read / summary.delivered) * 100).toFixed(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
              value={filters.dateType}
              onChange={(e) => handleFilterChange("dateType", e.target.value)}
            >
              <option value="Day">Day</option>
              <option value="Range">Date Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filters.dateType === "Day" ? "Date" : "Start Date"}
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          {filters.dateType === "Range" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="accepted">Accepted</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summary.totalSubmitted.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Messages</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summary.sent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Sent</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summary.delivered.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Delivered</div>
            <div className="text-xs text-blue-500">{getDeliveryRate()}%</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {summary.read.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Read</div>
            <div className="text-xs text-purple-500">{getReadRate()}%</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {summary.failed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Failed</div>
          </div>
        </div>
      </div>

      {/* Delivery Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                    width: `${
                      summary.totalSubmitted > 0
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Message Details
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
            <tbody className="bg-white divide-y divide-gray-200">
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
