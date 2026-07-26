// Top-level editor composition. Must be rendered inside a <ReactFlowProvider/>.
// Owns the validation pass, save/publish/auto-layout actions, and which side
// panel is shown (config drawer vs simulator).

"use client";

import * as React from "react";
import { useReactFlow } from "@xyflow/react";
import { NodePalette } from "./NodePalette";
import { FlowCanvas } from "./FlowCanvas";
import { NodeConfigDrawer } from "./NodeConfigDrawer";
import { FlowToolbar } from "./FlowToolbar";
import { FlowSimulator } from "./FlowSimulator";
import { useFlowStore } from "./store/flowStore";
import { validateFlow, errorCount } from "@/lib/whatsapp/flow/validate";
import { serializeFlow } from "@/lib/whatsapp/flow/serialize";
import { layoutFlow } from "@/lib/whatsapp/flow/layout";
import { saveFlowDraft, publishFlow } from "@/lib/api/whatsapp/flows";
import { notify } from "@/lib/toast";
import type { FlowNodeType } from "@/lib/whatsapp/flow/types";

export function FlowBuilder() {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const selectedId = useFlowStore((s) => s.selectedNodeId);
  const setGraph = useFlowStore((s) => s.setGraph);
  const setNodeErrors = useFlowStore((s) => s.setNodeErrors);
  const markSaved = useFlowStore((s) => s.markSaved);
  const addNode = useFlowStore((s) => s.addNode);
  const rf = useReactFlow();

  const [simOpen, setSimOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);

  const issues = React.useMemo(() => validateFlow(nodes, edges), [nodes, edges]);

  // Reflect blocking issues onto the offending nodes (error ring).
  React.useEffect(() => {
    const ids = new Set(issues.filter((i) => i.severity === "error" && i.nodeId).map((i) => i.nodeId!));
    setNodeErrors(ids);
  }, [issues, setNodeErrors]);

  const addAtCenter = React.useCallback(
    (type: FlowNodeType) => {
      const position = rf.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      addNode(type, position);
    },
    [rf, addNode],
  );

  const handleAutoLayout = React.useCallback(async () => {
    const laid = await layoutFlow(nodes, edges);
    setGraph(laid, edges);
    requestAnimationFrame(() => rf.fitView({ padding: 0.2, duration: 300 }));
  }, [nodes, edges, setGraph, rf]);

  const handleSave = React.useCallback(async () => {
    const { flowId, flowName } = useFlowStore.getState();
    setSaving(true);
    try {
      await saveFlowDraft(flowId, flowName, serializeFlow(nodes, edges));
      markSaved();
      notify.success("Draft saved");
    } catch (e) {
      notify.error(e, "Could not save draft");
    } finally {
      setSaving(false);
    }
  }, [nodes, edges, markSaved]);

  const handlePublish = React.useCallback(async () => {
    if (errorCount(issues) > 0) {
      notify.warning("Fix the validation issues before publishing");
      return;
    }
    const { flowId, flowName } = useFlowStore.getState();
    setPublishing(true);
    try {
      await publishFlow(flowId, flowName, serializeFlow(nodes, edges));
      markSaved();
      notify.success("Flow published");
    } catch (e) {
      notify.error(e, "Could not publish flow");
    } finally {
      setPublishing(false);
    }
  }, [issues, nodes, edges, markSaved]);

  return (
    <div className="flex h-full flex-col bg-background">
      <FlowToolbar
        issues={issues}
        saving={saving}
        publishing={publishing}
        simulatorOpen={simOpen}
        onSave={handleSave}
        onPublish={handlePublish}
        onAutoLayout={handleAutoLayout}
        onToggleSimulator={() => setSimOpen((v) => !v)}
      />
      <div className="flex min-h-0 flex-1">
        <NodePalette onAdd={addAtCenter} />
        <div className="relative min-w-0 flex-1">
          <FlowCanvas />
        </div>
        {simOpen ? <FlowSimulator onClose={() => setSimOpen(false)} /> : selectedId ? <NodeConfigDrawer /> : null}
      </div>
    </div>
  );
}
