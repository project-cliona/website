"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, ShieldCheck, Clock, Fingerprint } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import SubHeading from "@/components/ui/SubHeading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import {
  authBuilderSchema,
  type AuthBuilderForm,
  WHATSAPP_LANGUAGES,
} from "@/lib/schema/whatsapp.schema";
import { authenticatedApiClient } from "@/lib/axios";
import { useUser } from "@/providers/userProvider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  wabaId: string;
  onPreviewChange: (data: {
    authMode: true;
    addSecurity: boolean;
    expirationMinutes: number | undefined;
    otpButtonText: string;
  }) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TemplateAuthBuilder({ wabaId, onPreviewChange }: Props) {
  const router = useRouter();
  const { user } = useUser();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // -------------------------------------------------------------------------
  // Form setup
  // -------------------------------------------------------------------------

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthBuilderForm>({
    resolver: zodResolver(authBuilderSchema),
    defaultValues: {
      name: "",
      language: "en",
      addSecurityRecommendation: true,
      codeExpirationMinutes: undefined,
      otpButtonText: "Copy Code",
    },
  });

  // -------------------------------------------------------------------------
  // Watched values
  // -------------------------------------------------------------------------

  const addSecurity = watch("addSecurityRecommendation") ?? true;
  const expMinutes = watch("codeExpirationMinutes");
  const otpButtonText = watch("otpButtonText") ?? "Copy Code";

  // -------------------------------------------------------------------------
  // Preview updates
  // -------------------------------------------------------------------------

  useEffect(() => {
    onPreviewChange({
      authMode: true,
      addSecurity,
      expirationMinutes: expMinutes,
      otpButtonText,
    });
  }, [addSecurity, expMinutes, otpButtonText, onPreviewChange]);

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------

  const onSubmit = async (data: AuthBuilderForm) => {
    setSubmitError(null);

    try {
      setSubmitting(true);

      const components: Record<string, unknown>[] = [
        {
          type: "BODY",
          add_security_recommendation: data.addSecurityRecommendation,
        },
      ];

      if (data.codeExpirationMinutes != null) {
        components.push({
          type: "FOOTER",
          code_expiration_minutes: data.codeExpirationMinutes,
        });
      }

      components.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "OTP",
            otp_type: "COPY_CODE",
            text: data.otpButtonText || "Copy Code",
          },
        ],
      });

      const payload = {
        name: data.name,
        category: "AUTHENTICATION",
        language: data.language,
        wabaId,
        components,
        modifiedBy: user?.userId,
      };

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

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

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

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g. otp_verification"
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
                <Select value={field.value} onValueChange={field.onChange}>
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
        </div>
      </section>

      {/* ---- Section 2: Verification Message (Body) ---- */}
      <section className="space-y-4">
        <SubHeading title="Verification Message" Icon={ShieldCheck} />

        <div className="space-y-3">
          <div className="rounded-md bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 space-y-1">
            <p>
              <code className="rounded bg-gray-200 px-1 text-xs">{"{{1}}"}</code>{" "}
              is your verification code.
            </p>
            {addSecurity && (
              <p className="text-gray-500">
                For your security, do not share this code.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="addSecurityRecommendation"
              render={({ field }) => (
                <Checkbox
                  id="addSecurity"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
              )}
            />
            <Label htmlFor="addSecurity" className="text-sm font-normal cursor-pointer">
              Add security recommendation
            </Label>
          </div>
        </div>
      </section>

      {/* ---- Section 3: Code Expiration (Footer) ---- */}
      <section className="space-y-4">
        <SubHeading title="Code Expiration" Icon={Clock} />

        <div className="space-y-1.5">
          <Label htmlFor="codeExpiration">Expiration Time (minutes)</Label>
          <Input
            id="codeExpiration"
            type="number"
            min={1}
            max={90}
            placeholder="e.g. 10"
            {...register("codeExpirationMinutes", { valueAsNumber: true })}
          />
          {errors.codeExpirationMinutes && (
            <p className="text-xs text-red-500">
              {errors.codeExpirationMinutes.message}
            </p>
          )}
          {expMinutes != null && !isNaN(expMinutes) && (
            <p className="text-xs text-gray-500">
              Will render as: &quot;This code expires in {expMinutes} minutes.&quot;
            </p>
          )}
        </div>
      </section>

      {/* ---- Section 4: OTP Button ---- */}
      <section className="space-y-4">
        <SubHeading title="OTP Button" Icon={Fingerprint} />

        <div className="space-y-3">
          {/* Copy Code — enabled, selected */}
          <div className="rounded-md border-2 border-primary bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium">Copy Code</span>
            </div>
            <p className="text-xs text-gray-500 pl-6">
              User taps button to copy the OTP code
            </p>
            <div className="pl-6 space-y-1.5">
              <Label htmlFor="otpButtonText" className="text-xs">
                Button Label
              </Label>
              <Input
                id="otpButtonText"
                placeholder="Copy Code"
                maxLength={25}
                {...register("otpButtonText")}
              />
              {errors.otpButtonText && (
                <p className="text-xs text-red-500">
                  {errors.otpButtonText.message}
                </p>
              )}
            </div>
          </div>

          {/* One Tap — disabled */}
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300">
                <div className="h-2 w-2 rounded-full bg-transparent" />
              </div>
              <span className="text-sm font-medium text-gray-500">One Tap</span>
              <Badge variant="secondary" className="text-[10px]">
                Coming Soon
              </Badge>
            </div>
            <p className="text-xs text-gray-400 pl-6 mt-1">
              Auto-fill on Android devices
            </p>
          </div>

          {/* Zero Tap — disabled */}
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300">
                <div className="h-2 w-2 rounded-full bg-transparent" />
              </div>
              <span className="text-sm font-medium text-gray-500">Zero Tap</span>
              <Badge variant="secondary" className="text-[10px]">
                Coming Soon
              </Badge>
            </div>
            <p className="text-xs text-gray-400 pl-6 mt-1">
              Automatic verification without user interaction
            </p>
          </div>
        </div>
      </section>

      {/* ---- Section 5: Submit ---- */}
      <div className="flex items-center gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/app/whatsapp/templates/create")}
        >
          Back
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </form>
  );
}
