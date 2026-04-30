"use client";

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/Button"

// -----------------------------------------------------------------------------
// High-level prop-driven Pagination (rebrand visual style)
// -----------------------------------------------------------------------------

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const arr: (number | "...")[] = [1];
  if (current > 3) arr.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) arr.push(p);
  if (current < total - 2) arr.push("...");
  arr.push(total);
  return arr;
}

function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <div className={cn("flex items-center justify-between mt-4", className)}>
      <div className="text-caption text-muted-foreground">
        Page {page} of {pageCount}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-9 px-3 inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        {pageNumbers(page, pageCount).map((n, i) =>
          n === "..." ? (
            <span key={`e${i}`} className="px-2 text-muted-foreground">…</span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={cn(
                "h-9 min-w-9 px-2 rounded-md text-sm focus-ring",
                n === page
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {String(n).padStart(2, "0")}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="h-9 px-3 inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Backward-compat shadcn primitives
// -----------------------------------------------------------------------------
// The original `Pagination` was a thin <nav> wrapper. The high-level component
// above replaces that name. Consumers that need the wrapper should use
// `PaginationNav` (same behavior as the previous default export).

function PaginationNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationNav,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
