"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function useDashboardEntrance(
  headerRef: React.RefObject<HTMLDivElement | null>,
  listRef: React.RefObject<HTMLDivElement | null>,
  itemsReady: boolean = false
) {
  const tl = useRef<gsap.core.Timeline | null>(null);
  const headerAnimated = useRef(false);

  // Animate header once on mount
  useGSAP(() => {
    if (!headerRef.current || headerAnimated.current) return;
    headerAnimated.current = true;

    const header = headerRef.current;
    const title = header.querySelector("[data-anim=\"dash-title\"]");
    const subtitle = header.querySelector("[data-anim=\"dash-subtitle\"]");
    const search = header.querySelector("[data-anim=\"dash-search\"]");

    tl.current = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.current
      .fromTo(
        title,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(
        subtitle,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.2"
      )
      .fromTo(
        search,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      );
  }, [headerRef]);

  // Animate list items when they become ready (after data loads)
  useEffect(() => {
    if (!itemsReady || !listRef.current) return;

    const items = listRef.current.querySelectorAll("[data-anim=\"dash-item\"]");
    if (items.length === 0) return;

    // Set initial state for stagger
    gsap.set(items, { opacity: 0, y: 15, scale: 0.98 });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.out",
      delay: 0.1,
    });
  }, [itemsReady, listRef]);

  return tl;
}
