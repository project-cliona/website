// Domain types for the WhatsApp Flow Builder (v1 — visual conversation automation).
// The editor (React Flow) shape is mapped to/from the wire `FlowDefinition` via serialize.ts.
// Kept framework-agnostic so it can be unit-tested and shared with backend validation later.

export type FlowNodeType =
  | "start" // keyword trigger / entry point
  | "text"
  | "template"
  | "buttons"
  | "ask"
  | "condition"
  | "delay"
  | "end";

export type FlowStatus = "draft" | "published" | "paused" | "archived";

/* ---------------------------------- node configs ---------------------------------- */

export type KeywordMatchMode = "exact" | "contains" | "regex";
export type ConditionOperator = "equals" | "notEquals" | "contains" | "gt" | "lt" | "exists";
export type DelayUnit = "seconds" | "minutes" | "hours" | "days";
export type AskExpectedType = "text" | "number" | "email";

export interface FlowButton {
  /** Stable id — also the source-handle id and the inbound button_reply.id at runtime. */
  id: string;
  title: string;
}

export interface ConditionRule {
  /** Stable id — also the source-handle id for this branch. */
  id: string;
  variable: string;
  operator: ConditionOperator;
  value: string;
}

export interface StartConfig {
  keywords: string[];
  matchMode: KeywordMatchMode;
}
export interface TextConfig {
  body: string;
  previewUrl?: boolean;
}
export interface TemplateConfig {
  templateName: string;
  language: string;
}
export interface ButtonsConfig {
  body: string;
  header?: string;
  footer?: string;
  buttons: FlowButton[]; // 1..3 (Meta hard cap)
}
export interface AskConfig {
  prompt: string;
  saveToVariable: string;
  expectedType: AskExpectedType;
  validationRegex?: string;
  retryMessage?: string;
  maxRetries: number;
  timeoutSeconds?: number;
}
export interface ConditionConfig {
  rules: ConditionRule[];
}
export interface DelayConfig {
  duration: number;
  unit: DelayUnit;
}
export interface EndConfig {
  reason?: string;
}

export interface NodeConfigMap {
  start: StartConfig;
  text: TextConfig;
  template: TemplateConfig;
  buttons: ButtonsConfig;
  ask: AskConfig;
  condition: ConditionConfig;
  delay: DelayConfig;
  end: EndConfig;
}

export type AnyNodeConfig = NodeConfigMap[FlowNodeType];

/**
 * Stored in each React Flow node's `data`. Treat as immutable (always replace,
 * never mutate). Declared as a `type` (not `interface`) so it satisfies React
 * Flow's `Record<string, unknown>` data constraint.
 */
export type FlowNodeData = {
  type: FlowNodeType;
  config: AnyNodeConfig;
  /** Set by validation to render an error ring on the node. */
  hasError?: boolean;
};

/* ------------------------------- wire definition --------------------------------- */

export const FLOW_DEFINITION_VERSION = 1;

export interface FlowDefinitionNode {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  config: AnyNodeConfig;
}

export interface FlowDefinitionEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
}

export interface FlowDefinition {
  version: number;
  entryNodeId: string | null;
  nodes: FlowDefinitionNode[];
  edges: FlowDefinitionEdge[];
}

/* ------------------------------- list / summary ---------------------------------- */

export interface FlowSummary {
  id: string;
  name: string;
  description?: string;
  status: FlowStatus;
  nodeCount: number;
  updatedAt: string; // ISO
}

export interface FlowRecord extends FlowSummary {
  definition: FlowDefinition;
}

/* -------------------------------- validation ------------------------------------- */

export interface FlowValidationIssue {
  nodeId?: string;
  message: string;
  severity: "error" | "warning";
}
