import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CakeCanvas from './CakeCanvas';
import BirthdayCardModal from './BirthdayCardModal';
import KnifeCutOverlay from './KnifeCutOverlay';

export default function CakeSection() {
  const [cardOpen, setCardOpen] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);

  const handleSliceComplete = () => {
    setCakeCut(true);
    // Small delay before showing the card for dramatic effect
    setTimeout(() => setCardOpen(true), 200);
  };

  return (
    <>
      {/* ── Birthday Card Modal ── */}
      <BirthdayCardModal open={cardOpen} onClose={() => setCardOpen(false)} />

      <section
        id="cake-section"
        className="relative flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f0810 0%, #1a0a0a 40%, #120809 100%)' }}
      >
        {/* Background ambience blurs */}
        <div
          className="absolute top-20 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8B0000, transparent)' }}
        />
        <div
          className="absolute top-20 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8B0000, transparent)' }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-08 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent 70%)' }}
        />


        {/* Section Header */}
        <motion.div
          className="text-center mb-1 z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h1
            className="font-script text-6xl sm:text-7xl md:text-8xl mb-2"
            style={{
              background: 'linear-gradient(90deg, #C9A84C, #FFD700, #F5D280, #FFD700, #C9A84C)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer-slide 3s linear infinite',
              filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.4))',
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Happy Birthday!
          </motion.h1>
          <p
            className="text-base sm:text-lg font-light tracking-wide max-w-md mx-auto font-display italic"
            style={{ color: 'rgba(245,210,128,0.7)' }}
          >
            To my wonderful, beautiful sister
          </p>
        </motion.div>

        {/* ── 3D Cake Canvas + Knife overlay ── */}
        <motion.div
          className="relative z-10 w-full max-w-2xl mx-auto"
          style={{ height: 'clamp(360px, 55vh, 560px)' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* 3D cake (no click handler — knife takes over) */}
          <CakeCanvas />

          {/* Knife cut overlay on top of canvas */}
          <KnifeCutOverlay
            onSliceComplete={handleSliceComplete}
            disabled={cakeCut}
          />

          {/* Flash effect when cake is cut */}
          <AnimatePresence>
            {cakeCut && (
              <motion.div
                key="flash"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.6), rgba(255,255,255,0.3), transparent)', zIndex: 30 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, times: [0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom hints */}
        <motion.div
          className="mt-2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          {!cakeCut ? (
            <motion.p
              className="text-sm tracking-widest uppercase font-medium"
              style={{ color: 'rgba(212,175,55,0.7)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🔪 Kéo dao cắt bánh để mở thiệp 🔪
            </motion.p>
          ) : (
            <motion.p
              className="text-sm tracking-widest uppercase font-medium"
              style={{ color: 'rgba(212,175,55,0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✨ Cắt thành công! ✨
            </motion.p>
          )}
          <p className="text-xs" style={{ color: 'rgba(212,175,55,0.4)' }}>
            Kéo chuột để xoay 🖱️ · Scroll để zoom
          </p>
        </motion.div>

        {/* Floating decorative elements */}
        {[
          { emoji: '🕯️', left: '8%', top: '15%' },
          { emoji: '🕯️', left: '92%', top: '15%' },
          { emoji: '✨', left: '12%', top: '38%' },
          { emoji: '✨', left: '88%', top: '38%' },
          { emoji: '👑', left: '6%', top: '62%' },
          { emoji: '👑', left: '94%', top: '62%' },
          { emoji: '🌟', left: '15%', top: '82%' },
          { emoji: '🌟', left: '85%', top: '82%' },
        ].map((item, i) => (
          <motion.span
            key={i}
            className="absolute text-xl sm:text-2xl pointer-events-none select-none"
            style={{ left: item.left, top: item.top, opacity: 0.35 }}
            animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4 + (i % 5) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {item.emoji}
          </motion.span>
        ))}
      </section>
    </>
  );
}
