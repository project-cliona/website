// Lightweight client-side simulator: walks the graph as a WhatsApp-style thread so
// the builder can test logic without sending real messages. (v2 can swap the bubble
// UI for the shared WhatsappPreview/PhoneFrame components.)

"use client";

import * as React from "react";
import { RotateCcw, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFlowStore } from "./store/flowStore";
import { OPERATOR_LABEL } from "@/lib/whatsapp/flow/nodeRegistry";
import type {
  AskConfig,
  ButtonsConfig,
  ConditionConfig,
  DelayConfig,
  FlowNodeData,
  StartConfig,
  TemplateConfig,
  TextConfig,
} from "@/lib/whatsapp/flow/types";
import type { Edge, Node } from "@xyflow/react";

type FNode = Node<FlowNodeData>;
type Bubble = { id: number; role: "bot" | "user" | "note"; text: string };
type Option = { handle: string; label: string };
type Awaiting =
  | { type: "buttons"; nodeId: string; options: Option[] }
  | { type: "ask"; nodeId: string }
  | { type: "condition"; nodeId: string; options: Option[] }
  | { type: "delay"; nodeId: string }
  | { type: "end" }
  | { type: "dead" }
  | null;

const MAX_STEPS = 100;

export function FlowSimulator({ onClose }: { onClose: () => void }) {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);

  const [messages, setMessages] = React.useState<Bubble[]>([]);
  const [awaiting, setAwaiting] = React.useState<Awaiting>(null);
  const [answer, setAnswer] = React.useState("");
  const counter = React.useRef(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const byId = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const nextTarget = React.useCallback(
    (nodeId: string, handle = "out"): string | null =>
      edges.find((e: Edge) => e.source === nodeId && (e.sourceHandle ?? "out") === handle)?.target ?? null,
    [edges],
  );

  const runFrom = React.useCallback(
    (startId: string | null) => {
      const added: Bubble[] = [];
      const bot = (text: string) => added.push({ id: counter.current++, role: "bot", text });
      const note = (text: string) => added.push({ id: counter.current++, role: "note", text });

      let cur = startId;
      let result: Awaiting = { type: "dead" };
      let guard = 0;

      while (cur && guard++ < MAX_STEPS) {
        const node = byId.get(cur) as FNode | undefined;
        if (!node) break;
        const data = node.data;
        switch (data.type) {
          case "start":
            cur = nextTarget(cur, "out");
            continue;
          case "text": {
            bot((data.config as TextConfig).body || "(empty message)");
            cur = nextTarget(cur, "out");
            continue;
          }
          case "template": {
            bot(`📋 Template · ${(data.config as TemplateConfig).templateName || "(none)"}`);
            cur = nextTarget(cur, "out");
            continue;
          }
          case "buttons": {
            const c = data.config as ButtonsConfig;
            bot(c.body || "(empty message)");
            result = { type: "buttons", nodeId: cur, options: c.buttons.map((b) => ({ handle: b.id, label: b.title })) };
            cur = null;
            break;
          }
          case "ask": {
            bot((data.config as AskConfig).prompt || "(empty prompt)");
            result = { type: "ask", nodeId: cur };
            cur = null;
            break;
          }
          case "condition": {
            const c = data.config as ConditionConfig;
            result = {
              type: "condition",
              nodeId: cur,
              options: [
                ...c.rules.map((r, i) => ({
                  handle: r.id,
                  label: r.variable ? `${r.variable} ${OPERATOR_LABEL[r.operator] ?? ""} ${r.value}`.trim() : `Rule ${i + 1}`,
                })),
                { handle: "else", label: "Else" },
              ],
            };
            cur = null;
            break;
          }
          case "delay": {
            const c = data.config as DelayConfig;
            note(`⏳ Waiting ${c.duration} ${c.unit}…`);
            result = { type: "delay", nodeId: cur };
            cur = null;
            break;
          }
          case "end":
            note("— Flow ended —");
            result = { type: "end" };
            cur = null;
            break;
        }
      }
      if (guard >= MAX_STEPS) note("Stopped: too many steps (possible loop).");
      else if (result.type === "dead") note("Flow stops here — no next step connected.");

      setMessages((prev) => [...prev, ...added]);
      setAwaiting(result);
    },
    [byId, nextTarget],
  );

  const reset = React.useCallback(() => {
    counter.current = 0;
    setMessages([]);
    setAnswer("");
    const start = nodes.find((n) => n.data.type === "start");
    if (!start) {
      setMessages([{ id: counter.current++, role: "note", text: "Add a Trigger node to simulate the flow." }]);
      setAwaiting(null);
      return;
    }
    const hasKeyword = (start.data.config as StartConfig).keywords[0];
    setMessages([{ id: counter.current++, role: "user", text: hasKeyword || "(trigger)" }]);
    runFrom(start.id);
  }, [nodes, runFrom]);

  // (Re)start when the simulator opens. Intentionally only on mount.
  React.useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pushUser = (text: string) => setMessages((prev) => [...prev, { id: counter.current++, role: "user", text }]);

  const onPick = (option: Option) => {
    if (!awaiting || (awaiting.type !== "buttons" && awaiting.type !== "condition")) return;
    if (awaiting.type === "buttons") pushUser(option.label);
    setAwaiting(null);
    runFrom(nextTarget(awaiting.nodeId, option.handle));
  };

  const onAnswer = () => {
    if (!awaiting || awaiting.type !== "ask" || !answer.trim()) return;
    pushUser(answer.trim());
    const target = nextTarget(awaiting.nodeId, "out");
    setAnswer("");
    setAwaiting(null);
    runFrom(target);
  };

  const onDelayContinue = () => {
    if (!awaiting || awaiting.type !== "delay") return;
    const target = nextTarget(awaiting.nodeId, "out");
    setAwaiting(null);
    runFrom(target);
  };

  return (
    <aside className="flex w-96 shrink-0 flex-col border-l border-border bg-muted/40">
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
        <h2 className="text-h3 flex-1">Simulator</h2>
        <button
          type="button"
          aria-label="Restart"
          onClick={reset}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Close simulator"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) =>
          m.role === "note" ? (
            <div key={m.id} className="mx-auto w-fit rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {m.text}
            </div>
          ) : (
            <div
              key={m.id}
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-small shadow-e1",
                m.role === "user"
                  ? "ml-auto rounded-br-sm bg-[#dcf8c6] text-slate-900"
                  : "mr-auto rounded-bl-sm bg-card text-foreground",
              )}
            >
              {m.text}
            </div>
          ),
        )}

        {awaiting?.type === "buttons" || awaiting?.type === "condition" ? (
          <div className="ml-auto flex max-w-[85%] flex-col items-end gap-1.5 pt-1">
            {awaiting.options.map((o) => (
              <button
                key={o.handle}
                type="button"
                onClick={() => onPick(o)}
                className="rounded-full border border-primary-200 bg-card px-3 py-1.5 text-small text-primary-700 hover:bg-primary-50 focus-ring"
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : null}

        {awaiting?.type === "delay" && (
          <button
            type="button"
            onClick={onDelayContinue}
            className="mx-auto block rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:bg-accent focus-ring"
          >
            Skip delay →
          </button>
        )}
      </div>

      {awaiting?.type === "ask" && (
        <div className="flex items-center gap-2 border-t border-border bg-card p-3">
          <Input
            value={answer}
            placeholder="Type a reply…"
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAnswer()}
          />
          <Button size="icon" onClick={onAnswer} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}
