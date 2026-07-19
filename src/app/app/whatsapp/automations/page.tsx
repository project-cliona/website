"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Workflow, Mail, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { PromoCard } from "@/components/ui/PromoCard";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSubject,
} from "@/components/ui/table";
import { usePageSearch } from "@/providers/searchProvider";

interface AutomationRow {
  id: number;
  name: string;
  subtitle: string;
  type: "automated" | "scheduled";
  launched: string;
  performance: number;
}

const STUB_AUTOMATIONS: AutomationRow[] = [
  { id: 1, name: "Welcome Series", subtitle: "First-touch greeting flow", type: "automated", launched: "30+ days ago", performance: 87.1 },
  { id: 2, name: "Cart Recovery", subtitle: "Abandoned cart reminders", type: "automated", launched: "14 days ago", performance: 65.8 },
  { id: 3, name: "Product Launch", subtitle: "New arrivals announcement", type: "scheduled", launched: "7 days ago", performance: 92.4 },
  { id: 4, name: "Feedback Loop", subtitle: "Post-purchase survey", type: "automated", launched: "21 days ago", performance: 78.3 },
  { id: 5, name: "Seasonal Promotion", subtitle: "Holiday specials", type: "automated", launched: "10 days ago", performance: 80.5 },
  { id: 6, name: "Re-engagement", subtitle: "Win back inactive users", type: "automated", launched: "30 days ago", performance: 55.2 },
];

export default function AutomationsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  usePageSearch({ placeholder: "Search automations", onChange: setQ });

  const filtered = STUB_AUTOMATIONS.filter((a) =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeading
        title="Automations"
        subtitle="Manage your automated message flows"
        actions={
          <Button asChild className="bg-ai-gradient text-white shadow-e2 hover:shadow-e3">
            <Link href="/app/whatsapp/flows">
              <Plus className="h-4 w-4" /> New Flow
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-lg border border-border bg-card shadow-e1">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-h3">All Automations</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Automation Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Launched</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <TableSubject
                      avatar={
                        <div className="h-8 w-8 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                      }
                      primary={a.name}
                      secondary={a.subtitle}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusPill status={a.type}>
                      {a.type === "automated" ? "Automated" : "Scheduled"}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.launched}</TableCell>
                  <TableCell className="font-semibold tabular-nums">
                    {a.performance.toFixed(1)}%
                  </TableCell>
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
                          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                          <DropdownMenuItem disabled className="text-destructive focus:text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-5 py-4">
            <Pagination page={page} pageCount={15} onPageChange={setPage} />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <PromoCard
            icon={Workflow}
            title="Visual Automation Builder"
            description="Build awesome automations easily with our drag-and-drop editor."
            cta={{ label: "Open Flow Builder", href: "/app/whatsapp/flows" }}
          />
        </aside>
      </div>
    </div>
  );
}
