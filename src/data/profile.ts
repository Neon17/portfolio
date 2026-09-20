// ============================================================================
// SINGLE SOURCE OF TRUTH
// Everything on the site AND the auto-generated ATS CV is derived from this file.
// Edit here → the website and your downloadable CV both update. Nothing else to touch.
// ============================================================================

export type SkillLevel = "Expert" | "Proficient" | "Skillful" | "Learning";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** 0-100, used for the visual bars on the site (CV ignores this) */
  score: number;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  start: string; // "Jan 2026"
  end: string; // "Apr 2026" | "Present"
  summary: string;
  /** Quantified, ATS-friendly achievement bullets (start with a strong verb) */
  highlights: string[];
  stack: string[];
  hasCertificate?: boolean;
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  /** Short punchy bullets for the CV */
  bullets: string[];
  stack: string[];
  role: string;
  category: "Backend" | "Full Stack" | "Frontend" | "Machine Learning" | "Open Source";
  featured: boolean;
  links: { label: string; url: string }[];
  /** Highlight metric shown as a chip, e.g. "24s → 2-3s" */
  metric?: string;
  year: string;
}

export interface Achievement {
  title: string;
  detail: string;
  icon: "trophy" | "code" | "git" | "spark";
}

// ----------------------------------------------------------------------------
// IDENTITY
// ----------------------------------------------------------------------------
export const profile = {
  name: "Neon Neupane",
  title: "Backend-Focused Full Stack Developer",
  // One-liner used in the hero rotator
  taglines: [
    "I build production backends that survive real users.",
    "Laravel · Django · React — payments, search, multi-tenancy.",
    "285 LeetCode Solved. Clean code. Real-world APIs.",
    "Backend heart, full-stack reach.",
  ],
  // Professional summary — tuned for ATS keyword matching + human punch.
  summary:
    "Backend-focused Full Stack Developer with 10+ months of production engineering experience across three companies (currently Full Stack Engineer at Nep Tech Pal) shipping features on real Django, Laravel, and Next.js codebases. Built payment integrations (eSewa, Khalti, RevenueCat) with rollback safety, cut search latency from 24s to 2-3s with Meilisearch on a 2.3GB dataset, and architected a subdomain-based multi-vendor marketplace on Django REST + React. Contributed 5+ merged PRs to an open-source Laravel/Filament package. Strong problem-solver (285 LeetCode solved — 203 Medium, 45 Hard · 100 Days Badge). Passionate about clean code, real-world APIs, and system design.",

  location: "Pokhara, Nepal",
  availability: "Open to backend & full-stack roles (remote / Nepal)",

  contact: {
    email: "neon.neupane.9@gmail.com",
    phone: "+977 9846000744",
    address: "Shivalaya, Street-8, Pokhara, Nepal",
    github: "https://github.com/Neon17",
    githubHandle: "Neon17",
    leetcode: "https://leetcode.com/learninglad123",
    leetcodeHandle: "learninglad123",
  },

  languages: [
    { name: "English", level: "Professional" },
    { name: "Hindi", level: "Fluent" },
    { name: "Nepali", level: "Native" },
  ],
};

// ----------------------------------------------------------------------------
// LIVE STATS (also render as animated counters on the site)
// ----------------------------------------------------------------------------
export const stats = [
  { label: "LeetCode Solved", value: 285, suffix: "" },
  { label: "GitHub Contributions / yr", value: 2200, suffix: "+" },
  { label: "Merged OSS PRs", value: 5, suffix: "+" },
  { label: "Months Interning", value: 10, suffix: "+" },
];

export const leetcode = {
  total: 285,
  easy: 37,
  medium: 203,
  hard: 45,
  handle: "learninglad123",
};

// ----------------------------------------------------------------------------
// EXPERIENCE (reverse-chronological — most recent first, ATS standard)
// ----------------------------------------------------------------------------
export const experiences: Experience[] = [
  {
    role: "Full Stack Engineer",
    company: "Nep Tech Pal Pvt Ltd",
    location: "Pokhara, Nepal",
    start: "May 2026",
    end: "Present",
    summary:
      "Engineering an enterprise NDIS service-delivery platform in Django REST and Next.js for an Australian disability care provider.",
    highlights: [
      "Architected backend REST APIs in Django REST Framework consumed by a Next.js provider portal for participant and plan management.",
      "Engineered granular Role-Based Access Control (RBAC) and immutable audit logging for sensitive clinical and participant records.",
      "Designed automated invoicing and claim-export pipelines adhering to Australian NDIS price-guide compliance with 100% calculation accuracy.",
    ],
    stack: ["Django", "Django REST Framework", "Python", "Next.js", "React", "TypeScript", "PostgreSQL", "RBAC", "Git"],
  },
  {
    role: "Full Stack Developer Intern — Backend",
    company: "Firefly IT Solutions Pvt. Ltd.",
    location: "Pokhara, Nepal",
    start: "Jan 2026",
    end: "Apr 2026",
    hasCertificate: true,
    summary:
      "Backend development on a production Laravel platform. Owned payment, search, and booking features end-to-end.",
    highlights: [
      "Built payment integrations (eSewa, Khalti, RevenueCat) with rollback safety and credit reservation to prevent double-charges.",
      "Reduced product search latency from 24s to 2-3s (~90% faster) by integrating Meilisearch over a 2.3GB dataset.",
      "Developed a Parked Numbers system with instant activation and email alerts, plus QR-based booking with payment-proof verification.",
      "Contributed 5+ merged PRs to the company's open-source Laravel/Filament package (Filament v5 support, Open Graph/Twitter cards, Table of Contents, tests).",
    ],
    stack: ["Laravel", "PHP", "Meilisearch", "eSewa", "Khalti", "RevenueCat", "Filament", "Git"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Nipuna Prabidhik Sewa",
    location: "Pokhara, Nepal",
    start: "Sep 2025",
    end: "Nov 2025",
    summary:
      "Collaborated on a production Laravel application in an Agile team using Jira, Slack, and Git.",
    highlights: [
      "Built a reusable notification system and CRM data-export features used across the product.",
      "Integrated third-party APIs and fixed backend bugs in a large existing codebase.",
      "Worked with Laravel Passport, Sanctum, and Spatie Permissions — applying authentication flows and RBAC in production.",
      "Deepened understanding of Laravel architecture, task scheduling, and queues.",
    ],
    stack: ["Laravel", "PHP", "Laravel Passport", "Sanctum", "Spatie Permissions", "Jira", "Agile"],
  },
];

// ----------------------------------------------------------------------------
// PROJECTS (featured ones surface first; CV picks the top featured)
// ----------------------------------------------------------------------------
export const projects: Project[] = [
  {
    name: "Multi-Vendor Marketplace",
    tagline: "Django REST + React — subdomain-based multi-tenancy",
    description:
      "A full-stack multi-vendor e-commerce marketplace where each shop lives on its own subdomain. A middleware resolves the active shop per request, orders fan out from a master order into per-shop sub-orders, and vendors only ever see their own data.",
    bullets: [
      "Architected subdomain-based multi-tenancy (ShopContextMiddleware) so each vendor's data is isolated by shop.",
      "Designed a Master Order → Sub-Order → Order Item hierarchy that atomically splits a multi-shop cart across vendors.",
      "Built a custom Google OAuth flow from scratch (no drop-in library) with secure httpOnly cookie token storage.",
      "Added JWT auth, eSewa/Khalti payments, and async email delivery via Celery + Redis.",
    ],
    stack: ["Django", "Django REST Framework", "React 19", "TypeScript", "PostgreSQL", "Celery", "Redis", "JWT", "Vite", "Tailwind"],
    role: "Solo — full stack & architecture",
    category: "Full Stack",
    featured: true,
    metric: "Multi-tenant",
    year: "2026",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/ecommerce" }],
  },
  {
    name: "E-Commerce Platform",
    tagline: "Laravel 12 — Typesense search, cart merge, PDF invoices",
    description:
      "A production-grade Laravel 12 storefront with a complete order lifecycle, background job processing (Horizon), and instant full-text product search.",
    bullets: [
      "Built guest-to-user cart merge, a coupon engine with usage limits, and the full cart → checkout → order → payment lifecycle.",
      "Integrated Typesense for real-time full-text product search and generated PDF invoices with DomPDF.",
      "Processed order/payment emails through queued jobs managed by Laravel Horizon, with Admin/Customer RBAC.",
    ],
    stack: ["Laravel 12", "PHP 8.2", "Typesense", "Laravel Horizon", "DomPDF", "MySQL", "Blade", "Tailwind"],
    role: "Solo — full stack",
    category: "Backend",
    featured: true,
    metric: "23 migrations",
    year: "2026",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/project-ecom" }],
  },
  {
    name: "Garage — Vehicle Service Booking",
    tagline: "Laravel + Livewire — real-time queue & eSewa",
    description:
      "A vehicle servicing platform with real-time queue position tracking, in-app chat between customers and mechanics, and eSewa payments — served with Laravel Octane on RoadRunner.",
    bullets: [
      "Built real-time service-queue position tracking and customer↔mechanic chat with Livewire (no full page reloads).",
      "Integrated eSewa payments (initiate → success/failure callbacks) and a rating/review system.",
      "Served the app with Laravel Octane + RoadRunner; deployed on AWS EC2 with Nginx, custom domain, and SSL.",
    ],
    stack: ["Laravel 10", "Livewire 3", "eSewa", "Laravel Octane", "RoadRunner", "Sanctum", "AWS EC2", "Nginx"],
    role: "Solo — full stack & deploy",
    category: "Full Stack",
    featured: true,
    metric: "Real-time",
    year: "2025",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/Garage" }],
  },
  {
    name: "Smart Blood Bank",
    tagline: "Laravel API + Next.js 15 + Leaflet — geolocation matching",
    description:
      "A location-based blood donation platform that matches donors and requests by distance and blood type, with privacy-aware profiles and an interactive map.",
    bullets: [
      "Built a geospatial matching backend (NearbyScope) that finds nearby donors/requests by distance and blood type.",
      "Designed privacy-aware profiles letting donors control what location/contact info is visible.",
      "Delivered an interactive Leaflet map UI in Next.js 15 with geocoding and distance-based filtering.",
    ],
    stack: ["Laravel 12", "Next.js 15", "React 19", "TypeScript", "Leaflet", "Sanctum", "MySQL", "Radix UI"],
    role: "Full stack (frontend + backend repos)",
    category: "Full Stack",
    featured: true,
    metric: "Geolocation",
    year: "2025",
    links: [
      { label: "Frontend", url: "https://github.com/Neon17/blood-bank-frontend" },
      { label: "Backend", url: "https://github.com/Neon17/blood-bank-backend" },
      { label: "Live", url: "https://blood-bank-frontend-sigma.vercel.app/" },
    ],
  },
  {
    name: "Task Reminder",
    tagline: "Laravel 12 — timezone-aware queued email reminders",
    description:
      "A scheduling system that emails users task reminders in their own local timezone, powered by Laravel jobs, commands, and the scheduler.",
    bullets: [
      "Built timezone-aware reminder scheduling so each user receives emails in their own local time.",
      "Used queued jobs, custom Artisan commands, and the Laravel scheduler for reliable delivery.",
      "Added Socialite OAuth login and Excel import/export for bulk task operations.",
    ],
    stack: ["Laravel 12", "Livewire", "Jetstream", "Socialite", "Laravel Excel", "Pest", "Queues"],
    role: "Solo — backend",
    category: "Backend",
    featured: false,
    metric: "Queue-driven",
    year: "2025",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/task-reminder" }],
  },
  {
    name: "Filament Blog — Open Source",
    tagline: "5+ merged PRs to a Laravel/Filament package",
    description:
      "Sustained contributions to an open-source Laravel Filament blog plugin, including a major-version migration and new reader-facing features.",
    bullets: [
      "Led the Filament v5 compatibility upgrade for the package.",
      "Added an auto-generated Table of Contents, an author block, and Open Graph/Twitter card support.",
      "Fixed image aspect-ratio distortion across screen sizes and contributed test fixes.",
    ],
    stack: ["Laravel", "Filament v5", "PHP", "Pest", "Open Graph"],
    role: "Open-source contributor",
    category: "Open Source",
    featured: true,
    metric: "5+ merged PRs",
    year: "2026",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/filament-blog" }],
  },
  {
    name: "AI Employee Monitoring System (EMS)",
    tagline: "72-hour hackathon — 1st Runner-Up",
    description:
      "An AI-powered employee monitoring and accountability system built in a 72-hour provincial hackathon, addressing 'Poor Performance and Accountability of Officials'.",
    bullets: [
      "Built in 72 hours with a team; placed First Runner-Up at the provincial hackathon.",
      "Combined a Next.js frontend, an Express.js API, and a Flask ML service.",
    ],
    stack: ["Next.js", "Express.js", "Flask", "Python"],
    role: "Team — full stack",
    category: "Machine Learning",
    featured: false,
    metric: "1st Runner-Up",
    year: "2025",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/EMS" }],
  },
  {
    name: "Machine Learning Notebooks",
    tagline: "PyTorch · TensorFlow · scikit-learn — GPU training",
    description:
      "An ongoing ML learning journey: PyTorch fundamentals through CNNs, regression, and clustering, trained on a CUDA GPU.",
    bullets: [
      "Implemented CNN image classification (CIFAR-10), regression, and unsupervised clustering across 10 notebooks.",
      "Configured CUDA/cuDNN for GPU-accelerated training with PyTorch and TensorFlow/Keras.",
    ],
    stack: ["PyTorch", "TensorFlow", "Keras", "scikit-learn", "pandas", "NumPy", "CUDA"],
    role: "Self-study",
    category: "Machine Learning",
    featured: false,
    metric: "10 notebooks",
    year: "2026",
    links: [{ label: "GitHub", url: "https://github.com/Neon17/machine-learning-notebooks" }],
  },
];

// ----------------------------------------------------------------------------
// SKILLS (grouped — drives site bars AND CV skills section)
// ----------------------------------------------------------------------------
export const skillGroups: SkillGroup[] = [
  {
    category: "Backend",
    skills: [
      { name: "PHP / Laravel", level: "Expert", score: 92 },
      { name: "Livewire", level: "Proficient", score: 82 },
      { name: "Django / DRF", level: "Proficient", score: 80 },
      { name: "FastAPI", level: "Skillful", score: 68 },
      { name: "Node.js / Express", level: "Skillful", score: 72 },
      { name: "NestJS", level: "Skillful", score: 64 },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "JavaScript / TypeScript", level: "Proficient", score: 84 },
      { name: "React / Next.js", level: "Proficient", score: 82 },
      { name: "Redux", level: "Skillful", score: 70 },
      { name: "Tailwind CSS", level: "Proficient", score: 85 },
    ],
  },
  {
    category: "Databases & Search",
    skills: [
      { name: "MySQL / PostgreSQL", level: "Proficient", score: 84 },
      { name: "MongoDB", level: "Skillful", score: 70 },
      { name: "Redis", level: "Skillful", score: 68 },
      { name: "Meilisearch / Typesense", level: "Proficient", score: 80 },
    ],
  },
  {
    category: "Infra, Payments & Tooling",
    skills: [
      { name: "Git & CI/CD", level: "Expert", score: 90 },
      { name: "AWS EC2 / Nginx", level: "Skillful", score: 66 },
      { name: "Celery / Queues / Horizon", level: "Proficient", score: 80 },
      { name: "eSewa / Khalti / RevenueCat", level: "Proficient", score: 85 },
    ],
  },
  {
    category: "CS Fundamentals & Learning",
    skills: [
      { name: "DSA (C++)", level: "Proficient", score: 84 },
      { name: "System Design (L1 basics)", level: "Learning", score: 50 },
      { name: "Machine Learning (PyTorch)", level: "Learning", score: 55 },
    ],
  },
];

// Flat keyword list for ATS density (rendered in the CV skills line).
export const atsSkillKeywords = [
  "PHP", "Laravel", "Livewire", "Python", "Django", "Django REST Framework", "FastAPI",
  "JavaScript", "TypeScript", "Node.js", "Express.js", "NestJS", "React", "Next.js", "Redux",
  "Tailwind CSS", "REST APIs", "MySQL", "PostgreSQL", "MongoDB", "Redis",
  "Meilisearch", "Typesense", "Celery", "Queues", "Laravel Horizon", "RabbitMQ",
  "JWT", "OAuth2", "Sanctum", "Passport", "RBAC", "Multi-Tenancy",
  "eSewa", "Khalti", "RevenueCat", "Payment Integration",
  "Git", "CI/CD", "Docker", "AWS EC2", "Nginx", "Linux",
  "Data Structures & Algorithms", "C++", "System Design", "Agile", "Jira",
];

// ----------------------------------------------------------------------------
// ACHIEVEMENTS
// ----------------------------------------------------------------------------
export const achievements: Achievement[] = [
  {
    title: "First Runner-Up — Provincial Hackathon",
    detail:
      "Placed 1st Runner-Up in a 72-hour provincial hackathon with an AI-powered Employee Monitoring System (Next.js, Express.js, Flask).",
    icon: "trophy",
  },
  {
    title: "Open Source Contributor — Filament Blog",
    detail:
      "5+ merged PRs to a Laravel/Filament package: Filament v5 support, Table of Contents, author block, OG/Twitter cards, and tests.",
    icon: "git",
  },
  {
    title: "285 LeetCode Problems Solved",
    detail:
      "203 Medium and 45 Hard problems solved (@learninglad123, 100 Days Badge) — consistent DSA practice in C++.",
    icon: "code",
  },
  {
    title: "2,200+ GitHub Contributions",
    detail:
      "Over 2,270 contributions in the last year across 35+ repositories — a daily building habit.",
    icon: "spark",
  },
  {
    title: "College Chess Champion",
    detail:
      "Placed 1st in the college sports-meet chess competition — the same pattern-finding and lookahead I bring to problem-solving.",
    icon: "trophy",
  },
];

// ----------------------------------------------------------------------------
// BEYOND CODE — hobbies, ongoing learning, the human bits
// ----------------------------------------------------------------------------
export const interests = [
  { label: "Chess ♟", note: "College champion" },
  { label: "System Design", note: "Actively learning" },
  { label: "Machine Learning", note: "PyTorch, self-study" },
  { label: "Open Source", note: "Laravel / Filament" },
  { label: "Problem Solving", note: "285 LeetCode" },
];

// A short, honest note on the journey — growth story recruiters love.
export const journey = {
  title: "How I got here",
  text: "My first real project (Garage) taught me the hard way that planning beats raw coding — I hand-built every feature (eSewa, maps, real-time queues) without AI, wrestled with ORM relationships, and shipped something messy but working. Showcasing it at the GCES IT Expo taught me to research and design before I code. Today I plan with ER diagrams, work in Agile with Jira tickets, and commit to timelines. I'm still learning — deliberately going deeper, not just wider.",
};

// ----------------------------------------------------------------------------
// EDUCATION
// ----------------------------------------------------------------------------
export const education = [
  {
    degree: "Bachelor of Software Engineering",
    school: "Gandaki College of Science and Engineering (Pokhara University)",
    location: "Pokhara, Nepal",
    start: "Mar 2022",
    end: "Present",
    note: "8th semester. Final-year internship completed.",
  },
];
