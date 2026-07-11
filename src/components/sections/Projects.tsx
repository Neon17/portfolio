"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { FiGithub as Github } from "react-icons/fi";
import { projects } from "@/data/profile";
import { SectionHeading } from "@/components/ui/Reveal";

const categories = ["All", "Full Stack", "Backend", "Open Source", "Machine Learning"] as const;

export default function Projects() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");

  const shown = useMemo(() => {
    const list =
      filter === "All" ? projects : projects.filter((p) => p.category === filter);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter]);

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        tag="04 — Projects"
        title="Things I've built"
        subtitle="Hand-built, from schema to deploy. Every card links to real code on GitHub."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              filter === c
                ? "bg-gradient-to-r from-aurora-violet to-aurora-indigo text-white shadow-glow"
                : "glass text-[var(--color-muted)] hover:text-star"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.article
              key={p.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="glass glass-hover group flex flex-col rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                    {p.featured && (
                      <Star size={14} className="fill-aurora-cyan text-aurora-cyan" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-aurora-cyan">{p.tagline}</p>
                </div>
                {p.metric && (
                  <span className="shrink-0 rounded-full border border-aurora-teal/30 bg-aurora-teal/10 px-2.5 py-1 text-[11px] font-medium text-aurora-teal">
                    {p.metric}
                  </span>
                )}
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                {p.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 7).map((t) => (
                  <span
                    key={t}
                    className="rounded-md chip px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
                  >
                    {t}
                  </span>
                ))}
                {p.stack.length > 7 && (
                  <span className="rounded-md chip px-2 py-0.5 text-[11px] text-[var(--color-muted)]">
                    +{p.stack.length - 7}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-4 border-t border-white/5 pt-4">
                <span className="text-xs text-[var(--color-muted)]">{p.role}</span>
                <div className="ml-auto flex items-center gap-3">
                  {p.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-star transition-colors hover:text-aurora-cyan"
                    >
                      {l.label === "GitHub" || l.label === "Frontend" || l.label === "Backend" ? (
                        <Github size={14} />
                      ) : (
                        <ExternalLink size={14} />
                      )}
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
