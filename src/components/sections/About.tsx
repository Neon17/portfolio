"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { profile, stats, leetcode } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function LeetRing() {
  const pct = Math.round((leetcode.total / 3000) * 100); // ~ progress feel
  const segments = [
    { label: "Easy", value: leetcode.easy, color: "#2dd4bf" },
    { label: "Medium", value: leetcode.medium, color: "#f59e0b" },
    { label: "Hard", value: leetcode.hard, color: "#ec4899" },
  ];
  return (
    <div className="glass glass-hover flex items-center gap-5 rounded-2xl p-5">
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
        <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ffffff10" strokeWidth="3" />
          <motion.circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="url(#leetgrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            whileInView={{ strokeDashoffset: 100 - Math.min(pct + 20, 92) }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="leetgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <div className="font-display text-xl font-bold">{leetcode.total}</div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
            solved
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="text-xs">
            <div className="mb-1 flex justify-between">
              <span className="text-[var(--color-muted)]">{seg.label}</span>
              <span className="font-semibold">{seg.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full chip">
              <motion.div
                className="h-full rounded-full"
                style={{ background: seg.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(seg.value / leetcode.medium) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <span className="section-tag">01 — About</span>
          <Reveal i={1}>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              I like the parts users never see.
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-5 leading-relaxed text-[var(--color-muted)]">
              I&apos;m a backend-leaning full-stack developer from Pokhara, Nepal.
              Across two internships I&apos;ve shipped real production features —
              payment flows with rollback safety, search that went from{" "}
              <span className="text-star">24s to 2-3s</span>, and a multi-vendor
              marketplace with subdomain multi-tenancy.
            </p>
          </Reveal>
          <Reveal i={3}>
            <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
              I&apos;m most at home in Laravel and Django, currently going deeper
              into system design and machine learning. I&apos;m not a designer —
              I&apos;m the person who makes sure the API is fast, correct, and
              won&apos;t fall over. I love a good problem to solve.
            </p>
          </Reveal>
          <Reveal i={4}>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Problem Solver", "Clean Code", "Real-World APIs", "System Design (learning)"].map(
                (t) => (
                  <span
                    key={t}
                    className="glass rounded-full px-3 py-1 text-xs text-[var(--color-muted)]"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((st, i) => (
              <Reveal key={st.label} i={i}>
                <div className="glass glass-hover rounded-2xl p-5 text-center">
                  <div className="font-display text-3xl font-bold text-gradient">
                    <Counter to={st.value} suffix={st.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">
                    {st.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal i={2}>
            <LeetRing />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
