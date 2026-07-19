"use client";

import Link from "next/link";
import { BookOpen, Boxes, Plug, Wrench, ArrowRight } from "lucide-react";
import { RequireRole } from "@/components/auth/RequireRole";
import { ROLE_ADMIN } from "@/lib/rbac";
import { PageHeading } from "@/components/ui/PageHeading";
import { Card } from "@/components/ui/Card";
import { docsByCategory, type DocCategory, type DocMeta } from "@/lib/docs/registry";

const CATEGORY_ICON: Record<DocCategory, typeof BookOpen> = {
  Architecture: Boxes,
  Integrations: Plug,
  Operations: Wrench,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function DocCard({ doc }: { doc: DocMeta }) {
  const Icon = CATEGORY_ICON[doc.category] ?? BookOpen;
  return (
    <Link href={`/app/admin/documentation/${doc.slug}`} className="block focus-ring rounded-lg">
      <Card variant="interactive" className="h-full p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
            <Icon className="h-5 w-5" />
          </span>
          <span className="text-caption text-muted-foreground">{doc.category}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-h3 text-foreground">{doc.title}</h3>
          <p className="text-small text-muted-foreground mt-1.5">{doc.description}</p>
        </div>
        <div className="flex items-center justify-between text-caption text-muted-foreground">
          <span>Updated {formatDate(doc.updatedAt)}</span>
          <span className="flex items-center gap-1 text-primary-700">
            Read <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function DocumentationPage() {
  const groups = docsByCategory();

  return (
    <RequireRole roles={[ROLE_ADMIN]}>
      <div className="space-y-8">
        <PageHeading
          title="Documentation"
          subtitle="Internal guides on how the platform works — credentials, integrations, and operations. Admin only."
        />

        {groups.length === 0 ? (
          <Card className="p-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="text-h3 text-foreground mt-3">No documentation yet</h3>
            <p className="text-small text-muted-foreground mt-1">
              Guides added to the docs registry will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.category} className="space-y-3">
                <h2 className="text-caption text-muted-foreground">{group.category}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((doc) => (
                    <DocCard key={doc.slug} doc={doc} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  );
}
