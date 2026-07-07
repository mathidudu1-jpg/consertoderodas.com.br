"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Estados de material para cada uma das 10 etapas do conserto.
 * O progresso (0..1) é interpolado entre esses keyframes, então a
 * roda "renasce" enquanto o usuário rola a seção do processo.
 */
type KF = {
  body: string; // cor do corpo/raios
  met: number; // metalness
  rough: number; // roughness
  cc: number; // clearcoat (verniz)
  ring: number; // brilho do anel técnico azul (gabarito / CNC)
  tire: number; // opacidade do pneu
  rim: number; // intensidade da luz de contorno azul
};

const KFS: KF[] = [
  { body: "#54585d", met: 0.25, rough: 0.96, cc: 0, ring: 0.0, tire: 1, rim: 0.15 }, // 1 preparação
  { body: "#5b5f64", met: 0.32, rough: 0.9, cc: 0, ring: 1.0, tire: 0, rim: 0.2 }, // 2 gabaritos
  { body: "#71757a", met: 0.55, rough: 0.78, cc: 0, ring: 0.25, tire: 0, rim: 0.25 }, // 3 torno
  { body: "#9aa0a6", met: 0.88, rough: 0.5, cc: 0, ring: 0.0, tire: 0, rim: 0.3 }, // 4 limpeza
  { body: "#6f7a6b", met: 0.05, rough: 1.0, cc: 0, ring: 0.0, tire: 0, rim: 0.3 }, // 5 fundo (primer)
  { body: "#b8bfc7", met: 0.55, rough: 0.5, cc: 0.2, ring: 0.0, tire: 0, rim: 0.4 }, // 6 pintura
  { body: "#cfd6dd", met: 1.0, rough: 0.16, cc: 0.4, ring: 1.0, tire: 0, rim: 0.55 }, // 7 diamantação
  { body: "#cdd4db", met: 0.92, rough: 0.06, cc: 1, ring: 0.15, tire: 0, rim: 0.7 }, // 8 verniz
  { body: "#d2d9e0", met: 0.94, rough: 0.05, cc: 1, ring: 0.0, tire: 0, rim: 0.85 }, // 9 secagem
  { body: "#d9e0e8", met: 1.0, rough: 0.04, cc: 1, ring: 0.0, tire: 1, rim: 1.0 }, // 10 entrega
];

function sampleKF(p: number) {
  const n = KFS.length - 1;
  const f = THREE.MathUtils.clamp(p, 0, 1) * n;
  const lo = Math.floor(f);
  const hi = Math.min(lo + 1, n);
  const t = f - lo;
  const a = KFS[lo];
  const b = KFS[hi];
  return {
    met: THREE.MathUtils.lerp(a.met, b.met, t),
    rough: THREE.MathUtils.lerp(a.rough, b.rough, t),
    cc: THREE.MathUtils.lerp(a.cc, b.cc, t),
    ring: THREE.MathUtils.lerp(a.ring, b.ring, t),
    tire: THREE.MathUtils.lerp(a.tire, b.tire, t),
    rim: THREE.MathUtils.lerp(a.rim, b.rim, t),
    colA: a.body,
    colB: b.body,
    t,
  };
}

const SPOKES = 10;

export default function Wheel3D({
  progressRef,
  spin = 0.25,
  interactive = false,
  tilt = [-0.18, -0.35],
}: {
  progressRef: MutableRefObject<number>;
  spin?: number;
  interactive?: boolean;
  tilt?: [number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const { pointer } = useThree();

  const cA = useMemo(() => new THREE.Color(), []);
  const cB = useMemo(() => new THREE.Color(), []);

  // Material único do corpo — compartilhado por todos os raios/aros/cubo,
  // mutado a cada frame para evoluir com o progresso.
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#54585d"),
        metalness: 0.25,
        roughness: 0.96,
        clearcoat: 0,
        clearcoatRoughness: 0.15,
      }),
    []
  );
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const tireMat = useRef<THREE.MeshStandardMaterial>(null);

  const spokes = useMemo(
    () => Array.from({ length: SPOKES }).map((_, i) => ({ a: (i / SPOKES) * Math.PI * 2 })),
    []
  );
  const lugs = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return { x: Math.cos(a) * 0.62, y: Math.sin(a) * 0.62 };
      }),
    []
  );

  useFrame((_, dt) => {
    const s = sampleKF(progressRef.current);

    cA.set(s.colA);
    cB.set(s.colB);
    cA.lerp(cB, s.t);
    bodyMat.color.copy(cA);
    bodyMat.metalness = s.met;
    bodyMat.roughness = s.rough;
    bodyMat.clearcoat = s.cc;

    if (ringMat.current) {
      ringMat.current.emissiveIntensity = s.ring * 2.4;
      ringMat.current.opacity = 0.2 + s.ring * 0.8;
    }
    if (tireMat.current) tireMat.current.opacity = s.tire;
    if (rimLight.current) rimLight.current.intensity = 6 + s.rim * 34;

    if (spinner.current) {
      spinner.current.rotation.z -= dt * spin;
      spinner.current.rotation.z -= dt * progressRef.current * 0.5;
    }

    if (interactive && group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        tilt[1] + pointer.x * 0.35,
        0.06
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        tilt[0] + pointer.y * 0.2,
        0.06
      );
    }
  });

  return (
    <group ref={group} rotation={[tilt[0], tilt[1], 0]}>
      <pointLight ref={rimLight} position={[0, 0, -2.6]} color="#0f57fb" distance={12} />

      <group ref={spinner}>
        {/* Pneu */}
        <mesh>
          <torusGeometry args={[2.04, 0.44, 24, 64]} />
          <meshStandardMaterial
            ref={tireMat}
            color="#0b0d12"
            roughness={0.92}
            metalness={0.1}
            transparent
            opacity={1}
          />
        </mesh>

        {/* Lábio externo polido */}
        <mesh>
          <torusGeometry args={[1.96, 0.12, 20, 72]} />
          <meshPhysicalMaterial color="#d9e0e8" metalness={1} roughness={0.12} clearcoat={1} />
        </mesh>

        {/* Anel técnico azul (gabarito / CNC) */}
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[1.72, 0.03, 12, 80]} />
          <meshStandardMaterial
            ref={ringMat}
            color="#0f57fb"
            emissive="#3b82ff"
            emissiveIntensity={0}
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Barril / disco escuro visível pelas janelas */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.28]}>
          <cylinderGeometry args={[1.9, 1.86, 0.7, 64]} />
          <meshStandardMaterial color="#15181f" metalness={0.6} roughness={0.55} side={THREE.DoubleSide} />
        </mesh>

        {/* Corpo (material compartilhado que evolui) */}
        {spokes.map((sp, i) => (
          <mesh key={i} rotation={[0, 0, sp.a]} position={[0, 1.15, 0.06]} material={bodyMat}>
            <boxGeometry args={[0.34, 1.5, 0.34]} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.05]} material={bodyMat}>
          <torusGeometry args={[1.7, 0.14, 16, 72]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]} material={bodyMat}>
          <cylinderGeometry args={[0.62, 0.62, 0.34, 48]} />
        </mesh>

        {/* Parafusos */}
        {lugs.map((l, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[l.x, l.y, 0.28]}>
            <cylinderGeometry args={[0.075, 0.075, 0.12, 6]} />
            <meshStandardMaterial color="#0c0e13" metalness={0.9} roughness={0.35} />
          </mesh>
        ))}

        {/* Tampa central azul */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.34, 0.34, 0.08, 40]} />
          <meshStandardMaterial
            color="#0f57fb"
            metalness={0.5}
            roughness={0.35}
            emissive="#0f2d8a"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
