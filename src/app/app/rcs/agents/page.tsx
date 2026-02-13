"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Table";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeading } from "@/components/PageHeading";
import { fetchAgents } from "@/lib/api/rcs/agents";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { VariantProps } from "class-variance-authority";
import { Agent } from "@/lib/type";

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

const columns: ColumnDef<Agent>[] = [
  {
    id: "id",
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
    header: "Agent Name",
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 60,
  },
  {
    accessorKey: "billingcategory",
    header: "Category",
    size: 70,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 120,
  },
  {
    accessorKey: "agentdescription",
    header: "Description",
    size: 150,
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
  {
    accessorKey: "phoneno",
    header: "Phone No.",
    size: 80,
  },
];

export default function UsersTable() {
  const userId = 2;

  const { data: agentData, isLoading, error } = useQuery({
    queryKey: ["agents", userId],
    queryFn: () => fetchAgents(userId),
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
        title="Agents"
        subtitle="Overview and manage all active and inactive agents in your dashboard"
      />
      <DataTable<Agent> incomingData={agentData ?? []} columns={columns} buttonTitle={"Add agent"} navigateTo="agents/create" rowNavigate="app/rcs/agents"/>
    </div>
  );
}
