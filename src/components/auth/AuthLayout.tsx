"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  title: string;
  panelTitle: string;
  panelSubtitle: string;
  panelTagline?: string;
  children: ReactNode;
}

export function AuthLayout({
  title,
  panelTitle,
  panelSubtitle,
  panelTagline,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left brand panel */}
      <aside className="relative hidden md:flex flex-col justify-between overflow-hidden bg-primary-600 text-white px-10 py-12 md:px-16 md:py-16">
        {/* Decorative geometric strips */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-0 h-3 w-44 bg-primary-400/50 -rotate-12 translate-x-1/3" />
          <div className="absolute top-20 right-0 h-3 w-28 bg-primary-300/50 -rotate-12 translate-x-1/2" />
          <div className="absolute bottom-[34%] -left-12 h-3 w-52 bg-primary-300/70 -rotate-12" />
          <div className="absolute bottom-[28%] -left-6 h-3 w-32 bg-primary-200/70 -rotate-12" />
        </div>

        {/* Logo */}
        <Link href="/" className="relative inline-flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-white" />
          <span className="text-lg font-semibold tracking-tight">Squalto</span>
        </Link>

        {/* Headline + subtitle */}
        <div className="relative max-w-md">
          <h1 className="text-[40px] md:text-[44px] font-bold leading-[1.1] tracking-tight">
            {panelTitle}
          </h1>
          <p className="text-white/80 text-base mt-6 max-w-sm leading-relaxed">
            {panelSubtitle}
          </p>
        </div>

        {/* Brand tagline at bottom */}
        {panelTagline && (
          <p className="relative italic text-white/80 text-sm leading-relaxed max-w-sm">
            {panelTagline}
          </p>
        )}
      </aside>

      {/* Right form panel */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="flex flex-col justify-center px-6 py-12 md:px-16"
      >
        <div className="w-full max-w-[420px] mx-auto">
          <h2 className="text-[28px] font-bold tracking-tight text-foreground">{title}</h2>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
