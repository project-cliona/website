// Map between the React Flow editor shape and the versioned wire `FlowDefinition`.
// Strips React-Flow-only transient fields (selected, dragging, measured) on the way out.

import type { Edge, Node } from "@xyflow/react";
import {
  FLOW_DEFINITION_VERSION,
  type FlowDefinition,
  type FlowNodeData,
} from "./types";

type FNode = Node<FlowNodeData>;

export function serializeFlow(nodes: FNode[], edges: Edge[]): FlowDefinition {
  const start = nodes.find((n) => n.data.type === "start");
  return {
    version: FLOW_DEFINITION_VERSION,
    entryNodeId: start?.id ?? null,
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.data.type,
      position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
      config: n.data.config,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? null,
      targetHandle: e.targetHandle ?? null,
      label: typeof e.label === "string" ? e.label : undefined,
    })),
  };
}

export function deserializeFlow(def: FlowDefinition): { nodes: FNode[]; edges: Edge[] } {
  return {
    nodes: def.nodes.map((n) => ({
      id: n.id,
      type: n.type, // React Flow node-type key === our FlowNodeType
      position: n.position,
      // The trigger is required — block keyboard/API deletion of it.
      deletable: n.type !== "start",
      data: { type: n.type, config: n.config },
    })),
    edges: def.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
      targetHandle: e.targetHandle ?? undefined,
      label: e.label,
    })),
  };
}
