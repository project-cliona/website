// Shared node chrome: a shadcn Card-styled box with a category-colored header,
// a target handle on top, and source handle(s) at the bottom/right (one per branch
// for buttons/condition). Body content is provided by the per-type summary.

"use client";

import * as React from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { NODE_META, getSourceHandles } from "@/lib/whatsapp/flow/nodeRegistry";
import { categoryStyleForNode } from "@/lib/whatsapp/flow/categories";
import type { FlowNodeData } from "@/lib/whatsapp/flow/types";

export const NODE_WIDTH = 256;

const SOURCE_DOT: React.CSSProperties = { width: 11, height: 11, background: "#4F46E5", border: "2px solid #fff" };
const TARGET_DOT: React.CSSProperties = { width: 11, height: 11, background: "#94A3B8", border: "2px solid #fff" };

export function BaseNode({
  data,
  selected,
  children,
}: {
  data: FlowNodeData;
  selected?: boolean;
  children?: React.ReactNode;
}) {
  const meta = NODE_META[data.type];
  const style = categoryStyleForNode(data.type);
  const Icon = meta.icon;
  const handles = getSourceHandles(data);
  const showTarget = data.type !== "start";
  const multiOutput = handles.length > 1;

  return (
    <div
      style={{ width: NODE_WIDTH }}
      className={cn(
        "rounded-lg border bg-card shadow-e1 transition-[box-shadow] duration-[var(--motion-fast)]",
        selected ? "border-primary ring-2 ring-primary/40 shadow-e2" : "border-border",
        data.hasError && "border-destructive ring-2 ring-destructive/40",
      )}
    >
      {showTarget && <Handle type="target" position={Position.Top} style={TARGET_DOT} />}

      <div className={cn("flex items-center gap-2 rounded-t-lg px-3 py-2", style.headerBg, style.headerText)}>
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-small font-semibold truncate">{meta.label}</span>
      </div>

      <div className="px-3 py-2.5 text-small text-foreground">{children}</div>

      {!multiOutput
        ? handles.length === 1 && (
            <Handle type="source" position={Position.Bottom} id={handles[0]!.id} style={SOURCE_DOT} />
          )
        : (
            <div className="flex flex-col gap-1.5 border-t border-border px-3 py-2.5">
              {handles.map((h) => (
                <div
                  key={h.id}
                  className="relative flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  <span className="truncate pr-3">{h.label ?? h.id}</span>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={h.id}
                    style={{ ...SOURCE_DOT, position: "absolute", right: -13, top: "50%" }}
                  />
                </div>
              ))}
            </div>
          )}
    </div>
  );
}
