import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { C, FEATURES } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Features — Everything You Need for WhatsApp Engagement | Squalto",
  description:
    "Onboarding, AI template management, bulk campaigns, a shared team inbox, audience segmentation, and analytics — everything you need to grow on the WhatsApp Business API.",
};

const HIGHLIGHTS = [
  "Official WhatsApp Business API partner",
  "Go live in minutes with Embedded Signup",
  "Built-in retries, real-time tracking & reporting",
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: C.accentLight, color: C.accent }}
            >
              <CheckCircle2 size={12} />
              One Platform for Everything WhatsApp
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F1117] leading-tight">
              Powerful Features Built to Convert on WhatsApp
            </h1>
            <p className="text-base text-gray-600 max-w-xl leading-relaxed">
              From connecting your number to measuring every message — Squalto gives you
              everything you need to engage customers and grow sales on the WhatsApp Business API.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/auth/signup"
                className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full"
                style={{ backgroundColor: C.accent }}
              >
                Start for Free
                <ChevronRight size={14} />
              </a>
              <Link
                href="/#pricing"
                className="flex items-center gap-2 text-sm font-semibold text-[#0F1117] px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="px-6 py-20" style={{ backgroundColor: C.darkBg }}>
          <div className="max-w-7xl mx-auto">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: C.accent }}
            >
              Features
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white max-w-md leading-snug">
                Everything You Need for WhatsApp Engagement
              </h2>
              <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                Explore each capability in depth — click any feature to see how it works.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <Link
                  key={f.slug}
                  href={`/features/${f.slug}`}
                  className="group flex flex-col gap-4 p-6 rounded-xl border transition-all hover:border-[#4F46E5]/40"
                  style={{ backgroundColor: C.darkCard, borderColor: C.darkBorder }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#4F46E520" }}
                  >
                    <f.icon size={18} style={{ color: C.accent }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1">{f.navTitle}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.shortDesc}</p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: C.accent }}
                  >
                    Learn more
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights strip */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: C.accent }} />
                <span className="text-sm text-gray-700 leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 text-center" style={{ backgroundColor: C.darkBg }}>
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              From Sign-Up to First Message in Minutes
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              No contracts. No credit card required. Start sending with the official WhatsApp
              Business API today.
            </p>
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3.5 rounded-full mt-2"
              style={{ backgroundColor: C.accent }}
            >
              Get Started Free
              <ChevronRight size={14} />
            </a>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
