"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Plus, Workflow } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { usePageSearch } from "@/providers/searchProvider";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { createFlow, listFlows } from "@/lib/api/whatsapp/flows";
import type { FlowStatus } from "@/lib/whatsapp/flow/types";

const STATUS_STYLE: Record<FlowStatus, string> = {
  draft: "bg-secondary text-secondary-foreground",
  published: "bg-emerald-50 text-emerald-700",
  paused: "bg-amber-50 text-amber-700",
  archived: "bg-slate-100 text-slate-500",
};

export default function FlowsListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  usePageSearch({ placeholder: "Search flows", onChange: setQ });

  const { data: flows = [], isLoading } = useQuery({ queryKey: ["wa-flows"], queryFn: listFlows });

  const createMut = useMutation({
    mutationFn: () => createFlow(),
    onSuccess: (rec) => {
      qc.invalidateQueries({ queryKey: ["wa-flows"] });
      router.push(`/app/whatsapp/flows/${rec.id}`);
    },
    onError: (e) => notify.error(e, "Could not create flow"),
  });

  const filtered = flows.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeading
        title="Flow Builder"
        subtitle="Design automated WhatsApp conversations with a visual, drag-and-drop builder."
        actions={
          <Button onClick={() => createMut.mutate()} loading={createMut.isPending}>
            <Plus className="h-4 w-4" /> New Flow
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg border border-border bg-card animate-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Workflow className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-h3">{q ? "No flows match your search" : "No flows yet"}</h3>
            <p className="text-small text-muted-foreground mt-1">
              {q ? "Try a different name." : "Create your first automation to greet, qualify, and route customers 24/7."}
            </p>
          </div>
          {!q && (
            <Button onClick={() => createMut.mutate()} loading={createMut.isPending}>
              <Plus className="h-4 w-4" /> Create your first flow
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <Link key={f.id} href={`/app/whatsapp/flows/${f.id}`}>
              <Card variant="interactive" className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", STATUS_STYLE[f.status])}>
                    {f.status}
                  </span>
                </div>
                <h3 className="text-h3 mt-3 truncate">{f.name}</h3>
                {f.description && <p className="text-small text-muted-foreground mt-0.5 line-clamp-2">{f.description}</p>}
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {f.nodeCount} step{f.nodeCount === 1 ? "" : "s"}
                  </span>
                  <span>Updated {formatDistanceToNow(new Date(f.updatedAt), { addSuffix: true })}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
