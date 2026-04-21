// import { FilterFn } from "@tanstack/react-table";
import { Megaphone, Bell, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Category = "marketing" | "utility" | "authentication";

interface SubTypeOption {
  value: string;
  label: string;
  description: string;
  disabled?: boolean;
}

export const defaultSubType: Record<Category, string> = {
  marketing: "default",
  utility: "default",
  authentication: "otp",
};

export const categoryConfig: Record<
  Category,
  { label: string; icon: React.ElementType; subTypes: SubTypeOption[] }
> = {
  marketing: {
    label: "Marketing",
    icon: Megaphone,
    subTypes: [
      {
        value: "default",
        label: "Default",
        description:
          "Send promotional content like offers, updates, and invitations to your customers.",
      },
      {
        value: "carousel",
        label: "Carousel",
        description:
          "Send a scrollable series of cards with images and call-to-action buttons.",
        disabled: true,
      },
    ],
  },
  utility: {
    label: "Utility",
    icon: Bell,
    subTypes: [
      {
        value: "default",
        label: "Default",
        description:
          "Send transactional messages like order updates, account alerts, and appointment reminders.",
      },
    ],
  },
  authentication: {
    label: "Authentication",
    icon: ShieldCheck,
    subTypes: [
      {
        value: "otp",
        label: "One-time passcode",
        description:
          "Send one-time passcodes for user verification and account authentication.",
      },
    ],
  },
};

type CSVOptions<T> = {
  data: T[];
  filename?: string;
  columns?: {
    header: string;
    accessor: keyof T | ((row: T) => any);
  }[];
};

export function exportToCSV<T>({
  data,
  filename = "data.csv",
  columns,
}: CSVOptions<T>) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // 🔥 If no columns provided → auto-generate
  const finalColumns =
    columns ||
    Object.keys(data[0]).map((key) => ({
      header: key,
      accessor: key as keyof T,
    }));

  // Headers
  const headers = finalColumns.map((col) => col.header);

  // Rows
  const rows = data.map((row) =>
    finalColumns.map((col) => {
      let value =
        typeof col.accessor === "function"
          ? col.accessor(row)
          : row[col.accessor];

      if (value === null || value === undefined) return "";

      // escape quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    })
  );

  const csvContent =
    [headers, ...rows.map((r) => r.join(","))].join("\n");

  // Download
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}