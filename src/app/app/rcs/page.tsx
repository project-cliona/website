import { PageHeading } from "@/components/ui/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Send,
    CheckCircle,
    Users,
    FileText,
    UserPlus,
    ArrowRight,
    LucideProps,
} from "lucide-react";
import Link from "next/link";

const statsData = [
    {
        title: "Total Campaigns",
        value: "24",
        icon: <BarChart /> as React.ReactElement<LucideProps>,
        trend: "+12%",
        trendUp: true,
        iconVariant: 0 as const,
    },
    {
        title: "RCS Sent",
        value: "1,247",
        icon: <Send /> as React.ReactElement<LucideProps>,
        trend: "+8%",
        trendUp: true,
        iconVariant: 1 as const,
    },
    {
        title: "Delivery Rate",
        value: "94.2%",
        icon: <CheckCircle /> as React.ReactElement<LucideProps>,
        trend: "+2.1%",
        trendUp: true,
        iconVariant: 2 as const,
    },
    {
        title: "Active Agents",
        value: "8",
        icon: <Users /> as React.ReactElement<LucideProps>,
        trend: "+1",
        trendUp: true,
        iconVariant: 3 as const,
    },
];

const recentCampaigns = [
    {
        name: "Holiday Promotion",
        status: "Delivered",
        statusDot: "bg-green-500",
        badgeVariant: "active" as const,
        count: "1,245",
        time: "2 hours ago",
    },
    {
        name: "Cart Abandonment",
        status: "Sending",
        statusDot: "bg-blue-500",
        badgeVariant: "pending" as const,
        count: "856",
        time: "4 hours ago",
    },
    {
        name: "Welcome Series",
        status: "Completed",
        statusDot: "bg-stone-400",
        badgeVariant: "inactive" as const,
        count: "2,103",
        time: "1 day ago",
    },
];

const weeklyData = [
    { day: "Mon", sent: 180, delivered: 168 },
    { day: "Tue", sent: 240, delivered: 225 },
    { day: "Wed", sent: 195, delivered: 181 },
    { day: "Thu", sent: 310, delivered: 289 },
    { day: "Fri", sent: 275, delivered: 261 },
    { day: "Sat", sent: 142, delivered: 134 },
    { day: "Sun", sent: 98, delivered: 91 },
];

const quickActions = [
    {
        icon: Send,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        title: "Send Campaign",
        description: "Dispatch a new RCS campaign",
        href: "/app/rcs/sendMessage",
    },
    {
        icon: FileText,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        title: "Create Template",
        description: "Design a new message template",
        href: "/app/rcs/templates/create",
    },
    {
        icon: UserPlus,
        iconBg: "bg-green-50",
        iconColor: "text-green-700",
        title: "Add Agent",
        description: "Register a new RCS agent bot",
        href: "/app/rcs/agents/create",
    },
];

export default function Dashboard() {
    const maxSent = Math.max(...weeklyData.map((d) => d.sent));

    return (
        <div className="space-y-8">
            <PageHeading
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening with your campaigns."
            />

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
                        href="/app/rcs/campaignReport"
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
