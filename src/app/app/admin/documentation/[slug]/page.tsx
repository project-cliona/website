"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { RequireRole } from "@/components/auth/RequireRole";
import { ROLE_ADMIN } from "@/lib/rbac";
import { Card } from "@/components/ui/Card";
import { getDocMeta, loadDocHtml } from "@/lib/docs/registry";

// Injected into every doc so the iframe reports its own height. Runs in the
// iframe's opaque (sandboxed) origin — it can postMessage to the parent but
// cannot read the parent DOM or localStorage. This is why doc content can stay
// pure HTML/CSS and why the iframe never needs `allow-same-origin`.
const HEIGHT_BRIDGE = `<script>(function(){
  function send(){ try { parent.postMessage({ type: "cliona-doc-height", height: document.body.scrollHeight }, "*"); } catch (e) {} }
  if (typeof ResizeObserver !== "undefined") { new ResizeObserver(send).observe(document.body); }
  window.addEventListener("load", send);
  window.addEventListener("resize", send);
  send();
})();<\/script>`;

function withHeightBridge(html: string): string {
  return html.includes("</body>")
    ? html.replace("</body>", `${HEIGHT_BRIDGE}</body>`)
    : html + HEIGHT_BRIDGE;
}

function DocViewer({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);

  // The doc renders in a script-sandboxed iframe (opaque origin, no
  // `allow-same-origin`) so its styles never collide with the app theme and a
  // doc can never reach the parent's DOM or token. The injected bridge posts
  // its content height back so we can size the frame and scroll the page as one.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      if (e.data?.type === "cliona-doc-height" && typeof e.data.height === "number") {
        setHeight(e.data.height);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      title="Documentation"
      srcDoc={withHeightBridge(html)}
      sandbox="allow-scripts"
      className="w-full rounded-lg border border-border bg-white"
      style={{ height }}
    />
  );
}

function NotFound() {
  return (
    <Card className="p-10 text-center">
      <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="text-h3 text-foreground mt-3">Document not found</h3>
      <p className="text-small text-muted-foreground mt-1">
        This guide doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/app/admin/documentation"
        className="text-small text-primary-700 hover:underline mt-4 inline-block focus-ring rounded"
      >
        Back to documentation
      </Link>
    </Card>
  );
}

export default function DocumentationDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const meta = getDocMeta(slug);

  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadDocHtml(slug)
      .then((content) => {
        if (!cancelled) setHtml(content);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <RequireRole roles={[ROLE_ADMIN]}>
      <div className="space-y-5">
        <Link
          href="/app/admin/documentation"
          className="inline-flex items-center gap-1.5 text-small text-muted-foreground hover:text-foreground transition-colors focus-ring rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Documentation
        </Link>

        {!meta ? (
          <NotFound />
        ) : (
          <>
            <div>
              <h1 className="text-h1 text-foreground">{meta.title}</h1>
              <p className="text-small text-muted-foreground mt-1.5 max-w-2xl">
                {meta.description}
              </p>
            </div>

            {loading ? (
              <Card className="p-10 text-center text-small text-muted-foreground">
                Loading…
              </Card>
            ) : html ? (
              <DocViewer html={html} />
            ) : (
              <NotFound />
            )}
          </>
        )}
      </div>
    </RequireRole>
  );
}
