import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { BlogList } from "@/components/blog/BlogList";
import { C } from "@/lib/marketing";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — WhatsApp Marketing & Business API Insights | Squalto",
  description:
    "Guides, playbooks, and ideas for growing your business on the WhatsApp Business API — from templates and campaigns to pricing and customer support.",
};

// Most-recent first.
const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export default function BlogPage() {
  return (
    <>
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="bg-white px-6 pt-16 md:pt-24 pb-10 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.accent }}>
              The Squalto Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F1117] leading-tight">
              WhatsApp Marketing &amp; Business API Insights
            </h1>
            <p className="text-base text-gray-600 max-w-xl leading-relaxed">
              Guides, playbooks, and ideas to help you engage customers and grow sales on the
              channel they actually check.
            </p>
          </div>
        </section>

        {/* List */}
        <section className="bg-white px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <BlogList posts={posts} />
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 text-center" style={{ backgroundColor: C.darkBg }}>
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              Put These Ideas to Work
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect your WhatsApp Business number for free and send your first campaign today.
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
