"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { WhatsappMessage } from "@/lib/type";
import { refreshAccessToken } from "@/lib/axios";

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
 * for every inbound or outbound message the backend emits. Survives access-token
 * expiry (refresh + reconnect) and calls `onReconnect` after an outage.
 */
export function useWhatsappSocket(
  onMessage: (msg: WhatsappMessage) => void,
  // Called after a dropped connection comes back, to refetch anything missed.
  onReconnect?: () => void,
) {
  const cbRef = useRef(onMessage);
  cbRef.current = onMessage;
  const reconnectRef = useRef(onReconnect);
  reconnectRef.current = onReconnect;

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("accessToken")) return;

    const socket: Socket = io(socketBaseUrl(), {
      // A function, so every (re)connect sends the current token rather than
      // the one captured when the page loaded (it expires after 15 minutes).
      auth: (cb) => cb({ token: localStorage.getItem("accessToken") }),
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
    });

    // Handshake rejected (token expired): refresh, then reconnect. Socket.IO
    // does not auto-retry a middleware rejection. At most one refresh per
    // token, so a server-side failure (also reported as "unauthorized") can't
    // loop refresh -> reject -> refresh.
    let disposed = false;
    let refreshing = false;
    let refreshedForToken: string | null = null;
    socket.on("connect_error", (err) => {
      if (disposed || refreshing || !err.message.startsWith("unauthorized")) return;
      const current = localStorage.getItem("accessToken");
      if (!current || current === refreshedForToken) return;
      refreshing = true;
      refreshAccessToken()
        .then((token) => {
          refreshedForToken = token;
          if (!disposed) socket.connect();
        })
        .catch(() => {
          // Refresh failed: the REST layer decides whether to log out.
        })
        .finally(() => {
          refreshing = false;
        });
    });

    socket.on("whatsapp:message", (msg: WhatsappMessage) => cbRef.current(msg));

    // Messages emitted while disconnected are not replayed, so resync.
    let connectedBefore = false;
    socket.on("connect", () => {
      if (connectedBefore) reconnectRef.current?.();
      connectedBefore = true;
    });

    return () => {
      disposed = true;
      socket.off("connect");
      socket.off("connect_error");
      socket.off("whatsapp:message");
      socket.disconnect();
    };
  }, []);
}
