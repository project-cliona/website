"use client";

import { useLayoutEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { C, type FeatureDetailCard } from "@/lib/marketing";

interface StackingCardsProps {
  title: string;
  cards: FeatureDetailCard[];
}

export function StackingCards({ title, cards }: StackingCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>("[data-stack-wrap]");
      const cardEls = gsap.utils.toArray<HTMLElement>("[data-stack-card]");

      cardEls.forEach((card, i) => {
        const nextWrap = wraps[i + 1];
        if (!nextWrap) return; // last card stays centered & full size
        // As the next slot slides up to cover this card, shrink, lift and dim it
        // so the previous cards peek out behind the active one — a real stack.
        gsap.fromTo(
          card,
          { scale: 1, y: 0, filter: "brightness(1)" },
          {
            scale: 0.9,
            y: -110,
            filter: "brightness(0.6)",
            ease: "none",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: nextWrap,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [cards]);

  return (
    <section className="px-6 pt-20" style={{ backgroundColor: C.darkBg }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
          {title}
        </h2>
      </div>

      <div ref={rootRef} className="relative">
        {cards.map((card, i) => (
          <div
            key={card.title}
            data-stack-wrap
            className="sticky top-0 h-screen flex items-center justify-center"
          >
            <div
              data-stack-card
              className="w-full max-w-4xl rounded-3xl border p-10 md:p-12 shadow-e4 flex flex-col gap-6"
              style={{
                backgroundColor: C.darkCard,
                borderColor: C.darkBorder,
                zIndex: i + 1,
                willChange: "transform",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#4F46E520" }}
                >
                  <CheckCircle2 size={26} style={{ color: C.accent }} />
                </div>
                <span
                  className="text-sm font-semibold tracking-widest"
                  style={{ color: C.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{card.title}</h3>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
