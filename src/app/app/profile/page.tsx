"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/providers/userProvider";
import { cn } from "@/lib/utils";
import { AlertTriangle, Copy } from "lucide-react";

const roleNames: Record<number, string> = {
    0: "Admin",
    1: "Reseller",
    2: "Client",
};

const profileFields = [
    { key: "fullName", label: "Full Name" },
    { key: "mobile", label: "Phone" },
    { key: "companyName", label: "Company" },
    { key: "companyUrl", label: "Company URL" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "currency", label: "Currency" },
] as const;

export default function ProfilePage() {
    const { user, profile } = useUser();
    const [activeTab, setActiveTab] = useState<"profile" | "apikeys">("profile");

    const initials = profile?.fullName?.[0]?.toUpperCase() ?? "?";

    return (
        <div className="space-y-8">
            <PageHeading
                title="Profile"
                subtitle="Manage your account information and API keys."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Card */}
                <div className="card-warm text-center lg:col-span-1">
                    {!user || !profile ? (
                        <div className="flex flex-col items-center gap-3">
                            <Skeleton className="w-20 h-20 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded-md" />
                            <Skeleton className="h-4 w-40 rounded-md" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto">
                                {initials}
                            </div>
                            <p className="text-xl font-semibold text-foreground mt-4">
                                {profile.fullName || "No name set"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <Badge variant="inactive">
                                    {roleNames[profile.roleId] ?? "User"}
                                </Badge>
                                <Badge variant={profile.profileStatus === "active" ? "active" : "pending"}>
                                    {profile.profileStatus}
                                </Badge>
                            </div>
                        </>
                    )}
                </div>

                {/* Tab Container */}
                <div className="card-warm lg:col-span-2">
                    {/* Tab Bar */}
                    <div className="flex border-b border-border mb-6">
                        {(["profile", "apikeys"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                                    activeTab === tab
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab === "profile" ? "Profile" : "API Keys"}
                            </button>
                        ))}
                    </div>

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profileFields.map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">
                                            {label}
                                        </label>
                                        <div className="text-sm text-foreground p-3 bg-muted/50 rounded-lg min-h-[40px]">
                                            {(profile as unknown as Record<string, string | undefined>)?.[key] ?? (
                                                <span className="text-muted-foreground italic">Not set</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-6">
                                <Button disabled className="cursor-not-allowed opacity-50">
                                    Edit Profile
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Profile editing coming soon
                                </p>
                            </div>
                        </div>
                    )}

                    {/* API Keys Tab */}
                    {activeTab === "apikeys" && (
                        <div>
                            <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4 flex gap-3 mb-5">
                                <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700">
                                    Keep your API key secret. Never expose it in client-side code.
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
                                    API Key
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 text-sm font-mono text-foreground p-3 bg-muted/50 rounded-lg border border-border">
                                        sk_live_&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                                    </div>
                                    <Button variant="outline" size="icon" aria-label="Copy API key">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Generated on March 1, 2026
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
