"use client";

import { use, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { FlowBuilder } from "@/components/whatsapp/flow/FlowBuilder";
import { useFlowStore } from "@/components/whatsapp/flow/store/flowStore";
import { getFlow } from "@/lib/api/whatsapp/flows";
import { Button } from "@/components/ui/Button";

export default function FlowEditorPage({ params }: { params: Promise<{ flowId: string }> }) {
  const { flowId } = use(params);
  const { data, isLoading, isError } = useQuery({ queryKey: ["wa-flow", flowId], queryFn: () => getFlow(flowId) });
  const loadDefinition = useFlowStore((s) => s.loadDefinition);
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (data && loadedRef.current !== data.id) {
      loadDefinition(data.id, data.name, data.definition);
      loadedRef.current = data.id;
      // Drop any undo history carried over from a previously-open flow so Undo
      // can't restore another flow's graph. Clear again after the debounced
      // history push from this load settles (~250ms).
      useFlowStore.temporal.getState().clear();
      const t = setTimeout(() => useFlowStore.temporal.getState().clear(), 300);
      return () => clearTimeout(t);
    }
  }, [data, loadDefinition]);

  // Full-bleed: cancel the app shell's px-6/py-6 and fill below the 3.5rem TopBar.
  return (
    <div className="-m-6 h-[calc(100dvh-3.5rem)] overflow-hidden">
      {isLoading ? (
        <Centered>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-small text-muted-foreground">Loading flow…</span>
        </Centered>
      ) : isError || !data ? (
        <Centered>
          <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          <p className="text-h3">Flow not found</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/app/whatsapp/flows">Back to flows</Link>
          </Button>
        </Centered>
      ) : (
        <ReactFlowProvider>
          <FlowBuilder />
        </ReactFlowProvider>
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col items-center justify-center gap-3">{children}</div>;
}
