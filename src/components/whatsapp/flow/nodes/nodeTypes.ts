// Module-level (stable) nodeTypes map — defining this inline in render would remount
// all nodes every frame. Every flow node type renders through the single FlowNode.

import type { NodeTypes } from "@xyflow/react";
import { FlowNode } from "./FlowNode";

export const nodeTypes: NodeTypes = {
  start: FlowNode,
  text: FlowNode,
  template: FlowNode,
  buttons: FlowNode,
  ask: FlowNode,
  condition: FlowNode,
  delay: FlowNode,
  end: FlowNode,
};
