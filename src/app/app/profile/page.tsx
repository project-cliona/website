"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeading } from "@/components/ui/PageHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WabaCard } from "@/components/whatsapp/WabaCard";
import { ConnectWabaCard } from "@/components/whatsapp/ConnectWabaCard";
import { ApiKeysManager } from "@/components/whatsapp/ApiKeysManager";
import { useUser } from "@/providers/userProvider";
import { useWaba } from "@/providers/wabaProvider";
import { disconnectWhatsapp } from "@/lib/api/whatsapp/onboarding";
import { wabaKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getInitials } from "@/lib/utils";
import type { WabaAccount } from "@/lib/type";

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h3">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground truncate">{value || "—"}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, userAuthLoading } = useUser();
  const {
    accounts,
    selectedWabaId,
    setSelectedWabaId,
    isLoading: wabaLoading,
    hasWaba,
  } = useWaba();
  const queryClient = useQueryClient();
  const [pendingDisconnect, setPendingDisconnect] = useState<WabaAccount | null>(
    null
  );

  // Profile data comes from the user provider rather than a fresh request,
  // so there is no window here in which userId is undefined.
  const disconnectMutation = useMutation({
    mutationFn: (wabaId: string) => disconnectWhatsapp(wabaId),
    onSuccess: () => {
      notify.success("WhatsApp account disconnected");
      queryClient.invalidateQueries({ queryKey: wabaKeys.accounts() });
      setPendingDisconnect(null);
    },
    onError: (error: unknown) => {
      notify.error(error, "Could not disconnect the account");
      setPendingDisconnect(null);
    },
  });

  if (userAuthLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  const fullName = profile?.fullName ?? null;

  return (
    <div className="space-y-8">
      <PageHeading
        title="Profile"
        subtitle="Your account details and connected WhatsApp Business Accounts."
      />

      <Section title="Account">
        <Card className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
              {getInitials(fullName, user?.email)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground truncate">
                  {fullName ?? user?.email ?? "Your account"}
                </p>
                {profile?.profileStatus && <Badge>{profile.profileStatus}</Badge>}
              </div>
              <p className="text-small text-muted-foreground truncate">
                {user?.email}
              </p>

              <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                <Field label="Company" value={profile?.companyName} />
                <Field label="Mobile" value={profile?.mobile} />
                <Field
                  label="Location"
                  value={[profile?.city, profile?.state].filter(Boolean).join(", ")}
                />
                <Field label="Currency" value={profile?.currency} />
                <Field
                  label="Member since"
                  value={
                    profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : null
                  }
                />
                <Field label="Website" value={profile?.companyUrl} />
              </dl>
            </div>
          </div>
        </Card>
      </Section>

      <Section
        title={hasWaba ? `WhatsApp accounts (${accounts.length})` : "WhatsApp accounts"}
        action={hasWaba ? <ConnectWabaCard variant="compact" /> : undefined}
      >
        {wabaLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : !hasWaba ? (
          <ConnectWabaCard />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <WabaCard
                key={account.wabaId}
                account={account}
                isSelected={account.wabaId === selectedWabaId}
                onSelect={setSelectedWabaId}
                onDisconnect={setPendingDisconnect}
                disconnecting={
                  disconnectMutation.isPending &&
                  pendingDisconnect?.wabaId === account.wabaId
                }
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="API keys">
        <ApiKeysManager />
      </Section>

      <AlertDialog
        open={!!pendingDisconnect}
        onOpenChange={(open) => !open && setPendingDisconnect(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect this account?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDisconnect?.displayPhoneNumber ?? pendingDisconnect?.wabaId}{" "}
              will stop sending and receiving messages. Its templates, campaigns
              and history stay available to view, and your other accounts are
              unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                pendingDisconnect &&
                disconnectMutation.mutate(pendingDisconnect.wabaId)
              }
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
