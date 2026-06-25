"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { C } from "@/lib/marketing";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-gray-600 hover:text-[#0F1117] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-[#0F1117] transition-colors px-4 py-2"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="text-sm font-medium text-white px-5 py-2 rounded-full transition-colors"
            style={{ backgroundColor: C.accent }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.accent)}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-gray-600"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <a href="/auth/login" className="text-sm font-medium text-gray-600">
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="text-sm font-medium text-white text-center px-5 py-2 rounded-full"
            style={{ backgroundColor: C.accent }}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
