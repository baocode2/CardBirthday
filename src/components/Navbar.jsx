import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ currentView, setCurrentView }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '🏠 Home', icon: '🎁' },
    { id: 'cake', label: '🎂 Cake', icon: '🎂' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 py-3"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-5xl mx-auto glass-strong rounded-2xl px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('home')}
        >
          <span className="text-2xl">🎀</span>
          <h1 className="font-script text-xl sm:text-2xl text-[#C9A84C] glow-text">
            Happy Birthday
          </h1>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative px-5 py-2 rounded-xl font-medium text-sm transition-colors duration-300 ${
                currentView === item.id
                  ? 'text-[#3D2914]'
                  : 'text-[#6B4226]/70 hover:text-[#3D2914]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentView === item.id && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(248,180,200,0.2))',
                    border: '1px solid rgba(255,215,0,0.3)',
                    boxShadow: '0 0 12px rgba(255,215,0,0.15)',
                  }}
                  layoutId="nav-active"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className="block w-5 h-0.5 bg-[#6B4226] rounded-full"
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-[#6B4226] rounded-full"
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-[#6B4226] rounded-full"
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sm:hidden mt-2 glass-strong rounded-2xl overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full px-5 py-3.5 text-left font-medium text-sm flex items-center gap-3 transition-colors ${
                  currentView === item.id
                    ? 'text-[#3D2914] bg-white/20'
                    : 'text-[#6B4226]/70'
                }`}
                whileTap={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
