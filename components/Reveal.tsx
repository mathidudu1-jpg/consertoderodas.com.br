"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  /** Se true, anima os filhos diretos em sequência */
  childrenStagger?: boolean;
};

export default function Reveal({
  children,
  className,
  y = 30,
  delay = 0,
  stagger = 0.08,
  childrenStagger = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = childrenStagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "expo.out",
        stagger: childrenStagger ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, childrenStagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
