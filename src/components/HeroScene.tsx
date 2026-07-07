"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";

/* The hero centrepiece: a flat-shaded crystal that leans toward your
   cursor, wrapped in a geodesic cage, with two little moons on tilted
   orbits. Click it — it pops and changes colour. */

type Pointer = { x: number; y: number };

// aurora palette the crystal cycles through on click
const CRYSTAL_COLORS = {
  dark: ["#8b5cf6", "#22d3ee", "#ec4899", "#2dd4bf", "#f59e0b"],
  light: ["#6d28d9", "#0e7490", "#be185d", "#0f766e", "#b45309"],
};

function makeHaloTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.4, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function Crystal({ pointer, light }: { pointer: React.MutableRefObject<Pointer>; light: boolean }) {
  const tilt = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const pop = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const haloTexture = useMemo(() => makeHaloTexture(), []);

  const palette = light ? CRYSTAL_COLORS.light : CRYSTAL_COLORS.dark;
  const color = palette[colorIdx];
  const halo = light ? "#0e7490" : "#22d3ee";

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((state, delta) => {
    if (tilt.current) {
      // lean toward the cursor, gently
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, pointer.current.x * 0.45, 3, delta);
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, pointer.current.y * 0.35, 3, delta);
    }
    if (spinner.current) {
      spinner.current.rotation.y += delta * 0.22;
      pop.current = Math.max(0, pop.current - delta * 1.8);
      const s = (hovered ? 1.05 : 1) + pop.current;
      spinner.current.scale.setScalar(THREE.MathUtils.damp(spinner.current.scale.x, s, 8, delta));
    }
    if (cage.current) {
      // the geodesic cage turns the other way, slower
      cage.current.rotation.y -= delta * 0.05;
      cage.current.rotation.x += delta * 0.02;
    }
    if (mat.current) {
      // breathing glow + hover flare
      const breathe = Math.sin(state.clock.elapsedTime * 1.2) * 0.07;
      mat.current.emissiveIntensity = THREE.MathUtils.damp(
        mat.current.emissiveIntensity,
        (hovered ? 0.55 : 0.32) + breathe,
        6,
        delta
      );
    }
  });

  return (
    <group ref={tilt}>
      {/* soft bloom halo behind everything */}
      <sprite scale={[7.5, 7.5, 1]} position={[0, 0, -1.5]}>
        <spriteMaterial
          map={haloTexture}
          color={color}
          transparent
          opacity={light ? 0.22 : 0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={1}>
        <group
          ref={spinner}
          onClick={(e) => {
            e.stopPropagation();
            if (e.delta > 6) return;
            pop.current = 0.35;
            setColorIdx((i) => (i + 1) % palette.length);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh>
            <icosahedronGeometry args={[1.55, 0]} />
            <meshStandardMaterial
              ref={mat}
              color={color}
              emissive={color}
              emissiveIntensity={0.32}
              roughness={0.25}
              metalness={0.45}
              flatShading
            />
          </mesh>
          <mesh scale={1.24}>
            <icosahedronGeometry args={[1.55, 0]} />
            <meshBasicMaterial color={halo} wireframe transparent opacity={light ? 0.28 : 0.2} />
          </mesh>
        </group>
      </Float>

      {/* geodesic cage around the whole composition */}
      <mesh ref={cage}>
        <icosahedronGeometry args={[2.85, 1]} />
        <meshBasicMaterial color={halo} wireframe transparent opacity={light ? 0.1 : 0.07} />
      </mesh>

      {/* two little moons on tilted orbits */}
      <Orbit radius={2.55} speed={0.5} tiltZ={0.4} size={0.14} color={halo} />
      <Orbit radius={3.15} speed={-0.32} tiltZ={-0.55} size={0.1} color={light ? "#be185d" : "#ec4899"} />
    </group>
  );
}

function Orbit({
  radius,
  speed,
  tiltZ,
  size,
  color,
}: {
  radius: number;
  speed: number;
  tiltZ: number;
  size: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return (
    <group rotation={[0, 0, tiltZ]}>
      <group ref={ref}>
        <mesh position={[radius, 0, 0]}>
          <octahedronGeometry args={[size, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} flatShading />
        </mesh>
      </group>
      {/* faint orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only canvas mount guard, same as Starfield
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const light = theme === "light";
  if (!mounted) return <div className="h-[340px] sm:h-[420px] lg:h-[480px]" />;

  return (
    <div className="h-[340px] w-full sm:h-[420px] lg:h-[480px]">
      <Canvas
        key={theme}
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.8]}
      >
        <ambientLight intensity={light ? 0.9 : 0.55} />
        <directionalLight position={[4, 5, 6]} intensity={light ? 1.6 : 1.3} />
        <pointLight position={[-5, -3, 3]} intensity={28} color="#8b5cf6" />
        <pointLight position={[5, 2, -3]} intensity={20} color="#22d3ee" />
        <Crystal pointer={pointer} light={light} />
        <Sparkles
          count={60}
          scale={[9, 7, 5]}
          size={2}
          speed={0.3}
          opacity={light ? 0.65 : 0.45}
          color={light ? "#2563eb" : "#a5f3fc"}
        />
      </Canvas>
    </div>
  );
}
