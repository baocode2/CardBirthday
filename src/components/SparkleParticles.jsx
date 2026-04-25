import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 200;

export default function SparkleParticles({ radius = 2.8, height = 3 }) {
  const pointsRef = useRef();

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Distribute in a cylindrical shell around the cake
      const angle = Math.random() * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.4);
      const y = (Math.random() - 0.3) * height;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * r;

      sizes[i] = 0.02 + Math.random() * 0.04;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, phases };
  }, [radius, height]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pts = pointsRef.current;
    if (!pts) return;

    // Slowly rotate the whole particle cloud
    pts.rotation.y = t * 0.08;

    // Twinkle: modulate each particle's size
    const sizeAttr = pts.geometry.attributes.size;
    for (let i = 0; i < COUNT; i++) {
      const base = sizes[i];
      const twinkle = 0.5 + 0.5 * Math.sin(t * 3 + phases[i]);
      sizeAttr.array[i] = base * twinkle;
    }
    sizeAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        color="#FFD700"
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={createSparkleTexture()}
      />
    </points>
  );
}

/**
 * Programmatic radial gradient dot used as the particle sprite.
 */
function createSparkleTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,223,100,0.8)');
  gradient.addColorStop(0.7, 'rgba(255,180,50,0.3)');
  gradient.addColorStop(1, 'rgba(255,150,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
