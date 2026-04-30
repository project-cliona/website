"use client";

import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import { PageHeading } from "@/components/ui/PageHeading";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import {
  createCampaign,
  type CampaignAudience,
  type CreateCampaignRecipient,
} from "@/lib/api/whatsapp/campaigns";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Controller, useForm } from "react-hook-form";
import {
  SendWhatsappCampaignForm,
  sendWhatsappCampaignSchema,
} from "@/lib/schema/whatsapp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsappTemplate, AudiencePreview } from "@/lib/type";
import {
  RecipientPicker,
  type RecipientSelection,
} from "@/components/whatsapp/RecipientPicker";
import { useUser } from "@/providers/userProvider";
import { usePageSearch } from "@/providers/searchProvider";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function SendWhatsappMessage() {
  const { user } = useUser();
  const userId = user?.userId;
  const reduceMotion = useReducedMotion();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sentResult, setSentResult] = useState<{
    count: number;
    campaignId: number;
  } | null>(null);

  // Wires the TopBar search prompt for this page. RecipientPicker doesn't
  // accept an external search filter today, so we just register the
  // placeholder — the actual filter still lives inside the picker UI.
  usePageSearch({
    placeholder: "Search recipients",
    onChange: () => {
      /* no-op: RecipientPicker filters internally */
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SendWhatsappCampaignForm>({
    resolver: zodResolver(sendWhatsappCampaignSchema),
    defaultValues: {
      campaignName: "",
      templateId: "",
    },
  });

  const selectedTemplateId = watch("templateId");

  const [selection, setSelection] = useState<RecipientSelection | null>(null);
  const [preview, setPreview] = useState<AudiencePreview | null>(null);

  const { data: templates } = useQuery<WhatsappTemplate[]>({
    queryKey: ["whatsapp-template", userId],
    queryFn: () => fetchWhatsappTemplates(Number(userId)),
    enabled: !!userId,
  });

  const selectedTemplate = templates?.find(
    (t) => t.id.toString() === selectedTemplateId
  );

  let previewBody = "";
  let previewHeaderType: "none" | "text" | "image" | "video" | "document" = "none";
  let previewHeaderValue = "";
  let previewFooter = "";
  let previewButtons: { type: string; text: string }[] = [];
  const headerMediaUrl: string | null = selectedTemplate?.headerMediaUrl ?? null;

  if (selectedTemplate) {
    const comps = Array.isArray(selectedTemplate.components)
      ? selectedTemplate.components
      : [];

    for (const comp of comps as Record<string, unknown>[]) {
      const t = (String(comp.type ?? "")).toUpperCase();
      if (t === "BODY") previewBody = String(comp.text ?? "");
      if (t === "HEADER") {
        previewHeaderType = (String(comp.format ?? "text").toLowerCase()) as typeof previewHeaderType;
        previewHeaderValue = String(comp.text ?? "");
      }
      if (t === "FOOTER") previewFooter = String(comp.text ?? "");
      if (t === "BUTTONS" && Array.isArray(comp.buttons)) {
        previewButtons = (comp.buttons as Array<Record<string, string>>).map(
          (b) => ({ type: b.type, text: b.text })
        );
      }
    }
  }

  const bodyVariables = useMemo(() => {
    const matches = previewBody.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches)].map((v) => v.replace(/\{\{|\}\}/g, ""));
  }, [previewBody]);

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const isNamedFormat =
    selectedTemplate?.parameterFormat === "named" ||
    selectedTemplate?.parameterFormat === "NAMED";

  // Build Meta-spec components for anything that's not per-recipient variables
  // (e.g. media header). Body variables are packed per-recipient inside the
  // recipients[] array instead of here — see mutation below.
  const buildSharedComponents = (): Record<string, unknown>[] => {
    const components: Record<string, unknown>[] = [];
    if (previewHeaderType !== "none" && previewHeaderType !== "text") {
      if (!headerMediaUrl) {
        throw new Error(
          "This template has a media header but no stored media URL. Re-upload the header image to refresh the stored URL, then retry."
        );
      }
      components.push({
        type: "header",
        parameters: [
          {
            type: previewHeaderType,
            [previewHeaderType]: { link: headerMediaUrl },
          },
        ],
      });
    }
    return components;
  };

  const recipientCount = preview?.matched ?? 0;

  const mutation = useMutation({
    mutationFn: async (data: SendWhatsappCampaignForm) => {
      if (!selectedTemplate) {
        throw new Error("Please select a template");
      }
      if (!selection) {
        throw new Error(
          "Choose a list, tag filter, or paste numbers to send to"
        );
      }

      const sharedComponents = buildSharedComponents();

      const variablesForAll: Record<string, string> | string[] | undefined =
        bodyVariables.length === 0
          ? undefined
          : isNamedFormat
            ? bodyVariables.reduce<Record<string, string>>((acc, v) => {
                acc[v] = variableValues[v] ?? "";
                return acc;
              }, {})
            : bodyVariables.map((v) => variableValues[v] ?? "");

      // List/tag mode sends the audience union — the server resolves to phones
      // from the phonebook, so there's no client-side cap. Paste mode keeps
      // the explicit recipients[] path so each phone can carry its own
      // variables if we later add per-row personalization.
      if (selection.mode === "list" || selection.mode === "tags") {
        const audience: CampaignAudience =
          selection.mode === "list"
            ? { source: "list", listId: selection.listId }
            : { source: "tags", tags: selection.tags };

        return await createCampaign({
          campaignName: data.campaignName,
          templateName: selectedTemplate.name,
          templateLanguage: selectedTemplate.language,
          audience,
          variables: variablesForAll,
          components: sharedComponents.length > 0 ? sharedComponents : undefined,
        });
      }

      // Paste mode.
      if (selection.phones.length === 0) {
        throw new Error("No recipients in the selected audience");
      }
      const recipients: CreateCampaignRecipient[] = selection.phones.map(
        (phone) => ({ phone, variables: variablesForAll })
      );

      return await createCampaign({
        campaignName: data.campaignName,
        templateName: selectedTemplate.name,
        templateLanguage: selectedTemplate.language,
        recipients,
        components: sharedComponents.length > 0 ? sharedComponents : undefined,
      });
    },
    onSuccess: (result) => {
      setSubmitError(null);
      // Replace the previous router.push with a celebration overlay — the
      // user clicks through to the live report from the modal CTA.
      setSentResult({
        campaignId: result.id,
        count: result.totalRecipients ?? recipientCount,
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create campaign";
      setSubmitError(msg);
    },
  });

  const onSubmit = (data: SendWhatsappCampaignForm) => {
    setSubmitError(null);
    mutation.mutate(data);
  };

  const approvedTemplates = templates?.filter(
    (t) => (t.status ?? "").toUpperCase() === "APPROVED"
  );

  const sendDisabled =
    mutation.isPending || !selection || recipientCount === 0;

  return (
    <div className="space-y-8">
      <PageHeading
        title="Send Message"
        subtitle="Reach your audience with WhatsApp messaging"
        actions={
          <Link
            href="/app/whatsapp/campaignReport"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Campaign Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Campaign Name *</Label>
                  <Controller
                    name="campaignName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="e.g. Flash Sale — April Weekend"
                        />
                        {fieldState.error && (
                          <p className="text-sm text-destructive mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Select Template *</Label>
                  <Controller
                    name="templateId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!approvedTemplates || approvedTemplates.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an approved template" />
                        </SelectTrigger>
                        <SelectContent>
                          {approvedTemplates && approvedTemplates.length > 0 ? (
                            approvedTemplates.map((template) => (
                              <SelectItem
                                key={template.id}
                                value={template.id.toString()}
                              >
                                {template.name} ({template.category})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-template" disabled>
                              No approved templates available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.templateId && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.templateId.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {bodyVariables.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Template Variables
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  These values are used for every recipient in this campaign.
                  Per-recipient personalization is coming soon.
                </p>
                <div className="space-y-3">
                  {bodyVariables.map((variable) => (
                    <div key={variable}>
                      <Label className="mb-1 block text-sm">
                        {`{{${variable}}}`}
                      </Label>
                      <Input
                        placeholder={`Enter value for {{${variable}}}`}
                        value={variableValues[variable] || ""}
                        onChange={(e) =>
                          setVariableValues((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <RecipientPicker
              onChange={(s, p) => {
                setSelection(s);
                setPreview(p);
              }}
            />

            {submitError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                {submitError}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card variant="highlight" className="p-6">
              <div className="text-caption text-muted-foreground mb-3">
                Live preview
              </div>
              <WhatsappPreview
                headerType={previewHeaderType}
                headerValue={previewHeaderValue}
                body={previewBody}
                footer={previewFooter}
                buttons={previewButtons}
              />
            </Card>
          </div>
        </div>

        <div className="sticky bottom-0 -mx-4 md:-mx-6 mt-6 px-4 md:px-6 py-3 border-t border-border bg-card/90 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary-100 text-primary-800 px-2.5 py-0.5 text-xs font-medium">
              {recipientCount.toLocaleString()} recipients
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            loading={mutation.isPending}
            disabled={sendDisabled}
            className="shadow-primary-glow"
          >
            <Send className="h-4 w-4" />
            Send Campaign
          </Button>
        </div>
      </form>

      {sentResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: reduceMotion ? 1 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 400, damping: 24 }
            }
            className="rounded-xl bg-card border border-border shadow-e4 p-10 text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: reduceMotion ? 1 : 0 }}
              animate={{ scale: reduceMotion ? 1 : [0, 1.1, 1] }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                times: [0, 0.6, 1],
              }}
              className="mx-auto w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-success" />
            </motion.div>
            <h2 className="text-h1">
              Sent to {sentResult.count.toLocaleString()} recipients
            </h2>
            <p className="text-small text-muted-foreground mt-2">
              Track delivery in real time on the campaign report.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button asChild>
                <Link
                  href={`/app/whatsapp/campaignReport/${sentResult.campaignId}`}
                >
                  View live report
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setSentResult(null)}>
                Send another
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
