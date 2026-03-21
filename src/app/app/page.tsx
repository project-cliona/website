import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    MessageCircle,
    Phone,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

const channels = [
    {
        name: "RCS",
        provider: "Google RCS Business Messaging",
        icon: MessageSquare,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        href: "/app/rcs",
        active: true,
    },
    {
        name: "WhatsApp",
        provider: "Meta Cloud API",
        icon: MessageCircle,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        href: "/app/whatsapp",
        active: true,
    },
    {
        name: "SMS",
        provider: "Coming Soon",
        icon: Phone,
        iconBg: "bg-stone-100",
        iconColor: "text-stone-400",
        href: "",
        active: false,
    },
];

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <PageHeading
                title="Workspace"
                subtitle="Choose a channel to manage your campaigns and messaging."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels.map((channel) => {
                    const Icon = channel.icon;
                    const card = (
                        <div
                            className={`card-warm group cursor-pointer transition-all duration-200 ${
                                channel.active
                                    ? "hover:-translate-y-0.5 hover:shadow-md"
                                    : "opacity-60 cursor-not-allowed"
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${channel.iconBg}`}>
                                <Icon className={`h-6 w-6 ${channel.iconColor}`} />
                            </div>

                            <h3 className="text-lg font-semibold text-foreground mt-5">
                                {channel.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {channel.provider}
                            </p>

                            <div className="flex items-center justify-between mt-5">
                                {channel.active ? (
                                    <Badge variant="active">Active</Badge>
                                ) : (
                                    <Badge className="bg-stone-100 text-stone-500 border-transparent">
                                        Coming Soon
                                    </Badge>
                                )}
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    );

                    if (channel.active) {
                        return (
                            <Link key={channel.name} href={channel.href} className="block">
                                {card}
                            </Link>
                        );
                    }

                    return <div key={channel.name}>{card}</div>;
                })}
            </div>
        </div>
    );
}
