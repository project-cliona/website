"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** vertical offset to animate in from (px) */
  y?: number;
  /** delay before animating (s) */
  delay?: number;
  /** render as a different element tag */
  as?: "div" | "section" | "li" | "article";
}

/**
 * Fades + slides its children in as they scroll into view (GSAP ScrollTrigger).
 * No-op under prefers-reduced-motion.
 */
export function Reveal({ children, className, y = 24, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y,
        duration: 0.6,
        delay,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [y, delay]);

  const Tag = as as "div";
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
