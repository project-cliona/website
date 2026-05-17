import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: LucideIcon
  trailingSlot?: React.ReactNode
  invalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leadingIcon: Leading, trailingSlot, invalid, ...props }, ref) => {
    const ringStyles = invalid
      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30"
      : "border-input focus-visible:ring-2 focus-visible:ring-primary/30";

    if (!Leading && !trailingSlot) {
      return (
        <input
          type={type}
          aria-invalid={invalid}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-[box-shadow,border-color] duration-[var(--motion-fast)]",
            ringStyles,
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className={cn("relative w-full", className)}>
        {Leading && (
          <Leading className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <input
          type={type}
          aria-invalid={invalid}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-[box-shadow,border-color] duration-[var(--motion-fast)]",
            Leading ? "pl-9" : "pl-3",
            trailingSlot ? "pr-10" : "pr-3",
            ringStyles,
          )}
          ref={ref}
          {...props}
        />
        {trailingSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailingSlot}</div>
        )}
      </div>
    );
  }
)

Input.displayName = "Input"

export { Input }
