// Pure, framework-light pre-publish validation. Returns structured issues the UI
// surfaces (error count gates publish; warnings are advisory). Unit-testable.

import type { Edge, Node } from "@xyflow/react";
import type { FlowNodeData, FlowValidationIssue } from "./types";
import { NODE_CONFIG_SCHEMA } from "./schema";
import { NODE_META, getSourceHandles } from "./nodeRegistry";

type FNode = Node<FlowNodeData>;

export function validateFlow(nodes: FNode[], edges: Edge[]): FlowValidationIssue[] {
  const issues: FlowValidationIssue[] = [];
  const label = (n: FNode) => NODE_META[n.data.type].label;

  // 1. Exactly one trigger.
  const starts = nodes.filter((n) => n.data.type === "start");
  if (starts.length === 0) {
    issues.push({ message: "Flow needs a Trigger to start.", severity: "error" });
  } else if (starts.length > 1) {
    issues.push({ message: "A flow can have only one Trigger.", severity: "error" });
  }

  // 2. Per-node config (via the same zod schemas the forms use).
  for (const n of nodes) {
    const res = NODE_CONFIG_SCHEMA[n.data.type].safeParse(n.data.config);
    if (!res.success) {
      const first = res.error.issues[0]?.message ?? "Invalid configuration";
      issues.push({ nodeId: n.id, message: `${label(n)}: ${first}`, severity: "error" });
    }
  }

  // 3. Reachability from the trigger.
  if (starts.length === 1) {
    const adj = new Map<string, string[]>();
    for (const e of edges) adj.set(e.source, [...(adj.get(e.source) ?? []), e.target]);
    const seen = new Set<string>();
    const stack = [starts[0]!.id];
    while (stack.length) {
      const id = stack.pop()!;
      if (seen.has(id)) continue;
      seen.add(id);
      for (const t of adj.get(id) ?? []) stack.push(t);
    }
    for (const n of nodes) {
      if (n.data.type !== "start" && !seen.has(n.id)) {
        issues.push({ nodeId: n.id, message: `${label(n)} is not connected to the flow.`, severity: "warning" });
      }
    }
  }

  // 4. Dangling outputs + unconnected branches.
  const outBySource = new Map<string, Set<string>>();
  for (const e of edges) {
    const set = outBySource.get(e.source) ?? new Set<string>();
    set.add(e.sourceHandle ?? "out");
    outBySource.set(e.source, set);
  }
  for (const n of nodes) {
    if (n.data.type === "end") continue;
    const handles = getSourceHandles(n.data);
    const connected = outBySource.get(n.id) ?? new Set<string>();
    if (handles.length <= 1) {
      if (connected.size === 0) {
        issues.push({ nodeId: n.id, message: `${label(n)} has no next step.`, severity: "warning" });
      }
    } else {
      for (const h of handles) {
        if (!connected.has(h.id)) {
          issues.push({ nodeId: n.id, message: `Branch "${h.label ?? h.id}" is not connected.`, severity: "warning" });
        }
      }
    }
  }

  // 5. Loop-without-a-wait guard (approximate; backend enforces precisely).
  if (hasCycle(nodes, edges)) {
    const hasWait = nodes.some((n) => n.data.type === "delay" || n.data.type === "ask");
    if (!hasWait) {
      issues.push({
        message: "Flow has a loop with no Delay or Ask step — this can run forever.",
        severity: "error",
      });
    }
  }

  return issues;
}

export function errorCount(issues: FlowValidationIssue[]): number {
  return issues.filter((i) => i.severity === "error").length;
}

function hasCycle(nodes: FNode[], edges: Edge[]): boolean {
  const adj = new Map<string, string[]>();
  for (const e of edges) adj.set(e.source, [...(adj.get(e.source) ?? []), e.target]);
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>(nodes.map((n) => [n.id, WHITE]));

  const dfs = (id: string): boolean => {
    color.set(id, GRAY);
    for (const next of adj.get(id) ?? []) {
      const c = color.get(next) ?? WHITE;
      if (c === GRAY) return true;
      if (c === WHITE && dfs(next)) return true;
    }
    color.set(id, BLACK);
    return false;
  };

  for (const n of nodes) {
    if ((color.get(n.id) ?? WHITE) === WHITE && dfs(n.id)) return true;
  }
  return false;
}
