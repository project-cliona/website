import type { Metadata } from "next";
import { Terminal, Package, ChevronRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { C } from "@/lib/marketing";
import { SDK_META, SDK_SECTIONS, type DocBlock } from "@/lib/sdk-docs";

export const metadata: Metadata = {
  title: "Node.js SDK — Squalto Docs",
  description: SDK_META.tagline,
};

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "text":
      return <p className="text-[15px] text-gray-700 leading-relaxed">{block.text}</p>;
    case "subheading":
      return <h3 className="text-lg font-semibold text-[#0F1117] mt-2">{block.text}</h3>;
    case "list":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: C.accent }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return <CodeBlock code={block.sample.code} lang={block.sample.lang} filename={block.sample.filename} />;
    case "note":
      return (
        <div
          className="rounded-lg border-l-4 px-4 py-3 text-[14px] leading-relaxed"
          style={{ borderColor: C.accent, backgroundColor: C.accentLight, color: "#3730A3" }}
        >
          {block.text}
        </div>
      );
  }
}

export default function SdkDocsPage() {
  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="px-6 py-14 border-b border-gray-100" style={{ backgroundColor: C.darkBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
            <span>Docs</span>
            <ChevronRight size={12} />
            <span className="text-gray-200">Node.js SDK</span>
          </div>
          <div className="flex items-start gap-4">
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#4F46E520" }}
            >
              <Terminal size={22} style={{ color: C.accent }} />
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Node.js SDK
              </h1>
              <p className="text-gray-400 mt-2 max-w-2xl text-[15px] leading-relaxed">
                {SDK_META.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full"
                  style={{ backgroundColor: C.darkCard, color: "#E0E7FF", border: `1px solid ${C.darkBorder}` }}
                >
                  <Package size={12} />
                  {SDK_META.name}@{SDK_META.version}
                </span>
                <span className="text-xs text-gray-500">{SDK_META.runtimes}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body: sidebar + content */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <nav className="lg:sticky lg:top-24 flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
              On this page
            </p>
            {SDK_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-gray-600 hover:text-[#0F1117] hover:bg-gray-50 rounded-md px-3 py-1.5 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 flex flex-col gap-14">
          {SDK_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-[#0F1117]">{section.title}</h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}

          <div
            className="rounded-xl border p-6 mt-4"
            style={{ backgroundColor: C.darkBg, borderColor: C.darkBorder }}
          >
            <h3 className="text-white font-semibold mb-1">Ready to build?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Grab your API keys from the dashboard and send your first message today.
            </p>
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-colors"
              style={{ backgroundColor: C.accent }}
            >
              Get Started Free
              <ChevronRight size={14} />
            </a>
          </div>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
