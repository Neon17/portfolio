"use client";

/* eslint-disable react-hooks/immutability --
   ref mutations here happen inside useFrame (per-frame animation loop),
   which runs after render — same pattern as Starfield.tsx */

import { useRef, useState, useMemo, useEffect, useCallback, type ReactElement } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, MousePointerClick, Hand, Sparkles as SparklesIcon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/lib/useIsMobile";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/* ------------------------------------------------------------------ */
/* The five shapes on the rail. Names are mine — the d20 is a chess    */
/* player's favourite dice joke, the knot is self-explanatory.         */
/* ------------------------------------------------------------------ */
const SHAPES: {
  name: string;
  note: string;
  geometry: ReactElement;
  dark: string;
  light: string;
}[] = [
  {
    name: "The d20",
    note: "roll for initiative",
    geometry: <icosahedronGeometry args={[1.3, 0]} />,
    dark: "#8b5cf6",
    light: "#6d28d9",
  },
  {
    name: "The Knot",
    note: "like my git history",
    geometry: <torusKnotGeometry args={[0.85, 0.3, 160, 24]} />,
    dark: "#22d3ee",
    light: "#0e7490",
  },
  {
    name: "The Gem",
    note: "flat-shaded on purpose",
    geometry: <octahedronGeometry args={[1.4, 0]} />,
    dark: "#ec4899",
    light: "#be185d",
  },
  {
    name: "The d12",
    note: "the d20's calmer brother",
    geometry: <dodecahedronGeometry args={[1.25, 0]} />,
    dark: "#2dd4bf",
    light: "#0f766e",
  },
  {
    name: "The Donut",
    note: "every 3D dev draws one",
    geometry: <torusGeometry args={[1.0, 0.42, 32, 96]} />,
    dark: "#f59e0b",
    light: "#b45309",
  },
];

const SPACING = 4.4; // distance between shapes on the rail
const BURST_COLORS = ["#8b5cf6", "#22d3ee", "#ec4899", "#2dd4bf", "#f59e0b", "#a5f3fc"];

function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Stardust burst at a click point                                     */
/* ------------------------------------------------------------------ */
const BURST_COUNT = 48;
const BURST_LIFE = 1.1; // seconds

function Burst({
  seed,
  position,
  color,
  texture,
  onDone,
}: {
  seed: number;
  position: THREE.Vector3;
  color: string;
  texture: THREE.Texture;
  onDone: () => void;
}) {
  const ref = useRef<THREE.Points>(null);
  const age = useRef(0);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(BURST_COUNT * 3);
    const vel = new Float32Array(BURST_COUNT * 3);
    // seeded PRNG keeps render pure (same trick as the Starfield)
    let s = 7919 + seed * 104729;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < BURST_COUNT; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const speed = 1.6 + rand() * 2.6;
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return [pos, vel];
  }, [seed]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    age.current += delta;
    const t = age.current / BURST_LIFE;
    if (t >= 1) {
      onDone();
      return;
    }
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const damp = 1 - t * 0.6;
    for (let i = 0; i < BURST_COUNT * 3; i++) {
      arr[i] += velocities[i] * delta * damp;
    }
    attr.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 1 - t * t;
    mat.size = 0.16 * (1 - t * 0.5);
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.16}
        map={texture}
        alphaMap={texture}
        transparent
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* One shape on the rail                                               */
/* ------------------------------------------------------------------ */
type Spin = { vx: number; vy: number };

function ShapeItem({
  index,
  focused,
  light,
  spin,
  onSelect,
  onPop,
}: {
  index: number;
  focused: boolean;
  light: boolean;
  spin: React.MutableRefObject<Spin>;
  onSelect: (i: number) => void;
  onPop: (point: THREE.Vector3) => void;
}) {
  const inner = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const pop = useRef(0);
  const [hovered, setHovered] = useState(false);
  const shape = SHAPES[index];
  const color = light ? shape.light : shape.dark;

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!inner.current) return;
    // slow idle turn; the focused one also carries your drag-flick momentum
    const idle = focused ? 0.22 : 0.09;
    inner.current.rotation.y += delta * (idle + (focused ? spin.current.vx : 0));
    inner.current.rotation.x += delta * (idle * 0.4 + (focused ? spin.current.vy : 0));
    if (focused) {
      // friction on the flick
      const f = Math.exp(-delta * 1.6);
      spin.current.vx *= f;
      spin.current.vy *= f;
    }
    pop.current = Math.max(0, pop.current - delta * 1.8);
    const target = (focused ? (hovered ? 1.06 : 1) : 0.52) + pop.current;
    const s = THREE.MathUtils.damp(inner.current.scale.x, target, 6, delta);
    inner.current.scale.setScalar(s);
    if (mat.current) {
      mat.current.opacity = THREE.MathUtils.damp(mat.current.opacity, focused ? 1 : 0.3, 6, delta);
      mat.current.emissiveIntensity = THREE.MathUtils.damp(
        mat.current.emissiveIntensity,
        focused ? (hovered ? 0.55 : 0.32) : 0.12,
        6,
        delta
      );
    }
    if (halo.current) {
      const haloTarget = focused ? (light ? 0.24 : 0.17) : 0.05;
      halo.current.opacity = THREE.MathUtils.damp(halo.current.opacity, haloTarget, 6, delta);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return; // that was a drag/flick, not a click
    if (!focused) {
      onSelect(index);
      return;
    }
    pop.current = 0.38;
    onPop(e.point.clone());
  };

  return (
    <Float speed={1.6 + index * 0.2} rotationIntensity={0.25} floatIntensity={0.9}>
      <group
        position={[index * SPACING, 0, 0]}
        ref={inner}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          {shape.geometry}
          <meshStandardMaterial
            ref={mat}
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.25}
            metalness={0.45}
            flatShading
            transparent
            opacity={0.3}
          />
        </mesh>
        {/* wireframe halo shell */}
        <mesh scale={1.22}>
          {shape.geometry}
          <meshBasicMaterial ref={halo} color={color} wireframe transparent opacity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* The rail that slides between shapes                                 */
/* ------------------------------------------------------------------ */
type BurstData = { id: number; position: THREE.Vector3; color: string };

function Scene({
  focus,
  light,
  mobile,
  spin,
  onSelect,
  onPopped,
}: {
  focus: number;
  light: boolean;
  mobile: boolean;
  spin: React.MutableRefObject<Spin>;
  onSelect: (i: number) => void;
  onPopped: () => void;
}) {
  const rail = useRef<THREE.Group>(null);
  const [bursts, setBursts] = useState<BurstData[]>([]);
  const nextId = useRef(0);
  const texture = useMemo(() => makeGlowTexture(), []);

  const spawnBurst = useCallback((position: THREE.Vector3, color: string) => {
    const id = nextId.current++;
    setBursts((b) => [...b.slice(-6), { id, position, color }]);
  }, []);

  const removeBurst = useCallback((id: number) => {
    setBursts((b) => b.filter((x) => x.id !== id));
  }, []);

  const handlePop = useCallback(
    (point: THREE.Vector3) => {
      spawnBurst(point, BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)]);
      onPopped();
    },
    [spawnBurst, onPopped]
  );

  useFrame((_, delta) => {
    if (!rail.current) return;
    // slide the whole rail so the focused shape sits centre-stage
    rail.current.position.x = THREE.MathUtils.damp(
      rail.current.position.x,
      -focus * SPACING,
      4,
      delta
    );
    // a whisper of tilt from leftover flick, so the world feels attached
    rail.current.rotation.y = THREE.MathUtils.damp(
      rail.current.rotation.y,
      spin.current.vx * 0.02,
      3,
      delta
    );
  });

  return (
    <>
      <ambientLight intensity={light ? 0.9 : 0.55} />
      <directionalLight position={[4, 5, 6]} intensity={light ? 1.6 : 1.3} />
      <pointLight position={[-5, -3, 3]} intensity={30} color="#8b5cf6" />
      <pointLight position={[5, 2, -3]} intensity={22} color="#22d3ee" />

      <group ref={rail}>
        {SHAPES.map((s, i) => (
          <ShapeItem
            key={s.name}
            index={i}
            focused={i === focus}
            light={light}
            spin={spin}
            onSelect={onSelect}
            onPop={handlePop}
          />
        ))}
      </group>

      <Sparkles
        count={mobile ? 36 : 90}
        scale={[13, 7, 6]}
        size={2.2}
        speed={0.35}
        opacity={light ? 0.7 : 0.5}
        color={light ? "#2563eb" : "#a5f3fc"}
      />

      {/* invisible backdrop — clicking empty space makes stardust */}
      <mesh
        position={[0, 0, -4]}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6) return;
          spawnBurst(e.point.clone(), BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)]);
        }}
      >
        <planeGeometry args={[60, 26]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {bursts.map((b) => (
        <Burst
          key={b.id}
          seed={b.id}
          position={b.position}
          color={b.color}
          texture={texture}
          onDone={() => removeBurst(b.id)}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Playground() {
  const { theme } = useTheme();
  const mobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [focus, setFocus] = useState(0);
  const [pops, setPops] = useState(0);
  const spin = useRef<Spin>({ vx: 0, vy: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only canvas mount guard, same as Starfield
  useEffect(() => setMounted(true), []);
  const light = theme === "light";

  const slide = useCallback((dir: number) => {
    setFocus((f) => (f + dir + SHAPES.length) % SHAPES.length);
  }, []);

  // flick-to-spin: dragging anywhere on the canvas throws the focused shape
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    spin.current.vx = THREE.MathUtils.clamp(spin.current.vx + dx * 0.045, -14, 14);
    spin.current.vy = THREE.MathUtils.clamp(spin.current.vy + dy * 0.03, -10, 10);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section id="lab" className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        tag="06 — 3D Lab"
        title="A little corner to play in"
        subtitle="I put five shapes on a rail in the same night sky as the rest of this site. Slide through them, flick one to spin it, click it and it pops. No reason — it was just fun to build."
      />

      <Reveal>
        <div
          className="glass relative h-[380px] touch-pan-y select-none overflow-hidden rounded-3xl sm:h-[500px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {mounted && (
            <Canvas
              key={theme} /* rebuild materials on theme change */
              camera={{ position: [0, 0, 6.2], fov: 45 }}
              gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
              dpr={mobile ? [1, 1.5] : [1, 1.8]}
            >
              <Scene
                focus={focus}
                light={light}
                mobile={mobile}
                spin={spin}
                onSelect={setFocus}
                onPopped={() => setPops((p) => p + 1)}
              />
            </Canvas>
          )}

          {/* slide arrows */}
          <button
            onClick={() => slide(-1)}
            aria-label="Previous shape"
            className="glass absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-star transition-colors hover:text-aurora-cyan"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => slide(1)}
            aria-label="Next shape"
            className="glass absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-star transition-colors hover:text-aurora-cyan"
          >
            <ChevronRight size={18} />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {SHAPES.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setFocus(i)}
                aria-label={`Go to ${s.name}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === focus ? 20 : 8,
                  background: i === focus ? "var(--c-tag)" : "var(--hairline)",
                }}
              />
            ))}
          </div>

          {/* name plate */}
          <div className="pointer-events-none absolute bottom-4 left-5 text-xs text-[var(--color-muted)]">
            <span className="font-display text-sm font-semibold text-star">
              {SHAPES[focus].name}
            </span>
            <span className="ml-2 italic">{SHAPES[focus].note}</span>
            {pops > 0 && <span className="ml-2">· popped ×{pops}</span>}
          </div>
        </div>
      </Reveal>

      <Reveal i={1}>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[
            { icon: Hand, text: "drag — flick it into a spin" },
            { icon: MousePointerClick, text: "click the shape — it pops" },
            { icon: SparklesIcon, text: "click the void — stardust" },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="chip flex items-center gap-2 rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-xs text-[var(--color-muted)]"
            >
              <Icon size={13} className="text-aurora-cyan" /> {text}
            </span>
          ))}
          <span className="ml-auto text-[11px] italic text-[var(--color-muted)]">
            three.js + react-three-fiber, no game engine — just vectors
          </span>
        </div>
      </Reveal>
    </section>
  );
}
