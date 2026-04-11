"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PageHeading } from "@/components/ui/PageHeading";
import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import TemplateDefaultBuilder from "@/components/whatsapp/TemplateDefaultBuilder";
import TemplateAuthBuilder from "@/components/whatsapp/TemplateAuthBuilder";
import TemplateCarouselBuilder from "@/components/whatsapp/TemplateCarouselBuilder";
import { getWhatsappTemplateById } from "@/lib/api/whatsapp/templates";
import { WhatsappTemplate } from "@/lib/type";

// ---------------------------------------------------------------------------
// Inner component that reads search params (requires Suspense boundary)
// ---------------------------------------------------------------------------

function BuilderContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") as
    | "marketing"
    | "utility"
    | "authentication"
    | null;
  const type = searchParams.get("type") as
    | "default"
    | "otp"
    | "carousel"
    | null;
  const wabaId = searchParams.get("wabaId");
  const editId = searchParams.get("edit");

  // Redirect back to step 1 when required params are missing
  if (!category || !type || !wabaId) {
    redirect("/app/whatsapp/templates/create");
  }

  const isEditMode = !!editId;

  // Fetch template data when editing
  const { data: editTemplateResult, isLoading: editLoading } = useQuery({
    queryKey: ["whatsapp-template", editId],
    queryFn: () => getWhatsappTemplateById(editId!),
    enabled: isEditMode,
  });

  const editTemplate: WhatsappTemplate | undefined = editTemplateResult
    ? Array.isArray(editTemplateResult)
      ? editTemplateResult[0]
      : editTemplateResult
    : undefined;

  // Preview state — default mode (marketing / utility)
  const [defaultPreview, setDefaultPreview] = useState({
    headerType: "none" as "none" | "text" | "image" | "video" | "document" | "location",
    headerValue: "",
    body: "",
    footer: "",
    buttons: [] as { type: string; text: string }[],
  });

  // Preview state — auth mode (authentication)
  const [authPreview, setAuthPreview] = useState({
    authMode: true as const,
    addSecurity: true,
    expirationMinutes: 10 as number | undefined,
    otpButtonText: "Copy Code",
  });

  // Callbacks passed to builders
  const handleDefaultPreviewChange = useCallback(
    (data: {
      headerType: "none" | "text" | "image" | "video" | "document" | "location";
      headerValue: string;
      body: string;
      footer: string;
      buttons: { type: string; text: string }[];
    }) => {
      setDefaultPreview(data);
    },
    [],
  );

  const handleAuthPreviewChange = useCallback(
    (data: {
      authMode: true;
      addSecurity: boolean;
      expirationMinutes: number | undefined;
      otpButtonText: string;
    }) => {
      setAuthPreview(data);
    },
    [],
  );

  const isAuth = category === "authentication";
  const isCarousel = type === "carousel";

  const categoryLabel =
    category.charAt(0).toUpperCase() + category.slice(1);

  // Show loading while fetching template for edit
  if (isEditMode && editLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading template...
      </div>
    );
  }

  return (
    <>
      <PageHeading
        title={isEditMode ? `Edit ${categoryLabel} Template` : `Create ${categoryLabel} Template`}
        subtitle="Configure your template content and preview it live."
      />

      <div className="flex gap-6">
        {/* Builder — takes 2/3 width */}
        <div className="w-2/3 min-w-0">
          {isCarousel ? (
            <TemplateCarouselBuilder />
          ) : isAuth ? (
            <TemplateAuthBuilder
              wabaId={wabaId}
              onPreviewChange={handleAuthPreviewChange}
              initialData={isEditMode ? editTemplate : undefined}
            />
          ) : (
            <TemplateDefaultBuilder
              category={category as "marketing" | "utility"}
              wabaId={wabaId}
              onPreviewChange={handleDefaultPreviewChange}
              initialData={isEditMode ? editTemplate : undefined}
            />
          )}
        </div>

        {/* Live preview — takes 1/3 width, sticky */}
        <div className="w-1/3 min-w-0">
          <div className="sticky top-6">
            {isAuth ? (
              <WhatsappPreview {...authPreview} />
            ) : (
              <WhatsappPreview {...defaultPreview} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page export — wraps BuilderContent in Suspense (required by Next.js for
// useSearchParams)
// ---------------------------------------------------------------------------

export default function TemplateBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-sm text-gray-500">
          Loading builder...
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
