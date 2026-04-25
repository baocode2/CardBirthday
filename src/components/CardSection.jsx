import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const cardMessages = [
  {
    front: '🎁 Open Me!',
    back: {
      message: "You bring so much light into everyone's life. Happy Birthday, dear sister! 💕",
      imgLabel: 'Photo 1',
    },
  },
  {
    front: '✨ Surprise!',
    back: {
      message: 'May your day be as beautiful and radiant as your smile! 🌸',
      imgLabel: 'Photo 2',
    },
  },
  {
    front: '🌟 For You!',
    back: {
      message: 'Wishing you endless happiness and all the love in the world! 🎂',
      imgLabel: 'Photo 3',
    },
  },
  {
    front: '💖 Click Me!',
    back: {
      message: "Another year of being amazing — I'm so lucky to have you as my sister! 🥳",
      imgLabel: 'Photo 4',
    },
  },
];

function FlipCard({ data, index }) {
  const [flipped, setFlipped] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageLoad = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImgSrc(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    handleImageLoad(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleImageLoad(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleImageAreaClick = (e) => {
    e.stopPropagation(); // Prevent flipping the card back
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className={`flip-card w-full h-[340px] sm:h-[380px] md:h-[420px] ${flipped ? 'flipped' : ''}`}
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => setFlipped(!flipped)}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flip-card-inner">
        {/* FRONT */}
        <div
          className="flip-card-front glass-strong rounded-2xl flex flex-col items-center justify-center gap-5 p-6 border-2 border-white/30"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.35), rgba(248,180,200,0.2), rgba(232,168,124,0.15))',
            boxShadow: '0 8px 32px rgba(248,180,200,0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C9A84C] rounded-tl-lg opacity-60" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C9A84C] rounded-tr-lg opacity-60" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C9A84C] rounded-bl-lg opacity-60" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C9A84C] rounded-br-lg opacity-60" />

          {/* Glitter dots */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  background: '#FFD700',
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animation: `twinkle ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite`,
                  boxShadow: '0 0 4px rgba(255,215,0,0.5)',
                }}
              />
            ))}
          </div>

          <div className="text-5xl sm:text-6xl mb-2 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))' }}>
            {data.front.split(' ')[0]}
          </div>
          <h3 className="shimmer-text font-display text-2xl sm:text-3xl font-bold tracking-wide">
            {data.front.replace(/^[^\s]+\s/, '')}
          </h3>
          <p className="text-sm text-[#6B4226]/70 mt-2 font-medium tracking-wider uppercase">
            Tap to reveal
          </p>

          {/* Bottom shimmer line */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* BACK */}
        <div
          className="flip-card-back glass-strong rounded-2xl flex flex-col items-center justify-center gap-4 p-6"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.4), rgba(253,226,232,0.3))',
            boxShadow: '0 8px 32px rgba(248,180,200,0.3), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Image upload area */}
          <div
            onClick={handleImageAreaClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="w-full h-44 sm:h-52 rounded-xl overflow-hidden border-2 shadow-lg relative cursor-pointer transition-all duration-300"
            style={{
              borderColor: isDragging ? '#C9A84C' : imgSrc ? 'rgba(255,255,255,0.5)' : 'rgba(201,168,76,0.5)',
              background: isDragging
                ? 'rgba(201,168,76,0.15)'
                : imgSrc
                  ? 'transparent'
                  : 'linear-gradient(135deg, rgba(248,180,200,0.2), rgba(232,168,124,0.1))',
              boxShadow: isDragging ? '0 0 20px rgba(201,168,76,0.4)' : undefined,
            }}
          >
            <AnimatePresence mode="wait">
              {imgSrc ? (
                /* Uploaded image */
                <motion.div
                  key="uploaded"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={imgSrc}
                    alt={data.back.imgLabel}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay hint on hover */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-1">🔄</div>
                      <p className="text-xs font-semibold tracking-wider uppercase">Đổi ảnh</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Upload prompt */
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0], scale: [1, 1.12, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-4xl"
                  >
                    📷
                  </motion.div>
                  <p className="text-sm font-semibold text-[#8B5E3C]">{data.back.imgLabel}</p>
                  <p className="text-xs text-[#8B5E3C]/60 text-center px-3 leading-relaxed">
                    Click để chọn ảnh
                    <br />
                    hoặc kéo thả vào đây
                  </p>
                  {/* Dashed border animated hint */}
                  <div
                    className="absolute inset-2 rounded-lg pointer-events-none"
                    style={{
                      border: '1.5px dashed rgba(201,168,76,0.5)',
                      animation: 'pulse-glow 3s ease-in-out infinite',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message */}
          <p className="text-center font-display text-base sm:text-lg italic leading-relaxed text-[#3D2914]/85 px-2">
            "{data.back.message}"
          </p>

          <p className="text-xs text-[#C9A84C] tracking-widest uppercase font-semibold">
            — With Love 💛
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CardSection() {
  return (
    <section id="cards-section" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#C9A84C] mb-3 glow-text">
            Special Messages
          </h2>
          <p className="text-[#6B4226]/70 text-base sm:text-lg font-light tracking-wide">
            Tap each card to reveal a surprise ✨
          </p>
          <div className="w-24 h-0.5 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {cardMessages.map((card, i) => (
            <FlipCard key={i} data={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
