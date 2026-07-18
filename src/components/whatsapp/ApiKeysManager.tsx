"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, KeyRound, Plus, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
  TableSubject,
} from "@/components/ui/table";
import { notify } from "@/lib/toast";
import {
  createApiKey,
  fetchApiKeys,
  revokeApiKey,
  type CreatedApiKey,
} from "@/lib/api/apiKeys";

const QUERY_KEY = ["api-keys"];

async function copy(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    notify.info(`${label} copied to clipboard`);
  } catch {
    notify.error(null, "Could not copy to clipboard");
  }
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ApiKeysManager() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  // Holds the freshly-created key (with secret) until the user dismisses it.
  const [created, setCreated] = useState<CreatedApiKey | null>(null);

  const { data: keys, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchApiKeys,
  });

  const createMutation = useMutation({
    mutationFn: () => createApiKey({ label: label.trim() || undefined }),
    onSuccess: (key) => {
      setCreated(key);
      setLabel("");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => notify.error(err, "Could not create API key"),
  });

  const revokeMutation = useMutation({
    mutationFn: (sid: string) => revokeApiKey(sid),
    onSuccess: () => {
      notify.success("API key revoked");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => notify.error(err, "Could not revoke API key"),
  });

  function openCreate() {
    setCreated(null);
    setLabel("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setCreated(null);
    setLabel("");
  }

  function handleRevoke(sid: string) {
    if (
      window.confirm(
        `Revoke key ${sid}? Any application using it will immediately stop working. This cannot be undone.`,
      )
    ) {
      revokeMutation.mutate(sid);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>API keys</CardTitle>
          <CardDescription>
            Use these credentials to authenticate the Squalto SDK from your app.
            Keep them secret — treat them like passwords.
          </CardDescription>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Create key
        </Button>
      </CardHeader>

      <CardContent>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoading rows={3} columns={5} />
              ) : !keys || keys.length === 0 ? (
                <TableEmpty colSpan={5}>
                  <KeyRound className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    No API keys yet
                  </p>
                  <p className="text-caption text-muted-foreground">
                    Create your first key to start using the SDK.
                  </p>
                </TableEmpty>
              ) : (
                keys.map((key) => (
                  <TableRow key={key.sid}>
                    <TableCell>
                      <TableSubject
                        primary={
                          <span className="font-mono text-xs">{key.sid}</span>
                        }
                        secondary={key.label ?? "Untitled key"}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusPill status={key.status}>{key.status}</StatusPill>
                    </TableCell>
                    <TableCell className="text-small text-muted-foreground">
                      {fmtDate(key.createdAt)}
                    </TableCell>
                    <TableCell className="text-small text-muted-foreground">
                      {fmtDate(key.lastUsedAt)}
                    </TableCell>
                    <TableCell>
                      <TableActions>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copy(key.sid, "Key ID")}
                          aria-label="Copy key id"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {key.status === "active" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRevoke(key.sid)}
                            aria-label="Revoke key"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableActions>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Modal isOpen={modalOpen} onClose={closeModal} size="md">
        {created ? (
          <>
            <ModalHeader
              title="API key created"
              description="Copy your secret now — it will not be shown again."
            />
            <ModalBody className="space-y-4">
              <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5">
                <TriangleAlert className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <p className="text-small text-foreground">
                  Store this secret in a secure place (e.g. an environment
                  variable). Anyone with it can send messages on your behalf.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Key ID (public)</Label>
                <Input
                  readOnly
                  value={created.sid}
                  className="font-mono text-xs"
                  trailingSlot={
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copy(created.sid, "Key ID")}
                      aria-label="Copy key id"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Secret</Label>
                <Input
                  readOnly
                  value={created.secret}
                  className="font-mono text-xs"
                  trailingSlot={
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copy(created.secret, "Secret")}
                      aria-label="Copy secret"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModal}>Done</Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader
              title="Create API key"
              description="Give your key a label so you can recognize it later."
            />
            <ModalBody>
              <div className="space-y-1.5">
                <Label htmlFor="key-label">Label (optional)</Label>
                <Input
                  id="key-label"
                  leadingIcon={KeyRound}
                  placeholder="e.g. Production server"
                  value={label}
                  maxLength={120}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createMutation.mutate();
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                loading={createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                Create key
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </Card>
  );
}
