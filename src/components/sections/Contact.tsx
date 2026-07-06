"use client";

import { Mail, Phone, MapPin, Copy, Check } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { FiGithub as Github } from "react-icons/fi";
import { useState } from "react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import CVDownload from "@/components/CVDownload";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-5 py-24">
      <div className="glass rounded-3xl p-8 text-center sm:p-14">
        <Reveal>
          <span className="section-tag">06 — Contact</span>
        </Reveal>
        <Reveal i={1}>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Let&apos;s build something <span className="text-gradient">real</span>.
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)]">
            I&apos;m open to backend and full-stack roles — remote or in Nepal.
            If you need someone who ships and keeps learning, my inbox is open.
          </p>
        </Reveal>

        <Reveal i={3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.contact.email}`}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-violet to-aurora-indigo px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
            >
              <Mail size={16} /> Email me
            </a>
            <button
              onClick={copyEmail}
              className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm transition-colors hover:text-aurora-cyan"
            >
              {copied ? <Check size={15} className="text-aurora-teal" /> : <Copy size={15} />}
              {copied ? "Copied!" : profile.contact.email}
            </button>
            <CVDownload variant="ghost" />
          </div>
        </Reveal>

        <Reveal i={4}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-muted)]">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-star"
            >
              <Github size={16} /> {profile.contact.githubHandle}
            </a>
            <a
              href={profile.contact.leetcode}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-star"
            >
              <SiLeetcode size={16} /> {profile.contact.leetcodeHandle}
            </a>
            <span className="flex items-center gap-2">
              <Phone size={16} /> {profile.contact.phone}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> {profile.location}
            </span>
          </div>
        </Reveal>
      </div>

      <footer className="mt-12 text-center text-xs text-[var(--color-muted)]">
        <p>
          Built by {profile.name} · Next.js · Three.js · Framer Motion · Tailwind
        </p>
        <p className="mt-1">
          Under a rotating night sky, from Pokhara ✦ · CV auto-generated from live data
        </p>
      </footer>
    </section>
  );
}
