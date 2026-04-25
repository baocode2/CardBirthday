import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import CandleFlame from './CandleFlame';

/* ─────────────────────────────────────────────
   Pearl bead decoration
   ───────────────────────────────────────────── */
function Pearl({ position, size = 0.04, color = '#FFFFFF' }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={color}
        roughness={0.15}
        metalness={0.4}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Pearl ring around a tier edge
   ───────────────────────────────────────────── */
function PearlRing({ radius, y, count = 28, color = '#FFFFFF', size = 0.038 }) {
  const pearls = useMemo(() =>
    Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      ];
    }),
  [radius, y, count]);

  return (
    <>
      {pearls.map((pos, i) => (
        <Pearl key={i} position={pos} color={color} size={size} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Ornamental decorative ring (torus)
   ───────────────────────────────────────────── */
function OrnamentRing({ radius, y, color = '#D4AF37', tubeRadius = 0.018 }) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tubeRadius, 12, 64]} />
      <meshStandardMaterial
        color={color}
        roughness={0.15}
        metalness={0.85}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Quilted diamond pattern studs on a tier
   ───────────────────────────────────────────── */
function QuiltStuds({ radius, yBase, height, rows = 3, color = '#D4AF37' }) {
  const studs = useMemo(() => {
    const result = [];
    for (let row = 0; row < rows; row++) {
      const y = yBase + (height / (rows + 1)) * (row + 1);
      const count = Math.round(radius * 28);
      const offset = row % 2 === 0 ? 0 : Math.PI / count;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + offset;
        result.push([Math.cos(angle) * (radius + 0.005), y, Math.sin(angle) * (radius + 0.005)]);
      }
    }
    return result;
  }, [radius, yBase, height, rows]);

  return (
    <>
      {studs.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.1}
            metalness={0.9}
            emissive={color}
            emissiveIntensity={0.07}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Royal Crown on top of the cake
   ───────────────────────────────────────────── */
function RoyalCrown({ y }) {
  const crownColor = '#D4AF37';
  const gemColors = ['#FF0000', '#1E90FF', '#FF1493', '#00CED1', '#FF4500'];
  const points = 5;

  const spikes = useMemo(() =>
    Array.from({ length: points }).map((_, i) => {
      const angle = (i / points) * Math.PI * 2;
      return { angle, x: Math.cos(angle) * 0.22, z: Math.sin(angle) * 0.22 };
    }),
  []);

  return (
    <group position={[0, y, 0]}>
      {/* Crown base band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.045, 12, 64]} />
        <meshStandardMaterial color={crownColor} roughness={0.1} metalness={0.95} emissive={crownColor} emissiveIntensity={0.1} />
      </mesh>

      {/* Crown cylinder body */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.245, 0.245, 0.08, 64, 1, true]} />
        <meshStandardMaterial color={crownColor} roughness={0.15} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Crown spikes */}
      {spikes.map((s, i) => (
        <group key={i}>
          <mesh position={[s.x, 0.1, s.z]}>
            <coneGeometry args={[0.035, 0.2, 8]} />
            <meshStandardMaterial color={crownColor} roughness={0.12} metalness={0.92} emissive={crownColor} emissiveIntensity={0.08} />
          </mesh>
          {/* Gem on spike tip */}
          <mesh position={[s.x * 0.95, 0.2, s.z * 0.95]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial
              color={gemColors[i]}
              roughness={0.0}
              metalness={0.1}
              emissive={gemColors[i]}
              emissiveIntensity={0.5}
              transparent
              opacity={0.92}
            />
          </mesh>
        </group>
      ))}

      {/* Center large gem */}
      <mesh position={[0, 0.0, 0.25]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial
          color="#FF0000"
          roughness={0.0}
          metalness={0.05}
          emissive="#FF3300"
          emissiveIntensity={0.7}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Crown base extra ring with pearls */}
      <PearlRing radius={0.26} y={-0.08} count={20} color="#FFFEF0" size={0.025} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   A single royal cake tier
   ───────────────────────────────────────────── */
function RoyalTier({ radius, height, y, bodyColor, isDark = false, hasText = false }) {
  const topY = y + height;

  return (
    <group>
      <group position={[0, y + height / 2, 0]}>
        {/* Main tier body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, height, 64]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={isDark ? 0.5 : 0.35}
            metalness={isDark ? 0.05 : 0.02}
          />
        </mesh>

        {/* Quilted stud pattern for tier 2 (white) */}
        {!isDark && (
          <QuiltStuds
            radius={radius}
            yBase={-height / 2}
            height={height}
            rows={3}
            color="#D4AF37"
          />
        )}

        {/* Golden Text wrapped on bottom tier */}
        {hasText && (
          <group>
            {[
              { c: 'L', a: -0.32 },
              { c: 'i', a: -0.19 },
              { c: 'n', a: -0.10 },
              { c: 'h', a:  0.03 },
              { c: '-', a:  0.15 },
              { c: '1', a:  0.25 },
              { c: '8', a:  0.37 }
            ].map((item, i) => {
              const x = Math.sin(item.a) * (radius + 0.005);
              const z = Math.cos(item.a) * (radius + 0.005);
              return (
                <Text
                  key={i}
                  position={[x, 0, z]}
                  rotation={[0, item.a, 0]}
                  fontSize={0.28}
                  color="#FFD700"
                  anchorX="center"
                  anchorY="middle"
                  material-toneMapped={false}
                >
                  {item.c}
                </Text>
              )
            })}
          </group>
        )}
      </group>

      {/* Top ornament ring */}
      <OrnamentRing radius={radius + 0.01} y={topY} color="#D4AF37" />

      {/* Bottom ornament ring */}
      <OrnamentRing radius={radius + 0.01} y={y} color="#D4AF37" />

      {/* Pearl ring at the top */}
      <PearlRing
        radius={radius + 0.025}
        y={topY + 0.015}
        count={Math.round(radius * 36)}
        color="#FFFEF0"
        size={0.032}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────
   Main Royal CakeModel
   ───────────────────────────────────────────── */
export default function CakeModel({ onClick }) {
  const groupRef = useRef();

  // Gentle float + very slow idle rotation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.05;
      groupRef.current.rotation.y = t * 0.04;
    }
  });

  /* Tier definitions: bottom→top
     Tier 0 = Crimson red (bottom)
     Tier 1 = Ivory white quilted (middle)
     Tier 2 = Rich gold (top)
  */
  const tiers = [
    { radius: 1.15, height: 0.65, y: 0.0,  bodyColor: '#8B0000', isDark: true, hasText: true },  // crimson bottom
    { radius: 0.82, height: 0.58, y: 0.68, bodyColor: '#FAF0E6', isDark: false }, // ivory middle
    { radius: 0.52, height: 0.50, y: 1.29, bodyColor: '#BF9B30', isDark: true },  // gold top
  ];

  // Candles on top of the top tier (royal arrangement)
  const topTierTopY = 1.29 + 0.50;
  const candleCount = 8;
  const candlePositions = useMemo(() =>
    Array.from({ length: candleCount }).map((_, i) => {
      const angle = (i / candleCount) * Math.PI * 2;
      const r = 0.3;
      return [Math.cos(angle) * r, topTierTopY + 0.02, Math.sin(angle) * r];
    }),
  [topTierTopY]);

  const candleColors = [
    '#FFD700', '#FF69B4', '#FFD700', '#87CEEB',
    '#FFD700', '#FF69B4', '#FFD700', '#FF6B6B',
  ];

  // Crown position: sits right above the top tier
  const crownY = topTierTopY + 0.42;

  return (
    <group ref={groupRef} onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* ── Gold base platter ── */}
      <mesh position={[0, -0.06, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.50, 1.55, 0.10, 64]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.12} metalness={0.92} emissive="#C9A84C" emissiveIntensity={0.05} />
      </mesh>
      {/* Platter rim pearl ring */}
      <PearlRing radius={1.52} y={0.0} count={48} color="#FFFEF0" size={0.028} />
      {/* Platter edge ring */}
      <OrnamentRing radius={1.52} y={0.0} color="#D4AF37" tubeRadius={0.022} />

      {/* ── Cake Tiers ── */}
      {tiers.map((t, i) => (
        <RoyalTier key={i} {...t} />
      ))}

      {/* ── Connecting tier transition discs ── */}
      {/* Between tier 0 and 1 */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.84, 1.17, 0.05, 64]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.12} metalness={0.92} />
      </mesh>
      {/* Between tier 1 and 2 */}
      <mesh position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.54, 0.84, 0.05, 64]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.12} metalness={0.92} />
      </mesh>

      {/* ── Royal Candles ── */}
      {candlePositions.map((pos, i) => (
        <CandleFlame
          key={i}
          position={pos}
          color={candleColors[i]}
          height={0.42 + (i % 2) * 0.06}
        />
      ))}

      {/* ── Royal Crown ── */}
      <RoyalCrown y={crownY} />

      {/* ── Crown glow light ── */}
      <pointLight
        position={[0, crownY + 0.2, 0]}
        color="#FFD700"
        intensity={1.2}
        distance={3}
        decay={2}
      />
    </group>
  );
}
