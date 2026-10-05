"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BarChart3, Send, CheckCircle, Book, Plus, Users, FileText } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { fetchWhatsappDashboard } from "@/lib/api/whatsapp/dashboard";
import { ConnectWabaCard } from "@/components/whatsapp/ConnectWabaCard";
import { useWaba } from "@/providers/wabaProvider";
import { wabaKeys } from "@/lib/queryKeys";
import { useUser } from "@/providers/userProvider";

export default function Dashboard() {
  const { profile } = useUser();
  const firstName = profile?.fullName?.split(" ")[0] ?? "there";

  const { hasWaba, isLoading: wabaLoading, selectedWabaId } = useWaba();

  const { data, isLoading } = useQuery({
    queryKey: wabaKeys.dashboard(selectedWabaId ?? ""),
    queryFn: () => fetchWhatsappDashboard(selectedWabaId!),
    enabled: !!selectedWabaId,
  });

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Welcome back, ${firstName}!`}
        subtitle="Here's what's happening with your WhatsApp campaigns today."
        actions={
          <>
            {/* Create Automation sat here. Hidden with the rest of the
                automations surface until that page does something. */}
            <Button asChild>
              <Link href="/app/whatsapp/sendMessage">
                <Plus className="h-4 w-4" />
                New Campaign
              </Link>
            </Button>
          </>
        }
      />

      {/* The connected-account card that used to sit here is gone: the top
          bar now shows the selected account permanently. */}
      {!wabaLoading && !hasWaba && <ConnectWabaCard />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Total Campaigns"
          info="All campaigns on this account, in any state."
          value={data?.totalCampaigns?.toLocaleString() ?? "0"}
          trend={data?.campaignsTrend ? { value: data.campaignsTrend, positive: true } : undefined}
        />
        <StatsCard
          icon={<Send className="h-4 w-4" />}
          label="Messages Sent"
          info="Outbound messages Meta accepted for delivery."
          value={data?.messagesSent?.toLocaleString() ?? "0"}
          trend={data?.messagesTrend ? { value: data.messagesTrend, positive: true } : undefined}
        />
        <StatsCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Delivery Rate"
          info="Delivered or read, as a share of all attempted."
          value={data?.deliveryRate ?? "0%"}
          trend={data?.deliveryRateTrend ? { value: data.deliveryRateTrend, positive: true } : undefined}
        />
        <StatsCard
          icon={<Book className="h-4 w-4" />}
          label="Active Templates"
          info="Meta-approved templates, ready to use today."
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
