"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWhatsappDashboard } from "@/lib/api/whatsapp/dashboard";
import {
  exchangeWhatsappCode,
  getWhatsappConnectionStatus,
  disconnectWhatsapp,
} from "@/lib/api/whatsapp/onboarding";
import { launchEmbeddedSignup } from "@/lib/facebook-sdk";
import { BarChart, Send, CheckCircle, Book, LucideProps } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WhatsappDashboard() {
  const queryClient = useQueryClient();
  const [connectError, setConnectError] = useState<string | null>(null);

  // Dashboard data
  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp-dashboard"],
    queryFn: fetchWhatsappDashboard,
  });

  // Connection status
  const { data: connectionStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["whatsapp-connection-status"],
    queryFn: getWhatsappConnectionStatus,
  });

  // Exchange token mutation
  const exchangeMutation = useMutation({
    mutationFn: exchangeWhatsappCode,
    onSuccess: () => {
      setConnectError(null);
      queryClient.invalidateQueries({ queryKey: ["whatsapp-connection-status"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-dashboard"] });
    },
    onError: (error: any) => {
      setConnectError(
        error?.response?.data?.message ??
          "Failed to connect WhatsApp account. Please try again."
      );
    },
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: disconnectWhatsapp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-connection-status"] });
    },
  });

  // Handle connect button click
  const handleConnect = async () => {
    setConnectError(null);
    const result = await launchEmbeddedSignup();
    if (result.status === "success") {
      exchangeMutation.mutate(result.code);
    } else if (result.status === "error") {
      setConnectError(result.message);
    }
    // "cancelled" -- no action, user dismissed the popup
  };

  // Handle disconnect
  const handleDisconnect = () => {
    if (
      window.confirm(
        "Are you sure you want to disconnect your WhatsApp account?"
      )
    ) {
      disconnectMutation.mutate();
    }
  };

  if (isLoading || statusLoading) {
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

      {/* Connection Status Banner */}
      {connectionStatus?.connected === false && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Your WhatsApp Business Account
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect your WABA to start sending campaigns, managing templates,
            and tracking delivery reports.
          </p>
          <button
            onClick={handleConnect}
            disabled={exchangeMutation.isPending}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exchangeMutation.isPending ? "Connecting..." : "Connect WhatsApp"}
          </button>
          {connectError && (
            <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {connectError}
            </div>
          )}
        </div>
      )}

      {connectionStatus?.connected === true && connectionStatus.account && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">
                Connected
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>
          <div className="mt-3">
            <p className="text-base font-semibold text-gray-900">
              {connectionStatus.account.displayPhoneNumber}
            </p>
            {connectionStatus.account.businessName && (
              <p className="text-sm text-gray-500 mt-0.5">
                {connectionStatus.account.businessName}
              </p>
            )}
          </div>
        </div>
      )}

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
          icon={
            <CheckCircle color="#22c55e" /> as React.ReactElement<LucideProps>
          }
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
