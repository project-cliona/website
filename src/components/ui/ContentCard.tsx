"use client";

import Link from "next/link";
import { Star, Users, Check, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CategoryTone = "indigo" | "violet" | "amber" | "rose" | "slate";

const toneStyles: Record<CategoryTone, { bg: string; text: string; dot: string }> = {
  indigo: { bg: "bg-primary-50", text: "text-primary-800", dot: "bg-primary-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-800", dot: "bg-violet-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-800", dot: "bg-rose-500" },
  slate: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
};

interface ContentCardProps {
  icon: LucideIcon;
  category: { label: string; tone?: CategoryTone };
  title: string;
  rating?: { value: number; reviews: number };
  description: string;
  meta?: { primary: string; secondary?: string };
  cta: { label: string; href?: string; onClick?: () => void };
  footerNote?: string;
}

export function ContentCard({
  icon: Icon,
  category,
  title,
  rating,
  description,
  meta,
  cta,
  footerNote,
}: ContentCardProps) {
  const tone = toneStyles[category.tone ?? "indigo"];

  const ctaContent = (
    <>
      {cta.label}
      <ArrowUpRight className="h-4 w-4" />
    </>
  );

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-e1 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="h-10 w-10 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
            tone.bg,
            tone.text,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
          {category.label}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 text-foreground">{title}</h3>
        {rating && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">{rating.value.toFixed(1)}</span>
            <span className="text-caption text-muted-foreground">{rating.reviews} reviews</span>
          </div>
        )}
      </div>

      <p className="text-small text-muted-foreground line-clamp-2">{description}</p>

      {meta && (
        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-small text-foreground font-medium">{meta.primary}</span>
          {meta.secondary && (
            <span className="text-caption text-muted-foreground ml-auto">{meta.secondary}</span>
          )}
        </div>
      )}

      <Button asChild={!!cta.href} onClick={cta.onClick} className="w-full mt-2">
        {cta.href ? <Link href={cta.href}>{ctaContent}</Link> : <span>{ctaContent}</span>}
      </Button>

      {footerNote && (
        <div className="flex items-center justify-center gap-1.5 text-caption text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-success" />
          {footerNote}
        </div>
      )}
    </div>
  );
}
