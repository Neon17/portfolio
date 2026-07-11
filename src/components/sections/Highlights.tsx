"use client";

import { Trophy, GitPullRequest, Code2, Sparkles, GraduationCap, Compass } from "lucide-react";
import { achievements, education, interests, journey } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const icons = {
  trophy: Trophy,
  git: GitPullRequest,
  code: Code2,
  spark: Sparkles,
};

export default function Highlights() {
  return (
    <section id="achievements" className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        tag="05 — Achievements & Education"
        title="Beyond the code"
        subtitle="Competitions, open source, and the foundation underneath it all."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {achievements.map((a, i) => {
          const Icon = icons[a.icon];
          return (
            <Reveal key={a.title} i={i}>
              <div className="glass glass-hover flex h-full gap-4 rounded-2xl p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aurora-violet/30 to-aurora-cyan/20">
                  <Icon size={20} className="text-aurora-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                    {a.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-6">
        {education.map((ed) => (
          <Reveal key={ed.school}>
            <div className="glass glass-hover flex flex-wrap items-center gap-4 rounded-2xl p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aurora-indigo/30 to-aurora-pink/20">
                <GraduationCap size={20} className="text-aurora-pink" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold">{ed.degree}</h3>
                <p className="text-sm text-aurora-cyan">{ed.school}</p>
                <p className="text-xs text-[var(--color-muted)]">{ed.note}</p>
              </div>
              <span className="text-sm text-[var(--color-muted)]">
                {ed.start} – {ed.end}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Beyond code + journey */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Compass size={16} className="text-aurora-teal" />
              <h3 className="font-display font-semibold">Beyond code</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((it) => (
                <span
                  key={it.label}
                  className="group rounded-full border border-white/10 chip px-3 py-1.5 text-sm transition-colors hover:border-aurora-cyan/50"
                >
                  {it.label}
                  <span className="ml-1.5 text-[11px] text-[var(--color-muted)]">
                    {it.note}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal i={1}>
          <div className="glass h-full rounded-2xl p-6">
            <h3 className="mb-2 font-display font-semibold">{journey.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              {journey.text}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
