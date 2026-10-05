"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWaba } from "@/providers/wabaProvider";
import { wabaKeys } from "@/lib/queryKeys";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { ConversationList } from "@/components/whatsapp/ConversationList";
import { ConversationThread } from "@/components/whatsapp/ConversationThread";
import { NewChatModal } from "@/components/whatsapp/NewChatModal";
import {
  fetchConversations,
  fetchThread,
  markConversationRead,
  sendTextReply,
} from "@/lib/api/whatsapp/conversations";
import { useWhatsappSocket } from "@/lib/socket";
import { notify } from "@/lib/toast";
import type { WhatsappMessage } from "@/lib/type";

export default function WhatsappConversationsPage() {
  const qc = useQueryClient();
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);

  const { selectedWabaId, isReadOnly } = useWaba();

  const { data: conversations = [], isLoading: loadingList } = useQuery({
    queryKey: wabaKeys.conversations(selectedWabaId ?? ""),
    queryFn: () => fetchConversations(selectedWabaId!),
    enabled: !!selectedWabaId,
  });

  const { data: messages = [], isLoading: loadingThread } = useQuery({
    queryKey: wabaKeys.thread(selectedWabaId ?? "", selectedPhone ?? ""),
    queryFn: () => fetchThread(selectedPhone as string, selectedWabaId!),
    enabled: !!selectedPhone,
  });

  // Realtime: any inbound/outbound message refreshes the list and the open thread.
  const onSocketMessage = useCallback(
    (msg: WhatsappMessage) => {
      qc.invalidateQueries({ queryKey: wabaKeys.conversations(selectedWabaId ?? "") });
      qc.invalidateQueries({ queryKey: wabaKeys.thread(selectedWabaId ?? "", msg.recipientPhone) });
    },
    [qc],
  );
  useWhatsappSocket(onSocketMessage);

  const markReadMut = useMutation({
    mutationFn: (phone: string) => markConversationRead(phone, selectedWabaId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wa-conversations"] }),
  });

  const replyMut = useMutation({
    mutationFn: (text: string) =>
      sendTextReply({ to: selectedPhone as string, text, wabaId: selectedWabaId! }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wabaKeys.thread(selectedWabaId ?? "", selectedPhone ?? "") });
      qc.invalidateQueries({ queryKey: wabaKeys.conversations(selectedWabaId ?? "") });
    },
    onError: (err) => notify.error(err, "Could not send message"),
  });

  const selectConversation = (phone: string, name: string | null) => {
    setSelectedPhone(phone);
    setSelectedName(name);
    markReadMut.mutate(phone);
  };

  const onSelectFromList = (phone: string) => {
    const conv = conversations.find((c) => c.contactPhone === phone);
    selectConversation(phone, conv?.contactName ?? null);
  };

  return (
    <div className="space-y-4">
      <PageHeading
        title="Conversations"
        subtitle="Chat with customers who message your WhatsApp number"
        actions={
          <Button onClick={() => setNewChatOpen(true)}>
            <MessageSquarePlus className="h-4 w-4" /> New chat
          </Button>
        }
      />

      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 overflow-hidden rounded-lg border border-border bg-card shadow-e1 lg:grid-cols-12">
        <div className="hidden border-r border-border lg:col-span-4 lg:block">
          <ConversationList
            conversations={conversations}
            loading={loadingList}
            selectedPhone={selectedPhone}
            search={search}
            onSearch={setSearch}
            onSelect={onSelectFromList}
          />
        </div>

        <div className="lg:col-span-8">
          {selectedPhone ? (
            <ConversationThread
              phone={selectedPhone}
              contactName={selectedName}
              messages={messages}
              loading={loadingThread}
              sending={replyMut.isPending}
              onSend={(text) => replyMut.mutate(text)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MessagesSquare className="h-10 w-10" />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onStart={(phone, name) => selectConversation(phone, name)}
      />
    </div>
  );
}
