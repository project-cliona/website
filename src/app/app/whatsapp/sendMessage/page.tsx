"use client";

import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import { PageHeading } from "@/components/ui/PageHeading";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import {
  createCampaign,
  type CreateCampaignRecipient,
} from "@/lib/api/whatsapp/campaigns";
import { previewAudience } from "@/lib/api/whatsapp/audience";
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
import { WhatsappTemplate, AudiencePreview } from "@/lib/type";
import {
  RecipientPicker,
  type RecipientSelection,
} from "@/components/whatsapp/RecipientPicker";
import { useUser } from "@/providers/userProvider";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SendWhatsappMessage() {
  const { user } = useUser();
  const userId = user?.userId;
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

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

      // Resolve the selection to a concrete phone list on the client. For
      // Phase 1 this goes through the mocked audience-preview endpoint,
      // which returns up to 50 sample recipients — so list/tag mode is
      // capped at 50 contacts in Phase 1. Phase 2 moves the resolver
      // server-side and drops the cap.
      let phones: string[];
      if (selection.mode === "list" || selection.mode === "tags") {
        const p = await previewAudience({
          mode: selection.mode,
          listId: selection.mode === "list" ? selection.listId : undefined,
          tags: selection.mode === "tags" ? selection.tags : undefined,
        });
        phones = p.sampleRecipients.map((r) => r.phone);
      } else {
        phones = selection.phones;
      }

      if (phones.length === 0) {
        throw new Error("No recipients in the selected audience");
      }

      const variablesForAll: Record<string, string> | string[] | undefined =
        bodyVariables.length === 0
          ? undefined
          : isNamedFormat
            ? bodyVariables.reduce<Record<string, string>>((acc, v) => {
                acc[v] = variableValues[v] ?? "";
                return acc;
              }, {})
            : bodyVariables.map((v) => variableValues[v] ?? "");

      const recipients: CreateCampaignRecipient[] = phones.map((phone) => ({
        phone,
        variables: variablesForAll,
      }));

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
      // Navigate straight to the campaign detail page — progress is tracked there.
      router.push(`/app/whatsapp/campaignReport/${result.id}`);
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeading
          title="Send WhatsApp Campaign"
          subtitle="Create and send WhatsApp campaigns to your audience"
        />
        <Link
          href="/app/whatsapp/campaignReport"
          className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
        >
          View all campaigns <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                          <p className="text-sm text-red-500 mt-1">
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.templateId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {bodyVariables.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Template Variables
                </h2>
                <p className="text-sm text-gray-500 mb-4">
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
              </div>
            )}

            <RecipientPicker
              onChange={(s, p) => {
                setSelection(s);
                setPreview(p);
              }}
            />

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                mutation.isPending ||
                !selection ||
                (preview?.matched ?? 0) === 0
              }
            >
              {mutation.isPending
                ? "Creating campaign…"
                : preview && preview.matched > 0
                  ? `Launch campaign to ${preview.matched.toLocaleString()} recipient${preview.matched === 1 ? "" : "s"}`
                  : "Launch campaign"}
            </Button>
          </div>

          <div className="lg:col-span-1">
            <WhatsappPreview
              headerType={previewHeaderType}
              headerValue={previewHeaderValue}
              body={previewBody}
              footer={previewFooter}
              buttons={previewButtons}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
