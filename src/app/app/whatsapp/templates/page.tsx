"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeading } from "@/components/ui/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { useQuery } from "@tanstack/react-query";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import { VariantProps } from "class-variance-authority";
import { WhatsappTemplate } from "@/lib/type";

const columns: ColumnDef<WhatsappTemplate>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
      />
    ),
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
  {
    accessorKey: "name",
    header: "Template Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryVariantMap: Record<
        string,
        VariantProps<typeof badgeVariants>["variant"]
      > = {
        marketing: "pending",
        utility: "active",
        authentication: "default",
      };
      return (
        <Badge variant={categoryVariantMap[category] || "default"}>
          {category}
        </Badge>
      );
    },
    size: 80,
  },
  {
    accessorKey: "language",
    header: "Language",
    size: 60,
  },
  {
    accessorKey: "wabaId",
    header: "WABA ID",
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusVariantMap: Record<
        string,
        VariantProps<typeof badgeVariants>["variant"]
      > = {
        active: "active",
        Active: "active",
        pending: "pending",
        Pending: "pending",
        rejected: "rejected",
        Rejected: "rejected",
      };
      return (
        <Badge variant={statusVariantMap[status] || "default"}>
          {status || "N/A"}
        </Badge>
      );
    },
    size: 70,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
    size: 80,
  },
];

export default function WhatsappTemplatesPage() {
  const { data: templateData, isLoading } = useQuery({
    queryKey: ["whatsapp-templates"],
    queryFn: fetchWhatsappTemplates,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeading
          title="Templates"
          subtitle="Manage your WhatsApp message templates"
        />
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeading
        title="Templates"
        subtitle="Manage your WhatsApp message templates"
      />
      <DataTable<WhatsappTemplate>
        incomingData={templateData ?? []}
        columns={columns}
        filterPlaceHolder="Filter with template name"
        buttonTitle="Add template"
        navigateTo="templates/create"
        rowNavigate="app/whatsapp/templates"
      />
    </div>
  );
}
