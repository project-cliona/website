import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-card text-card-foreground rounded-lg border transition-[box-shadow,transform] duration-[var(--motion-base)]",
  {
    variants: {
      variant: {
        default:     "border border-gray-200",
        interactive: "border-border shadow-e1 hover:shadow-e2 hover:-translate-y-px cursor-pointer",
        highlight:   "border-primary-200 bg-primary-50/40 shadow-e1",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  ),
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 p-6 pb-4", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-h3 text-foreground", className)} {...props} />
);
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-small text-muted-foreground", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-2 p-6 pt-0 border-t border-border bg-muted/40", className)} {...props} />
);
