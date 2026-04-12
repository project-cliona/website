"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Info,
  MessageSquare,
  Type,
  Zap,
  Variable,
  Upload,
  Link,
  CheckCircle2,
  MapPin,
  FileIcon,
  Loader2,
  X,
} from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import SubHeading from "@/components/ui/SubHeading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import {
  defaultBuilderSchema,
  type DefaultBuilderForm,
  WHATSAPP_LANGUAGES,
} from "@/lib/schema/whatsapp.schema";
import { authenticatedApiClient } from "@/lib/axios";
import { updateWhatsappTemplate } from "@/lib/api/whatsapp/templates";
import { useUser } from "@/providers/userProvider";
import { WhatsappTemplate } from "@/lib/type";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  category: "marketing" | "utility";
  wabaId: string;
  onPreviewChange: (data: {
    headerType: "none" | "text" | "image" | "video" | "document" | "location";
    headerValue: string;
    body: string;
    footer: string;
    buttons: { type: string; text: string }[];
  }) => void;
  initialData?: WhatsappTemplate;
}

type ButtonType = "QUICK_REPLY" | "URL" | "PHONE_NUMBER" | "COPY_CODE";

const BUTTON_OPTIONS: { value: ButtonType; label: string }[] = [
  { value: "QUICK_REPLY", label: "Quick Reply" },
  { value: "URL", label: "URL" },
  { value: "PHONE_NUMBER", label: "Phone Number" },
  { value: "COPY_CODE", label: "Copy Code" },
];

const BUTTON_LIMITS: Record<ButtonType, number> = {
  QUICK_REPLY: 10,
  URL: 2,
  PHONE_NUMBER: 1,
  COPY_CODE: 1,
};

const MEDIA_CONFIG: Record<string, { accept: string; maxSize: number; label: string }> = {
  image: { accept: ".jpg,.jpeg,.png", maxSize: 5 * 1024 * 1024, label: "Image (JPG, PNG) - max 5 MB" },
  video: { accept: ".mp4", maxSize: 16 * 1024 * 1024, label: "Video (MP4) - max 16 MB" },
  document: { accept: ".pdf", maxSize: 100 * 1024 * 1024, label: "Document (PDF) - max 100 MB" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractVariables(
  text: string,
  format: "POSITIONAL" | "NAMED"
): string[] {
  if (!text) return [];
  const regex =
    format === "POSITIONAL" ? /\{\{(\d+)\}\}/g : /\{\{([a-z_]+)\}\}/g;
  const vars: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (!vars.includes(match[1])) {
      vars.push(match[1]);
    }
  }
  return vars;
}

function hasVariableAtEdges(text: string): boolean {
  const trimmed = text.trim();
  return /^\{\{[^}]+\}\}/.test(trimmed) || /\{\{[^}]+\}\}$/.test(trimmed);
}

function countVariables(text: string): number {
  const matches = text.match(/\{\{[^}]+\}\}/g);
  return matches ? matches.length : 0;
}

/** Replace {{1}}, {{name}} etc. in text with example values where available */
function substituteExamples(
  text: string,
  examples: Record<string, string>
): string {
  if (!text) return text;
  return text.replace(/\{\{([^}]+)\}\}/g, (full, key: string) => {
    const val = examples[key];
    return val ? val : full;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers: extract initial form values from a WhatsappTemplate
// ---------------------------------------------------------------------------

function extractInitialValues(template: WhatsappTemplate) {
  const components = Array.isArray(template.components) ? template.components : [];
  let headerType: DefaultBuilderForm["headerType"] = "none";
  let headerText = "";
  let headerMediaUrl = "";
  let body = "";
  let footer = "";
  let parameterFormat: "POSITIONAL" | "NAMED" = (template.parameterFormat === "NAMED" ? "NAMED" : "POSITIONAL");
  const buttons: DefaultBuilderForm["buttons"] = [];
  const bodyExamples: Record<string, string> = {};
  let headerExample = "";

  for (const comp of components as Record<string, any>[]) {
    const t = (comp.type || "").toUpperCase();

    if (t === "HEADER") {
      const fmt = (comp.format || "").toLowerCase();
      if (fmt === "text") {
        headerType = "text";
        headerText = comp.text || "";
        // Extract header example
        if (comp.example?.header_text?.[0]) {
          headerExample = comp.example.header_text[0];
        } else if (comp.example?.header_text_named_params?.[0]?.example) {
          headerExample = comp.example.header_text_named_params[0].example;
        }
      } else if (fmt === "location") {
        headerType = "location";
      } else if (["image", "video", "document"].includes(fmt)) {
        headerType = fmt as "image" | "video" | "document";
        if (comp.preview_url) {
          headerMediaUrl = comp.preview_url as string;
        } else if (comp.example?.header_url?.[0]) {
          headerMediaUrl = comp.example.header_url[0];
        }
      }
    }

    if (t === "BODY") {
      body = comp.text || "";
      // Extract body examples
      if (comp.example?.body_text?.[0] && Array.isArray(comp.example.body_text[0])) {
        const vars = extractVariables(body, parameterFormat);
        comp.example.body_text[0].forEach((val: string, idx: number) => {
          if (vars[idx]) bodyExamples[vars[idx]] = val;
        });
      } else if (comp.example?.body_text_named_params && Array.isArray(comp.example.body_text_named_params)) {
        for (const p of comp.example.body_text_named_params) {
          bodyExamples[p.param_name] = p.example;
        }
      }
    }

    if (t === "FOOTER") {
      footer = comp.text || "";
    }

    if (t === "BUTTONS" && Array.isArray(comp.buttons)) {
      for (const btn of comp.buttons as Record<string, any>[]) {
        const bType = btn.type as ButtonType;
        buttons.push({
          type: bType,
          text: btn.text || "",
          url: btn.url || "",
          phoneNumber: btn.phone_number || "",
          example: btn.example || "",
        });
      }
    }
  }

  // For edit mode: the preview URL is stored in preview_url field of the header component
  let mediaPreviewUrl: string | null = null;
  for (const comp of components as Record<string, any>[]) {
    if ((comp.type || "").toUpperCase() === "HEADER" && comp.preview_url) {
      mediaPreviewUrl = comp.preview_url as string;
    }
  }

  return {
    formValues: {
      name: template.name,
      language: template.language as DefaultBuilderForm["language"],
      parameterFormat,
      headerType,
      headerText,
      headerMediaUrl,
      body,
      footer,
      buttons,
    } as DefaultBuilderForm,
    bodyExamples,
    headerExample,
    headerPreviewUrl: mediaPreviewUrl || headerMediaUrl || null,
  };
}

export default function TemplateDefaultBuilder({
  category,
  wabaId,
  onPreviewChange,
  initialData,
}: Props) {
  const router = useRouter();
  const { user } = useUser();
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const headerInputRef = useRef<HTMLInputElement | null>(null);
  const isEditMode = !!initialData;

  const initialValues = useMemo(
    () => (initialData ? extractInitialValues(initialData) : null),
    [initialData]
  );

  const [bodyExamples, setBodyExamples] = useState<Record<string, string>>(
    initialValues?.bodyExamples ?? {}
  );
  const [headerExample, setHeaderExample] = useState(
    initialValues?.headerExample ?? ""
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newVarName, setNewVarName] = useState("");

  // Media upload state
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    initialValues?.headerPreviewUrl ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -----------------------------------------------------------------------
  // Form setup
  // -----------------------------------------------------------------------

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DefaultBuilderForm>({
    resolver: zodResolver(defaultBuilderSchema),
    defaultValues: initialValues?.formValues ?? {
      name: "",
      language: "en",
      parameterFormat: "POSITIONAL",
      headerType: "none",
      headerText: "",
      headerMediaUrl: "",
      body: "",
      footer: "",
      buttons: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "buttons",
  });

  // -----------------------------------------------------------------------
  // Watched values
  // -----------------------------------------------------------------------

  const headerType = watch("headerType");
  const headerText = watch("headerText") ?? "";
  const headerMediaUrl = watch("headerMediaUrl") ?? "";
  const bodyText = watch("body");
  const footerText = watch("footer") ?? "";
  const parameterFormat = watch("parameterFormat") ?? "POSITIONAL";
  const buttons = watch("buttons") ?? [];

  // -----------------------------------------------------------------------
  // Derived state
  // -----------------------------------------------------------------------

  const bodyVariables = useMemo(
    () => extractVariables(bodyText, parameterFormat),
    [bodyText, parameterFormat]
  );

  const headerVariables = useMemo(
    () => (headerType === "text" ? extractVariables(headerText, parameterFormat) : []),
    [headerType, headerText, parameterFormat]
  );

  const headerVarError = useMemo(() => {
    if (headerType !== "text") return null;
    if (countVariables(headerText) > 1) return "Header supports at most 1 variable.";
    if (headerText && hasVariableAtEdges(headerText))
      return "Variable cannot be at the start or end of the header.";
    return null;
  }, [headerType, headerText]);

  const bodyVarError = useMemo(() => {
    if (bodyText && hasVariableAtEdges(bodyText))
      return "Variables cannot be at the start or end of the body.";
    return null;
  }, [bodyText]);

  // -----------------------------------------------------------------------
  // Button type counts for limit enforcement
  // -----------------------------------------------------------------------

  const buttonTypeCounts = useMemo(() => {
    const counts: Record<ButtonType, number> = {
      QUICK_REPLY: 0,
      URL: 0,
      PHONE_NUMBER: 0,
      COPY_CODE: 0,
    };
    for (const b of buttons) {
      if (b.type in counts) counts[b.type as ButtonType]++;
    }
    return counts;
  }, [buttons]);

  // -----------------------------------------------------------------------
  // Preview updates (Issue 5: substitute example values)
  // -----------------------------------------------------------------------

  useEffect(() => {
    // Build preview body with example values substituted
    const previewBody = substituteExamples(bodyText, bodyExamples);

    // Build preview header with example value substituted
    let previewHeaderValue = "";
    if (headerType === "text") {
      const headerExMap: Record<string, string> = {};
      if (headerVariables.length > 0 && headerExample) {
        headerExMap[headerVariables[0]] = headerExample;
      }
      previewHeaderValue = substituteExamples(headerText, headerExMap);
    } else if (headerType !== "none") {
      previewHeaderValue = mediaUrl || headerMediaUrl;
    }

    onPreviewChange({
      headerType: (headerType ?? "none") as "none" | "text" | "image" | "video" | "document" | "location",
      headerValue: previewHeaderValue,
      body: previewBody,
      footer: footerText,
      buttons: buttons.map((b) => ({ type: b.type, text: b.text })),
    });
  }, [headerType, headerText, headerMediaUrl, mediaUrl, bodyText, footerText, buttons, onPreviewChange, bodyExamples, headerExample, headerVariables]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  /** Add variable to body text (Issue 3: inline input for named variables) */
  const addBodyVariable = (varName?: string) => {
    const textarea = bodyRef.current;
    if (!textarea) return;

    let varStr: string;
    if (parameterFormat === "POSITIONAL") {
      const nextN = bodyVariables.length > 0
        ? Math.max(...bodyVariables.map(Number)) + 1
        : 1;
      varStr = `{{${nextN}}}`;
    } else {
      if (!varName || !/^[a-z_]+$/.test(varName)) return;
      varStr = `{{${varName}}}`;
    }

    const start = textarea.selectionStart ?? bodyText.length;
    const end = textarea.selectionEnd ?? bodyText.length;
    const newBody =
      bodyText.substring(0, start) + varStr + bodyText.substring(end);
    setValue("body", newBody, { shouldValidate: true });

    // Re-focus and set cursor after the inserted variable
    setTimeout(() => {
      textarea.focus();
      const pos = start + varStr.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  /** Add variable to header text (Issue 2) */
  const addHeaderVariable = () => {
    const input = headerInputRef.current;
    const currentText = headerText;

    let varStr: string;
    if (parameterFormat === "POSITIONAL") {
      varStr = "{{1}}";
    } else {
      const name = newVarName.trim();
      if (!name || !/^[a-z_]+$/.test(name)) return;
      varStr = `{{${name}}}`;
      setNewVarName("");
    }

    const start = input?.selectionStart ?? currentText.length;
    const end = input?.selectionEnd ?? currentText.length;
    const newText =
      currentText.substring(0, start) + varStr + currentText.substring(end);
    setValue("headerText", newText, { shouldValidate: true });

    setTimeout(() => {
      input?.focus();
      const pos = start + varStr.length;
      input?.setSelectionRange(pos, pos);
    }, 0);
  };

  const addButton = (type: ButtonType) => {
    if (buttons.length >= 10) return;
    if (buttonTypeCounts[type] >= BUTTON_LIMITS[type]) return;
    append({ type, text: "", url: "", phoneNumber: "", example: "" });
  };

  /** Reset media upload state when header type changes */
  useEffect(() => {
    setMediaUrl(null);
    setUploadedFileName(null);
    setUploadError(null);
  }, [headerType]);

  /** Handle media file selection and upload */
  const handleMediaFileSelect = async (file: File) => {
    const config = MEDIA_CONFIG[headerType as string];
    if (!config) return;

    // Validate file size
    if (file.size > config.maxSize) {
      setUploadError(`File too large. Maximum size: ${formatFileSize(config.maxSize)}`);
      return;
    }

    // Validate file extension
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    const allowed = config.accept.split(",");
    if (!allowed.includes(ext)) {
      setUploadError(`Invalid file type. Accepted: ${config.accept}`);
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await authenticatedApiClient().post("/whatsApp/upload-media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { url } = res.data.result;
      setMediaUrl(url);
      setUploadedFileName(file.name);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const clearUploadedFile = () => {
    setMediaUrl(null);
    setUploadedFileName(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -----------------------------------------------------------------------
  // Payload builder (Issue 1: category lowercase, Issue 6: Meta format)
  // -----------------------------------------------------------------------

  const buildPayload = (data: DefaultBuilderForm) => {
    const components: Record<string, unknown>[] = [];

    // HEADER
    const hType = data.headerType ?? "none";
    if (hType !== "none") {
      if (hType === "text") {
        const headerComp: Record<string, unknown> = {
          type: "HEADER",
          format: "TEXT",
          text: data.headerText ?? "",
        };
        if (headerVariables.length > 0 && headerExample) {
          if (parameterFormat === "NAMED") {
            headerComp.example = {
              header_text_named_params: [
                { param_name: headerVariables[0], example: headerExample },
              ],
            };
          } else {
            headerComp.example = { header_text: [headerExample] };
          }
        }
        components.push(headerComp);
      } else if (hType === "location") {
        components.push({ type: "HEADER", format: "LOCATION" });
      } else {
        const format = hType.toUpperCase();
        const headerComp: Record<string, unknown> = {
          type: "HEADER",
          format,
        };
        const url = mediaUrl || data.headerMediaUrl;
        if (url) {
          headerComp.example = { header_url: [url] };
        }
        components.push(headerComp);
      }
    }

    // BODY
    const bodyComp: Record<string, unknown> = {
      type: "BODY",
      text: data.body,
    };
    if (bodyVariables.length > 0) {
      if (parameterFormat === "POSITIONAL") {
        const orderedValues = bodyVariables
          .sort((a, b) => Number(a) - Number(b))
          .map((v) => bodyExamples[v] ?? "");
        bodyComp.example = { body_text: [orderedValues] };
      } else {
        bodyComp.example = {
          body_text_named_params: bodyVariables.map((v) => ({
            param_name: v,
            example: bodyExamples[v] ?? "",
          })),
        };
      }
    }
    components.push(bodyComp);

    // FOOTER
    if (data.footer) {
      components.push({ type: "FOOTER", text: data.footer });
    }

    // BUTTONS (Issue 6: COPY_CODE has no text field, just example)
    if (data.buttons && data.buttons.length > 0) {
      const nonQR = data.buttons.filter((b) => b.type !== "QUICK_REPLY");
      const qr = data.buttons.filter((b) => b.type === "QUICK_REPLY");
      const sorted = [...nonQR, ...qr];

      const metaButtons = sorted.map((b) => {
        switch (b.type) {
          case "URL":
            return { type: "URL", text: b.text, url: b.url ?? "" };
          case "PHONE_NUMBER":
            return {
              type: "PHONE_NUMBER",
              text: b.text,
              phone_number: b.phoneNumber ?? "",
            };
          case "COPY_CODE":
            return { type: "COPY_CODE", example: b.example ?? "" };
          case "QUICK_REPLY":
          default:
            return { type: "QUICK_REPLY", text: b.text };
        }
      });

      components.push({ type: "BUTTONS", buttons: metaButtons });
    }

    // Issue 1: send category as-is (lowercase) instead of .toUpperCase()
    const payload: Record<string, unknown> = {
      name: data.name,
      language: data.language,
      category,
      wabaId,
      components,
      modifiedBy: user?.userId,
    };

    if (parameterFormat === "NAMED") {
      payload.parameterFormat = "NAMED";
    }

    return payload;
  };

  // -----------------------------------------------------------------------
  // Submit
  // -----------------------------------------------------------------------

  const onSubmit = async (data: DefaultBuilderForm) => {
    setSubmitError(null);

    // Validate variable examples
    if (headerVariables.length > 0 && !headerExample.trim()) {
      setSubmitError("Please provide an example value for the header variable.");
      return;
    }

    for (const v of bodyVariables) {
      if (!bodyExamples[v]?.trim()) {
        setSubmitError(
          `Please provide an example value for body variable {{${v}}}.`
        );
        return;
      }
    }

    if (headerVarError) {
      setSubmitError(headerVarError);
      return;
    }
    if (bodyVarError) {
      setSubmitError(bodyVarError);
      return;
    }

    try {
      setSubmitting(true);
      const payload = buildPayload(data);
      if (isEditMode && initialData) {
        await updateWhatsappTemplate(initialData.id, payload);
      } else {
        await authenticatedApiClient().post("/whatsApp/template", payload);
      }
      router.push("/app/whatsapp/templates");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : isEditMode ? "Failed to update template." : "Failed to create template.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error banner */}
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* ---- Section 1: Template Info ---- */}
      <section className="space-y-4">
        <SubHeading title="Template Info" Icon={Info} />

        {isEditMode && (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 col-span-full">
            Template name and language cannot be changed after creation.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g. order_confirmation"
              {...register("name")}
              readOnly={isEditMode}
              className={isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Lowercase letters, numbers, and underscores only.
            </p>
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <Label>Language</Label>
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isEditMode}
                >
                  <SelectTrigger className={isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {WHATSAPP_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && (
              <p className="text-xs text-red-500">{errors.language.message}</p>
            )}
          </div>

          {/* Parameter Format */}
          <div className="space-y-1.5">
            <Label>Parameter Format</Label>
            <Controller
              control={control}
              name="parameterFormat"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POSITIONAL">
                      {"Positional ({{1}}, {{2}})"}
                    </SelectItem>
                    <SelectItem value="NAMED">
                      {"Named ({{name}})"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

      {/* ---- Section 2: Header (Issue 2: Add Variable button) ---- */}
      <section className="space-y-4">
        <SubHeading title="Header" Icon={Type} />

        <div className="space-y-1.5">
          <Label>Header Type</Label>
          <Controller
            control={control}
            name="headerType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {headerType === "text" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="headerText">Header Text</Label>
              <span className="text-xs text-gray-400">
                {headerText.length}/60
              </span>
            </div>
            <Controller
              control={control}
              name="headerText"
              render={({ field }) => (
                <Input
                  id="headerText"
                  placeholder="e.g. Hello {{1}}!"
                  maxLength={60}
                  {...field}
                  ref={(el) => {
                    field.ref(el);
                    headerInputRef.current = el;
                  }}
                />
              )}
            />
            {/* Add Variable button for header */}
            {parameterFormat === "POSITIONAL" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHeaderVariable}
                disabled={countVariables(headerText) >= 1}
                className="gap-1"
              >
                <Variable className="h-4 w-4" />
                {countVariables(headerText) >= 1 ? "Variable Added" : "Add Variable"}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Variable name (e.g. name)"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  className="w-48 h-8 text-sm"
                  disabled={countVariables(headerText) >= 1}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHeaderVariable}
                  disabled={countVariables(headerText) >= 1 || !newVarName.trim()}
                  className="gap-1"
                >
                  <Variable className="h-4 w-4" />
                  Add
                </Button>
              </div>
            )}
            {headerVarError && (
              <p className="text-xs text-red-500">{headerVarError}</p>
            )}
            {errors.headerText && (
              <p className="text-xs text-red-500">
                {errors.headerText.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              You may include 1 variable. Variables cannot appear at the start or
              end of the text.
            </p>
          </div>
        )}

        {(headerType === "image" ||
          headerType === "video" ||
          headerType === "document") && (
          <div className="space-y-3">

            <div className="space-y-2">
              {/* Upload success state */}
              {mediaUrl ? (
                  <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">
                        {uploadedFileName || "Existing media"}
                      </p>
                      <p className="text-xs text-green-600 truncate">
                        {uploadedFileName ? "Uploaded successfully" : mediaUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearUploadedFile}
                      className="shrink-0 rounded p-1 text-green-600 hover:bg-green-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  /* Drag & drop upload area */
                  <div
                    className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      uploading
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleMediaFileSelect(file);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      accept={MEDIA_CONFIG[headerType]?.accept ?? ""}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaFileSelect(file);
                      }}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FileIcon className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">
                          Drop your file here, or{" "}
                          <span className="text-blue-600 underline">browse</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {MEDIA_CONFIG[headerType]?.label}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs text-red-500">{uploadError}</p>
                )}
              </div>
            ) : (
            </div>
        )}

        {headerType === "location" && (
          <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Location Header</p>
              <p className="text-xs text-blue-600">
                Location data will be provided at send time. No configuration needed here.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ---- Section 3: Body (Issue 3: inline input for named variables) ---- */}
      <section className="space-y-4">
        <SubHeading title="Body" Icon={MessageSquare} />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Body Text</Label>
            <span className="text-xs text-gray-400">
              {bodyText?.length ?? 0}/1024
            </span>
          </div>
          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <Textarea
                id="body"
                rows={6}
                placeholder="Enter your message body..."
                maxLength={1024}
                {...field}
                ref={(el) => {
                  field.ref(el);
                  bodyRef.current = el;
                }}
              />
            )}
          />
          {bodyVarError && (
            <p className="text-xs text-red-500">{bodyVarError}</p>
          )}
          {errors.body && (
            <p className="text-xs text-red-500">{errors.body.message}</p>
          )}
        </div>

        {parameterFormat === "POSITIONAL" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBodyVariable()}
            className="gap-1"
          >
            <Variable className="h-4 w-4" />
            Add Variable
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Variable name (e.g. order_id)"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              className="w-56 h-8 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                addBodyVariable(newVarName.trim());
                setNewVarName("");
              }}
              disabled={!newVarName.trim() || !/^[a-z_]+$/.test(newVarName.trim())}
              className="gap-1"
            >
              <Variable className="h-4 w-4" />
              Add
            </Button>
            {newVarName && !/^[a-z_]+$/.test(newVarName.trim()) && (
              <span className="text-xs text-red-500">
                Lowercase letters and underscores only
              </span>
            )}
          </div>
        )}

        {/* Variable examples */}
        {(bodyVariables.length > 0 || headerVariables.length > 0) && (
          <div className="rounded-md bg-gray-50 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Example Values
            </p>

            {headerVariables.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Header variable{" "}
                  <code className="rounded bg-gray-200 px-1">
                    {`{{${headerVariables[0]}}}`}
                  </code>
                </Label>
                <Input
                  placeholder="e.g. John"
                  value={headerExample}
                  onChange={(e) => setHeaderExample(e.target.value)}
                />
              </div>
            )}

            {bodyVariables.map((v) => (
              <div key={v} className="space-y-1.5">
                <Label className="text-xs">
                  Body variable{" "}
                  <code className="rounded bg-gray-200 px-1">{`{{${v}}}`}</code>
                </Label>
                <Input
                  placeholder={`Example for {{${v}}}`}
                  value={bodyExamples[v] ?? ""}
                  onChange={(e) =>
                    setBodyExamples((prev) => ({
                      ...prev,
                      [v]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Section 4: Footer ---- */}
      <section className="space-y-4">
        <SubHeading title="Footer" Icon={Type} />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="footer">Footer Text</Label>
            <span className="text-xs text-gray-400">
              {footerText.length}/60
            </span>
          </div>
          <Input
            id="footer"
            placeholder="e.g. Reply STOP to unsubscribe"
            maxLength={60}
            {...register("footer")}
          />
          {errors.footer && (
            <p className="text-xs text-red-500">{errors.footer.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Variables are not supported in the footer.
          </p>
        </div>
      </section>

      {/* ---- Section 5: Buttons (Issue 4: Controller for live preview, Issue 6: COPY_CODE label) ---- */}
      <section className="space-y-4">
        <SubHeading title="Buttons" Icon={Zap} />

        {/* Add button dropdown */}
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(val) => addButton(val as ButtonType)}
            value=""
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add Button..." />
            </SelectTrigger>
            <SelectContent>
              {BUTTON_OPTIONS.map((opt) => {
                const disabled =
                  buttons.length >= 10 ||
                  buttonTypeCounts[opt.value] >= BUTTON_LIMITS[opt.value];
                return (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={disabled}
                  >
                    {opt.label}
                    {disabled ? " (limit reached)" : ""}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-400">{buttons.length}/10</span>
        </div>

        {/* Button cards */}
        <div className="space-y-3">
          {fields.map((field, index) => {
            const bType = buttons[index]?.type as ButtonType | undefined;
            return (
              <div
                key={field.id}
                className="rounded-md border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {bType === "QUICK_REPLY"
                      ? "Quick Reply"
                      : bType === "URL"
                        ? "URL"
                        : bType === "PHONE_NUMBER"
                          ? "Phone Number"
                          : "Copy Code"}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Button text (Issue 4: use Controller for live preview) */}
                {bType !== "COPY_CODE" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Button Text</Label>
                    <Controller
                      control={control}
                      name={`buttons.${index}.text`}
                      render={({ field: f }) => (
                        <Input
                          placeholder="Button label"
                          maxLength={25}
                          value={f.value}
                          onChange={f.onChange}
                          onBlur={f.onBlur}
                          ref={f.ref}
                        />
                      )}
                    />
                    {errors.buttons?.[index]?.text && (
                      <p className="text-xs text-red-500">
                        {errors.buttons[index].text?.message}
                      </p>
                    )}
                  </div>
                )}

                {/* COPY_CODE: fixed label, no text input (Issue 6) */}
                {bType === "COPY_CODE" && (
                  <p className="text-xs text-gray-500">
                    Label: &quot;Copy offer code&quot; (fixed by Meta)
                  </p>
                )}

                {/* Type-specific fields (Issue 4: use Controller) */}
                {bType === "URL" && (
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Controller
                      control={control}
                      name={`buttons.${index}.url`}
                      render={({ field: f }) => (
                        <Input
                          placeholder="https://example.com/{{1}}"
                          value={f.value ?? ""}
                          onChange={f.onChange}
                          onBlur={f.onBlur}
                          ref={f.ref}
                        />
                      )}
                    />
                  </div>
                )}

                {bType === "PHONE_NUMBER" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number</Label>
                    <Controller
                      control={control}
                      name={`buttons.${index}.phoneNumber`}
                      render={({ field: f }) => (
                        <Input
                          placeholder="+1234567890"
                          value={f.value ?? ""}
                          onChange={f.onChange}
                          onBlur={f.onBlur}
                          ref={f.ref}
                        />
                      )}
                    />
                  </div>
                )}

                {bType === "COPY_CODE" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Example Code</Label>
                    <Controller
                      control={control}
                      name={`buttons.${index}.example`}
                      render={({ field: f }) => (
                        <Input
                          placeholder="e.g. SUMMER2024"
                          value={f.value ?? ""}
                          onChange={f.onChange}
                          onBlur={f.onBlur}
                          ref={f.ref}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Section 6: Submit ---- */}
      <div className="flex items-center gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/app/whatsapp/templates/create")}
        >
          Back
        </Button>
        <Button type="submit" disabled={submitting} className="gap-1">
          {!isEditMode && <Plus className="h-4 w-4" />}
          {submitting
            ? (isEditMode ? "Updating..." : "Creating...")
            : (isEditMode ? "Update Template" : "Create Template")}
        </Button>
      </div>
    </form>
  );
}
