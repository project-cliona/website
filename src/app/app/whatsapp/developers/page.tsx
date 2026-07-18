import Link from "next/link";
import { BookOpen, Boxes, Terminal } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ApiKeysManager } from "@/components/whatsapp/ApiKeysManager";

const INSTALL = "npm install @squalto/sdk";

const QUICKSTART = `import { Squalto } from "@squalto/sdk";

const client = new Squalto(
  process.env.SQUALTO_ACCOUNT_SID!, // your Key ID (SK…)
  process.env.SQUALTO_AUTH_TOKEN!,  // your secret
);

// Send an approved template
await client.whatsapp.messages.create({
  to: "+15551234567",
  templateName: "order_update",
  variables: { "1": "Alice", "2": "#1234" },
});`;

export default function DevelopersPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="API Management"
        title="Developers"
        subtitle="Everything you need to integrate Squalto into your app — API keys, the Node.js SDK, and quickstart guides."
        actions={
          <Button variant="outline" asChild>
            <Link href="/docs/sdk" target="_blank">
              <BookOpen className="h-4 w-4" />
              Full documentation
            </Link>
          </Button>
        }
      />

      {/* Getting started */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              1. Install the SDK
            </CardTitle>
            <CardDescription>
              A typed, zero-dependency Node.js client. Requires Node 18+.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={INSTALL} lang="bash" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              2. Authenticate &amp; send
            </CardTitle>
            <CardDescription>
              Create an API key below, then use it as your credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={QUICKSTART} lang="typescript" filename="send.ts" />
          </CardContent>
        </Card>
      </div>

      {/* API keys */}
      <ApiKeysManager />

      {/* Help footer */}
      <Card>
        <CardHeader>
          <CardTitle>Need more?</CardTitle>
          <CardDescription>
            The full SDK reference covers auto-pagination, typed errors, retries,
            idempotency, and webhook verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/docs/sdk" target="_blank">
              Read the docs
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/docs/sdk#webhooks" target="_blank">
              Webhook setup
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/docs/sdk#errors" target="_blank">
              Error handling
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
