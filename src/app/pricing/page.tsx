import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { PricingPlans } from "@/components/marketing/PricingPlans";
import { C } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Pricing — Plans for Every Business Scale | Squalto",
  description:
    "Simple, transparent pricing for WhatsApp Business messaging. Start free and scale as you grow — no hidden fees.",
};

const FAQS = [
  {
    q: "Do I pay for WhatsApp conversations separately?",
    a: "Meta charges per-conversation fees that are billed at cost. Your Squalto plan covers the platform, automation, and support.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes — upgrade or downgrade anytime. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "You can get started for free and connect your WhatsApp Business number before committing to a paid plan.",
  },
];

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="bg-white px-6 pt-16 md:pt-24 pb-10 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: C.accent }}
            >
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F1117] leading-tight">
              Tailored Plans for Your Business Scale
            </h1>
            <p className="text-base text-gray-600 max-w-xl leading-relaxed">
              Start free, scale as you grow. No hidden fees — only pay for what you use.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="px-6 pb-20" style={{ backgroundColor: "#fff" }}>
          <div className="max-w-7xl mx-auto">
            <PricingPlans />
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20" style={{ backgroundColor: "#F9FAFB" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1117] text-center mb-12">
              Pricing FAQ
            </h2>
            <div className="flex flex-col gap-4">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-[#0F1117]">
                    {faq.q}
                    <ChevronRight
                      size={16}
                      className="text-gray-400 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 text-center" style={{ backgroundColor: C.darkBg }}>
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              Ready to Get Started?
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
