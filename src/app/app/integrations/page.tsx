import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
    Webhook,
    MessageCircle,
    MessageSquare,
    Zap,
} from "lucide-react";
import Link from "next/link";

const availableIntegrations = [
    {
        name: "Meta WABA",
        description: "Connect your WhatsApp Business Account for messaging",
        icon: MessageCircle,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        category: "Messaging",
        href: "/app/whatsapp",
        cta: "Connect",
    },
    {
        name: "Google RCS",
        description: "Register RCS agents for rich business messaging",
        icon: MessageSquare,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        category: "Messaging",
        href: "/app/rcs/agents/create",
        cta: "Connect",
    },
    {
        name: "Webhook",
        description: "Send real-time event notifications to your server",
        icon: Webhook,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        category: "Developer",
        href: "",
        cta: "Configure",
    },
    {
        name: "Zapier",
        description: "Automate workflows with 5,000+ app integrations",
        icon: Zap,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-700",
        category: "Automation",
        href: "",
        cta: "coming_soon",
    },
];

export default function IntegrationsPage() {
    return (
        <div className="space-y-8">
            <PageHeading
                title="Integrations"
                subtitle="Connect your favorite tools and services."
            />

            {/* Active Integrations */}
            <div>
                <h3 className="section-heading mb-4">Active Integrations</h3>
                <div className="card-warm flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Webhook className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Webhook</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Sends events to https://api.yourapp.com/hooks
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="active">Connected</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                    </div>
                </div>
            </div>

            {/* Available Integrations */}
            <div>
                <h3 className="section-heading mb-4">Available Integrations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {availableIntegrations.map((integration) => {
                        const Icon = integration.icon;
                        return (
                            <div
                                key={integration.name}
                                className="card-warm group hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${integration.iconBg}`}>
                                    <Icon className={`h-5 w-5 ${integration.iconColor}`} />
                                </div>
                                <p className="text-sm font-semibold text-foreground mt-3">{integration.name}</p>
                                <p className="text-xs text-muted-foreground mt-1 mb-4">{integration.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{integration.category}</span>
                                    {integration.cta === "coming_soon" ? (
                                        <Badge className="bg-stone-100 text-stone-500 text-xs border-transparent">
                                            Coming Soon
                                        </Badge>
                                    ) : integration.href ? (
                                        <Link href={integration.href}>
                                            <Button size="sm">{integration.cta}</Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="sm">{integration.cta}</Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
