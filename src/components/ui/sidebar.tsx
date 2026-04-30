"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight, Menu, X } from "lucide-react";

interface SidebarLinkType {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within Sidebar");
  return ctx;
}

const STORAGE_KEY = "squalto:sidebar:collapsed";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "1") {
      setCollapsedState(true);
    }
  }, []);

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function SidebarBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <DesktopSidebar className={className}>{children}</DesktopSidebar>
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </>
  );
}

function DesktopSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { collapsed } = useSidebar();
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "h-screen sticky top-0 hidden md:flex md:flex-col bg-card border-r border-border px-3 py-4 shrink-0",
        className,
      )}
    >
      {children}
    </motion.aside>
  );
}

function MobileSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { mobileOpen, setMobileOpen } = useSidebar();
  return (
    <>
      <div className="h-12 px-4 flex md:hidden items-center justify-between bg-card border-b border-border">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="text-foreground" />
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={cn("fixed inset-0 z-50 bg-card p-6 flex flex-col", className)}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end mb-6"
              aria-label="Close menu"
            >
              <X className="text-foreground" />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SidebarBrand({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 mb-4">
        <Link href="/app" className="flex items-center justify-center">
          <img src="/logo-mark.svg" alt="Squalto" width={28} height={28} />
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary focus-ring"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between mb-4 h-8">
      <Link href="/app" className="flex items-center gap-2">
        <img src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
      </Link>
      <button
        type="button"
        onClick={onToggleCollapse}
        className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary focus-ring"
        aria-label="Collapse sidebar"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

export function SidebarLink({ link }: { link: SidebarLinkType }) {
  const { collapsed, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const active = pathname === link.href || pathname.startsWith(link.href + "/");

  return (
    <Link
      href={link.href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-[var(--motion-fast)]",
        active
          ? "bg-primary-50 text-primary-700 border-l-2 border-primary-600 -ml-[2px] pl-[10px]"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <span className="shrink-0">{link.icon}</span>
      {!collapsed && <span className="truncate">{link.label}</span>}
    </Link>
  );
}

export function SidebarSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();
  return (
    <div className="mt-4 first:mt-0">
      {title && !collapsed && (
        <div className="text-caption text-muted-foreground px-2.5 mb-1">{title}</div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
