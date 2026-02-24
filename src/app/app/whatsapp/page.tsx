"use client";

import { PageHeading } from "@/components/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { useQuery } from "@tanstack/react-query";
import { fetchWhatsappDashboard } from "@/lib/api/whatsapp/dashboard";
import { BarChart, Send, CheckCircle, Book, LucideProps } from "lucide-react";
import Link from "next/link";

export default function WhatsappDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp-dashboard"],
    queryFn: fetchWhatsappDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeading
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your WhatsApp campaigns."
        />
        <TableSkeleton rows={4} columns={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeading
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your WhatsApp campaigns."
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Campaigns"
          value={data?.totalCampaigns?.toString() ?? "0"}
          icon={<BarChart color="#3b82f6" /> as React.ReactElement<LucideProps>}
          trend={data?.campaignsTrend ?? ""}
          trendUp={true}
          tooltip="Total number of WhatsApp campaigns"
        />
        <StatsCard
          title="Messages Sent"
          value={data?.messagesSent?.toLocaleString() ?? "0"}
          icon={<Send color="#4f46e5" /> as React.ReactElement<LucideProps>}
          trend={data?.messagesTrend ?? ""}
          trendUp={true}
          tooltip="Total messages sent across all campaigns"
        />
        <StatsCard
          title="Delivery Rate"
          value={data?.deliveryRate ?? "0%"}
          icon={<CheckCircle color="#22c55e" /> as React.ReactElement<LucideProps>}
          trend={data?.deliveryRateTrend ?? ""}
          trendUp={true}
          tooltip="Percentage of messages successfully delivered"
        />
        <StatsCard
          title="Active Templates"
          value={data?.activeTemplates?.toString() ?? "0"}
          icon={<Book color="#f59e0b" /> as React.ReactElement<LucideProps>}
          trend={data?.templatesTrend ?? ""}
          trendUp={true}
          tooltip="Number of active message templates"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Campaigns
          </h3>
          <div className="space-y-4">
            {data?.recentCampaigns?.map(
              (
                campaign: {
                  campaignName: string;
                  status: string;
                  messageCount: number;
                  createdAt: string;
                },
                index: number
              ) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {campaign.campaignName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {campaign.messageCount.toLocaleString()} messages
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : campaign.status === "Sending"
                        ? "bg-blue-50 text-blue-700"
                        : campaign.status === "Scheduled"
                        ? "bg-yellow-50 text-yellow-700"
                        : campaign.status === "Failed"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href="/app/whatsapp/sendMessage">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                Send New Campaign
              </button>
            </Link>
            <Link href="/app/whatsapp/templates/create">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-3">
                Create Template
              </button>
            </Link>
            <Link href="/app/whatsapp/contacts">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-3">
                Manage Contacts
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
