// Node category → visual tokens. Shared by node cards, the minimap, and the palette
// so a category always reads the same color across the builder. Uses the app's
// design-token classes (see globals.css) rather than ad-hoc colors.

import type { FlowNodeType } from "./types";

export type NodeCategory = "trigger" | "message" | "interactive" | "logic" | "terminal";

export interface CategoryStyle {
  label: string;
  /** header strip background + text */
  headerBg: string;
  headerText: string;
  /** selection / accent ring color (used by minimap too, as a hex) */
  accentHex: string;
  /** soft chip background for the palette icon */
  chipBg: string;
  chipText: string;
}

export const CATEGORY_STYLE: Record<NodeCategory, CategoryStyle> = {
  trigger: {
    label: "Trigger",
    headerBg: "bg-primary-50",
    headerText: "text-primary-700",
    accentHex: "#4F46E5", // primary-600
    chipBg: "bg-primary-50",
    chipText: "text-primary-700",
  },
  message: {
    label: "Message",
    headerBg: "bg-emerald-50",
    headerText: "text-emerald-700",
    accentHex: "#25D366", // channel-whatsapp
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
  },
  interactive: {
    label: "Interactive",
    headerBg: "bg-blue-50",
    headerText: "text-blue-700",
    accentHex: "#2563EB", // info
    chipBg: "bg-blue-50",
    chipText: "text-blue-700",
  },
  logic: {
    label: "Logic",
    headerBg: "bg-amber-50",
    headerText: "text-amber-700",
    accentHex: "#D97706", // warning
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
  },
  terminal: {
    label: "End",
    headerBg: "bg-slate-100",
    headerText: "text-slate-600",
    accentHex: "#64748B", // muted-foreground
    chipBg: "bg-slate-100",
    chipText: "text-slate-600",
  },
};

export const NODE_CATEGORY: Record<FlowNodeType, NodeCategory> = {
  start: "trigger",
  text: "message",
  template: "message",
  buttons: "interactive",
  ask: "interactive",
  condition: "logic",
  delay: "logic",
  end: "terminal",
};

export function categoryStyleForNode(type: FlowNodeType): CategoryStyle {
  return CATEGORY_STYLE[NODE_CATEGORY[type]];
}
