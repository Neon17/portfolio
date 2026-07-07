# Neon Neupane — Portfolio ✦

A night-sky themed, fully dynamic developer portfolio with an **ATS-friendly CV that auto-generates from your data** — no AI SDK, no backend. Built with Next.js 16, Three.js, Framer Motion, and Tailwind CSS v4.

## ✨ Features

- **Rotating star sky** — 3D colored starfield (react-three-fiber) with parallax layers, color breathing, and shooting stars.
- **One source of truth** — everything (site + CV) is driven by `src/data/profile.ts`. Edit that one file and both update.
- **Auto-generated ATS CV** — the "Download ATS CV" button builds a single-page, single-column PDF in your browser from your profile data. Selectable text, standard headings, keyword-dense — engineered to pass ATS parsers (LinkedIn, Greenhouse, Workday).
- **Animated everything** — scroll reveals, animated counters, LeetCode ring, skill bars, filterable project grid.
- **Static export** — deploys free to Vercel, Netlify, or GitHub Pages.

## 🧰 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | React 3D, static export, best DX |
| 3D | three.js + @react-three/fiber + drei | The rotating night sky |
| Animation | Framer Motion | Scroll & UI motion |
| Styling | Tailwind CSS v4 | Fast, themeable |
| PDF / CV | @react-pdf/renderer | Client-side ATS PDF, no server |

## 🚀 Run it

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # static site in ./out

## ✍️ How to customize (the important part)

**Everything lives in `src/data/profile.ts`.** No need to touch components.

- `profile` — name, title, summary, contact, taglines
- `experiences` — jobs (reverse-chronological)
- `projects` — add an object; set `featured: true` to surface it AND include it in the CV
- `skillGroups` — grouped skills with levels + bar scores
- `achievements`, `education`, `interests`, `journey`
- `atsSkillKeywords` — the flat keyword line the CV uses for ATS density

Change theme colors in `src/app/globals.css` under `@theme` (`--color-aurora-*`).
The CV layout/order lives in `src/lib/generateCv.tsx` (Summary -> Experience -> Projects -> Skills -> Education -> Achievements).

## 📦 Deploy

    npm run build       # outputs ./out
    # then drag ./out to Netlify, or run `vercel`, or push to GitHub Pages

Built under a rotating night sky, from Pokhara. ✦
