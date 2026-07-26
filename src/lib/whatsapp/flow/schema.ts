// Zod schemas: drive the config forms (zodResolver) AND boundary-validate a
// FlowDefinition coming from / going to the backend. One source of truth.

import { z } from "zod";
import { FLOW_DEFINITION_VERSION, type FlowNodeType } from "./types";

export const flowButtonSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Button label is required").max(20, "Max 20 characters"),
});

export const conditionRuleSchema = z
  .object({
    id: z.string(),
    variable: z.string().min(1, "Variable is required"),
    operator: z.enum(["equals", "notEquals", "contains", "gt", "lt", "exists"]),
    value: z.string(),
  })
  .refine((r) => r.operator === "exists" || r.value.trim().length > 0, {
    message: "Value is required for this operator",
    path: ["value"],
  });

export const startConfigSchema = z.object({
  keywords: z.array(z.string().min(1)).min(1, "Add at least one keyword"),
  matchMode: z.enum(["exact", "contains", "regex"]),
});

export const textConfigSchema = z.object({
  body: z.string().min(1, "Message body is required").max(4096),
  previewUrl: z.boolean().optional(),
});

export const templateConfigSchema = z.object({
  templateName: z.string().min(1, "Select a template"),
  language: z.string().min(1),
});

export const buttonsConfigSchema = z.object({
  body: z.string().min(1, "Message body is required").max(1024),
  header: z.string().max(60).optional(),
  footer: z.string().max(60).optional(),
  buttons: z.array(flowButtonSchema).min(1, "Add at least one button").max(3, "WhatsApp allows max 3 buttons"),
});

export const askConfigSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  saveToVariable: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Use letters, numbers, underscore (cannot start with a number)"),
  expectedType: z.enum(["text", "number", "email"]),
  validationRegex: z.string().optional(),
  retryMessage: z.string().optional(),
  maxRetries: z.number().int().min(0).max(5),
  timeoutSeconds: z.number().int().positive().optional(),
});

export const conditionConfigSchema = z.object({
  rules: z.array(conditionRuleSchema).min(1, "Add at least one rule"),
});

export const delayConfigSchema = z.object({
  duration: z.number().int().positive("Must be greater than 0"),
  unit: z.enum(["seconds", "minutes", "hours", "days"]),
});

export const endConfigSchema = z.object({
  reason: z.string().optional(),
});

export const NODE_CONFIG_SCHEMA: Record<FlowNodeType, z.ZodTypeAny> = {
  start: startConfigSchema,
  text: textConfigSchema,
  template: templateConfigSchema,
  buttons: buttonsConfigSchema,
  ask: askConfigSchema,
  condition: conditionConfigSchema,
  delay: delayConfigSchema,
  end: endConfigSchema,
};

export const flowDefinitionNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["start", "text", "template", "buttons", "ask", "condition", "delay", "end"]),
  position: z.object({ x: z.number(), y: z.number() }),
  config: z.record(z.string(), z.unknown()),
});

export const flowDefinitionEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullish(),
  targetHandle: z.string().nullish(),
  label: z.string().optional(),
});

export const flowDefinitionSchema = z.object({
  version: z.number().default(FLOW_DEFINITION_VERSION),
  entryNodeId: z.string().nullable(),
  nodes: z.array(flowDefinitionNodeSchema),
  edges: z.array(flowDefinitionEdgeSchema),
});
