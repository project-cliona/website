"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  exchangeWhatsappCode,
  getWhatsappConnectionStatus,
  disconnectWhatsapp,
} from "@/lib/api/whatsapp/onboarding";
import { launchEmbeddedSignup } from "@/lib/facebook-sdk";
import {
  MessageSquare,
  Send,
  Eye,
  Activity,
  FileText,
  Users,
  ArrowRight,
  LucideProps,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statsData = [
  {
    title: "Total Conversations",
    value: "1,842",
    icon: <MessageSquare /> as React.ReactElement<LucideProps>,
    trend: "+15%",
    trendUp: true,
    iconVariant: 0 as const,
  },
  {
    title: "Messages Sent",
    value: "5,623",
    icon: <Send /> as React.ReactElement<LucideProps>,
    trend: "+10%",
    trendUp: true,
    iconVariant: 1 as const,
  },
  {
    title: "Open Rate",
    value: "68.4%",
    icon: <Eye /> as React.ReactElement<LucideProps>,
    trend: "+3.2%",
    trendUp: true,
    iconVariant: 2 as const,
  },
  {
    title: "Active Campaigns",
    value: "12",
    icon: <Activity /> as React.ReactElement<LucideProps>,
    trend: "+3",
    trendUp: true,
    iconVariant: 3 as const,
  },
];

const recentCampaigns = [
  {
    name: "Festive Season Sale",
    status: "Delivered",
    statusDot: "bg-green-500",
    badgeVariant: "active" as const,
    count: "2,104",
    time: "1 hour ago",
  },
  {
    name: "Abandoned Cart Follow-up",
    status: "Sending",
    statusDot: "bg-blue-500",
    badgeVariant: "pending" as const,
    count: "987",
    time: "3 hours ago",
  },
  {
    name: "Re-engagement Blast",
    status: "Completed",
    statusDot: "bg-stone-400",
    badgeVariant: "inactive" as const,
    count: "3,412",
    time: "2 days ago",
  },
];

const weeklyData = [
  { day: "Mon", sent: 220, delivered: 205 },
  { day: "Tue", sent: 340, delivered: 318 },
  { day: "Wed", sent: 285, delivered: 270 },
  { day: "Thu", sent: 410, delivered: 389 },
  { day: "Fri", sent: 375, delivered: 355 },
  { day: "Sat", sent: 190, delivered: 178 },
  { day: "Sun", sent: 125, delivered: 118 },
];

const quickActions = [
  {
    icon: Send,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Send Campaign",
    description: "Dispatch a new WhatsApp campaign",
    href: "/app/whatsapp/sendMessage",
  },
  {
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Create Template",
    description: "Design a new message template",
    href: "/app/whatsapp/templates/create",
  },
  {
    icon: Users,
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    title: "Manage Contacts",
    description: "View and organise your contacts",
    href: "/app/whatsapp/contacts",
  },
];

export default function WhatsappDashboard() {
  const queryClient = useQueryClient();
  const [connectError, setConnectError] = useState<string | null>(null);

  const maxSent = Math.max(...weeklyData.map((d) => d.sent));

  // Connection status
  const { data: connectionStatus } = useQuery({
    queryKey: ["whatsapp-connection-status"],
    queryFn: getWhatsappConnectionStatus,
  });

  // Exchange token mutation
  const exchangeMutation = useMutation({
    mutationFn: exchangeWhatsappCode,
    onSuccess: () => {
      setConnectError(null);
      queryClient.invalidateQueries({ queryKey: ["whatsapp-connection-status"] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
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

  const handleConnect = async () => {
    setConnectError(null);
    const result = await launchEmbeddedSignup();
    if (result.status === "success") {
      exchangeMutation.mutate(result.code);
    } else if (result.status === "error") {
      setConnectError(result.message);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect your WhatsApp account?")) {
      disconnectMutation.mutate();
    }
  };

  return (
    <div className="space-y-8">
      <PageHeading
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your WhatsApp campaigns."
      />

      {/* Connection Status — Not Connected */}
      {connectionStatus?.connected === false && (
        <div className="card-warm">
          <h3 className="section-heading mb-1">Connect Your WhatsApp Business Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your WABA to start sending campaigns, managing templates, and tracking delivery reports.
          </p>
          <button
            onClick={handleConnect}
            disabled={exchangeMutation.isPending}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Connection Status — Connected */}
      {connectionStatus?.connected === true && connectionStatus.account && (
        <div className="card-warm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">Connected</span>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>
          <div className="mt-3">
            <p className="text-base font-semibold text-foreground">
              {connectionStatus.account.displayPhoneNumber}
            </p>
            {connectionStatus.account.businessName && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {connectionStatus.account.businessName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            trendUp={item.trendUp}
            iconVariant={item.iconVariant}
            index={index}
          />
        ))}
      </div>

      {/* Message Volume + Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Volume Card */}
        <div className="card-warm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-heading">Message Volume</h3>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                Sent
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                Delivered
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3 h-[180px]">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5 flex-1 justify-end">
                  <div
                    className="w-full max-w-[32px] bg-primary rounded-t-md transition-all duration-300"
                    style={{ height: `${(d.sent / maxSent) * 100}%` }}
                  />
                  <div
                    className="w-full max-w-[32px] bg-primary/30 rounded-t-md transition-all duration-300"
                    style={{ height: `${(d.delivered / maxSent) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="card-warm lg:col-span-1">
          <h3 className="section-heading mb-4">Recent Campaigns</h3>
          <div className="space-y-0">
            {recentCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${campaign.statusDot}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[140px]">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {campaign.count} messages &middot; {campaign.time}
                    </p>
                  </div>
                </div>
                <Badge variant={campaign.badgeVariant}>{campaign.status}</Badge>
              </div>
            ))}
          </div>
          <Link
            href="/app/whatsapp/campaignReport"
            className="text-sm text-primary font-medium mt-4 block hover:underline"
          >
            View all campaigns
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <div className="card-warm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow duration-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                  <Icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
