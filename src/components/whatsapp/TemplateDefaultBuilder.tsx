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
import { useUser } from "@/providers/userProvider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  category: "marketing" | "utility";
  wabaId: string;
  onPreviewChange: (data: {
    headerType: "none" | "text" | "image" | "video" | "document";
    headerValue: string;
    body: string;
    footer: string;
    buttons: { type: string; text: string }[];
  }) => void;
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TemplateDefaultBuilder({
  category,
  wabaId,
  onPreviewChange,
}: Props) {
  const router = useRouter();
  const { user } = useUser();
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const [bodyExamples, setBodyExamples] = useState<Record<string, string>>({});
  const [headerExample, setHeaderExample] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    defaultValues: {
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
  // Preview updates
  // -----------------------------------------------------------------------

  useEffect(() => {
    onPreviewChange({
      headerType: (headerType ?? "none") as "none" | "text" | "image" | "video" | "document",
      headerValue:
        headerType === "text"
          ? headerText
          : headerType !== "none"
            ? headerMediaUrl
            : "",
      body: bodyText,
      footer: footerText,
      buttons: buttons.map((b) => ({ type: b.type, text: b.text })),
    });
  }, [headerType, headerText, headerMediaUrl, bodyText, footerText, buttons, onPreviewChange]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  const addVariable = () => {
    const textarea = bodyRef.current;
    if (!textarea) return;

    let varStr: string;
    if (parameterFormat === "POSITIONAL") {
      const nextN = bodyVariables.length > 0
        ? Math.max(...bodyVariables.map(Number)) + 1
        : 1;
      varStr = `{{${nextN}}}`;
    } else {
      const name = prompt("Enter variable name (lowercase letters and underscores only):");
      if (!name || !/^[a-z_]+$/.test(name)) return;
      varStr = `{{${name}}}`;
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

  const addButton = (type: ButtonType) => {
    if (buttons.length >= 10) return;
    if (buttonTypeCounts[type] >= BUTTON_LIMITS[type]) return;
    append({ type, text: "", url: "", phoneNumber: "", example: "" });
  };

  // -----------------------------------------------------------------------
  // Payload builder
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
          headerComp.example = { header_text: [headerExample] };
        }
        components.push(headerComp);
      } else {
        const format = hType.toUpperCase();
        const headerComp: Record<string, unknown> = {
          type: "HEADER",
          format,
        };
        if (data.headerMediaUrl) {
          headerComp.example = { header_url: [data.headerMediaUrl] };
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
        const namedValues: Record<string, string> = {};
        for (const v of bodyVariables) {
          namedValues[v] = bodyExamples[v] ?? "";
        }
        bodyComp.example = { body_text: namedValues };
      }
    }
    components.push(bodyComp);

    // FOOTER
    if (data.footer) {
      components.push({ type: "FOOTER", text: data.footer });
    }

    // BUTTONS
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
            return { type: "COPY_CODE", text: b.text, example: b.example ?? "" };
          case "QUICK_REPLY":
          default:
            return { type: "QUICK_REPLY", text: b.text };
        }
      });

      components.push({ type: "BUTTONS", buttons: metaButtons });
    }

    const payload: Record<string, unknown> = {
      name: data.name,
      language: data.language,
      category: category.toUpperCase(),
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
      await authenticatedApiClient().post("/whatsApp/template", payload);
      router.push("/app/whatsapp/templates");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create template.";
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g. order_confirmation"
              {...register("name")}
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
                >
                  <SelectTrigger>
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

      {/* ---- Section 2: Header ---- */}
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
            <Input
              id="headerText"
              placeholder="e.g. Hello {{1}}!"
              maxLength={60}
              {...register("headerText")}
            />
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
          <div className="space-y-1.5">
            <Label htmlFor="headerMediaUrl">
              {headerType.charAt(0).toUpperCase() + headerType.slice(1)} URL
            </Label>
            <Input
              id="headerMediaUrl"
              placeholder={`https://example.com/sample.${headerType === "image" ? "jpg" : headerType === "video" ? "mp4" : "pdf"}`}
              {...register("headerMediaUrl")}
            />
            {errors.headerMediaUrl && (
              <p className="text-xs text-red-500">
                {errors.headerMediaUrl.message}
              </p>
            )}
          </div>
        )}
      </section>

      {/* ---- Section 3: Body ---- */}
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

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariable}
          className="gap-1"
        >
          <Variable className="h-4 w-4" />
          Add Variable
        </Button>

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

      {/* ---- Section 5: Buttons ---- */}
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

                {/* Button text */}
                <div className="space-y-1">
                  <Label className="text-xs">Button Text</Label>
                  <Input
                    placeholder="Button label"
                    maxLength={25}
                    {...register(`buttons.${index}.text`)}
                  />
                  {errors.buttons?.[index]?.text && (
                    <p className="text-xs text-red-500">
                      {errors.buttons[index].text?.message}
                    </p>
                  )}
                </div>

                {/* Type-specific fields */}
                {bType === "URL" && (
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input
                      placeholder="https://example.com/{{1}}"
                      {...register(`buttons.${index}.url`)}
                    />
                  </div>
                )}

                {bType === "PHONE_NUMBER" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number</Label>
                    <Input
                      placeholder="+1234567890"
                      {...register(`buttons.${index}.phoneNumber`)}
                    />
                  </div>
                )}

                {bType === "COPY_CODE" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Example Code</Label>
                    <Input
                      placeholder="e.g. SUMMER2024"
                      {...register(`buttons.${index}.example`)}
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
          <Plus className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </form>
  );
}
