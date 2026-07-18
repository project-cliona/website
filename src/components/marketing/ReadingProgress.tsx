"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { C } from "@/lib/marketing";

/**
 * Thin fixed progress bar at the top of the viewport that fills as the reader
 * scrolls through the page (GSAP ScrollTrigger, scrubbed). Sits just under the
 * sticky navbar.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bar.style.transform = "scaleX(0)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-[57px] left-0 right-0 z-40 h-0.5 bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{ transform: "scaleX(0)", backgroundColor: C.accent }}
      />
    </div>
  );
}
