"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  showStatusBar?: boolean;
}

export function PhoneFrame({ children, className, showStatusBar = true }: PhoneFrameProps) {
  return (
    <div className={cn("w-64 bg-[#0F1117] rounded-3xl p-3 shadow-e3 ring-1 ring-white/10", className)}>
      {showStatusBar && (
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-white text-xs font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
