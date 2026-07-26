// Single source of truth for the editor session. React Flow is rendered *controlled*
// from this store; undo/redo via zundo (history limited to nodes+edges).
//
// Design rules that prevent the classic node-editor bugs:
//  - node `data` is always REPLACED, never mutated (React Flow memoizes by data ref)
//  - nodes read actions from this store via selectors (no callbacks through `data` → no stale closures)
//  - one outgoing edge per source handle (re-connecting a handle replaces the old edge)

"use client";

import { create } from "zustand";
import { useStore as useZustandStore } from "zustand";
import { temporal } from "zundo";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";

import type { AnyNodeConfig, FlowDefinition, FlowNodeData, FlowNodeType } from "@/lib/whatsapp/flow/types";
import { deserializeFlow } from "@/lib/whatsapp/flow/serialize";
import { NODE_META, genId, getSourceHandles } from "@/lib/whatsapp/flow/nodeRegistry";
import type { ButtonsConfig, ConditionConfig } from "@/lib/whatsapp/flow/types";

type FNode = Node<FlowNodeData>;

export interface FlowState {
  flowId: string | null;
  flowName: string;
  nodes: FNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  isDirty: boolean;

  // lifecycle
  loadDefinition: (flowId: string, name: string, def: FlowDefinition) => void;
  markSaved: () => void;
  markDirty: () => void;
  setFlowName: (name: string) => void;

  // canvas (controlled React Flow)
  onNodesChange: (changes: NodeChange<FNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
  setGraph: (nodes: FNode[], edges: Edge[]) => void;

  // node ops
  addNode: (type: FlowNodeType, position: { x: number; y: number }) => string;
  updateNodeConfig: (id: string, config: AnyNodeConfig) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  setSelected: (id: string | null) => void;
  setNodeErrors: (idsWithError: Set<string>) => void;
}

function labelForHandle(nodes: FNode[], source: string, handleId: string | null | undefined): string | undefined {
  if (!handleId || handleId === "out") return undefined;
  const node = nodes.find((n) => n.id === source);
  if (!node) return undefined;
  return getSourceHandles(node.data).find((h) => h.id === handleId)?.label;
}

export const useFlowStore = create<FlowState>()(
  temporal(
    (set) => ({
      flowId: null,
      flowName: "Untitled flow",
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isDirty: false,

      loadDefinition: (flowId, name, def) => {
        const { nodes, edges } = deserializeFlow(def);
        set({ flowId, flowName: name, nodes, edges, selectedNodeId: null, isDirty: false });
      },

      markSaved: () => set({ isDirty: false }),
      // undo/redo bypass our actions (zundo sets nodes/edges directly), so the
      // toolbar calls this after an undo/redo to keep the dirty flag accurate.
      markDirty: () => set({ isDirty: true }),
      setFlowName: (name) => set({ flowName: name, isDirty: true }),

      onNodesChange: (changes) =>
        set((s) => ({ nodes: applyNodeChanges(changes, s.nodes), isDirty: dirtyFromNodeChanges(changes, s.isDirty) })),

      onEdgesChange: (changes) =>
        set((s) => ({ edges: applyEdgeChanges(changes, s.edges), isDirty: true })),

      onConnect: (conn) => {
        const { source, target, sourceHandle, targetHandle } = conn;
        if (!source || !target || source === target) return;
        const handleKey = sourceHandle ?? "out";
        set((s) => {
          // one outgoing edge per source handle
          const kept = s.edges.filter((e) => !(e.source === source && (e.sourceHandle ?? "out") === handleKey));
          const edge: Edge = {
            id: genId("e"),
            source,
            target,
            sourceHandle: sourceHandle ?? undefined,
            targetHandle: targetHandle ?? undefined,
            label: labelForHandle(s.nodes, source, sourceHandle),
          };
          return { edges: addEdge(edge, kept), isDirty: true };
        });
      },

      setGraph: (nodes, edges) => set({ nodes, edges, isDirty: true }),

      addNode: (type, position) => {
        const id = genId(type);
        const node: FNode = {
          id,
          type,
          position,
          data: { type, config: NODE_META[type].defaultConfig() },
        };
        set((s) => ({ nodes: [...s.nodes, node], selectedNodeId: id, isDirty: true }));
        return id;
      },

      updateNodeConfig: (id, config) =>
        set((s) => {
          const nodes = s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, config } } : n));
          const node = nodes.find((n) => n.id === id);
          let edges = s.edges;
          if (node && (node.data.type === "buttons" || node.data.type === "condition")) {
            const valid = new Set(getSourceHandles(node.data).map((h) => h.id));
            edges = edges
              .filter((e) => e.source !== id || (e.sourceHandle ? valid.has(e.sourceHandle) : false))
              .map((e) =>
                e.source === id && e.sourceHandle
                  ? { ...e, label: labelForHandle(nodes, id, e.sourceHandle) }
                  : e,
              );
          }
          return { nodes, edges, isDirty: true };
        }),

      deleteNode: (id) =>
        set((s) => {
          const node = s.nodes.find((n) => n.id === id);
          if (!node || node.data.type === "start") return {}; // trigger is required
          return {
            nodes: s.nodes.filter((n) => n.id !== id),
            edges: s.edges.filter((e) => e.source !== id && e.target !== id),
            selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
            isDirty: true,
          };
        }),

      duplicateNode: (id) =>
        set((s) => {
          const src = s.nodes.find((n) => n.id === id);
          if (!src || src.data.type === "start") return {};
          const newId = genId(src.data.type);
          const config = structuredCloneSafe(src.data.config);
          // fresh handle ids for multi-output configs so edges never collide
          if (src.data.type === "buttons") {
            const c = config as ButtonsConfig;
            c.buttons = c.buttons.map((b) => ({ ...b, id: genId("btn") }));
          } else if (src.data.type === "condition") {
            const c = config as ConditionConfig;
            c.rules = c.rules.map((r) => ({ ...r, id: genId("rule") }));
          }
          const clone: FNode = {
            id: newId,
            type: src.type,
            position: { x: src.position.x + 48, y: src.position.y + 48 },
            data: { type: src.data.type, config },
          };
          return { nodes: [...s.nodes, clone], selectedNodeId: newId, isDirty: true };
        }),

      setSelected: (id) => set({ selectedNodeId: id }),

      setNodeErrors: (ids) =>
        set((s) => {
          let changed = false;
          const nodes = s.nodes.map((n) => {
            const hasError = ids.has(n.id);
            if (hasError === !!n.data.hasError) return n;
            changed = true;
            return { ...n, data: { ...n.data, hasError } };
          });
          // Return an empty patch when nothing changed so we don't churn the
          // `nodes` reference (which would re-trigger validation → infinite loop).
          return changed ? { nodes } : {};
        }),
    }),
    {
      limit: 100,
      // Only track the graph in history; selection / name / dirty are transient.
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      // Coalesce rapid bursts (a drag = one history entry, not 200).
      handleSet: (handleSet) => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        return ((pastState) => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => handleSet(pastState), 250);
        }) as typeof handleSet;
      },
    },
  ),
);

function dirtyFromNodeChanges(changes: NodeChange<FNode>[], wasDirty: boolean): boolean {
  // Pure selection/dimension changes shouldn't flag unsaved work.
  const meaningful = changes.some(
    (c) => c.type === "position" || c.type === "remove" || c.type === "add" || c.type === "replace",
  );
  return wasDirty || meaningful;
}

function structuredCloneSafe<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/* ----------------------------- undo / redo (zundo) ----------------------------- */

interface TemporalSnapshot {
  pastStates: unknown[];
  futureStates: unknown[];
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

export function useFlowHistory<T>(selector: (s: TemporalSnapshot) => T): T {
  // useFlowStore.temporal is a vanilla zustand store of the history.
  return useZustandStore(useFlowStore.temporal as never, selector as never) as T;
}
