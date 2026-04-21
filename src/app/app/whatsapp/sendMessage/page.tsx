"use client";

import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import { FileUpload } from "@/components/ui/FileUpload";
import { PageHeading } from "@/components/ui/PageHeading";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import {
  createCampaign,
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
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { WhatsappTemplate } from "@/lib/type";
import { useUser } from "@/providers/userProvider";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

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
      mobileNumbers: "",
      uploadedFile: null,
      scheduledAt: "",
      removeDuplicates: true,
    },
  });

  const selectedTemplateId = watch("templateId");
  const mobileNumbersRaw = watch("mobileNumbers") ?? "";
  const removeDuplicates = watch("removeDuplicates");

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

  // Parse numbers from the textarea for live preview of recipient count
  const parsedPhones = useMemo(() => {
    const raw = mobileNumbersRaw
      .split(/[,\n]+/)
      .map((n) => n.trim())
      .filter(Boolean);
    return removeDuplicates ? [...new Set(raw)] : raw;
  }, [mobileNumbersRaw, removeDuplicates]);

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
      if (parsedPhones.length === 0) {
        throw new Error("Please enter at least one phone number");
      }

      const sharedComponents = buildSharedComponents();

      // For MVP, all recipients share the same body variable values. The
      // backend accepts per-recipient `variables` though, so when we ship CSV
      // upload with per-row variables the UI can swap in different values here
      // without an API change.
      const variablesForAll: Record<string, string> | string[] | undefined =
        bodyVariables.length === 0
          ? undefined
          : isNamedFormat
            ? bodyVariables.reduce<Record<string, string>>((acc, v) => {
                acc[v] = variableValues[v] ?? "";
                return acc;
              }, {})
            : bodyVariables.map((v) => variableValues[v] ?? "");

      const recipients: CreateCampaignRecipient[] = parsedPhones.map((phone) => ({
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
    (t) => t.status === "APPROVED" || t.status === "approved"
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

            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recipients
                </h2>
                {parsedPhones.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {parsedPhones.length.toLocaleString()} unique numbers
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <Controller
                  name="mobileNumbers"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Enter Mobile Numbers
                      </Label>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Enter numbers separated by commas or new lines (e.g. 919876543210)"
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500">
                        Numbers are normalized to digits-only E.164 server-side (country code required, no +).
                      </p>
                    </div>
                  )}
                />

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    OR Upload File
                  </p>
                  <Controller
                    name="uploadedFile"
                    control={control}
                    render={({ field }) => (
                      <FileUpload onFileUpload={field.onChange} />
                    )}
                  />
                </div>

                <Controller
                  name="removeDuplicates"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      <Label className="cursor-pointer">
                        Remove duplicate numbers (backend also dedupes)
                      </Label>
                    </div>
                  )}
                />
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Creating campaign…"
                : parsedPhones.length > 0
                  ? `Launch campaign to ${parsedPhones.length.toLocaleString()} recipient${parsedPhones.length === 1 ? "" : "s"}`
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
