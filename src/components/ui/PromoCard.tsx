"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PromoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export function PromoCard({ icon: Icon, title, description, cta, className }: PromoCardProps) {
  const ctaContent = <>{cta.label}</>;

  return (
    <div className={cn("rounded-lg border border-border bg-card p-6 shadow-e1 flex flex-col gap-4", className)}>
      <div className="rounded-lg bg-primary-50 p-8 flex items-center justify-center">
        <Icon className="h-12 w-12 text-primary-700" />
      </div>
      <div>
        <h3 className="text-h2 text-foreground">{title}</h3>
        <p className="text-small text-muted-foreground mt-1.5">{description}</p>
      </div>
      <Button
        asChild={!!cta.href}
        onClick={cta.onClick}
        className="w-full bg-foreground text-background hover:bg-foreground/90 hover:shadow-none"
      >
        {cta.href ? <Link href={cta.href}>{ctaContent}</Link> : <span>{ctaContent}</span>}
      </Button>
    </div>
  );
}
