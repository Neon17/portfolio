"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const levelColor: Record<string, string> = {
  Expert: "#22d3ee",
  Proficient: "#8b5cf6",
  Skillful: "#6366f1",
  Learning: "#ec4899",
};

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        tag="02 — Skills"
        title="The stack I build with"
        subtitle="Grouped by where I spend the most time. Backend and databases are home; the frontend gets the job done."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal key={group.category} i={gi} className="h-full">
            <div className="glass glass-hover h-full rounded-2xl p-6">
              <h3 className="mb-5 font-display text-lg font-semibold">
                {group.category}
              </h3>
              <div className="space-y-4">
                {group.skills.map((sk) => (
                  <div key={sk.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span>{sk.name}</span>
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider"
                        style={{ color: levelColor[sk.level] }}
                      >
                        {sk.level}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full chip">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${levelColor[sk.level]}, #22d3ee)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sk.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
