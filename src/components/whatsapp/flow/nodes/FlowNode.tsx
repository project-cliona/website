// One registry-driven node renderer used for every node type. The summary shown
// in the card body switches on data.type; branch handles are rendered by BaseNode.

"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import type {
  AskConfig,
  ButtonsConfig,
  ConditionConfig,
  DelayConfig,
  EndConfig,
  FlowNodeData,
  StartConfig,
  TemplateConfig,
  TextConfig,
} from "@/lib/whatsapp/flow/types";

function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground italic">{children}</span>;
}

function Summary({ data }: { data: FlowNodeData }) {
  switch (data.type) {
    case "start": {
      const c = data.config as StartConfig;
      return c.keywords.length ? (
        <div className="flex flex-wrap gap-1">
          {c.keywords.slice(0, 4).map((k) => (
            <span key={k} className="rounded bg-primary-50 px-1.5 py-0.5 text-xs text-primary-700">
              {k}
            </span>
          ))}
          {c.keywords.length > 4 && <span className="text-xs text-muted-foreground">+{c.keywords.length - 4}</span>}
        </div>
      ) : (
        <Placeholder>Add a keyword to start the flow</Placeholder>
      );
    }
    case "text": {
      const c = data.config as TextConfig;
      return c.body ? <p className="line-clamp-3 whitespace-pre-wrap">{c.body}</p> : <Placeholder>No message yet</Placeholder>;
    }
    case "template": {
      const c = data.config as TemplateConfig;
      return c.templateName ? (
        <p className="truncate">
          {c.templateName} <span className="text-muted-foreground">· {c.language}</span>
        </p>
      ) : (
        <Placeholder>No template selected</Placeholder>
      );
    }
    case "buttons": {
      const c = data.config as ButtonsConfig;
      return c.body ? <p className="line-clamp-2 whitespace-pre-wrap">{c.body}</p> : <Placeholder>No message yet</Placeholder>;
    }
    case "ask": {
      const c = data.config as AskConfig;
      return (
        <div className="space-y-1">
          {c.prompt ? <p className="line-clamp-2 whitespace-pre-wrap">{c.prompt}</p> : <Placeholder>No prompt yet</Placeholder>}
          {c.saveToVariable && <p className="text-xs text-muted-foreground">→ {`{{${c.saveToVariable}}}`}</p>}
        </div>
      );
    }
    case "condition": {
      const c = data.config as ConditionConfig;
      return <span className="text-muted-foreground">{c.rules.length} rule{c.rules.length === 1 ? "" : "s"} + else</span>;
    }
    case "delay": {
      const c = data.config as DelayConfig;
      return (
        <span>
          Wait <span className="font-semibold tabular-nums">{c.duration}</span> {c.unit}
        </span>
      );
    }
    case "end": {
      const c = data.config as EndConfig;
      return c.reason ? <p className="truncate">{c.reason}</p> : <Placeholder>End of flow</Placeholder>;
    }
    default:
      return null;
  }
}

export const FlowNode = memo(function FlowNode({ data, selected }: NodeProps) {
  const d = data as FlowNodeData;
  return (
    <BaseNode data={d} selected={selected}>
      <Summary data={d} />
    </BaseNode>
  );
});
