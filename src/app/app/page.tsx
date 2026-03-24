"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    Plus,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ServiceModalContent } from "./addService";
import { useUser } from "@/providers/userProvider";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState<"grid" | "list">("grid");
    const { profile } = useUser();

    const services = profile?.userService?.services || [];

    const filteredServices = services.filter(
        (s) => s.mappedStatus !== "deleted"
    );

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case "active":
                return "active";
            case "inactive":
                return "inactive";
            case "suspended":
                return "pending";
            case "deleted":
                return "destructive";
            default:
                return "default";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <PageHeading
                    title="Services"
                    subtitle="Select a service to view or manage your assigned resources."
                />

                <div className="flex items-center gap-3">
                    <Button onClick={() => setView("grid")} className={view === "grid" ? "bg-gray-100" : ""} variant="ghost" size="icon">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setView("list")} className={view === "list" ? "bg-gray-100" : ""} variant="ghost" size="icon">
                        <List className="h-4 w-4" />
                    </Button>

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        New Service
                    </Button>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <ServiceModalContent onClose={() => setIsModalOpen(false)} />
                    </Modal>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search for a service" className="pl-9" />
                </div>

                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4 text-gray-500" />
                </Button>
            </div>

            {/* ❗ Empty State */}
            {filteredServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border rounded-lg bg-gray-50">
                    <p className="text-gray-600 mb-4">
                        No services added yet
                    </p>

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Service
                    </Button>
                </div>
            ) : (
                /* ✅ Dynamic Grid */
                <div
                    className={
                        view === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "flex flex-col gap-4"
                    }
                >
                    {filteredServices.map((service) => {
                        const isSuspended = service.mappedStatus === "suspended";

                        const card = (
                            <div
                                className={`border rounded-lg p-5 transition bg-white ${isSuspended
                                        ? "opacity-60 cursor-not-allowed"
                                        : "hover:shadow-md cursor-pointer"
                                    } ${view === "list" ? "flex items-center justify-between" : ""
                                    }`}
                            >
                                {/* LEFT SIDE */}
                                <div
                                    className={
                                        view === "list"
                                            ? "flex items-center gap-4"
                                            : "flex flex-col"
                                    }
                                >
                                    <div>
                                        <h3 className="font-medium text-gray-900 capitalize">
                                            {service.serviceName}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {service.serviceName === "rcs"
                                                ? "AWS | ap-south-1"
                                                : "Meta | Cloud API"}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SIDE */}
                                <div
                                    className={
                                        view === "list"
                                            ? "flex items-center gap-4"
                                            : "mt-4 flex items-center justify-between"
                                    }
                                >
                                    <Badge variant={getBadgeVariant(service.mappedStatus)}>
                                        {service.mappedStatus.charAt(0).toUpperCase() +
                                            service.mappedStatus.slice(1)}
                                    </Badge>

                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        );
                        // 🚫 If suspended → no navigation
                        return isSuspended ? (
                            <div key={service.serviceId}>{card}</div>
                        ) : (
                            <Link
                                key={service.serviceId}
                                href={`/app/${service.serviceName}`}
                            >
                                {card}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}