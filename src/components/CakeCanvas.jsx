import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import CakeModel from './CakeModel';
import SparkleParticles from './SparkleParticles';

function CanvasLoader() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#D4AF37" wireframe />
    </mesh>
  );
}

/**
 * Props:
 *  onCakeClick – callback fired when user clicks on the cake mesh
 */
export default function CakeCanvas() {
  return (
    <div className="w-full h-full" style={{ minHeight: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.8, 3.5, 4.0], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<CanvasLoader />}>
          {/* ── Lighting ── */}
          <ambientLight intensity={0.5} color="#FFF5EE" />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.2}
            color="#FFF0E5"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={20}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={5}
            shadow-camera-bottom={-3}
          />
          <directionalLight position={[-4, 6, -4]} intensity={0.5} color="#FFE8C0" />
          <pointLight position={[-5, -5, -5]} intensity={0.6} color="#ffecd1" />

          {/* ── Studio environment ── */}
          <Environment preset="studio" />

          {/* ── Royal Cake ── */}
          <group scale={[1.15, 1.15, 1.15]} position={[0, -0.3, 0]}>
            <CakeModel />
          </group>

          {/* ── Sparkle particles ── */}
          <SparkleParticles radius={2.8} height={4} />

          {/* ── Ground shadow ── */}
          <ContactShadows
            position={[0, -0.15, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
            color="#8B0000"
          />

          {/* ── OrbitControls ── */}
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
