// Left palette: categorized, draggable node types. Click adds at viewport center;
// drag-drop places at the cursor (handled by FlowCanvas onDrop).

"use client";

import { cn } from "@/lib/utils";
import { PALETTE_NODES, type NodeMeta } from "@/lib/whatsapp/flow/nodeRegistry";
import { CATEGORY_STYLE, type NodeCategory } from "@/lib/whatsapp/flow/categories";
import type { FlowNodeType } from "@/lib/whatsapp/flow/types";

const GROUP_ORDER: NodeCategory[] = ["message", "interactive", "logic", "terminal"];

export const FLOW_NODE_DND_TYPE = "application/flow-node";

export function NodePalette({ onAdd }: { onAdd: (type: FlowNodeType) => void }) {
  const groups = GROUP_ORDER.map((cat) => ({
    cat,
    items: PALETTE_NODES.filter((m) => m.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-h3">Steps</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Drag onto the canvas or click to add</p>
      </div>
      <div className="p-3 space-y-4">
        {groups.map((g) => (
          <div key={g.cat}>
            <div className="text-caption text-muted-foreground px-1 mb-1.5">{CATEGORY_STYLE[g.cat].label}</div>
            <div className="space-y-1.5">
              {g.items.map((m) => (
                <PaletteItem key={m.type} meta={m} onAdd={onAdd} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function PaletteItem({ meta, onAdd }: { meta: NodeMeta; onAdd: (type: FlowNodeType) => void }) {
  const style = CATEGORY_STYLE[meta.category];
  const Icon = meta.icon;
  return (
    <button
      type="button"
      draggable
      onClick={() => onAdd(meta.type)}
      onDragStart={(e) => {
        e.dataTransfer.setData(FLOW_NODE_DND_TYPE, meta.type);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="group flex w-full items-start gap-2.5 rounded-md border border-border bg-background px-2.5 py-2 text-left transition-[box-shadow,border-color] duration-[var(--motion-fast)] hover:border-primary-200 hover:shadow-e1 focus-ring cursor-grab active:cursor-grabbing"
    >
      <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md", style.chipBg, style.chipText)}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-small font-medium text-foreground">{meta.label}</span>
        <span className="block text-xs text-muted-foreground line-clamp-2">{meta.description}</span>
      </span>
    </button>
  );
}
