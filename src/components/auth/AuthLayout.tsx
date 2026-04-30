"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="flex flex-col justify-center px-6 py-12 md:px-16"
      >
        <Link href="/" className="inline-flex items-center gap-2 mb-12">
          <Image src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
        </Link>
        <div className="max-w-[400px] w-full">
          <h1 className="text-h1 text-foreground">{title}</h1>
          <p className="text-small text-muted-foreground mt-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </motion.div>

      <aside className="hidden md:flex relative items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--primary-50),_transparent_70%)] overflow-hidden">
        <div className="relative w-64 bg-[#0F1117] rounded-3xl p-3 shadow-e3 ring-1 ring-white/10">
          <div className="bg-primary-600 rounded-t-xl px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-full" />
            <div>
              <p className="text-white text-xs font-semibold">Squalto AI</p>
              <p className="text-white/70 text-[10px]">Online</p>
            </div>
          </div>
          <div className="bg-[#ECE5DD] rounded-b-xl px-3 py-3 flex flex-col gap-2 min-h-[220px]">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-[11px] text-gray-800">Your order is confirmed.</p>
            </div>
            <div className="self-end bg-[#DCF8C6] rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-[11px] text-gray-800">Track your order</p>
            </div>
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-[11px] text-gray-800">Out for delivery</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
