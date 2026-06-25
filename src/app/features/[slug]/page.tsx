import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { StackingCards } from "@/components/marketing/StackingCards";
import { C, FEATURES, getFeature } from "@/lib/marketing";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return { title: "Feature — Squalto" };
  return {
    title: `${feature.title} | Squalto`,
    description: feature.tagline,
  };
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const Icon = feature.icon;
  const related = FEATURES.filter((f) => f.slug !== feature.slug);

  return (
    <>
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full w-fit"
                style={{ backgroundColor: C.accentLight, color: C.accent }}
              >
                <Icon size={12} />
                {feature.navTitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F1117] leading-tight">
                {feature.title}
              </h1>
              <p className="text-base text-gray-600 max-w-md leading-relaxed">
                {feature.tagline}
              </p>
              <ul className="flex flex-col gap-3">
                {feature.heroBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: C.accent }} />
                    <span className="text-sm text-gray-600 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="/auth/signup"
                  className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full"
                  style={{ backgroundColor: C.accent }}
                >
                  Start for Free
                  <ChevronRight size={14} />
                </a>
                <Link
                  href="/#contact"
                  className="flex items-center gap-2 text-sm font-semibold text-[#0F1117] px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Book a Demo
                </Link>
              </div>
            </div>

            {/* Right — illustrative card */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div
                  className="w-72 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-e3"
                  style={{ backgroundColor: C.darkBg }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: "#4F46E520" }}
                  >
                    <Icon size={30} style={{ color: C.accent }} />
                  </div>
                  <p className="text-white text-sm font-semibold text-center">{feature.navTitle}</p>
                  <p className="text-gray-400 text-xs text-center leading-relaxed">
                    {feature.shortDesc}
                  </p>
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-4 -right-6 bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3">
                  <p className="text-base font-bold text-[#0F1117]">{feature.heroStat.value}</p>
                  <p className="text-[10px] text-gray-500">{feature.heroStat.label}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detail cards — big cards that stack on scroll (GSAP) */}
        <StackingCards title={feature.sectionTitle} cards={feature.detailCards} />

        {/* How it works */}
        <section className="bg-white px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4 text-center"
              style={{ color: C.accent }}
            >
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1117] text-center mb-12">
              Up and Running in a Few Simple Steps
            </h2>
            <ol className="flex flex-col gap-5">
              {feature.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex items-start gap-5 p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                  <span
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: C.accent }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F1117] mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-center text-sm text-gray-500 mt-8">
              Yes, it&apos;s that easy.{" "}
              <a href="/auth/signup" className="font-semibold" style={{ color: C.accent }}>
                Create your account →
              </a>
            </p>
          </div>
        </section>

        {/* FAQ */}
        {feature.faqs && feature.faqs.length > 0 && (
          <section className="px-6 py-20" style={{ backgroundColor: "#F9FAFB" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F1117] text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-4">
                {feature.faqs.map((faq) => (
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
        )}

        {/* Related features */}
        <section className="bg-white px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F1117] mb-10 text-center">
              Everything You Need for WhatsApp Engagement
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((f) => (
                <Link
                  key={f.slug}
                  href={`/features/${f.slug}`}
                  className="group flex flex-col gap-3 p-6 rounded-xl border border-gray-100 shadow-sm hover:border-[#4F46E5]/40 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: C.accentLight }}
                  >
                    <f.icon size={18} style={{ color: C.accent }} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0F1117]">{f.navTitle}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{f.shortDesc}</p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium"
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

        {/* Final CTA */}
        <section className="px-6 py-24 text-center" style={{ backgroundColor: C.darkBg }}>
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              Ready to Grow on WhatsApp?
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
