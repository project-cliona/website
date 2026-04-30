"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, FileText, CheckCircle2, Clock, Plus, MoreHorizontal, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
  TableSubject,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageSearch } from "@/providers/searchProvider";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import { useUser } from "@/providers/userProvider";
import type { WhatsappTemplate } from "@/lib/type";

const APPROVED_STATUSES = new Set(["APPROVED", "approved", "active", "ACTIVE"]);
const PENDING_STATUSES = new Set([
  "PENDING",
  "pending",
  "IN_REVIEW",
  "in_review",
  "PENDING_REVIEW",
  "pending_review",
]);
const REJECTED_STATUSES = new Set(["REJECTED", "rejected"]);

function statusLabel(status: string | null | undefined): string {
  if (!status) return "Draft";
  if (APPROVED_STATUSES.has(status)) return "Approved";
  if (PENDING_STATUSES.has(status)) return "Pending";
  if (REJECTED_STATUSES.has(status)) return "Rejected";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function statusToneFor(status: string | null | undefined): "green" | "violet" | "red" | "slate" {
  if (!status) return "slate";
  if (APPROVED_STATUSES.has(status)) return "green";
  if (PENDING_STATUSES.has(status)) return "violet";
  if (REJECTED_STATUSES.has(status)) return "red";
  return "slate";
}

function categoryToneFor(category: WhatsappTemplate["category"]): "violet" | "indigo" | "slate" {
  switch (category) {
    case "marketing":
      return "violet";
    case "authentication":
      return "indigo";
    case "utility":
    default:
      return "slate";
  }
}

function categoryLabel(category: WhatsappTemplate["category"]): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.userId;
  const [q, setQ] = useState("");
  usePageSearch({ placeholder: "Search templates", onChange: setQ });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["whatsapp-templates", userId],
    queryFn: () => fetchWhatsappTemplates(Number(userId)),
    enabled: !!userId,
  });

  const filtered = useMemo(() => {
    if (!q) return templates;
    const needle = q.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        t.category.toLowerCase().includes(needle) ||
        (t.language?.toLowerCase().includes(needle) ?? false) ||
        (t.status?.toLowerCase().includes(needle) ?? false),
    );
  }, [templates, q]);

  const totals = useMemo(() => {
    let approved = 0;
    let pending = 0;
    const categories = new Map<string, number>();
    for (const t of templates) {
      if (t.status && APPROVED_STATUSES.has(t.status)) approved++;
      if (t.status && PENDING_STATUSES.has(t.status)) pending++;
      categories.set(t.category, (categories.get(t.category) ?? 0) + 1);
    }
    return { approved, pending, categories };
  }, [templates]);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Templates"
        subtitle="Your WhatsApp message templates"
        actions={
          <Button asChild>
            <Link href="/app/whatsapp/templates/create">
              <Plus className="h-4 w-4" /> Create Template
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FileText className="h-4 w-4" />}
          label="Total Templates"
          value={templates.length.toLocaleString()}
        />
        <StatsCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Approved"
          value={totals.approved.toLocaleString()}
        />
        <StatsCard
          icon={<Clock className="h-4 w-4" />}
          label="Pending review"
          value={totals.pending.toLocaleString()}
        />
        <StatsCard
          icon={<Mail className="h-4 w-4" />}
          label="Marketing"
          value={(totals.categories.get("marketing") ?? 0).toLocaleString()}
          accent
        />
      </div>

      <div className="rounded-lg border border-border bg-card shadow-e1">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-h3">Your Templates</h3>
          {q && (
            <span className="text-caption text-muted-foreground">
              {filtered.length} of {templates.length} match &ldquo;{q}&rdquo;
            </span>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading rows={5} columns={5} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16">
                  <div className="flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-h2 text-foreground">
                      {q ? "No templates match your search" : "No templates yet"}
                    </h3>
                    <p className="text-small text-muted-foreground mt-2 max-w-sm">
                      {q
                        ? "Try a different name, category, or language."
                        : "Create your first WhatsApp template to start sending campaigns."}
                    </p>
                    {!q && (
                      <Button asChild className="mt-6">
                        <Link href="/app/whatsapp/templates/create">
                          <Plus className="h-4 w-4" /> Create Template
                        </Link>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/app/whatsapp/templates/${t.id}`)}
                >
                  <TableCell>
                    <TableSubject
                      avatar={
                        <div className="h-8 w-8 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                      }
                      primary={t.name}
                      secondary={t.language?.toUpperCase()}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={categoryToneFor(t.category)}>
                      {categoryLabel(t.category)}
                    </StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={statusToneFor(t.status)}>{statusLabel(t.status)}</StatusPill>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/app/whatsapp/templates/${t.id}`}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/app/whatsapp/templates/${t.id}`}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
