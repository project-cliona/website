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
