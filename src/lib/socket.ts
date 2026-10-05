"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { WhatsappMessage, AppNotification } from "@/lib/type";

/**
 * The REST base URL points at `.../api/v1`; the Socket.IO server runs at the
 * server root, so strip the API path to get the socket origin.
 */
function socketBaseUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "";
  return api.replace(/\/api\/v\d+\/?$/, "");
}

/**
 * Subscribe to realtime WhatsApp messages for the logged-in user. Connects a
 * JWT-authenticated socket for the component's lifetime and invokes `onMessage`
 * for every inbound or outbound message the backend emits.
 */
export function useWhatsappSocket(onMessage: (msg: WhatsappMessage) => void) {
  const cbRef = useRef(onMessage);
  cbRef.current = onMessage;

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return;

    const socket: Socket = io(socketBaseUrl(), {
      auth: { token },
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("whatsapp:message", (msg: WhatsappMessage) => cbRef.current(msg));

    return () => {
      socket.off("whatsapp:message");
      socket.disconnect();
    };
  }, []);
}

/**
 * Subscribe to realtime in-app notifications for the logged-in user. Uses the
 * same JWT-authenticated socket and per-user room as `useWhatsappSocket`; the
 * backend emits `notification` once per recipient row it writes.
 */
export function useNotificationSocket(
  onNotification: (n: AppNotification) => void
) {
  const cbRef = useRef(onNotification);
  cbRef.current = onNotification;

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return;

    const socket: Socket = io(socketBaseUrl(), {
      auth: { token },
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("notification", (n: AppNotification) => cbRef.current(n));

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, []);
}
