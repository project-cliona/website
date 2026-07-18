// Single source of truth for node metadata: palette entries, default config when a
// node is created, and the source-handle layout (which drives branch edges).

import {
  Play,
  MessageSquare,
  FileText,
  MousePointerClick,
  HelpCircle,
  GitBranch,
  Clock,
  Flag,
  type LucideIcon,
} from "lucide-react";

import type { AnyNodeConfig, ButtonsConfig, ConditionConfig, FlowNodeData, FlowNodeType } from "./types";
import { NODE_CATEGORY, type NodeCategory } from "./categories";

export function genId(prefix = "n"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${rand}`;
}

export interface NodeMeta {
  type: FlowNodeType;
  label: string;
  description: string;
  icon: LucideIcon;
  category: NodeCategory;
  /** Shown in the palette (Start is seeded once and not re-addable). */
  addable: boolean;
  defaultConfig: () => AnyNodeConfig;
}

export const NODE_META: Record<FlowNodeType, NodeMeta> = {
  start: {
    type: "start",
    label: "Trigger",
    description: "Starts the flow when a keyword matches",
    icon: Play,
    category: NODE_CATEGORY.start,
    addable: false,
    defaultConfig: () => ({ keywords: [], matchMode: "exact" }),
  },
  text: {
    type: "text",
    label: "Send text",
    description: "Send a free-form text message",
    icon: MessageSquare,
    category: NODE_CATEGORY.text,
    addable: true,
    defaultConfig: () => ({ body: "" }),
  },
  template: {
    type: "template",
    label: "Send template",
    description: "Send an approved template (works outside 24h window)",
    icon: FileText,
    category: NODE_CATEGORY.template,
    addable: true,
    defaultConfig: () => ({ templateName: "", language: "en_US" }),
  },
  buttons: {
    type: "buttons",
    label: "Buttons",
    description: "Reply buttons (up to 3) that branch the flow",
    icon: MousePointerClick,
    category: NODE_CATEGORY.buttons,
    addable: true,
    defaultConfig: (): ButtonsConfig => ({
      body: "",
      buttons: [{ id: genId("btn"), title: "Button 1" }],
    }),
  },
  ask: {
    type: "ask",
    label: "Ask a question",
    description: "Prompt the user and capture their reply into a variable",
    icon: HelpCircle,
    category: NODE_CATEGORY.ask,
    addable: true,
    defaultConfig: () => ({
      prompt: "",
      saveToVariable: "",
      expectedType: "text",
      maxRetries: 1,
    }),
  },
  condition: {
    type: "condition",
    label: "Condition",
    description: "Branch on a variable or contact attribute",
    icon: GitBranch,
    category: NODE_CATEGORY.condition,
    addable: true,
    defaultConfig: (): ConditionConfig => ({
      rules: [{ id: genId("rule"), variable: "", operator: "equals", value: "" }],
    }),
  },
  delay: {
    type: "delay",
    label: "Delay",
    description: "Wait before continuing",
    icon: Clock,
    category: NODE_CATEGORY.delay,
    addable: true,
    defaultConfig: () => ({ duration: 1, unit: "hours" }),
  },
  end: {
    type: "end",
    label: "End",
    description: "Terminate the flow",
    icon: Flag,
    category: NODE_CATEGORY.end,
    addable: true,
    defaultConfig: () => ({}),
  },
};

export const PALETTE_NODES: NodeMeta[] = Object.values(NODE_META).filter((m) => m.addable);

export interface SourceHandleDef {
  id: string;
  label?: string;
}

/** Output handles for a node, derived from its config. Multi-output for buttons/condition. */
export function getSourceHandles(data: FlowNodeData): SourceHandleDef[] {
  switch (data.type) {
    case "end":
      return [];
    case "buttons": {
      const cfg = data.config as ButtonsConfig;
      const handles = cfg.buttons.map((b) => ({ id: b.id, label: b.title || "Button" }));
      return handles.length ? handles : [{ id: "out" }];
    }
    case "condition": {
      const cfg = data.config as ConditionConfig;
      return [
        ...cfg.rules.map((r, i) => ({ id: r.id, label: ruleLabel(r, i) })),
        { id: "else", label: "Else" },
      ];
    }
    default:
      return [{ id: "out" }];
  }
}

function ruleLabel(r: ConditionConfig["rules"][number], i: number): string {
  if (!r.variable) return `Rule ${i + 1}`;
  const op = OPERATOR_LABEL[r.operator] ?? r.operator;
  return r.operator === "exists" ? `${r.variable} exists` : `${r.variable} ${op} ${r.value || "…"}`;
}

export const OPERATOR_LABEL: Record<string, string> = {
  equals: "=",
  notEquals: "≠",
  contains: "contains",
  gt: ">",
  lt: "<",
  exists: "exists",
};
