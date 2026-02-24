"use client";

import { PageHeading } from "@/components/PageHeading";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { useQuery } from "@tanstack/react-query";
import { getWhatsappTemplateById } from "@/lib/api/whatsapp/templates";
import { useParams } from "next/navigation";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";
import { ArrowLeft } from "lucide-react";

export default function WhatsappTemplateDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data: templateResult, isLoading } = useQuery({
    queryKey: ["whatsapp-template", id],
    queryFn: () => getWhatsappTemplateById(id),
    enabled: !!id,
  });

  // The API returns an array; take the first item
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
    active: "active",
    pending: "pending",
    rejected: "rejected",
  };

  const components = Array.isArray(template.components)
    ? template.components
    : [];

  return (
    <div className="space-y-6">
      <Link
        href="/app/whatsapp/templates"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Templates
      </Link>

      <PageHeading title={template.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Template Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium text-gray-900">
                {template.name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Category</span>
              <Badge variant={categoryVariantMap[template.category] || "default"}>
                {template.category}
              </Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Language</span>
              <span className="text-sm font-medium text-gray-900">
                {template.language}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">WABA ID</span>
              <span className="text-sm font-medium text-gray-900">
                {template.wabaId}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Status</span>
              <Badge
                variant={
                  statusVariantMap[template.status ?? ""] || "default"
                }
              >
                {template.status || "N/A"}
              </Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Created At</span>
              <span className="text-sm font-medium text-gray-900">
                {template.createdAt
                  ? new Date(template.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Updated At</span>
              <span className="text-sm font-medium text-gray-900">
                {template.updatedAt
                  ? new Date(template.updatedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
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
              {components.map((comp: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">{comp.type}</Badge>
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
                          <span>{btn.text}</span>
                          {btn.url && (
                            <span className="text-xs text-blue-500">
                              {btn.url}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
