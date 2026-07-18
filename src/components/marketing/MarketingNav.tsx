"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { C, FEATURES } from "@/lib/marketing";

// Non-dropdown links (Features is rendered separately with its dropdown).
const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs/sdk" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {/* Features — hover dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <Link
              href="/features"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-[#0F1117] transition-colors"
            >
              Features
              <ChevronDown
                size={14}
                className={`transition-transform ${featuresOpen ? "rotate-180" : ""}`}
              />
            </Link>

            {featuresOpen && (
              // pt-3 keeps a hover "bridge" between the link and the panel
              <div className="absolute left-0 top-full pt-3 z-50">
                <div className="w-80 bg-white border border-gray-200 shadow-xl">
                  <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      WhatsApp
                    </p>
                  </div>
                  <div className="py-1">
                    {FEATURES.map((f) => (
                      <Link
                        key={f.slug}
                        href={`/features/${f.slug}`}
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <span
                          className="mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                          style={{ backgroundColor: C.accentLight }}
                        >
                          <f.icon size={16} style={{ color: C.accent }} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-[#0F1117]">
                            {f.navTitle}
                          </span>
                          <span className="block text-xs text-gray-500 leading-snug">
                            {f.shortDesc}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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
          <Link
            href="/features"
            className="text-sm font-medium text-[#0F1117]"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <div className="flex flex-col gap-3 pl-3 border-l border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              WhatsApp
            </p>
            {FEATURES.map((f) => (
              <Link
                key={f.slug}
                href={`/features/${f.slug}`}
                className="flex items-center gap-2 text-sm text-gray-600"
                onClick={() => setOpen(false)}
              >
                <f.icon size={15} style={{ color: C.accent }} />
                {f.navTitle}
              </Link>
            ))}
          </div>
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
