// The React Flow canvas, rendered controlled from the Zustand store.
// Handles palette drag-drop and click-to-select.

"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodes/nodeTypes";
import { useFlowStore } from "./store/flowStore";
import { FLOW_NODE_DND_TYPE } from "./NodePalette";
import { categoryStyleForNode } from "@/lib/whatsapp/flow/categories";
import type { FlowNodeData, FlowNodeType } from "@/lib/whatsapp/flow/types";

export function FlowCanvas() {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const setSelected = useFlowStore((s) => s.setSelected);
  const addNode = useFlowStore((s) => s.addNode);
  const { screenToFlowPosition } = useReactFlow();

  return (
    <div
      className="h-full w-full"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData(FLOW_NODE_DND_TYPE) as FlowNodeType;
        if (!type) return;
        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        addNode(type, position);
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, n) => setSelected(n.id)}
        onPaneClick={() => setSelected(null)}
        defaultEdgeOptions={{ type: "smoothstep" }}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        onlyRenderVisibleElements
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n: Node) => categoryStyleForNode((n.data as FlowNodeData).type).accentHex}
          nodeStrokeWidth={2}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
