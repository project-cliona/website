// Right side-drawer: per-node-type config form, bound directly to the store
// (one node updates → only that node re-renders). Closes by deselecting.

"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { X, Plus, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/providers/userProvider";
import { fetchApprovedWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useFlowStore } from "./store/flowStore";
import { NODE_META, genId } from "@/lib/whatsapp/flow/nodeRegistry";
import type {
  AnyNodeConfig,
  AskConfig,
  ButtonsConfig,
  ConditionConfig,
  ConditionOperator,
  DelayConfig,
  DelayUnit,
  EndConfig,
  KeywordMatchMode,
  StartConfig,
  TemplateConfig,
  TextConfig,
} from "@/lib/whatsapp/flow/types";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NodeConfigDrawer() {
  const selectedId = useFlowStore((s) => s.selectedNodeId);
  const node = useFlowStore((s) => s.nodes.find((n) => n.id === selectedId) ?? null);
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);
  const setSelected = useFlowStore((s) => s.setSelected);

  if (!node) return null;
  const meta = NODE_META[node.data.type];
  const Icon = meta.icon;
  const isStart = node.data.type === "start";
  const set = (config: typeof node.data.config) => updateNodeConfig(node.id, config);

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-h3 flex-1 truncate">{meta.label}</h2>
        <button
          type="button"
          aria-label="Close"
          onClick={() => setSelected(null)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <NodeForm type={node.data.type} config={node.data.config} set={set} />
      </div>

      {!isStart && (
        <div className="flex items-center gap-2 border-t border-border p-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => duplicateNode(node.id)}>
            <Copy className="h-4 w-4" /> Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => deleteNode(node.id)}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      )}
    </aside>
  );
}

function NodeForm({
  type,
  config,
  set,
}: {
  type: string;
  config: AnyNodeConfig;
  set: (c: AnyNodeConfig) => void;
}) {
  switch (type) {
    case "start":
      return <StartForm config={config as StartConfig} set={set as (c: StartConfig) => void} />;
    case "text":
      return <TextForm config={config as TextConfig} set={set as (c: TextConfig) => void} />;
    case "template":
      return <TemplateForm config={config as TemplateConfig} set={set as (c: TemplateConfig) => void} />;
    case "buttons":
      return <ButtonsForm config={config as ButtonsConfig} set={set as (c: ButtonsConfig) => void} />;
    case "ask":
      return <AskForm config={config as AskConfig} set={set as (c: AskConfig) => void} />;
    case "condition":
      return <ConditionForm config={config as ConditionConfig} set={set as (c: ConditionConfig) => void} />;
    case "delay":
      return <DelayForm config={config as DelayConfig} set={set as (c: DelayConfig) => void} />;
    case "end":
      return <EndForm config={config as EndConfig} set={set as (c: EndConfig) => void} />;
    default:
      return null;
  }
}

/* --------------------------------- forms --------------------------------- */

function StartForm({ config, set }: { config: StartConfig; set: (c: StartConfig) => void }) {
  return (
    <>
      <Field label="Keywords" hint="Comma-separated. The flow starts when an inbound message matches.">
        <Input
          value={config.keywords.join(", ")}
          placeholder="hi, hello, start"
          onChange={(e) =>
            set({
              ...config,
              keywords: e.target.value
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <Field label="Match mode">
        <Select value={config.matchMode} onValueChange={(v) => set({ ...config, matchMode: v as KeywordMatchMode })}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exact">Exact match</SelectItem>
            <SelectItem value="contains">Contains keyword</SelectItem>
            <SelectItem value="regex">Regex</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </>
  );
}

function TextForm({ config, set }: { config: TextConfig; set: (c: TextConfig) => void }) {
  return (
    <>
      <Field label="Message" hint="Use {{contact.name}} or {{variable}} for personalization.">
        <Textarea
          rows={5}
          value={config.body}
          placeholder="Type your message…"
          onChange={(e) => set({ ...config, body: e.target.value })}
        />
      </Field>
      <div className="flex items-center justify-between">
        <Label>Show link preview</Label>
        <Switch enabled={!!config.previewUrl} onChange={(v) => set({ ...config, previewUrl: v })} />
      </div>
    </>
  );
}

const TEMPLATE_KEY_SEP = "::";
const templateKey = (name: string, language: string) => `${name}${TEMPLATE_KEY_SEP}${language}`;

function TemplateForm({ config, set }: { config: TemplateConfig; set: (c: TemplateConfig) => void }) {
  const { user } = useUser();
  const userId = user?.userId;

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["wa-approved-templates", userId],
    queryFn: () => fetchApprovedWhatsappTemplates(Number(userId)),
    enabled: !!userId,
  });

  const options = templates.map((t) => ({ key: templateKey(t.name, t.language), name: t.name, language: t.language }));
  const currentKey = config.templateName ? templateKey(config.templateName, config.language) : "";
  const currentMissing = !!config.templateName && !options.some((o) => o.key === currentKey);

  return (
    <Field
      label="Template"
      hint="Only Meta-approved templates can be sent. This is the only node that can message a contact outside the 24-hour window."
    >
      {isLoading ? (
        <div className="h-10 rounded-md border border-input bg-background animate-shimmer" />
      ) : options.length === 0 && !currentMissing ? (
        <div className="rounded-md border border-dashed border-border p-3 text-small text-muted-foreground">
          No approved templates yet.{" "}
          <Link href="/app/whatsapp/templates" className="text-primary hover:underline">
            Create &amp; submit one →
          </Link>
        </div>
      ) : (
        <>
          <Select
            value={currentKey || undefined}
            onValueChange={(v) => {
              const opt = options.find((o) => o.key === v);
              if (opt) set({ ...config, templateName: opt.name, language: opt.language });
            }}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select an approved template" />
            </SelectTrigger>
            <SelectContent>
              {currentMissing && (
                <SelectItem value={currentKey} disabled>
                  {config.templateName} · {config.language} (unavailable)
                </SelectItem>
              )}
              {options.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.name} · {o.language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentMissing && (
            <p className="mt-1.5 text-xs text-destructive">
              This template is no longer approved or was removed — pick another.
            </p>
          )}
        </>
      )}
    </Field>
  );
}

function ButtonsForm({ config, set }: { config: ButtonsConfig; set: (c: ButtonsConfig) => void }) {
  const addButton = () => {
    if (config.buttons.length >= 3) return;
    set({ ...config, buttons: [...config.buttons, { id: genId("btn"), title: `Button ${config.buttons.length + 1}` }] });
  };
  return (
    <>
      <Field label="Message">
        <Textarea
          rows={3}
          value={config.body}
          placeholder="What would you like to do?"
          onChange={(e) => set({ ...config, body: e.target.value })}
        />
      </Field>
      <Field label="Buttons" hint="Up to 3. Each button is a separate branch on the canvas.">
        <div className="space-y-2">
          {config.buttons.map((b) => (
            <div key={b.id} className="flex items-center gap-2">
              <Input
                value={b.title}
                maxLength={20}
                onChange={(e) =>
                  set({
                    ...config,
                    buttons: config.buttons.map((x) => (x.id === b.id ? { ...x, title: e.target.value } : x)),
                  })
                }
              />
              <button
                type="button"
                aria-label="Remove button"
                disabled={config.buttons.length <= 1}
                onClick={() => set({ ...config, buttons: config.buttons.filter((x) => x.id !== b.id) })}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {config.buttons.length < 3 && (
            <Button variant="outline" size="sm" onClick={addButton}>
              <Plus className="h-4 w-4" /> Add button
            </Button>
          )}
        </div>
      </Field>
    </>
  );
}

function AskForm({ config, set }: { config: AskConfig; set: (c: AskConfig) => void }) {
  return (
    <>
      <Field label="Question">
        <Textarea
          rows={3}
          value={config.prompt}
          placeholder="What's your order ID?"
          onChange={(e) => set({ ...config, prompt: e.target.value })}
        />
      </Field>
      <Field label="Save answer to variable" hint="Reference it later as {{variable}}.">
        <Input
          value={config.saveToVariable}
          placeholder="orderId"
          onChange={(e) => set({ ...config, saveToVariable: e.target.value })}
        />
      </Field>
      <Field label="Expected type">
        <Select value={config.expectedType} onValueChange={(v) => set({ ...config, expectedType: v as AskConfig["expectedType"] })}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Max retries">
        <Input
          type="number"
          min={0}
          max={5}
          value={config.maxRetries}
          onChange={(e) => set({ ...config, maxRetries: clampInt(e.target.value, 0, 5) })}
        />
      </Field>
    </>
  );
}

function ConditionForm({ config, set }: { config: ConditionConfig; set: (c: ConditionConfig) => void }) {
  const addRule = () =>
    set({ ...config, rules: [...config.rules, { id: genId("rule"), variable: "", operator: "equals", value: "" }] });
  return (
    <Field label="Rules" hint="Evaluated top-to-bottom; first match wins. An 'Else' branch is always added.">
      <div className="space-y-3">
        {config.rules.map((r) => (
          <div key={r.id} className="rounded-md border border-border p-2.5 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={r.variable}
                placeholder="variable"
                onChange={(e) =>
                  set({ ...config, rules: config.rules.map((x) => (x.id === r.id ? { ...x, variable: e.target.value } : x)) })
                }
              />
              <button
                type="button"
                aria-label="Remove rule"
                disabled={config.rules.length <= 1}
                onClick={() => set({ ...config, rules: config.rules.filter((x) => x.id !== r.id) })}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={r.operator}
                onValueChange={(v) =>
                  set({ ...config, rules: config.rules.map((x) => (x.id === r.id ? { ...x, operator: v as ConditionOperator } : x)) })
                }
              >
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">equals</SelectItem>
                  <SelectItem value="notEquals">not equals</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                  <SelectItem value="gt">greater than</SelectItem>
                  <SelectItem value="lt">less than</SelectItem>
                  <SelectItem value="exists">exists</SelectItem>
                </SelectContent>
              </Select>
              {r.operator !== "exists" && (
                <Input
                  value={r.value}
                  placeholder="value"
                  onChange={(e) =>
                    set({ ...config, rules: config.rules.map((x) => (x.id === r.id ? { ...x, value: e.target.value } : x)) })
                  }
                />
              )}
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addRule}>
          <Plus className="h-4 w-4" /> Add rule
        </Button>
      </div>
    </Field>
  );
}

function DelayForm({ config, set }: { config: DelayConfig; set: (c: DelayConfig) => void }) {
  return (
    <Field label="Wait for" hint="A long delay may push the next message past the 24-hour window.">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          value={config.duration}
          onChange={(e) => set({ ...config, duration: clampInt(e.target.value, 1, 100000) })}
          className="w-24"
        />
        <Select value={config.unit} onValueChange={(v) => set({ ...config, unit: v as DelayUnit })}>
          <SelectTrigger className="h-10 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Field>
  );
}

function EndForm({ config, set }: { config: EndConfig; set: (c: EndConfig) => void }) {
  return (
    <Field label="Reason (optional)" hint="Internal note shown in analytics.">
      <Input value={config.reason ?? ""} placeholder="e.g. handed off" onChange={(e) => set({ ...config, reason: e.target.value })} />
    </Field>
  );
}

function clampInt(raw: string, min: number, max: number): number {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
