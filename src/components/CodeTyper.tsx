"use client";

import { useEffect, useMemo, useState } from "react";

/* A tiny fake-editor that "live types" snippets from my real work. */

type Tok = { t: string; c?: string };
type Snippet = { file: string; lang: string; tokens: Tok[] };

const SNIPPETS: Snippet[] = [
  {
    file: "PaymentService.php",
    lang: "Laravel",
    tokens: [
      { t: "// payments with rollback safety\n", c: "tok-cm" },
      { t: "DB", c: "tok-fn" },
      { t: "::" },
      { t: "transaction", c: "tok-fn" },
      { t: "(" },
      { t: "function", c: "tok-kw" },
      { t: " () " },
      { t: "use", c: "tok-kw" },
      { t: " ($order) {\n" },
      { t: "    $order->" },
      { t: "reserveCredits", c: "tok-fn" },
      { t: "();\n" },
      { t: "    Esewa", c: "tok-fn" },
      { t: "::" },
      { t: "charge", c: "tok-fn" },
      { t: "($order)->" },
      { t: "orFail", c: "tok-fn" },
      { t: "();\n" },
      { t: "});" },
    ],
  },
  {
    file: "middleware.py",
    lang: "Django",
    tokens: [
      { t: "# subdomain multi-tenancy\n", c: "tok-cm" },
      { t: "class", c: "tok-kw" },
      { t: " ShopContextMiddleware", c: "tok-fn" },
      { t: ":\n" },
      { t: "    def", c: "tok-kw" },
      { t: " __call__", c: "tok-fn" },
      { t: "(self, request):\n" },
      { t: "        request.shop = Shop.objects." },
      { t: "get", c: "tok-fn" },
      { t: "(\n" },
      { t: "            host=request." },
      { t: "get_host", c: "tok-fn" },
      { t: "())" },
    ],
  },
  {
    file: "search.ts",
    lang: "Meilisearch",
    tokens: [
      { t: "// product search: 24s → 2-3s\n", c: "tok-cm" },
      { t: "const", c: "tok-kw" },
      { t: " hits = " },
      { t: "await", c: "tok-kw" },
      { t: " index." },
      { t: "search", c: "tok-fn" },
      { t: "(query, {\n" },
      { t: "  limit: " },
      { t: "20", c: "tok-num" },
      { t: ",\n" },
      { t: "  attributesToHighlight: [" },
      { t: '"name"', c: "tok-str" },
      { t: "],\n" },
      { t: "});" },
    ],
  },
];

const TYPE_MS = 26; // per character (plus jitter)
const HOLD_MS = 2800; // pause on the finished snippet

export default function CodeTyper() {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const snippet = SNIPPETS[idx];
  const total = useMemo(
    () => snippet.tokens.reduce((n, tok) => n + tok.t.length, 0),
    [snippet]
  );

  useEffect(() => {
    if (count < total) {
      const t = setTimeout(
        () => setCount((c) => c + 1),
        TYPE_MS + Math.random() * 45
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCount(0);
      setIdx((i) => (i + 1) % SNIPPETS.length);
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [count, total]);

  // render tokens up to `count` typed characters
  const typed = useMemo(() => {
    const out: React.ReactElement[] = [];
    let remaining = count;
    for (let i = 0; i < snippet.tokens.length && remaining > 0; i++) {
      const tok = snippet.tokens[i];
      out.push(
        <span key={i} className={tok.c}>
          {tok.t.slice(0, remaining)}
        </span>
      );
      remaining -= tok.t.length;
    }
    return out;
  }, [snippet, count]);

  return (
    <div className="glass w-full max-w-lg overflow-hidden rounded-2xl text-left shadow-glow">
      {/* title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-[var(--color-muted)]">
          {snippet.file}
        </span>
        <span className="ml-auto rounded-full border border-aurora-cyan/30 px-2 py-0.5 text-[10px] font-medium text-aurora-cyan">
          {snippet.lang}
        </span>
      </div>

      {/* code */}
      <pre className="min-h-[7.5rem] whitespace-pre-wrap px-4 py-3.5 font-mono text-xs leading-relaxed text-star sm:text-[13px]">
        {typed}
        <span className="code-caret" aria-hidden />
      </pre>
    </div>
  );
}
