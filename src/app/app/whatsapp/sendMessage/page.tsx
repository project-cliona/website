"use client";

import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import { FileUpload } from "@/components/ui/FileUpload";
import { PageHeading } from "@/components/ui/PageHeading";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import { sendTemplateMessage } from "@/lib/api/whatsapp/messaging";
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

export default function SendWhatsappMessage() {
  const { user } = useUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SendWhatsappCampaignForm>({
    resolver: zodResolver(sendWhatsappCampaignSchema),
    defaultValues: {
      campaignName: "",
      templateId: "",
      mobileNumbers: "",
      uploadedFile: null,
      scheduledAt: "",
      removeDuplicates: false,
    },
  });

  const selectedTemplateId = watch("templateId");

  const { data: templates } = useQuery<WhatsappTemplate[]>({
    queryKey: ["whatsapp-templates"],
    queryFn: fetchWhatsappTemplates,
  });

  // Find the selected template and extract body/header/footer for preview
  const selectedTemplate = templates?.find(
    (t) => t.id.toString() === selectedTemplateId
  );

  let previewBody = "";
  let previewHeaderType: "none" | "text" | "image" | "video" | "document" = "none";
  let previewHeaderValue = "";
  let previewFooter = "";
  let previewButtons: { type: string; text: string }[] = [];

  if (selectedTemplate) {
    // components can be an array or wrapped in an object — normalize
    const comps = Array.isArray(selectedTemplate.components)
      ? selectedTemplate.components
      : [];

    for (const comp of comps as Record<string, any>[]) {
      const t = (comp.type || "").toUpperCase();
      if (t === "BODY") previewBody = comp.text || "";
      if (t === "HEADER") {
        previewHeaderType = ((comp.format || "text").toLowerCase()) as typeof previewHeaderType;
        previewHeaderValue = comp.text || "";
      }
      if (t === "FOOTER") previewFooter = comp.text || "";
      if (t === "BUTTONS" && Array.isArray(comp.buttons)) {
        previewButtons = comp.buttons.map((b: Record<string, string>) => ({
          type: b.type,
          text: b.text,
        }));
      }
    }
  }

  // Extract variable placeholders from template body (e.g., {{1}}, {{2}} or {{name}})
  const bodyVariables = useMemo(() => {
    const matches = previewBody.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches)].map((v) => v.replace(/\{\{|\}\}/g, ""));
  }, [previewBody]);

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Build the components array for Meta API send-time format
  // Named params require parameter_name field; positional params don't
  const isNamedFormat = selectedTemplate?.parameterFormat === "named" ||
    selectedTemplate?.parameterFormat === "NAMED";

  const buildSendComponents = () => {
    const components: Record<string, unknown>[] = [];

    if (bodyVariables.length > 0) {
      components.push({
        type: "body",
        parameters: bodyVariables.map((v) => {
          const param: Record<string, string> = {
            type: "text",
            text: variableValues[v] || "",
          };
          if (isNamedFormat) {
            param.parameter_name = v;
          }
          return param;
        }),
      });
    }

    return components;
  };

  const mutation = useMutation({
    mutationFn: async (data: SendWhatsappCampaignForm) => {
      let phoneNumbers = data.mobileNumbers
        ? data.mobileNumbers
            .split(/[,\n]+/)
            .map((n) => n.trim())
            .filter(Boolean)
        : [];

      if (data.removeDuplicates) {
        phoneNumbers = [...new Set(phoneNumbers)];
      }

      if (!selectedTemplate) {
        throw new Error("Please select a template");
      }

      if (phoneNumbers.length === 0) {
        throw new Error("Please enter at least one phone number");
      }

      const components = buildSendComponents();

      // Send to each phone number via the real Meta API
      const results = await Promise.allSettled(
        phoneNumbers.map((phone) =>
          sendTemplateMessage({
            to: phone,
            templateName: selectedTemplate.name,
            language: selectedTemplate.language,
            components: components.length > 0 ? components : undefined,
          })
        )
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0 && failed.length === results.length) {
        throw new Error(`All ${failed.length} messages failed to send`);
      }
      if (failed.length > 0) {
        throw new Error(`${failed.length} of ${results.length} messages failed`);
      }

      return { sent: results.length };
    },
    onSuccess: () => {
      setSubmitError(null);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send campaign";
      setSubmitError(msg);
    },
  });

  const onSubmit = (data: SendWhatsappCampaignForm) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    mutation.mutate(data);
  };

  // Only show approved templates in the selector (per Meta docs, only approved templates can be sent)
  const approvedTemplates = templates?.filter(
    (t) => t.status === "APPROVED" || t.status === "approved"
  );

  return (
    <div className="space-y-8">
      <PageHeading
        title="Send WhatsApp Campaign"
        subtitle="Create and send WhatsApp campaigns to your audience"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Settings */}
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
                          placeholder="Enter campaign name"
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

            {/* Variable Values */}
            {bodyVariables.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Template Variables
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Fill in the values for each variable in your template.
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

            {/* Mobile Numbers */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Mobile Numbers
              </h2>
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
                        Remove duplicate numbers
                      </Label>
                    </div>
                  )}
                />

                <div>
                  <Label className="mb-2 block">
                    Schedule (optional)
                  </Label>
                  <Controller
                    name="scheduledAt"
                    control={control}
                    render={({ field }) => (
                      <Input type="datetime-local" {...field} />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Error / Success Messages */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                Campaign sent successfully!
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send Campaign"}
            </Button>
          </div>

          {/* Preview */}
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
