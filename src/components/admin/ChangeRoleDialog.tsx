"use client";

import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { updateUserRole } from "@/lib/api/admin/users";
import { changeRoleSchema, type ChangeRoleInput } from "@/lib/schema/admin.schema";
import { ROLE_ADMIN, ROLE_RESELLER, ROLE_CLIENT, ROLE_LABEL, type Role } from "@/lib/rbac";
import type { AdminUserRow } from "@/lib/type";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: AdminUserRow;
  allUsers: AdminUserRow[];
}

export function ChangeRoleDialog({ open, onOpenChange, row, allUsers }: ChangeRoleDialogProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChangeRoleInput>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      roleId: row.roleId,
      parentId: row.parentId,
    },
  });

  useEffect(() => {
    reset({ roleId: row.roleId, parentId: row.parentId });
  }, [row, reset]);

  const selectedRole = watch("roleId") as Role;
  const watchedParentId = watch("parentId");

  const eligibleParents = useMemo(() => {
    if (selectedRole === ROLE_ADMIN) return [];
    if (selectedRole === ROLE_RESELLER) {
      return allUsers.filter((u) => u.roleId === ROLE_ADMIN && u.userId !== row.userId);
    }
    return allUsers.filter(
      (u) => (u.roleId === ROLE_ADMIN || u.roleId === ROLE_RESELLER) && u.userId !== row.userId
    );
  }, [selectedRole, allUsers, row.userId]);

  useEffect(() => {
    if (selectedRole === ROLE_ADMIN) {
      setValue("parentId", null, { shouldValidate: true });
      return;
    }
    if (watchedParentId === null && eligibleParents.length > 0) {
      setValue("parentId", eligibleParents[0].userId, { shouldValidate: true });
    }
  }, [selectedRole, eligibleParents, setValue, watchedParentId]);

  const mutation = useMutation({
    mutationFn: (body: ChangeRoleInput) => updateUserRole(row.userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(`${row.email}: role updated`);
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e?.response?.data?.message ?? "Could not update role";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ChangeRoleInput) => {
    mutation.mutate(data);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Change role — {row.email}</AlertDialogTitle>
            <AlertDialogDescription>
              Update this user&apos;s role and parent. Demotions are atomic; the last admin cannot be demoted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                control={control}
                name="roleId"
                render={({ field }) => (
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value) as Role)}
                  >
                    <option value={ROLE_ADMIN}>{ROLE_LABEL[ROLE_ADMIN]}</option>
                    <option value={ROLE_RESELLER}>{ROLE_LABEL[ROLE_RESELLER]}</option>
                    <option value={ROLE_CLIENT}>{ROLE_LABEL[ROLE_CLIENT]}</option>
                  </select>
                )}
              />
            </div>

            {selectedRole !== ROLE_ADMIN && (
              <div className="space-y-2">
                <Label>Parent</Label>
                <Controller
                  control={control}
                  name="parentId"
                  render={({ field }) => (
                    <select
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                    >
                      {eligibleParents.length === 0 && (
                        <option value="">No eligible parents</option>
                      )}
                      {eligibleParents.map((p) => (
                        <option key={p.userId} value={p.userId}>
                          {p.email} ({ROLE_LABEL[p.roleId]})
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.parentId && (
                  <p className="text-xs text-destructive">{errors.parentId.message}</p>
                )}
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
