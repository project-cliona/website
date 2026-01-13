import { PageHeading } from "@/components/PageHeading";
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

export default function Dashboard() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <PageHeading
                    title="Services"
                    subtitle="Select a service to view or manage your assigned resources."
                />

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <List className="h-4 w-4" />
                    </Button>

                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        New project
                    </Button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search for a project"
                        className="pl-9"
                    />
                </div>

                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4 text-gray-500" />
                </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Project Card */}
                <Link href="/app/rcs" className="block">
                    <div className="border rounded-lg p-5 hover:shadow-md transition cursor-pointer bg-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    RCS
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    AWS | ap-south-1
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="mt-4">
                            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">
                                NANO
                            </span>
                        </div>
                    </div></Link>

            </div>
        </div>
    );
}
