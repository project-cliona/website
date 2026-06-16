"use client";

import { Mail, Eye, MousePointerClick, DollarSign, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeading } from "@/components/ui/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  LineChart,
  DonutChart,
  BarChart,
  HorizontalBarChart,
} from "@/components/ui/chart";
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CampaignRow {
  name: string;
  opens: number;
  clicks: number;
  openRate: string;
}

const TOP_CAMPAIGNS: CampaignRow[] = [
  { name: "Spring Sale Launch", opens: 2184, clicks: 876, openRate: "44.4%" },
  { name: "Welcome Series", opens: 1890, clicks: 756, openRate: "42.8%" },
  { name: "Product Update", opens: 1576, clicks: 630, openRate: "41.2%" },
  { name: "Newsletter #12", opens: 1340, clicks: 536, openRate: "39.9%" },
];

export default function AnalyticsPage() {
  const hourlyData = [
    { hour: "3am", opens: 200 },
    { hour: "6am", opens: 400 },
    { hour: "9am", opens: 750 },
    { hour: "12pm", opens: 600 },
    { hour: "3pm", opens: 500 },
  ];
  const geoData = [
    { label: "USA", value: 2200 },
    { label: "CAN", value: 1500 },
    { label: "GER", value: 9500 },
    { label: "ITA", value: 1800 },
    { label: "JAP", value: 1100 },
  ];
  const growthData = [
    { month: "Oct", value: 5800 },
    { month: "Nov", value: 7200 },
    { month: "Dec", value: 9800 },
    { month: "Jan", value: 6500 },
    { month: "Feb", value: 7800 },
  ];
  const deviceData = [
    { name: "Desktop", value: 45, color: "#4F46E5" },
    { name: "Mobile", value: 35, color: "#A5B4FC" },
    { name: "Tablet", value: 20, color: "#E2E8F0" },
  ];

  return (
    <div className="space-y-6">
      <PageHeading title="Analytics" subtitle="Deep dive into your messaging performance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Mail className="h-4 w-4" />} label="Emails Sent" value="24,589" trend={{ value: "+18%", positive: true }} />
        <StatsCard icon={<Eye className="h-4 w-4" />} label="Total Opens" value="10,524" trend={{ value: "+12%", positive: true }} />
        <StatsCard icon={<MousePointerClick className="h-4 w-4" />} label="Total Clicks" value="4,210" trend={{ value: "+8%", positive: true }} />
        <StatsCard icon={<DollarSign className="h-4 w-4" />} label="Revenue" value="$34,890" trend={{ value: "+24%", positive: true }} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-4">Top Performing Campaigns</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Opens</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_CAMPAIGNS.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-semibold">{c.name}</TableCell>
                  <TableCell className="tabular-nums">{c.opens.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums">{c.clicks.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums">{c.openRate}</TableCell>
                  <TableCell>
                    <TableActions>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary focus-ring"
                            aria-label="More"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled>View details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="lg:col-span-4 rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-1">Device Breakdown</h3>
          <p className="text-caption text-muted-foreground mb-4">Opens by device type</p>
          <DonutChart data={deviceData} centerLabel={{ primary: "45%", secondary: "Desktop" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-1">Hourly Engagement</h3>
          <p className="text-caption text-muted-foreground mb-4">Opens by hour</p>
          <LineChart data={hourlyData} xKey="hour" series={[{ key: "opens", label: "Opens" }]} />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-1">Geographic Performance</h3>
          <p className="text-caption text-muted-foreground mb-4">Revenue by country</p>
          <HorizontalBarChart data={geoData} />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-e1">
          <h3 className="text-h3 mb-1">Subscriber Growth</h3>
          <p className="text-caption text-muted-foreground mb-4">Monthly growth</p>
          <BarChart data={growthData} xKey="month" yKey="value" highlightIndex={2} />
        </div>
      </div>
    </div>
  );
}
