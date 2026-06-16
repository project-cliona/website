import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("border-b border-border", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t border-border bg-muted/40 font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "group border-b border-border transition-colors duration-[var(--motion-fast)] hover:bg-secondary/60",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("h-10 px-3 text-left align-middle text-caption text-muted-foreground", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("h-12 px-3 align-middle", className)} {...props} />
));
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-caption text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

interface TableEmptyProps {
  colSpan: number;
  children: React.ReactNode;
}
export function TableEmpty({ colSpan, children }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12">
        <div className="flex flex-col items-center justify-center text-center">{children}</div>
      </td>
    </tr>
  );
}

export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="h-12 px-3">
              <div className="animate-shimmer h-4 rounded bg-muted" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

interface TableSubjectProps {
  avatar?: React.ReactNode;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}
export function TableSubject({ avatar, primary, secondary }: TableSubjectProps) {
  return (
    <div className="flex items-center gap-3">
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{primary}</div>
        {secondary && (
          <div className="text-caption text-muted-foreground truncate">{secondary}</div>
        )}
      </div>
    </div>
  );
}

export function TableActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex items-center justify-end gap-1", className)}>{children}</div>;
}
