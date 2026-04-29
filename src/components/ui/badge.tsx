import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-ring",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-primary-foreground",
        secondary:   "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline:     "text-foreground",
        active:      "border-transparent bg-primary-100 text-primary-800",
        pending:     "border-transparent bg-yellow-50 text-yellow-700",
        inactive:    "border-transparent bg-slate-100 text-slate-600",
        rejected:    "border-transparent bg-red-50 text-red-700",
        info:        "border-transparent bg-blue-50 text-blue-700",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
)

const dotColors: Record<string, string> = {
  active:   "bg-primary-600",
  pending:  "bg-yellow-500",
  inactive: "bg-slate-400",
  rejected: "bg-red-500",
  info:     "bg-blue-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  const showDot = dot && variant && variant in dotColors;
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant as string])} />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
