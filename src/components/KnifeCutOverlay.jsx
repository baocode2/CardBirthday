import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * KnifeCutOverlay
 *
 * A transparent overlay on top of the 3D cake canvas.
 * – Shows a knife cursor following the mouse.
 * – User clicks & drags across the cake to "slice".
 * – Once a slice is long enough, a glowing slash appears and onSliceComplete fires.
 *
 * Props:
 *   onSliceComplete – callback after a successful cut
 *   disabled        – when true, hide the overlay (e.g. after cake is already cut)
 */
export default function KnifeCutOverlay({ onSliceComplete, disabled }) {
  const containerRef = useRef(null);

  /* ── state ── */
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [slashLine, setSlashLine] = useState(null);     // final slash line for the animation
  const [showSparks, setShowSparks] = useState(false);
  const [sliceCompleted, setSliceCompleted] = useState(false);

  // trail points while dragging
  const [trail, setTrail] = useState([]);

  /* ── helpers ── */
  const getRelPos = useCallback((e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const distance = (a, b) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  /* ── mouse handlers ── */
  const handleMouseMove = useCallback(
    (e) => {
      const pos = getRelPos(e);
      setMousePos(pos);
      if (isDragging && dragStart) {
        setDragEnd(pos);
        setTrail((prev) => [...prev.slice(-40), pos]);
      }
    },
    [getRelPos, isDragging, dragStart],
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (sliceCompleted) return;
      const pos = getRelPos(e);
      setDragStart(pos);
      setDragEnd(pos);
      setIsDragging(true);
      setTrail([pos]);
    },
    [getRelPos, sliceCompleted],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStart || !dragEnd || sliceCompleted) {
      setIsDragging(false);
      setTrail([]);
      return;
    }

    const d = distance(dragStart, dragEnd);
    // Need at least 80 px drag to count as a slice
    if (d >= 80) {
      setSlashLine({ start: dragStart, end: dragEnd });
      setShowSparks(true);
      setSliceCompleted(true);

      // After slash animation plays, fire the callback
      setTimeout(() => {
        onSliceComplete?.();
      }, 900);
    }

    setIsDragging(false);
    setTrail([]);
  }, [isDragging, dragStart, dragEnd, sliceCompleted, onSliceComplete]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (isDragging) {
      setIsDragging(false);
      setTrail([]);
    }
  };

  /* ── compute knife rotation to match drag direction ── */
  const knifeAngle = (() => {
    if (isDragging && dragStart && dragEnd) {
      return (
        Math.atan2(dragEnd.y - dragStart.y, dragEnd.x - dragStart.x) *
        (180 / Math.PI)
      );
    }
    return 15; // default resting angle
  })();

  if (disabled || sliceCompleted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20"
      style={{ cursor: 'none' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Knife cursor ── */}
      <AnimatePresence>
        {isHovering && (
            <motion.div
              key="knife"
              className="pointer-events-none fixed"
              style={{
                left: mousePos.x,
                top: mousePos.y,
                x: "-5px",
                y: "-50px",
                originX: "5px",
                originY: "50px",
                rotate: knifeAngle,
                zIndex: 100,
                position: 'absolute',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              {/* Elegant Royal Knife SVG */}
              <svg
                width="120" height="100" viewBox="0 0 120 100" fill="none"
                style={{ filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.5))' }}
              >
                <defs>
                  <linearGradient id="blade-grad" x1="5" y1="45" x2="60" y2="55">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#CCCCCC" />
                    <stop offset="100%" stopColor="#999999" />
                  </linearGradient>
                  <linearGradient id="handle-grad" x1="60" y1="45" x2="110" y2="55">
                    <stop offset="0%" stopColor="#8B0000" />
                    <stop offset="50%" stopColor="#500000" />
                    <stop offset="100%" stopColor="#2A0000" />
                  </linearGradient>
                  <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFDF73" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#997A00" />
                  </linearGradient>
                </defs>
                <g>
                  {/* Blade */}
                  <path d="M 5 50 Q 30 46 60 46 L 60 52 Q 30 52 5 50 Z" fill="url(#blade-grad)" />
                  <path d="M 5 50 Q 30 51.5 60 51.5" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.8" />
                  {/* Handle */}
                  <rect x="62" y="44" width="40" height="12" rx="3" fill="url(#handle-grad)" />
                  {/* Guard */}
                  <rect x="58" y="38" width="6" height="24" rx="3" fill="url(#gold-grad)" />
                  {/* Pommel */}
                  <ellipse cx="104" cy="50" rx="5" ry="8" fill="url(#gold-grad)" />
                  {/* Handle Ornaments */}
                  <circle cx="70" cy="50" r="2" fill="#D4AF37" />
                  <circle cx="80" cy="50" r="2" fill="#D4AF37" />
                  <circle cx="90" cy="50" r="2" fill="#D4AF37" />
                </g>
              </svg>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drag trail / cut line ── */}
      {isDragging && trail.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 90 }}>
          <defs>
            <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,215,0,0)" />
              <stop offset="30%" stopColor="rgba(255,215,0,0.6)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,215,0,0.6)" />
            </linearGradient>
            <filter id="trail-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polyline
            points={trail.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="url(#trail-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trail-glow)"
          />
          {/* Wider soft glow */}
          <polyline
            points={trail.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255,215,0,0.2)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trail-glow)"
          />
        </svg>
      )}

      {/* ── Final slash animation ── */}
      <AnimatePresence>
        {slashLine && (
          <motion.svg
            key="slash"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 95 }}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.6, 1] }}
          >
            <defs>
              <linearGradient id="slash-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
              <filter id="slash-glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Main slash line */}
            <motion.line
              x1={slashLine.start.x}
              y1={slashLine.start.y}
              x2={slashLine.end.x}
              y2={slashLine.end.y}
              stroke="url(#slash-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#slash-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            {/* Wide glow */}
            <motion.line
              x1={slashLine.start.x}
              y1={slashLine.start.y}
              x2={slashLine.end.x}
              y2={slashLine.end.y}
              stroke="rgba(255,215,0,0.3)"
              strokeWidth="24"
              strokeLinecap="round"
              filter="url(#slash-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* ── Spark particles burst ── */}
      <AnimatePresence>
        {showSparks && slashLine && (
          <>
            {Array.from({ length: 18 }).map((_, i) => {
              const midX = (slashLine.start.x + slashLine.end.x) / 2;
              const midY = (slashLine.start.y + slashLine.end.y) / 2;
              const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
              const dist = 40 + Math.random() * 80;
              return (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: midX,
                    top: midY,
                    width: 3 + Math.random() * 4,
                    height: 3 + Math.random() * 4,
                    background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FFFFFF' : '#FF8C00',
                    boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(255,215,0,0.8)' : 'rgba(255,140,0,0.8)'}`,
                    zIndex: 99,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, ease: 'easeOut' }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* ── Hint text ── */}
      {!isDragging && !slashLine && (
        <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-lg">🔪</span>
            <span className="text-sm font-medium tracking-wider" style={{ color: 'rgba(212,175,55,0.9)' }}>
              Kéo dao để cắt bánh
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
