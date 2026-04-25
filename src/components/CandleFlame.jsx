import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Creates a radial glow texture for the flame halo sprites.
 */
function createGlowTexture(innerColor = [255, 255, 200], outerColor = [255, 160, 40]) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  gradient.addColorStop(0, `rgba(${innerColor.join(',')},1)`);
  gradient.addColorStop(0.15, `rgba(255,240,150,0.9)`);
  gradient.addColorStop(0.35, `rgba(${outerColor.join(',')},0.5)`);
  gradient.addColorStop(0.6, `rgba(255,100,20,0.15)`);
  gradient.addColorStop(1, 'rgba(255,80,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Shared glow texture (created once)
let _glowTexture = null;
function getGlowTexture() {
  if (!_glowTexture) _glowTexture = createGlowTexture();
  return _glowTexture;
}

/**
 * A single 3D candle with a multi-layered flickering flame, volumetric glow halo,
 * dynamic point lights, and sparkle emitter for a shimmering "lung linh" effect.
 *
 * Props:
 *   position – [x, y, z] of the candle base on the cake surface
 *   color    – candle body colour
 *   height   – candle stick height
 */
export default function CandleFlame({
  position = [0, 0, 0],
  color = '#FFB6C1',
  height = 0.55,
}) {
  const flameRef = useRef();
  const outerFlameRef = useRef();
  const haloRef = useRef();
  const haloRef2 = useRef();
  const lightRef = useRef();
  const lightRef2 = useRef();
  const sparkGroupRef = useRef();

  // Each candle gets its own random phase so they don't flicker in sync
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const phase2 = useMemo(() => Math.random() * Math.PI * 2 + 1.5, []);

  // Small sparkle particles floating up from the flame
  const sparks = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      offset: [
        (Math.random() - 0.5) * 0.06,
        Math.random() * 0.15,
        (Math.random() - 0.5) * 0.06,
      ],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Organic flicker: combine multiple sine waves at different frequencies
    const flicker =
      0.88 +
      0.12 * Math.sin(t * 14 + phase) +
      0.06 * Math.sin(t * 27 + phase * 1.7) +
      0.04 * Math.cos(t * 19 + phase * 2.3);

    const flickerSlow =
      0.9 + 0.1 * Math.sin(t * 5 + phase2);

    // Scale the inner bright core
    if (flameRef.current) {
      flameRef.current.scale.set(
        0.85 + 0.15 * Math.sin(t * 9 + phase),
        flicker,
        0.85 + 0.15 * Math.cos(t * 11 + phase),
      );
      // Slight sway
      flameRef.current.rotation.z = Math.sin(t * 6 + phase) * 0.08;
    }

    // Scale the outer glow envelope
    if (outerFlameRef.current) {
      outerFlameRef.current.scale.set(
        0.82 + 0.18 * Math.sin(t * 7 + phase + 1),
        0.82 + 0.18 * Math.cos(t * 13 + phase),
        0.82 + 0.18 * Math.sin(t * 9 + phase + 2),
      );
      outerFlameRef.current.rotation.z = Math.sin(t * 4 + phase) * 0.05;
    }

    // Pulsing glow halo
    if (haloRef.current) {
      const haloScale = 0.7 + 0.3 * flicker * flickerSlow;
      haloRef.current.scale.set(haloScale, haloScale, 1);
      haloRef.current.material.opacity = 0.25 + 0.15 * flicker;
    }

    // Second larger, softer halo
    if (haloRef2.current) {
      const h2Scale = 0.6 + 0.4 * flickerSlow;
      haloRef2.current.scale.set(h2Scale, h2Scale, 1);
      haloRef2.current.material.opacity = 0.12 + 0.08 * flicker;
    }

    // Fluctuate the main point-light intensity
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + 0.8 * flicker;
      // Subtle color temperature shift
      const warmth = 0.5 + 0.5 * Math.sin(t * 3 + phase);
      lightRef.current.color.setHSL(0.1 + warmth * 0.02, 0.9, 0.6);
    }

    // Secondary softer fill light
    if (lightRef2.current) {
      lightRef2.current.intensity = 0.4 + 0.3 * flickerSlow;
    }

    // Animate spark particles floating upward
    if (sparkGroupRef.current) {
      sparkGroupRef.current.children.forEach((spark, i) => {
        const s = sparks[i];
        const cycle = ((t * s.speed + s.phase) % 1);
        spark.position.y = cycle * 0.25;
        spark.position.x = s.offset[0] + Math.sin(t * 3 + s.phase) * 0.015;
        spark.position.z = s.offset[2] + Math.cos(t * 4 + s.phase) * 0.015;
        spark.material.opacity = cycle < 0.7 ? 0.8 * (1 - cycle / 0.7) : 0;
        const sparkScale = 0.5 + 0.5 * (1 - cycle);
        spark.scale.set(sparkScale, sparkScale, sparkScale);
      });
    }
  });

  const candleRadius = 0.06;
  // flameY is in LOCAL space (group is already translated to `position`)
  // Wick top = height + 0.06; flame sits just above the wick tip
  const flameY = height + 0.08;

  return (
    <group position={position}>
      {/* ── Candle body ── */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[candleRadius, candleRadius, height, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* ── Candle body highlight stripe ── */}
      <mesh position={[candleRadius * 0.7, height / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, height * 0.9, 8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.15}
          roughness={0.3}
        />
      </mesh>

      {/* ── Wick ── */}
      <mesh position={[0, height + 0.03, 0]}>
        <cylinderGeometry args={[0.008, 0.006, 0.06, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={1} />
      </mesh>

      {/* ── Wick ember glow (base of flame) ── */}
      <mesh position={[0, height + 0.06, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial
          color="#FF6600"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Outer flame glow (translucent orange envelope) ── */}
      <mesh ref={outerFlameRef} position={[0, flameY, 0]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Inner bright flame core (cone shape) ── */}
      <mesh ref={flameRef} position={[0, flameY, 0]}>
        <coneGeometry args={[0.028, 0.1, 12]} />
        <meshBasicMaterial
          color="#FFEA00"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── White-hot center of flame ── */}
      <mesh position={[0, flameY - 0.01, 0]}>
        <coneGeometry args={[0.012, 0.04, 8]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Volumetric glow halo (billboard sprite) ── */}
      <sprite ref={haloRef} position={[0, flameY + 0.02, 0]} scale={[0.35, 0.35, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#FFCC44"
        />
      </sprite>

      {/* ── Larger soft ambient halo ── */}
      <sprite ref={haloRef2} position={[0, flameY + 0.01, 0]} scale={[0.55, 0.55, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#FF9933"
        />
      </sprite>

      {/* ── Floating spark particles ── */}
      <group ref={sparkGroupRef} position={[0, flameY + 0.05, 0]}>
        {sparks.map((s, i) => (
          <mesh key={i} position={s.offset}>
            <sphereGeometry args={[0.006, 6, 6]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.8}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* ── Main point light for real-time illumination ── */}
      <pointLight
        ref={lightRef}
        position={[0, flameY + 0.05, 0]}
        color="#FFCC44"
        intensity={1.5}
        distance={3.5}
        decay={2}
        castShadow={false}
      />

      {/* ── Secondary softer warm fill light ── */}
      <pointLight
        ref={lightRef2}
        position={[0, flameY - 0.05, 0]}
        color="#FF8844"
        intensity={0.5}
        distance={2}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}
