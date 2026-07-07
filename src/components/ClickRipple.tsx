"use client";

import { useEffect, useState, useRef } from "react";

/* Water-like ripple wherever you click/tap — three expanding rings
   and a soft splash, like a drop landing on the night sky. */

type Ripple = { id: number; x: number; y: number };

export default function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      // only primary button / tap
      if (e.button !== 0) return;
      const id = nextId.current++;
      setRipples((r) => [...r.slice(-5), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((r) => r.filter((rp) => rp.id !== id));
      }, 1150);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: r.x, top: r.y }}
        >
          <i className="ripple-ring" />
          <i className="ripple-ring" style={{ animationDelay: "120ms" }} />
          <i className="ripple-ring" style={{ animationDelay: "260ms" }} />
          <i className="ripple-splash" />
        </span>
      ))}
    </div>
  );
}
