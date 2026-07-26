// Flow Builder API — talks to the backend flow engine (`/whatsApp/flow*`).
// This module is the adapter boundary: it maps the backend's response shape
// (numeric ids, ISO timestamps, `{ code, message, result }` envelope) to the
// editor's FlowSummary / FlowRecord types, so the rest of the builder is unchanged.

import { authenticatedApiClient } from "@/lib/axios";
import type {
  FlowDefinition,
  FlowRecord,
  FlowStatus,
  FlowSummary,
} from "@/lib/whatsapp/flow/types";

interface RawFlow {
  id: number | string;
  name: string;
  description?: string | null;
  status: string;
  nodeCount?: number;
  updatedAt: string;
  publishedVersionId?: number | null;
  definition?: FlowDefinition;
}

function toSummary(raw: RawFlow): FlowSummary {
  return {
    id: String(raw.id),
    name: raw.name,
    description: raw.description ?? undefined,
    status: (raw.status as FlowStatus) ?? "draft",
    nodeCount: raw.nodeCount ?? 0,
    updatedAt: raw.updatedAt,
  };
}

function toRecord(raw: RawFlow): FlowRecord {
  return { ...toSummary(raw), definition: raw.definition ?? emptyDefinition() };
}

function emptyDefinition(): FlowDefinition {
  return { version: 1, entryNodeId: null, nodes: [], edges: [] };
}

export async function listFlows(): Promise<FlowSummary[]> {
  try {
    const res = await authenticatedApiClient().get("/whatsApp/flow");
    return (res.data.result as RawFlow[]).map(toSummary);
  } catch (error) {
    console.log("Error fetching flows:", error);
    return [];
  }
}

export async function getFlow(id: string): Promise<FlowRecord | null> {
  try {
    const res = await authenticatedApiClient().get(`/whatsApp/flow/${id}`);
    return toRecord(res.data.result as RawFlow);
  } catch (error) {
    console.log("Error fetching flow:", error);
    return null;
  }
}

export async function createFlow(name = "Untitled flow"): Promise<FlowRecord> {
  const res = await authenticatedApiClient().post("/whatsApp/flow", { name });
  return toRecord(res.data.result as RawFlow);
}

export async function saveFlowDraft(
  flowId: string | null,
  name: string,
  definition: FlowDefinition,
): Promise<FlowRecord> {
  if (!flowId) {
    // No id yet — create, then this record carries the new id for subsequent saves.
    const created = await createFlow(name);
    flowId = created.id;
  }
  const res = await authenticatedApiClient().put(`/whatsApp/flow/${flowId}/draft`, { name, definition });
  return toRecord(res.data.result as RawFlow);
}

export async function publishFlow(
  flowId: string | null,
  name: string,
  definition: FlowDefinition,
): Promise<FlowRecord> {
  if (!flowId) {
    const created = await createFlow(name);
    flowId = created.id;
  }
  const res = await authenticatedApiClient().post(`/whatsApp/flow/${flowId}/publish`, { name, definition });
  return toRecord(res.data.result as RawFlow);
}

export async function deleteFlow(id: string): Promise<void> {
  await authenticatedApiClient().delete(`/whatsApp/flow/${id}`);
}

export async function duplicateFlow(id: string): Promise<FlowRecord> {
  const res = await authenticatedApiClient().post(`/whatsApp/flow/${id}/duplicate`);
  return toRecord(res.data.result as RawFlow);
}
