"use client";

import { useState } from "react";
import { Mail, FileText, Workflow, Crown, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { ContentCard } from "@/components/ui/ContentCard";
import { usePageSearch } from "@/providers/searchProvider";

type CategoryTone = "indigo" | "violet" | "amber" | "rose" | "slate";

interface TemplateCardData {
  id: number;
  icon: typeof Mail;
  category: { label: string; tone: CategoryTone };
  title: string;
  description: string;
  rating: { value: number; reviews: number };
  meta: { primary: string; secondary: string };
  footerNote: string;
}

const EMAIL_TEMPLATES: TemplateCardData[] = [
  {
    id: 1,
    icon: Mail,
    category: { label: "Onboarding", tone: "indigo" },
    title: "Welcome Email",
    description: "Welcome message with brand intro.",
    rating: { value: 4.8, reviews: 120 },
    meta: { primary: "Used by 234 teams", secondary: "Join 10,000+ users" },
    footerNote: "Takes 2 mins to customize",
  },
  {
    id: 2,
    icon: Mail,
    category: { label: "Marketing", tone: "violet" },
    title: "Promotional Sale",
    description: "Boost sales with our promotional email.",
    rating: { value: 4.6, reviews: 120 },
    meta: { primary: "Used by 220 teams", secondary: "Join 10,000+ users" },
    footerNote: "Takes 2 mins to customize",
  },
  {
    id: 3,
    icon: Mail,
    category: { label: "Content", tone: "slate" },
    title: "Newsletter Template",
    description: "Modern design focused on readability.",
    rating: { value: 4.9, reviews: 120 },
    meta: { primary: "Used by 180 teams", secondary: "Join 10,000+ users" },
    footerNote: "Takes 2 mins to customize",
  },
];

const AUTOMATION_TEMPLATES: TemplateCardData[] = [
  {
    id: 4,
    icon: Workflow,
    category: { label: "User Engagement", tone: "amber" },
    title: "Feedback Survey",
    description: "Short survey to gather user insights.",
    rating: { value: 4.5, reviews: 100 },
    meta: { primary: "Used by 150 teams", secondary: "Join 5,000+ users" },
    footerNote: "Takes 1 min to customize",
  },
  {
    id: 5,
    icon: Workflow,
    category: { label: "Product Updates", tone: "indigo" },
    title: "Monthly Newsletter",
    description: "Highlight product improvements and features.",
    rating: { value: 4.7, reviews: 80 },
    meta: { primary: "Used by 180 teams", secondary: "Join 7,500+ users" },
    footerNote: "Takes 3 mins to customize",
  },
  {
    id: 6,
    icon: Mail,
    category: { label: "Retention", tone: "rose" },
    title: "Onboarding Sequence",
    description: "3-email onboarding sequence.",
    rating: { value: 4.8, reviews: 120 },
    meta: { primary: "Used by 234 teams", secondary: "Join 10,000+ users" },
    footerNote: "Takes 2 mins to customize",
  },
];

export default function TemplatesPage() {
  const [q, setQ] = useState("");
  usePageSearch({ placeholder: "Search templates", onChange: setQ });

  const matches = (t: TemplateCardData) =>
    !q ||
    t.title.toLowerCase().includes(q.toLowerCase()) ||
    t.description.toLowerCase().includes(q.toLowerCase());

  return (
    <div className="space-y-6">
      <PageHeading
        title="Templates"
        actions={
          <Button asChild>
            <Link href="/app/whatsapp/templates/create">
              <Plus className="h-4 w-4" /> Create Template
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FileText className="h-4 w-4" />}
          label="Total Templates"
          value="48"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<Mail className="h-4 w-4" />}
          label="Email Templates"
          value="28"
          trend={{ value: "+18%", positive: true }}
        />
        <StatsCard
          icon={<Workflow className="h-4 w-4" />}
          label="Automations"
          value="20"
          trend={{ value: "+8%", positive: true }}
        />
        <StatsCard
          icon={<Crown className="h-4 w-4" />}
          label="Most Popular"
          value="456"
          trend={{ value: "+24%", positive: true }}
          accent
        />
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-e1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h2">Email Templates</h2>
          <Link href="#" className="text-sm text-primary-700 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMAIL_TEMPLATES.filter(matches).map((t) => (
            <ContentCard
              key={t.id}
              icon={t.icon}
              category={t.category}
              title={t.title}
              description={t.description}
              rating={t.rating}
              meta={t.meta}
              cta={{ label: "Use Template", href: `/app/whatsapp/templates/${t.id}` }}
              footerNote={t.footerNote}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-e1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h2">Automation Templates</h2>
          <Link href="#" className="text-sm text-primary-700 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUTOMATION_TEMPLATES.filter(matches).map((t) => (
            <ContentCard
              key={t.id}
              icon={t.icon}
              category={t.category}
              title={t.title}
              description={t.description}
              rating={t.rating}
              meta={t.meta}
              cta={{ label: "Use Template", href: `/app/whatsapp/templates/${t.id}` }}
              footerNote={t.footerNote}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
