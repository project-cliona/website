"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeading } from "@/components/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { useQuery } from "@tanstack/react-query";
import { fetchTemplates } from "@/lib/api/rcs/templates";
import { VariantProps } from "class-variance-authority";
import { RCSTemplate } from "@/lib/type";


const multiColumnFilterFn = (row: any, _columnId: string, value: string) => {
  const search = value.toLowerCase();
  return `${row.original.name} ${row.original.email}`
    .toLowerCase()
    .includes(search);
};

const statusFilterFn = (row: any, columnId: string, value: string[]) => {
  if (!value?.length) return true;
  return value.includes(row.getValue(columnId));
};

const columns: ColumnDef<RCSTemplate>[] = [
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
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
  {
    accessorKey: "name",
    header: "Template Name",
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 80,
  },
  {
    accessorKey: "templateType",
    header: "Template Type",
    size: 120,
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    size: 120,
  },
   {
    accessorKey: "agentID",
    header: "Agent ID",
    size: 120,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: statusFilterFn,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusVariantMap: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
        Active: "active",
        Pending: "pending",
        Inactive: "inactive",
        Rejected: "rejected",
        Default: "default",
      };

      return (
        <Badge variant={statusVariantMap[status] || "default"}>
          {status}
        </Badge>
      );
    },
    size: 70,
  },
];

/* ---------------- Component ---------------- */

export default function UsersTable() {
  const userId = 2;

  const { data: templateData, isLoading, error } = useQuery({
    queryKey: ["templates", userId],
    queryFn: () => fetchTemplates(userId),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeading
          title="Agents"
          subtitle="Overview and manage all active and inactive agents in your dashboard"
        />
        <TableSkeleton rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeading
        title="Templates"
        subtitle="Overview and manage your templates"
      />
      <DataTable<RCSTemplate> incomingData={templateData ?? []} columns={columns} filterPlaceHolder="Filter with template name" buttonTitle="Add template" navigateTo="templates/create" rowNavigate="app/rcs/templates"/>
    </div>
  );
}
