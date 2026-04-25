import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/* ─── Candle Component ─── */
function Candle({ color = '#FF69B4', left, height = 40 }) {
  return (
    <div className="absolute flex flex-col items-center" style={{ left, bottom: '100%', zIndex: 10 }}>
      {/* Flame glow */}
      <div className="absolute -top-7 w-6 h-6 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,200,50,0.6), transparent 70%)',
          animation: 'flame-glow 1.5s ease-in-out infinite',
        }}
      />
      {/* Flame */}
      <div className="flame relative w-3 h-5 mb-0.5" style={{ transformOrigin: 'bottom center' }}>
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, #FFF 10%, #FFEA00 30%, #FF8C00 60%, #FF4500 100%)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            filter: 'blur(0.5px)',
          }}
        />
        {/* Inner bright core */}
        <div className="absolute inset-1 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at 50% 70%, #FFF 20%, #FFEA00 60%, transparent 100%)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
        />
      </div>
      {/* Wick */}
      <div className="w-0.5 h-1.5 bg-gray-800 rounded-full" />
      {/* Candle body */}
      <div className="w-3 rounded-b-sm shadow-md"
        style={{
          height: `${height}px`,
          background: `linear-gradient(180deg, ${color} 0%, ${color}CC 100%)`,
          boxShadow: `inset -2px 0 4px rgba(0,0,0,0.1), 1px 0 3px rgba(0,0,0,0.1)`,
        }}
      >
        {/* Drip effect */}
        <div className="absolute top-0 left-0.5 w-2 h-2 rounded-b-full"
          style={{ background: `${color}AA` }}
        />
      </div>
    </div>
  );
}

/* ─── Flower Component ─── */
function Flower({ left, bottom, size = 30, color = '#FF69B4', delay = 0 }) {
  const petals = 5;
  return (
    <motion.div
      className="absolute"
      style={{ left, bottom, width: size, height: size, zIndex: 5 }}
      initial={{ scale: 0, rotate: -20 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, type: 'spring', stiffness: 150 }}
    >
      <div className="relative w-full h-full" style={{ animation: `float-gentle 4s ease-in-out ${delay}s infinite` }}>
        {Array.from({ length: petals }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size * 0.4,
              height: size * 0.55,
              background: `linear-gradient(135deg, ${color}, ${color}88)`,
              left: '50%',
              top: '50%',
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${i * (360 / petals)}deg)`,
              opacity: 0.9,
              boxShadow: `0 0 6px ${color}55`,
            }}
          />
        ))}
        {/* Center */}
        <div className="absolute rounded-full"
          style={{
            width: size * 0.25,
            height: size * 0.25,
            background: 'radial-gradient(circle, #FFD700, #FFA500)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 6px rgba(255,215,0,0.5)',
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Cake Layer ─── */
function CakeLayer({ width, height, color, frostingColor, top, zIndex }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 rounded-lg"
      style={{
        width,
        height,
        top,
        zIndex,
        background: `linear-gradient(180deg, ${frostingColor} 0%, ${frostingColor} 20%, ${color} 20%, ${color} 100%)`,
        boxShadow: `0 4px 15px rgba(0,0,0,0.15), inset 0 -3px 8px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.3)`,
        borderRadius: '8px 8px 12px 12px',
      }}
    >
      {/* Frosting drips */}
      {Array.from({ length: Math.floor(parseInt(width) / 25) }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-b-full"
          style={{
            width: `${8 + Math.random() * 8}px`,
            height: `${10 + Math.random() * 15}px`,
            background: frostingColor,
            left: `${15 + i * 25 + Math.random() * 10}px`,
            top: `${parseInt(height) * 0.18}px`,
            boxShadow: `inset -1px 0 2px rgba(0,0,0,0.05)`,
          }}
        />
      ))}

      {/* Decorative dots */}
      {Array.from({ length: Math.floor(parseInt(width) / 30) }).map((_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute rounded-full"
          style={{
            width: '5px',
            height: '5px',
            background: '#FFD700',
            left: `${20 + i * 30}px`,
            top: `${parseInt(height) * 0.5}px`,
            boxShadow: '0 0 4px rgba(255,215,0,0.4)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Cake3D Component ─── */
export default function Cake3D() {
  const rotateY = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef(null);

  // Auto-rotate
  useEffect(() => {
    if (!isDragging) {
      animationRef.current = animate(rotateY, [rotateY.get(), rotateY.get() + 360], {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
      });
    }
    return () => animationRef.current?.stop();
  }, [isDragging, rotateY]);

  const handleDragStart = () => {
    setIsDragging(true);
    animationRef.current?.stop();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Shadow transforms
  const shadowOpacity = useTransform(rotateY, [0, 90, 180, 270, 360], [0.3, 0.5, 0.3, 0.1, 0.3]);

  return (
    <div className="cake-scene relative w-full max-w-md mx-auto" style={{ height: '420px' }}>
      {/* Drag handle area */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-20"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={(_, info) => {
          rotateY.set(rotateY.get() + info.delta.x * 0.8);
        }}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'pan-y' }}
      />

      {/* Rotating Scene */}
      <motion.div
        className="cake-container-3d absolute inset-0 flex items-end justify-center pb-8"
        style={{ rotateY }}
      >
        {/* Plate / Base */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: '280px',
            height: '30px',
            background: 'linear-gradient(180deg, #FFF8F0, #F0E0D0)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 -2px 6px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,0.8)',
            borderRadius: '50%',
          }}
        />

        {/* Cake layers container */}
        <div className="relative" style={{ width: '260px', height: '200px', bottom: '18px' }}>
          {/* Bottom Layer */}
          <CakeLayer
            width="240px" height="70px" top="130px"
            color="#F8B4C8" frostingColor="#FFE4E9"
            zIndex={1}
          />
          {/* Middle Layer */}
          <CakeLayer
            width="180px" height="65px" top="70px"
            color="#E8A87C" frostingColor="#FFE4D4"
            zIndex={2}
          />
          {/* Top Layer */}
          <CakeLayer
            width="120px" height="60px" top="15px"
            color="#D4A574" frostingColor="#FFF0E5"
            zIndex={3}
          />

          {/* Candles */}
          <div className="absolute w-[120px] left-1/2 -translate-x-1/2" style={{ top: '15px' }}>
            <Candle color="#FF69B4" left="15px" height={35} />
            <Candle color="#FFD700" left="35px" height={40} />
            <Candle color="#FF69B4" left="55px" height={32} />
            <Candle color="#87CEEB" left="75px" height={38} />
            <Candle color="#FFD700" left="95px" height={36} />
          </div>

          {/* Top decoration - cherry / star */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-20 text-2xl"
            style={{ top: '-3px' }}
            animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⭐
          </motion.div>
        </div>

        {/* Flowers around the cake */}
        <Flower left="-10px" bottom="40px" size={35} color="#FF69B4" delay={0.2} />
        <Flower left="20px" bottom="20px" size={25} color="#FFB6C1" delay={0.4} />
        <Flower left="-20px" bottom="80px" size={28} color="#FF1493" delay={0.3} />
        <Flower left="calc(100% - 25px)" bottom="35px" size={32} color="#FF69B4" delay={0.5} />
        <Flower left="calc(100% - 5px)" bottom="70px" size={26} color="#FFB6C1" delay={0.6} />
        <Flower left="calc(100% + 10px)" bottom="25px" size={22} color="#FF1493" delay={0.7} />

        {/* Additional decorative elements */}
        <motion.div
          className="absolute text-lg"
          style={{ left: '-30px', bottom: '100px' }}
          animate={{ y: [0, -8, 0], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute text-lg"
          style={{ right: '-30px', bottom: '110px' }}
          animate={{ y: [0, -6, 0], rotate: [0, -10, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          🌺
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: '200px',
          height: '15px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.15), transparent 70%)',
          opacity: shadowOpacity,
        }}
      />

      {/* Drag hint */}
      <motion.p
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-[#6B4226]/50 font-medium whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        ↔ Drag to rotate the cake
      </motion.p>
    </div>
  );
}
