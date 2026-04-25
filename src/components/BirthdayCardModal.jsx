import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useEffect, useState } from 'react';

function FloatingBalloons() {
  const [windowHeight, setWindowHeight] = useState(1000);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const balloons = useMemo(() => Array.from({length: 15}).map((_, i) => ({
    id: i,
    color: ['#FF69B4', '#FFD700', '#FF4500', '#00CED1', '#1E90FF', '#FFB6C1'][i % 6],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.8,
    duration: 4 + Math.random() * 3,
    scale: 0.6 + Math.random() * 0.6,
    xOffset: (Math.random() - 0.5) * 100
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
       {balloons.map(b => (
         <motion.div
           key={b.id}
           className="absolute"
           style={{ left: b.left, bottom: '-150px' }}
           initial={{ y: 0, x: 0, opacity: 0 }}
           animate={{ y: -windowHeight - 300, x: b.xOffset, opacity: [0, 1, 1, 0] }}
           transition={{ delay: b.delay, duration: b.duration, ease: 'easeOut' }}
         >
           {/* Balloon SVG */}
           <svg width="40" height="60" viewBox="0 0 40 60" style={{ transform: `scale(${b.scale})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
             <path d="M 20 0 C 40 0 40 25 20 40 C 0 25 0 0 20 0 Z" fill={b.color} />
             <path d="M 20 40 L 17 45 L 23 45 Z" fill={b.color} />
             <path d="M 20 45 Q 15 55 25 60" stroke="rgba(255,255,255,0.7)" fill="none" strokeWidth="1" opacity="0.8"/>
             {/* Highlight */}
             <path d="M 12 10 Q 18 5 22 8" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" fill="none" />
           </svg>
         </motion.div>
       ))}
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   BirthdayCardModal
   Shown as a full-screen overlay when the cake is clicked.
   ────────────────────────────────────────────────────── */
export default function BirthdayCardModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="card-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(15,10,5,0.88) 0%, rgba(5,3,2,0.95) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Floating balloons effect */}
          <FloatingBalloons />

          {/* Card itself – prevents close on internal click */}
          <motion.div
            className="relative max-w-lg w-full mx-auto"
            initial={{ scale: 0.75, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-1 rounded-3xl opacity-60 blur-xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #FF69B4, #D4AF37)' }}
            />

            {/* Card body */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(212,175,55,0.08) 50%, rgba(139,0,0,0.1) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(212,175,55,0.45)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              {/* Animated shimmer top bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: 'linear-gradient(90deg, #8B0000, #D4AF37, #FFD700, #D4AF37, #8B0000)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer-slide 3s linear infinite',
                }}
              />

              <div className="p-8 sm:p-10 relative z-10">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 text-xl font-bold"
                  aria-label="Close"
                  style={{ zIndex: 1000, pointerEvents: 'auto' }}
                >
                  ✕
                </button>

                {/* Crown icon */}
                <motion.div
                  className="text-center mb-5"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-5xl sm:text-6xl block mb-2" style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.7))' }}>
                    👑
                  </span>
                  <div
                    className="w-20 h-0.5 mx-auto rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                  />
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="font-script text-4xl sm:text-5xl text-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  style={{
                    background: 'linear-gradient(90deg, #C9A84C, #FFD700, #F5D280, #FFD700, #C9A84C)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer-slide 3s linear infinite',
                    textShadow: 'none',
                  }}
                >
                  Happy BirthDay
                </motion.h2>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
                  <span className="text-lg" style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }}>🕯️</span>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
                </div>

                {/* Messages */}
                <motion.div
                  className="space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                >
                  <p
                    className="font-display text-base sm:text-lg italic leading-relaxed"
                    style={{ color: 'rgba(255,248,220,0.92)' }}
                  >
                    "Chúc chị gái yêu một ngày sinh nhật thật hạnh phúc và tràn đầy niềm vui! 🎂"
                  </p>

                  <p
                    className="font-display text-sm sm:text-base leading-relaxed"
                    style={{ color: 'rgba(255,240,200,0.75)' }}
                  >
                    Chúc một tuổi mới đầy sức khỏe, thành công và tất cả những điều xinh đẹp nhất! 🌸
                  </p>

                  <p
                    className="font-display text-sm sm:text-base leading-relaxed"
                    style={{ color: 'rgba(255,240,200,0.75)' }}
                  >
                    Chúc chị luôn tỏa sáng như ánh mặt trời, luôn xinh đẹp và vui vẻ mãi mãi! ☀️✨
                  </p>
                </motion.div>

                {/* Bottom divider + signature */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
                    <span className="text-base">🌺</span>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
                  </div>
                  <p
                    className="font-script text-2xl sm:text-3xl"
                    style={{ color: '#E8A87C', textShadow: '0 0 20px rgba(232,168,124,0.4)' }}
                  >
                    Yêu thương luôngg ❤️
                  </p>
                  <p className="text-xs tracking-widest uppercase mt-1 font-medium" style={{ color: 'rgba(212,175,55,0.5)' }}>
                    — From your big bro —
                  </p>
                </motion.div>

                {/* Glitter dots */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                        background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF69B4' : '#FFFFFF',
                        left: `${5 + Math.random() * 90}%`,
                        top: `${5 + Math.random() * 90}%`,
                        animation: `twinkle ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite`,
                        boxShadow: '0 0 5px rgba(255,215,0,0.6)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom shimmer bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: 'linear-gradient(90deg, #8B0000, #D4AF37, #FFD700, #D4AF37, #8B0000)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer-slide 3s linear infinite reverse',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
