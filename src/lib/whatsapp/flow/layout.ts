// Top-down auto-layout via elkjs (layered algorithm). Run on an explicit
// "Auto-arrange" action only (not on every change). Port-aware routing handles
// our multi-output button/condition nodes better than a tree layout.

import ELK from "elkjs/lib/elk.bundled.js";
import type { Edge, Node } from "@xyflow/react";
import type { FlowNodeData } from "./types";

type FNode = Node<FlowNodeData>;

const elk = new ELK();

const NODE_W = 264;
const NODE_H = 132;

const LAYOUT_OPTIONS: Record<string, string> = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.layered.spacing.nodeNodeBetweenLayers": "90",
  "elk.spacing.nodeNode": "64",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

export async function layoutFlow(nodes: FNode[], edges: Edge[]): Promise<FNode[]> {
  if (nodes.length === 0) return nodes;

  const graph = {
    id: "root",
    layoutOptions: LAYOUT_OPTIONS,
    children: nodes.map((n) => ({
      id: n.id,
      width: n.measured?.width ?? NODE_W,
      height: n.measured?.height ?? NODE_H,
    })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  };

  const res = await elk.layout(graph);
  const positions = new Map<string, { x: number; y: number }>(
    (res.children ?? []).map((c) => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]),
  );

  return nodes.map((n) => ({ ...n, position: positions.get(n.id) ?? n.position }));
}
