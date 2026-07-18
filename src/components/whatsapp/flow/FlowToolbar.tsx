// Editor top bar: editable name, dirty state, undo/redo, auto-arrange, validate,
// simulate toggle, save (draft) and publish.

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  LayoutGrid,
  Play,
  Save,
  Rocket,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useFlowStore, useFlowHistory } from "./store/flowStore";
import type { FlowValidationIssue } from "@/lib/whatsapp/flow/types";

interface Props {
  issues: FlowValidationIssue[];
  saving: boolean;
  publishing: boolean;
  simulatorOpen: boolean;
  onSave: () => void;
  onPublish: () => void;
  onAutoLayout: () => void;
  onToggleSimulator: () => void;
}

export function FlowToolbar({
  issues,
  saving,
  publishing,
  simulatorOpen,
  onSave,
  onPublish,
  onAutoLayout,
  onToggleSimulator,
}: Props) {
  const flowName = useFlowStore((s) => s.flowName);
  const setFlowName = useFlowStore((s) => s.setFlowName);
  const isDirty = useFlowStore((s) => s.isDirty);
  const markDirty = useFlowStore((s) => s.markDirty);

  const undo = useFlowHistory((s) => s.undo);
  const redo = useFlowHistory((s) => s.redo);
  const canUndo = useFlowHistory((s) => s.pastStates.length > 0);
  const canRedo = useFlowHistory((s) => s.futureStates.length > 0);

  const errorCount = issues.filter((i) => i.severity === "error").length;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-3">
      <Link
        href="/app/whatsapp/flows"
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring"
        aria-label="Back to flows"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <Input
        value={flowName}
        onChange={(e) => setFlowName(e.target.value)}
        className="h-9 max-w-xs font-medium"
        aria-label="Flow name"
      />

      <span className={cn("text-xs", isDirty ? "text-warning" : "text-muted-foreground")}>
        {isDirty ? "Unsaved changes" : "All changes saved"}
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <IconBtn
          label="Undo"
          onClick={() => {
            undo();
            markDirty();
          }}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </IconBtn>
        <IconBtn
          label="Redo"
          onClick={() => {
            redo();
            markDirty();
          }}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Auto-arrange" onClick={onAutoLayout}>
          <LayoutGrid className="h-4 w-4" />
        </IconBtn>

        <span
          className={cn(
            "ml-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs",
            errorCount > 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-50 text-emerald-700",
          )}
          title={issues.map((i) => i.message).join("\n") || "No issues"}
        >
          {errorCount > 0 ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {errorCount > 0 ? `${errorCount} issue${errorCount === 1 ? "" : "s"}` : "Valid"}
        </span>

        <Button variant={simulatorOpen ? "secondary" : "outline"} size="sm" onClick={onToggleSimulator}>
          <Play className="h-4 w-4" /> Simulate
        </Button>
        <Button variant="outline" size="sm" onClick={onSave} loading={saving} disabled={!isDirty && !saving}>
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button size="sm" onClick={onPublish} loading={publishing} disabled={errorCount > 0}>
          <Rocket className="h-4 w-4" /> Publish
        </Button>
      </div>
    </header>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
