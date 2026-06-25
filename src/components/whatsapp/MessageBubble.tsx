import { cn } from "@/lib/utils";
import { getMessageText } from "@/lib/api/whatsapp/conversations";
import type { WhatsappMessage } from "@/lib/type";

function formatTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABEL: Record<string, string> = {
  accepted: "✓",
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
  failed: "✕ failed",
};

export function MessageBubble({ message }: { message: WhatsappMessage }) {
  const outbound = message.direction === "outbound";
  const text = getMessageText(message);

  return (
    <div className={cn("flex w-full", outbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-e1",
          outbound
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card text-card-foreground border border-border rounded-bl-sm",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            outbound ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {outbound && (
            <span className={cn(message.status === "read" && "text-sky-300")}>
              {STATUS_LABEL[message.status] ?? ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
