import { PageHeading } from "@/components/ui/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    DollarSign,
    Layers,
    MessageSquare,
    MessageCircle,
    LucideProps,
} from "lucide-react";

const monthlyData = [
    { label: "Oct", sent: 4200 },
    { label: "Nov", sent: 5100 },
    { label: "Dec", sent: 7800 },
    { label: "Jan", sent: 6200 },
    { label: "Feb", sent: 8400 },
    { label: "Mar", sent: 12847 },
];

const channels = [
    {
        name: "RCS",
        icon: MessageSquare,
        color: "text-primary",
        progressColor: "bg-primary",
        volume: "7,920",
        pct: 62,
    },
    {
        name: "WhatsApp",
        icon: MessageCircle,
        color: "text-blue-500",
        progressColor: "bg-blue-400",
        volume: "4,927",
        pct: 38,
    },
];

const usageLog = [
    { date: "Mar 19", channel: "RCS", sent: "1,450", delivered: "1,389", failed: "61", cost: "$4.35" },
    { date: "Mar 18", channel: "WhatsApp", sent: "890", delivered: "867", failed: "23", cost: "$2.67" },
    { date: "Mar 17", channel: "RCS", sent: "1,230", delivered: "1,178", failed: "52", cost: "$3.69" },
    { date: "Mar 16", channel: "WhatsApp", sent: "1,100", delivered: "1,067", failed: "33", cost: "$3.30" },
    { date: "Mar 15", channel: "RCS", sent: "980", delivered: "945", failed: "35", cost: "$2.94" },
    { date: "Mar 14", channel: "RCS", sent: "1,340", delivered: "1,298", failed: "42", cost: "$4.02" },
];

export default function UsagePage() {
    const maxSent = Math.max(...monthlyData.map((d) => d.sent));

    return (
        <div className="space-y-8">
            <PageHeading
                title="Usage"
                subtitle="Track your message volume and estimated costs across all channels."
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Messages This Month"
                    value="12,847"
                    icon={<TrendingUp /> as React.ReactElement<LucideProps>}
                    trend="+18%"
                    trendUp={true}
                    iconVariant={0}
                />
                <StatsCard
                    title="Estimated Cost"
                    value="$38.54"
                    icon={<DollarSign /> as React.ReactElement<LucideProps>}
                    trend="-5%"
                    trendUp={false}
                    iconVariant={1}
                />
                <StatsCard
                    title="Active Channels"
                    value="2"
                    icon={<Layers /> as React.ReactElement<LucideProps>}
                    trend="+1"
                    trendUp={true}
                    iconVariant={2}
                />
            </div>

            {/* Volume + Channel Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Volume */}
                <div className="card-warm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="section-heading">Monthly Message Volume</h3>
                            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-4 h-[200px]">
                        {monthlyData.map((d) => (
                            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-center flex-1 justify-end">
                                    <span className="text-xs font-medium text-muted-foreground mb-1">
                                        {d.sent.toLocaleString()}
                                    </span>
                                    <div
                                        className="w-full max-w-[40px] bg-primary rounded-t-lg transition-all duration-300"
                                        style={{ height: `${(d.sent / maxSent) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground mt-2">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Channel Breakdown */}
                <div className="card-warm lg:col-span-1">
                    <h3 className="section-heading mb-6">By Channel</h3>
                    {channels.map((ch) => {
                        const Icon = ch.icon;
                        return (
                            <div key={ch.name} className="mb-5 last:mb-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`h-4 w-4 ${ch.color}`} />
                                        <span className="text-sm font-medium text-foreground">{ch.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">{ch.volume}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-border">
                                    <div
                                        className={`h-full rounded-full ${ch.progressColor}`}
                                        style={{ width: `${ch.pct}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{ch.pct}% of total</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Usage Log Table */}
            <div className="card-warm">
                <h3 className="section-heading mb-1">Message Log</h3>
                <p className="text-xs text-muted-foreground mb-4">Daily breakdown of message activity</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                {["Date", "Channel", "Sent", "Delivered", "Failed", "Cost"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left py-2.5 text-xs text-muted-foreground font-medium border-b border-border"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {usageLog.map((row) => (
                                <tr key={row.date + row.channel} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="py-3 text-foreground">{row.date}</td>
                                    <td className="py-3">
                                        {row.channel === "RCS" ? (
                                            <Badge variant="inactive">{row.channel}</Badge>
                                        ) : (
                                            <Badge className="bg-green-50 text-green-600 border-transparent">{row.channel}</Badge>
                                        )}
                                    </td>
                                    <td className="py-3 font-medium text-foreground">{row.sent}</td>
                                    <td className="py-3 text-green-700">{row.delivered}</td>
                                    <td className="py-3 text-red-500">{row.failed}</td>
                                    <td className="py-3 text-muted-foreground">{row.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
