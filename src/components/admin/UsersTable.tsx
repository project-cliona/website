"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/lib/api/admin/users";
import { useUser } from "@/providers/userProvider";
import { ROLE_ADMIN, ROLE_LABEL } from "@/lib/rbac";
import type { AdminUserRow } from "@/lib/type";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { ChangeRoleDialog } from "./ChangeRoleDialog";

export function UsersTable() {
  const { user } = useUser();
  const [selected, setSelected] = useState<AdminUserRow | null>(null);

  const { data: rows = [], isLoading } = useQuery<AdminUserRow[]>({
    queryKey: ["adminUsers"],
    queryFn: listUsers,
  });

  const adminCount = useMemo(
    () => rows.filter((r) => r.roleId === ROLE_ADMIN).length,
    [rows]
  );

  const parentEmail = (parentId: number | null) => {
    if (parentId === null) return "—";
    const parent = rows.find((r) => r.userId === parentId);
    return parent ? parent.email : `#${parentId}`;
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Parent</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isOwnRow = row.userId === user?.userId;
              const isLastAdmin = row.roleId === ROLE_ADMIN && adminCount === 1;

              return (
                <tr key={row.userId} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{row.email}</td>
                  <td className="px-4 py-2">{row.fullName ?? "—"}</td>
                  <td className="px-4 py-2">{ROLE_LABEL[row.roleId]}</td>
                  <td className="px-4 py-2">{parentEmail(row.parentId)}</td>
                  <td className="px-4 py-2 capitalize">{row.profileStatus}</td>
                  <td className="px-4 py-2 text-right">
                    {isOwnRow ? null : isLastAdmin ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button size="sm" variant="ghost" disabled>
                                Change role
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Can&apos;t demote the last admin.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelected(row)}
                      >
                        Change role
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted-foreground py-8">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <ChangeRoleDialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          row={selected}
          allUsers={rows}
        />
      )}
    </>
  );
}
