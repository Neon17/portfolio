"use client";

import { experiences } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { BadgeCheck, Briefcase } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <SectionHeading
        tag="03 — Experience"
        title="Where I've shipped"
        subtitle="6+ months across two companies — writing backend code that reached real users."
      />

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-4 top-2 hidden h-full w-px bg-gradient-to-b from-aurora-violet via-aurora-indigo to-transparent sm:block" />

        <div className="space-y-8">
          {experiences.map((e, i) => (
            <Reveal key={e.company} i={i}>
              <div className="relative sm:pl-14">
                <div className="glass absolute left-0 top-1 hidden h-8 w-8 items-center justify-center rounded-full border border-aurora-violet/40 sm:flex">
                  <Briefcase size={14} className="text-aurora-cyan" />
                </div>

                <div className="glass glass-hover rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {e.role}
                      </h3>
                      <p className="text-aurora-cyan">{e.company}</p>
                    </div>
                    <div className="text-right text-xs text-[var(--color-muted)]">
                      <div>
                        {e.start} – {e.end}
                      </div>
                      <div>{e.location}</div>
                      {e.hasCertificate && (
                        <span className="mt-1 inline-flex items-center gap-1 text-aurora-teal">
                          <BadgeCheck size={12} /> Certificate issued
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {e.highlights.map((h, hi) => (
                      <li
                        key={hi}
                        className="flex gap-2 text-sm leading-relaxed text-[var(--color-muted)]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora-violet" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {e.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md chip px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
