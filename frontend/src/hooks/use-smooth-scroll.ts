"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function useSmoothScroll() {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: true,
      ease: "power4.out",
      smoothTouch: 0.8,
    });

    smootherRef.current = smoother;

    return () => {
      smoother.kill();
    };
  }, []);

  return smootherRef;
}
