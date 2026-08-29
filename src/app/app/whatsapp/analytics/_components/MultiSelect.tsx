"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Compact multi-select for the filter bar. Selecting nothing means "all", which
 * is why the trigger reads "All accounts" rather than "None selected" — an empty
 * filter must never look like an empty result.
 */
export function MultiSelect({
  options,
  selected,
  onChange,
  allLabel,
  maxSelected,
  maxHint,
  disabled,
}: {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  allLabel: string;
  maxSelected?: number;
  maxHint?: string;
  disabled?: boolean;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
      return;
    }
    if (maxSelected && selected.length >= maxSelected) return;
    onChange([...selected, value]);
  };

  const label =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? "1 selected")
        : `${selected.length} selected`;

  const atLimit = Boolean(maxSelected && selected.length >= maxSelected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled || options.length === 0}
          className={cn(
            "flex h-9 min-w-[9rem] max-w-[14rem] items-center justify-between gap-2 rounded-md border border-gray-200 bg-card px-3 text-sm focus-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            selected.length > 0 && "border-primary-300 bg-primary-50/50"
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-1">
        {atLimit && maxHint && (
          <p className="px-2 py-1.5 text-caption text-muted-foreground">{maxHint}</p>
        )}
        <div className="max-h-64 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            const blocked = !isSelected && atLimit;
            return (
              <button
                key={option.value}
                type="button"
                disabled={blocked}
                onClick={() => toggle(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-secondary",
                  blocked && "cursor-not-allowed opacity-40"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.hint && (
                  <span className="text-caption text-muted-foreground shrink-0">
                    {option.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="mt-1 w-full rounded-sm px-2 py-1.5 text-left text-caption text-muted-foreground hover:bg-secondary"
          >
            Clear selection
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
