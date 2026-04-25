import { motion } from 'motion/react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background decorative elements – balanced symmetrically */}
      {/* Top-left glow */}
      <div
        className="absolute top-10 left-10 w-40 h-40 sm:w-64 sm:h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }}
      />
      {/* Top-right glow (mirror of top-left) */}
      <div
        className="absolute top-10 right-10 w-40 h-40 sm:w-64 sm:h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }}
      />
      {/* Bottom-left glow */}
      <div
        className="absolute bottom-20 left-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F8B4C8, transparent)' }}
      />
      {/* Bottom-right glow (mirror of bottom-left) */}
      <div
        className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F8B4C8, transparent)' }}
      />
      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8A87C, transparent)' }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Small top tag */}
        <motion.div
          className="inline-block mb-6"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="glass px-5 py-2 rounded-full text-sm font-medium text-[#6B4226]/80 tracking-wider">
            ✨ A Special Day ✨
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 leading-none"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="shimmer-text">Happy</span>
          <br />
          <span className="shimmer-text">Birthday!</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-display text-lg sm:text-xl md:text-2xl text-[#3D2914]/70 font-light mb-2 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          To my wonderful, beautiful sister
        </motion.p>

        {/* Name placeholder */}
        <motion.h2
          className="font-script text-3xl sm:text-4xl md:text-5xl text-[#E8A87C] mt-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          style={{ textShadow: '0 0 30px rgba(232,168,124,0.3)' }}
        >
          💖 [Sister's Name] 💖
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-xl">🌸</span>
          <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        {/* CTA */}
        <motion.p
          className="text-sm sm:text-base text-[#6B4226]/50 tracking-widest uppercase font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          Scroll down to discover your surprises
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-50">
              <path d="M7 10L12 15L17 10" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements – symmetric pairs */}
      {[
        { emoji: '🌸', left: '8%',  top: '15%' },
        { emoji: '🌸', left: '92%', top: '15%' },
        { emoji: '✨', left: '12%', top: '35%' },
        { emoji: '✨', left: '88%', top: '35%' },
        { emoji: '💕', left: '6%',  top: '60%' },
        { emoji: '💕', left: '94%', top: '60%' },
        { emoji: '🌟', left: '15%', top: '75%' },
        { emoji: '🌟', left: '85%', top: '75%' },
        { emoji: '🌺', left: '5%',  top: '45%' },
        { emoji: '🌺', left: '95%', top: '45%' },
        { emoji: '💫', left: '10%', top: '85%' },
        { emoji: '💫', left: '90%', top: '85%' },
      ].map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-xl sm:text-2xl pointer-events-none select-none opacity-40"
          style={{
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + (i % 6) * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.25,
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </section>
  );
}
