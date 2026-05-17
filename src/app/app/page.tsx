"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { BarChart3, Send, CheckCircle, Book, Plus, Users, FileText } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { fetchWhatsappDashboard } from "@/lib/api/whatsapp/dashboard";
import {
  exchangeWhatsappCode,
  getWhatsappConnectionStatus,
  disconnectWhatsapp,
} from "@/lib/api/whatsapp/onboarding";
import { launchEmbeddedSignup } from "@/lib/facebook-sdk";
import { useUser } from "@/providers/userProvider";

export default function Dashboard() {
  const { profile } = useUser();
  const firstName = profile?.fullName?.split(" ")[0] ?? "there";
  const queryClient = useQueryClient();
  const [connectError, setConnectError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp-dashboard"],
    queryFn: fetchWhatsappDashboard,
  });

  const { data: connectionStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["whatsapp-connection-status"],
    queryFn: getWhatsappConnectionStatus,
  });

  const exchangeMutation = useMutation({
    mutationFn: exchangeWhatsappCode,
    onSuccess: () => {
      setConnectError(null);
      queryClient.invalidateQueries({ queryKey: ["whatsapp-connection-status"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-dashboard"] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      setConnectError(
        error?.response?.data?.message ??
          "Failed to connect WhatsApp account. Please try again.",
      );
    },
  });

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
      exchangeMutation.mutate({
        code: result.code,
        wabaId: result.wabaId,
        phoneNumberId: result.phoneNumberId,
      });
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
    <div className="space-y-6">
      <PageHeading
        title={`Welcome back, ${firstName}!`}
        subtitle="Here's what's happening with your WhatsApp campaigns today."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/app/whatsapp/sendMessage">
                <Plus className="h-4 w-4" />
                New Campaign
              </Link>
            </Button>
            <Button asChild className="bg-ai-gradient text-white shadow-e2 hover:shadow-e3">
              <Link href="/app/whatsapp/automations">Create Automation</Link>
            </Button>
          </>
        }
      />

      {!statusLoading && connectionStatus?.connected === false && (
        <Card className="p-6">
          <h3 className="text-h3 mb-2">Connect Your WhatsApp Business Account</h3>
          <p className="text-small text-muted-foreground mb-4">
            Connect your WABA to start sending campaigns, managing templates, and tracking delivery reports.
          </p>
          <Button onClick={handleConnect} loading={exchangeMutation.isPending}>
            Connect WhatsApp
          </Button>
          {connectError && (
            <div className="mt-3 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
              {connectError}
            </div>
          )}
        </Card>
      )}

      {!statusLoading && connectionStatus?.connected === true && connectionStatus.account && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-success" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {connectionStatus.account.displayPhoneNumber}
                </p>
                {connectionStatus.account.businessName && (
                  <p className="text-caption text-muted-foreground">
                    {connectionStatus.account.businessName}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleDisconnect} loading={disconnectMutation.isPending}>
              Disconnect
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Total Campaigns"
          value={data?.totalCampaigns?.toLocaleString() ?? "0"}
          trend={data?.campaignsTrend ? { value: data.campaignsTrend, positive: true } : undefined}
        />
        <StatsCard
          icon={<Send className="h-4 w-4" />}
          label="Messages Sent"
          value={data?.messagesSent?.toLocaleString() ?? "0"}
          trend={data?.messagesTrend ? { value: data.messagesTrend, positive: true } : undefined}
        />
        <StatsCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Delivery Rate"
          value={data?.deliveryRate ?? "0%"}
          trend={data?.deliveryRateTrend ? { value: data.deliveryRateTrend, positive: true } : undefined}
        />
        <StatsCard
          icon={<Book className="h-4 w-4" />}
          label="Active Templates"
          value={data?.activeTemplates?.toLocaleString() ?? "0"}
          trend={data?.templatesTrend ? { value: data.templatesTrend, positive: true } : undefined}
          accent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-h3 mb-4">Recent Campaigns</h3>
          {isLoading ? (
            <div className="text-small text-muted-foreground">Loading…</div>
          ) : data?.recentCampaigns?.length ? (
            <div className="divide-y divide-border">
              {data.recentCampaigns.map(
                (
                  c: { campaignName: string; status: string; messageCount: number; createdAt: string },
                  i: number,
                ) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {c.campaignName}
                      </div>
                      <div className="text-caption text-muted-foreground">
                        {c.messageCount.toLocaleString()} messages
                      </div>
                    </div>
                    <StatusPill status={c.status.toLowerCase()}>{c.status}</StatusPill>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-small text-muted-foreground py-4">No campaigns yet.</div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-h3 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/app/whatsapp/sendMessage">
                <Send className="h-4 w-4" />
                Send New Campaign
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/app/whatsapp/templates/create">
                <FileText className="h-4 w-4" />
                Create Template
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/app/whatsapp/contacts">
                <Users className="h-4 w-4" />
                Manage Contacts
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
