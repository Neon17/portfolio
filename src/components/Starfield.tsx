"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/lib/useIsMobile";

function makeStarTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.85)");
  g.addColorStop(0.5, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function StarLayer({
  count,
  radius,
  size,
  speed,
  hueShift,
  texture,
  light,
}: {
  count: number;
  radius: number;
  size: number;
  speed: number;
  hueShift: number;
  texture: THREE.Texture;
  light: boolean;
}) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    let seed = 1337 + hueShift * 999;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < count; i++) {
      const r = radius * (0.6 + rand() * 0.4);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = rand();
      if (light) {
        // Blue glowing dots for the milky light theme (normal blending → visible on cream).
        const hue = 0.58 + t * 0.07 + hueShift * 0.2; // blues → indigo
        color.setHSL(hue, 0.75, 0.42 + rand() * 0.15);
      } else {
        // Mostly soft-white with aurora tints for the night sky.
        const hue = (0.58 + t * 0.35 + hueShift) % 1;
        const sat = t > 0.55 ? 0.7 : 0.25;
        color.setHSL(hue, sat, 0.7 + rand() * 0.3);
      }
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count, radius, hueShift, light]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.35;
    const mat = ref.current.material as THREE.PointsMaterial;
    const base = light ? 0.8 : 0.7;
    mat.opacity = base + Math.sin(state.clock.elapsedTime * 0.4 + hueShift * 10) * 0.18;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={texture}
        alphaMap={texture}
        vertexColors
        transparent
        opacity={0.9}
        alphaTest={0.01}
        sizeAttenuation
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShootingStar({ light }: { light: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const start = useMemo(() => new THREE.Vector3(-40, 30, -20), []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime % 8) / 8;
    ref.current.position.set(start.x + t * 80, start.y - t * 50, start.z + t * 20);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = t < 0.1 || t > 0.4 ? 0 : (1 - (t - 0.1) / 0.3) * (light ? 0.7 : 1);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.22, 8, 8]} />
      <meshBasicMaterial color={light ? "#2563eb" : "#a5f3fc"} transparent opacity={0} />
    </mesh>
  );
}

function Scene({ light, mobile }: { light: boolean; mobile: boolean }) {
  const texture = useMemo(() => makeStarTexture(), []);
  // Phones get ~40% of the stars — the sky still reads full but stays smooth.
  const far = mobile ? 620 : 1500;
  const near = mobile ? 300 : 700;
  return (
    <>
      <StarLayer count={far} radius={30} size={light ? 0.22 : 0.26} speed={0.012} hueShift={0} texture={texture} light={light} />
      <StarLayer count={near} radius={16} size={light ? 0.4 : 0.46} speed={0.03} hueShift={0.25} texture={texture} light={light} />
      <ShootingStar light={light} />
    </>
  );
}

export default function Starfield() {
  const { theme } = useTheme();
  const mobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const light = theme === "light";

  return (
    <>
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <Canvas
          key={theme} /* rebuild materials (blending) on theme change */
          camera={{ position: [0, 0, 1], fov: 75 }}
          gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
          dpr={mobile ? [1, 1.5] : [1, 1.8]}
        >
          <Scene light={light} mobile={mobile} />
        </Canvas>
      </div>
      <div className="sky-scrim" />
    </>
  );
}
