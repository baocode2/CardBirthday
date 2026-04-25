import { motion } from 'motion/react';
import CakeSection from './components/CakeSection';
import Particles from './components/Particles';

export default function App() {
  return (
    <div className="relative">
      {/* Global sparkle overlay */}
      <Particles />

      {/* Section 1: Royal Birthday Cake – click cake to open card */}
      <CakeSection />

      {/* Footer */}
      <footer
        className="relative py-14 text-center"
        style={{ background: '#0a0608' }}
      >
        <div
          className="w-24 h-px mx-auto mb-6 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          }}
        />
        <motion.p
          className="font-script text-2xl mb-2"
          style={{ color: '#D4AF37', textShadow: '0 0 16px rgba(212,175,55,0.4)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Made with 💖
        </motion.p>
        <p className="text-xs tracking-wider" style={{ color: 'rgba(212,175,55,0.35)' }}>
          A birthday gift for my sister!
        </p>
      </footer>
    </div>
  );
}
