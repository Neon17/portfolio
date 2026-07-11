"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Code2, MapPin } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { FiGithub as Github } from "react-icons/fi";
import { profile } from "@/data/profile";
import CVDownload from "@/components/CVDownload";
import CodeTyper from "@/components/CodeTyper";
import HeroScene from "@/components/HeroScene";

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % profile.taglines.length),
      3200
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center px-5 pt-24 pb-16 sm:pt-28 sm:pb-20"
      onMouseMove={(e) => {
        spot.current?.style.setProperty("--spot-x", `${e.clientX}px`);
        spot.current?.style.setProperty("--spot-y", `${e.clientY}px`);
      }}
    >
      <div className="hero-focus" />
      <div ref={spot} className="hero-spotlight" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        {/* ---------------- left: the pitch ---------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass mb-6 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-1.5 text-center text-[11px] leading-snug text-[var(--color-muted)] sm:text-xs"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-teal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-teal" />
            </span>
            {profile.availability}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hero-glow font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {profile.name.split(" ")[0]}{" "}
            <span className="text-gradient">{profile.name.split(" ")[1]}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 font-display text-lg font-medium text-star/90 sm:text-xl"
          >
            {profile.title}
          </motion.p>

          {/* rotating tagline */}
          <div className="mt-5 h-7 sm:h-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-aurora-cyan sm:text-base"
              >
                {profile.taglines[idx]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-violet to-aurora-indigo px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
            >
              <Code2 size={16} /> View my work
            </a>
            <CVDownload />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-7 flex items-center gap-5 text-[var(--color-muted)]"
          >
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-star"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={profile.contact.leetcode}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-star"
              aria-label="LeetCode"
            >
              <SiLeetcode size={20} />
            </a>
            <span className="flex items-center gap-1.5 text-xs">
              <MapPin size={14} /> {profile.location}
            </span>
          </motion.div>

          {/* live code — the kind of thing I actually ship */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-9 w-full max-w-lg"
          >
            <CodeTyper />
          </motion.div>
        </div>

        {/* ---------------- right: the crystal ---------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <HeroScene />
          <p className="pointer-events-none absolute bottom-1 right-2 text-[11px] italic text-[var(--color-muted)]">
            click it — it changes its mind
          </p>
        </motion.div>
        {/* The 3D crystal is desktop-only — on phones it's a second heavy
            WebGL canvas and a lot of extra scroll, so the hero ends on the
            live code editor instead. */}
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--color-muted)]"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
