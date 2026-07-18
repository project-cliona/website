"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
}

/**
 * Dark, copyable code block for the docs. No syntax-highlighting dependency —
 * uses a monospace <pre> with a copy-to-clipboard button, matching the site's
 * design tokens.
 */
export function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#21262D", backgroundColor: "#0D1117" }}>
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "#21262D", backgroundColor: "#161B22" }}
      >
        <span className="text-[11px] font-mono text-gray-500">
          {filename ?? lang ?? "code"}
        </span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code className="font-mono text-gray-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
