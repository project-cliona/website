"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { useQuery } from "@tanstack/react-query";
import { getWhatsappTemplateById } from "@/lib/api/whatsapp/templates";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";
import { ArrowLeft, Copy, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";

const categoryVariantMap: Record<
  string,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  marketing: "pending",
  utility: "active",
  authentication: "default",
};

const statusVariantMap: Record<
  string,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  APPROVED: "active",
  approved: "active",
  PENDING: "pending",
  pending: "pending",
  REJECTED: "rejected",
  rejected: "rejected",
  DISABLED: "rejected",
  PAUSED: "pending",
  IN_APPEAL: "pending",
};

const EDITABLE_STATUSES = ["APPROVED", "REJECTED", "PAUSED", "approved", "rejected", "paused"];

export default function WhatsappTemplateDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: templateResult, isLoading } = useQuery({
    queryKey: ["whatsapp-template", id],
    queryFn: () => getWhatsappTemplateById(id),
    enabled: !!id,
  });

  const template = Array.isArray(templateResult)
    ? templateResult[0]
    : templateResult;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeading title="Template Detail" />
        <TableSkeleton rows={6} columns={3} />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="space-y-8">
        <PageHeading title="Template Not Found" />
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">
            The template you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/app/whatsapp/templates"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  // Extract components for display and preview
  const components = Array.isArray(template.components)
    ? template.components
    : [];

  let previewBody = "";
  let previewHeaderType: "none" | "text" | "image" | "video" | "document" | "location" = "none";
  let previewHeaderValue = "";
  let previewFooter = "";
  let previewButtons: { type: string; text: string }[] = [];

  for (const comp of components as Record<string, any>[]) {
    const t = (comp.type || "").toUpperCase();
    if (t === "BODY") previewBody = comp.text || "";
    if (t === "HEADER") {
      const fmt = ((comp.format || "text").toLowerCase());
      previewHeaderType = fmt as typeof previewHeaderType;
      if (fmt === "text") {
        previewHeaderValue = comp.text || "";
      } else {
        // Prefer the persisted Supabase URL on the template row — Meta's
        // header_handle is opaque and not fetchable client-side.
        previewHeaderValue =
          template.headerMediaUrl ||
          comp.preview_url ||
          comp.example?.header_url?.[0] ||
          "";
      }
    }
    if (t === "FOOTER") previewFooter = comp.text || "";
    if (t === "BUTTONS" && Array.isArray(comp.buttons)) {
      previewButtons = comp.buttons.map((b: Record<string, string>) => ({
        type: b.type,
        text: b.text || (b.type === "COPY_CODE" ? "Copy offer code" : "Button"),
      }));
    }
  }

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString() : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/app/whatsapp/templates"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Link>
        {template.status && EDITABLE_STATUSES.includes(template.status) && (
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/app/whatsapp/templates/create/builder?category=${template.category}&type=default&wabaId=${template.wabaId}&edit=${template.id}`
              )
            }
          >
            <Pencil className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
            Edit Template
          </Button>
        )}
      </div>

      <PageHeading title={template.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details + Components (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Template Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Name", value: template.name },
                {
                  label: "Category",
                  value: (
                    <Badge variant={categoryVariantMap[template.category] || "default"}>
                      {template.category}
                    </Badge>
                  ),
                },
                { label: "Language", value: template.language },
                {
                  label: "Parameter Format",
                  value: template.parameterFormat || "positional",
                },
                {
                  label: "WABA ID",
                  value: (
                    <span className="font-mono text-xs">{template.wabaId}</span>
                  ),
                },
                {
                  label: "Meta Template ID",
                  value: template.metaTemplateId ? (
                    <span className="font-mono text-xs flex items-center gap-1">
                      {template.metaTemplateId}
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(template.metaTemplateId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </span>
                  ) : (
                    "N/A"
                  ),
                },
                {
                  label: "Status",
                  value: (
                    <Badge
                      variant={statusVariantMap[template.status ?? ""] || "default"}
                    >
                      {template.status || "N/A"}
                    </Badge>
                  ),
                },
                {
                  label: "Rejection Reason",
                  value:
                    template.rejectionReason && template.rejectionReason !== "NONE"
                      ? template.rejectionReason
                      : "—",
                },
                { label: "Created", value: formatDate(template.createdAt) },
                { label: "Updated", value: formatDate(template.updatedAt) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-gray-50 last:border-b-0"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Components */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Message Components
            </h3>
            {components.length === 0 ? (
              <p className="text-sm text-gray-500">
                No components data available.
              </p>
            ) : (
              <div className="space-y-4">
                {(components as Record<string, any>[]).map(
                  (comp, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">
                          {(comp.type || "").toUpperCase()}
                        </Badge>
                        {comp.format && (
                          <span className="text-xs text-gray-500">
                            ({comp.format})
                          </span>
                        )}
                      </div>
                      {comp.text && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {comp.text}
                        </p>
                      )}
                      {/* Example values */}
                      {comp.example && (
                        <div className="mt-2 bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-500 mb-1">
                            Example values:
                          </p>
                          <pre className="text-xs text-gray-600 overflow-x-auto">
                            {JSON.stringify(comp.example, null, 2)}
                          </pre>
                        </div>
                      )}
                      {/* Buttons */}
                      {comp.buttons && Array.isArray(comp.buttons) && (
                        <div className="mt-2 space-y-1">
                          {comp.buttons.map((btn: any, btnIdx: number) => (
                            <div
                              key={btnIdx}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {btn.type}
                              </span>
                              <span>{btn.text || (btn.type === "COPY_CODE" ? "Copy offer code" : "")}</span>
                              {btn.url && (
                                <span className="text-xs text-blue-500 truncate max-w-xs">
                                  {btn.url}
                                </span>
                              )}
                              {btn.phone_number && (
                                <span className="text-xs text-green-600">
                                  {btn.phone_number}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: WhatsApp Preview (1/3) */}
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
    </div>
  );
}
