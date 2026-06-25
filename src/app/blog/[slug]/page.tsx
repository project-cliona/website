import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Reveal } from "@/components/marketing/Reveal";
import { ReadingProgress } from "@/components/marketing/ReadingProgress";
import { C } from "@/lib/marketing";
import { BLOG_POSTS, getPost, formatBlogDate } from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Blog — Squalto" };
  return { title: `${post.title} | Squalto Blog`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a) => (a.category === post.category ? -1 : 1))
    .slice(0, 3);

  return (
    <>
      <MarketingNav />
      <ReadingProgress />
      <main>
        {/* Title block */}
        <section className="bg-white px-6 pt-14 md:pt-20 pb-10">
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0F1117] transition-colors w-fit"
            >
              <ArrowLeft size={15} />
              Back to blog
            </Link>
            <span
              className="text-xs font-semibold uppercase tracking-wider w-fit"
              style={{ color: C.accent }}
            >
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#0F1117] leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{post.author}</span>
              <span>•</span>
              <span>{formatBlogDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Cover */}
        <section className="px-6 pb-12">
          <div
            className="max-w-4xl mx-auto h-64 md:h-80 rounded-3xl flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})`,
            }}
          >
            <span className="text-8xl md:text-9xl">{post.glyph}</span>
          </div>
        </section>

        {/* Article body */}
        <article className="px-6 pb-20">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {post.content.map((section, i) => (
              <Reveal key={i} className="flex flex-col gap-4">
                {section.heading && (
                  <h2 className="text-2xl font-bold text-[#0F1117] mt-2">{section.heading}</h2>
                )}
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="text-[17px] text-gray-700 leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="flex flex-col gap-2.5">
                    {section.list.map((item, k) => (
                      <li key={k} className="flex items-start gap-3 text-[17px] text-gray-700 leading-relaxed">
                        <span
                          className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: C.accent }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}

            {/* Inline CTA button */}
            <Reveal className="mt-2">
              <a
                href="/auth/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full"
                style={{ backgroundColor: C.accent }}
              >
                Start for Free
                <ChevronRight size={14} />
              </a>
            </Reveal>
          </div>
        </article>

        {/* Related posts */}
        <section className="bg-white px-6 py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0F1117] mb-8">Keep reading</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Reveal key={rp.slug} as="article">
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full"
                  >
                    <div
                      className="h-36 flex items-center justify-center"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${rp.gradient[0]}, ${rp.gradient[1]})`,
                      }}
                    >
                      <span className="text-5xl">{rp.glyph}</span>
                    </div>
                    <div className="flex flex-col gap-2 p-5 flex-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.accent }}>
                        {rp.category}
                      </span>
                      <h3 className="text-base font-bold text-[#0F1117] leading-snug group-hover:text-[#4F46E5] transition-colors">
                        {rp.title}
                      </h3>
                      <span className="text-xs text-gray-500 mt-auto">{rp.readTime}</span>
                    </div>
                  </Link>
                </Reveal>
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
