import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 35;

function createParticle() {
  return {
    id: Math.random(),
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 6,
    size: 2 + Math.random() * 6,
    type: Math.random() > 0.5 ? 'star' : 'circle',
    drift: (Math.random() - 0.5) * 60,
  };
}

export default function Particles() {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, createParticle)
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute block"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              p.type === 'star'
                ? 'radial-gradient(circle, #FFD700, rgba(255,215,0,0))'
                : 'radial-gradient(circle, #F8B4C8, rgba(248,180,200,0))',
            borderRadius: p.type === 'circle' ? '50%' : '2px',
            animation: `sparkle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: 'blur(0.5px)',
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}

      {/* Twinkling stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={`twinkle-${i}`}
          className="absolute block rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: '#FFD700',
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 4}s infinite`,
            boxShadow: '0 0 6px rgba(255,215,0,0.6)',
          }}
        />
      ))}
    </div>
  );
}
