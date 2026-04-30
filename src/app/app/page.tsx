"use client";

import { Mail, Users, BarChart3, DollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { LineChart, DonutChart } from "@/components/ui/chart";
import { useUser } from "@/providers/userProvider";

export default function Dashboard() {
  const { profile } = useUser();
  const firstName = profile?.fullName?.split(" ")[0] ?? "there";

  // Stub data — real metrics get wired in a follow-up.
  const performanceData = [
    { day: "Mar 1", opens: 1200, clicks: 600, conversions: 200 },
    { day: "Mar 5", opens: 1800, clicks: 900, conversions: 400 },
    { day: "Mar 10", opens: 2400, clicks: 1100, conversions: 700 },
    { day: "Mar 15", opens: 2600, clicks: 1200, conversions: 800 },
    { day: "Mar 20", opens: 1900, clicks: 950, conversions: 500 },
    { day: "Mar 25", opens: 1700, clicks: 850, conversions: 450 },
    { day: "Mar 31", opens: 1500, clicks: 700, conversions: 350 },
  ];

  const typesData = [
    { name: "Newsletter", value: 35, color: "#4F46E5" },
    { name: "Promotional", value: 28, color: "#A5B4FC" },
    { name: "Transactional", value: 22, color: "#C7D2FE" },
    { name: "Other", value: 15, color: "#E2E8F0" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Welcome back, ${firstName}!`}
        subtitle="Welcome back! Here's what's happening today."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/app/whatsapp/sendMessage">
                <Plus className="h-4 w-4" />
                New Campaign
              </Link>
            </Button>
            <Button asChild className="bg-ai-gradient text-white shadow-e2 hover:shadow-e3">
              <Link href="/app/whatsapp">Create Automation</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Mail className="h-4 w-4" />}
          label="Total Campaigns"
          value="24"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<Users className="h-4 w-4" />}
          label="Active Contacts"
          value="8,429"
          trend={{ value: "+23%", positive: true }}
        />
        <StatsCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Avg. Open Rate"
          value="42.8%"
          trend={{ value: "+5.2%", positive: true }}
        />
        <StatsCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Revenue (MTD)"
          value="$12,450"
          trend={{ value: "-2.4%", positive: false }}
          accent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-1">Campaign Performance</h3>
          <p className="text-caption text-muted-foreground mb-4">Last 30 days overview</p>
          <LineChart
            data={performanceData}
            xKey="day"
            series={[
              { key: "opens", label: "Opens", color: "#4F46E5" },
              { key: "clicks", label: "Clicks", color: "#94A3B8" },
              { key: "conversions", label: "Conversions", color: "#FB923C" },
            ]}
          />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-1">Campaign Types</h3>
          <p className="text-caption text-muted-foreground mb-4">Distribution</p>
          <DonutChart data={typesData} centerLabel={{ primary: "35%", secondary: "Newsletter" }} />
        </div>
      </div>
    </div>
  );
}
