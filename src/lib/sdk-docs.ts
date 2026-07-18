// ─── Squalto Node.js SDK — documentation content ───────────────────────────
// Structured, data-driven docs for the /docs/sdk page. Mirrors the design
// language of the marketing site (see src/lib/marketing.ts). Code samples track
// the real @squalto/sdk public API.

export interface CodeSample {
  lang: string;
  code: string;
  filename?: string;
}

export type DocBlock =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; sample: CodeSample }
  | { type: "note"; text: string }
  | { type: "subheading"; text: string };

export interface DocSection {
  id: string;
  title: string;
  blocks: DocBlock[];
}

export const SDK_META = {
  name: "@squalto/sdk",
  version: "0.1.0",
  tagline:
    "The official Node.js SDK for the Squalto WhatsApp Business Platform — typed, zero-dependency, production-ready.",
  install: "npm install @squalto/sdk",
  runtimes: "Node 18, 20, 22 · ESM + CJS · TypeScript types included",
};

export const SDK_SECTIONS: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      {
        type: "text",
        text: "@squalto/sdk is a typed client for the Squalto REST API. It replaces hand-rolled HTTP calls with a clean, Twilio-style interface that handles authentication, retries, idempotency, auto-pagination, typed errors, and webhook verification out of the box.",
      },
      {
        type: "text",
        text: "The SDK talks to Squalto — not to Meta directly. Squalto wraps the WhatsApp Cloud API server-side, so you never manage Meta access tokens or phone-number ids.",
      },
      {
        type: "list",
        items: [
          "Zero runtime dependencies, tree-shakeable, and fully typed.",
          "Automatic retries with exponential backoff on transient failures.",
          "Idempotency keys on message and campaign sends to prevent duplicates.",
          "Auto-paginating list methods you can iterate with for await.",
          "First-class webhook signature verification and typed parsing.",
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    blocks: [
      {
        type: "text",
        text: "Install the package from npm. The SDK ships both ESM and CommonJS builds along with TypeScript declarations, and supports Node 18 and above.",
      },
      {
        type: "code",
        sample: { lang: "bash", code: "npm install @squalto/sdk\n# or: pnpm add @squalto/sdk\n# or: yarn add @squalto/sdk" },
      },
    ],
  },
  {
    id: "authentication",
    title: "Authentication",
    blocks: [
      {
        type: "text",
        text: "Authenticate with an account SID (AC…) and an auth token (SK… secret) from your Squalto dashboard. Construct the client once and reuse it across your application.",
      },
      {
        type: "code",
        sample: {
          lang: "typescript",
          filename: "client.ts",
          code: `import { Squalto } from "@squalto/sdk";

export const squalto = new Squalto(
  process.env.SQUALTO_ACCOUNT_SID!,
  process.env.SQUALTO_AUTH_TOKEN!,
);`,
        },
      },
      {
        type: "note",
        text: "Never hard-code your auth token or expose it in client-side code. Load it from an environment variable or secret manager.",
      },
    ],
  },
  {
    id: "quickstart",
    title: "Quickstart",
    blocks: [
      {
        type: "text",
        text: "Send your first message in under a minute. Template messages can be delivered at any time; free-form text replies are only deliverable inside the 24-hour customer service window.",
      },
      {
        type: "code",
        sample: {
          lang: "typescript",
          filename: "send.ts",
          code: `import { squalto } from "./client";

// Send an approved template (deliverable any time)
const message = await squalto.whatsapp.messages.create({
  to: "+15551234567",
  templateName: "order_update",
  variables: { "1": "Alice", "2": "#1234" },
});

console.log(message.id, message.status); // e.g. "msg_…", "accepted"

// Send a free-form reply (inside the 24h service window)
await squalto.whatsapp.messages.sendText({
  to: "+15551234567",
  body: "Thanks for your order! 🎉",
});`,
        },
      },
    ],
  },
  {
    id: "pagination",
    title: "Auto-pagination",
    blocks: [
      {
        type: "text",
        text: "Every list method returns an async iterable that transparently walks pages for you. Iterate the whole collection with for await, or fetch a single page manually.",
      },
      {
        type: "code",
        sample: {
          lang: "typescript",
          code: `// Iterate every matching contact across all pages
for await (const contact of squalto.whatsapp.contacts.list({ tag: "vip" })) {
  console.log(contact.phone);
}

// Or fetch a single 1-indexed page
const page = await squalto.whatsapp.contacts.list().page(1);
console.log(page.data, page.total);

// Or collect everything into an array
const all = await squalto.whatsapp.contacts.list().all();`,
        },
      },
    ],
  },
  {
    id: "errors",
    title: "Error handling",
    blocks: [
      {
        type: "text",
        text: "Failed requests throw a typed error subclass so you can branch on the failure mode. All API errors extend SqualtoApiError; transport failures throw SqualtoConnectionError.",
      },
      {
        type: "code",
        sample: {
          lang: "typescript",
          code: `import { ValidationError, RateLimitError } from "@squalto/sdk";

try {
  await squalto.whatsapp.messages.sendText({ to: "bad", body: "hi" });
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(err.errors); // field-level detail
  } else if (err instanceof RateLimitError) {
    console.error(\`Retry after \${err.retryAfter}s\`);
  } else {
    throw err;
  }
}`,
        },
      },
      {
        type: "subheading",
        text: "Error classes",
      },
      {
        type: "list",
        items: [
          "AuthenticationError — 401, missing or invalid API key.",
          "ValidationError — 422, request failed validation (see .errors).",
          "NotFoundError — 404, the resource does not exist.",
          "ConflictError — 409, conflicts with current state.",
          "RateLimitError — 429, includes .retryAfter (seconds).",
          "ApiError — any other 4xx/5xx response.",
          "SqualtoConnectionError — the request never reached the API.",
        ],
      },
      {
        type: "note",
        text: "Retries are automatic. The SDK retries 429 and 5xx responses (and transport errors) with exponential backoff and jitter, honoring the Retry-After header. Only after retries are exhausted does the error surface to your code.",
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    blocks: [
      {
        type: "text",
        text: "Verify inbound webhooks with a constant-time HMAC-SHA256 check over the raw request body, then parse the payload into a typed, discriminated union. Capture the raw body before any JSON body parser runs.",
      },
      {
        type: "code",
        sample: {
          lang: "typescript",
          filename: "webhook.ts",
          code: `import express from "express";
import { Squalto } from "@squalto/sdk";

const squalto = new Squalto(sid, token, {
  webhookSigningSecret: process.env.SQUALTO_WEBHOOK_SECRET,
});
const app = express();

app.post(
  "/webhooks/squalto",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const valid = squalto.webhooks.validateSignature(
      req.body,
      req.get("X-Hub-Signature-256"),
    );
    if (!valid) return res.sendStatus(401);

    res.sendStatus(200); // ack immediately, then process

    const event = squalto.webhooks.parse(req.body);
    switch (event.type) {
      case "message":           /* inbound customer message */ break;
      case "status":            /* delivery receipt */          break;
      case "template_status":   /* Meta approval / rejection */ break;
      case "template_category": /* category change */           break;
    }
  },
);`,
        },
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    blocks: [
      {
        type: "text",
        text: "Pass an options object as the third constructor argument to tune the client. All fields are optional.",
      },
      {
        type: "code",
        sample: {
          lang: "typescript",
          code: `new Squalto(accountSid, authToken, {
  baseUrl: "https://api.squalto.com/api/v1", // or set SQUALTO_BASE_URL
  timeout: 30_000,          // per-request timeout in ms
  maxRetries: 3,            // retries on 429 / 5xx / transport errors
  fetch: globalThis.fetch,  // inject a custom fetch (tests, proxies)
  webhookSigningSecret: "…",
});`,
        },
      },
    ],
  },
  {
    id: "api-reference",
    title: "API reference",
    blocks: [
      {
        type: "text",
        text: "The WhatsApp service is exposed under client.whatsapp, with webhook helpers under client.webhooks. Full method signatures ship with the TypeScript declarations.",
      },
      {
        type: "list",
        items: [
          "messages — sendText, create, list, get",
          "templates — create, list, update",
          "campaigns — create, list, get, listMessages, cancel",
          "contacts — create, get, update, delete, list, bulkDelete, addToList, removeFromList, import, export",
          "lists — create, list, update, delete",
          "tags — list",
          "audience — preview",
          "media — upload",
          "conversations — list, listMessages, markRead",
          "webhooks — validateSignature, parse",
        ],
      },
    ],
  },
];
