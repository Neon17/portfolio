"use client";

import { useState } from "react";
import { FileDown, Loader2, Check } from "lucide-react";

/**
 * Generates the ATS-friendly CV in the browser (no server, no AI SDK) from the
 * same profile data that powers the site, then triggers a download.
 * @react-pdf/renderer is imported lazily so it never bloats the initial bundle.
 */
export default function CVDownload({
  variant = "solid",
}: {
  variant?: "solid" | "ghost";
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handleDownload() {
    try {
      setState("loading");
      const { generateCvBlob } = await import("@/lib/generateCv");
      const blob = await generateCvBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Neon-Neupane-CV.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      console.error("CV generation failed:", err);
      setState("idle");
      alert("Sorry — CV generation failed. Please try again.");
    }
  }

  const base =
    "group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all";
  const styles =
    variant === "solid"
      ? "glass border border-white/15 text-star hover:border-aurora-cyan/60 hover:shadow-glow"
      : "border border-aurora-cyan/40 text-aurora-cyan hover:bg-aurora-cyan/10";

  return (
    <button
      onClick={handleDownload}
      disabled={state === "loading"}
      className={`${base} ${styles} disabled:opacity-70`}
    >
      {state === "loading" ? (
        <Loader2 size={16} className="animate-spin" />
      ) : state === "done" ? (
        <Check size={16} className="text-aurora-teal" />
      ) : (
        <FileDown size={16} />
      )}
      {state === "loading"
        ? "Generating…"
        : state === "done"
          ? "Downloaded!"
          : "Download ATS CV"}
    </button>
  );
}
