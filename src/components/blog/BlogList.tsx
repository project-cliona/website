"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { C } from "@/lib/marketing";
import { BLOG_CATEGORIES, formatBlogDate, type BlogPost } from "@/lib/blog";

function Cover({ post, large = false }: { post: BlogPost; large?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${large ? "h-56 md:h-full min-h-[14rem]" : "h-44"}`}
    >
      <Image
        src={`/blog/${post.slug}.jpg`}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      />
      <span className="absolute top-3 left-3 z-10 text-[11px] font-semibold text-white bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
        {post.category}
      </span>
    </div>
  );
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [cat, setCat] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  const [featured, ...rest] = filtered;

  useLayoutEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-blog-card]", {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.07,
      });
    }, root);
    return () => ctx.revert();
  }, [cat]);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {BLOG_CATEGORIES.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="text-sm font-medium px-4 py-2 rounded-full border transition-colors"
              style={
                active
                  ? { backgroundColor: C.accent, borderColor: C.accent, color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#4B5563" }
              }
            >
              {c}
            </button>
          );
        })}
      </div>

      <div ref={gridRef}>
        {/* Featured */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            data-blog-card
            className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-8"
          >
            <Cover post={featured} large />
            <div className="flex flex-col gap-3 p-8 justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.accent }}>
                Featured
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F1117] leading-snug group-hover:text-[#4F46E5] transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{featured.author}</span>
                <span>•</span>
                <span>{formatBlogDate(featured.date)}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium mt-2" style={{ color: C.accent }}>
                Read article
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        )}

        {/* Rest grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-blog-card
              className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <Cover post={post} />
              <div className="flex flex-col gap-2 p-5 flex-1">
                <h3 className="text-base font-bold text-[#0F1117] leading-snug group-hover:text-[#4F46E5] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{formatBlogDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
