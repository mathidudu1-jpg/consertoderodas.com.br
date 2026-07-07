"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { Suspense, useEffect, type MutableRefObject } from "react";
import Wheel3D from "./Wheel3D";

export default function WheelCanvas({
  progressRef,
  spin = 0.25,
  interactive = false,
  tilt = [-0.18, -0.35],
  className,
}: {
  progressRef: MutableRefObject<number>;
  spin?: number;
  interactive?: boolean;
  tilt?: [number, number];
  className?: string;
}) {
  // Garante que o R3F meça o container mesmo se o ResizeObserver não disparar
  // na montagem inicial (acontece em alguns navegadores/iframes).
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const t1 = setTimeout(fire, 60);
    const t2 = setTimeout(fire, 320);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Canvas
      className={className}
      resize={{ debounce: 0 }}
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 38 }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <directionalLight position={[-6, -2, 3]} intensity={0.7} color="#8fb0ff" />

      <Suspense fallback={null}>
        <Wheel3D
          progressRef={progressRef}
          spin={spin}
          interactive={interactive}
          tilt={tilt}
        />

        {/* Ambiente de estúdio gerado em cena — reflexos metálicos sem HDR externo */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={3}
            position={[0, 3, 4]}
            scale={[10, 3, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[-5, 1, 2]}
            scale={[6, 6, 1]}
            color="#2b6bff"
          />
          <Lightformer
            form="ring"
            intensity={2.5}
            position={[4, 0, 3]}
            scale={[4, 4, 1]}
            color="#bfd1ff"
          />
          <Lightformer
            form="circle"
            intensity={1.5}
            position={[0, -4, 2]}
            scale={[8, 8, 1]}
            color="#0f57fb"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
