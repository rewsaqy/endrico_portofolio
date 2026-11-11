import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';

interface MangaCharacterProps {
  src: string;
  alt: string;
  kanjiTop?: string;
  kanjiBottom?: string;
  caption?: string;
}

export const MangaCharacter: React.FC<MangaCharacterProps> = ({
  src,
  alt,
  kanjiTop = '餡子',
  kanjiBottom = '鶯',
  caption = 'DETECTIVE // ANKO UGUISU // NIGHTFALL',
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCharacterClick = () => {
    sfx.playSelect();
  };

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const resolvedSrc = src.startsWith('/') ? `${cleanBase}${src.slice(1)}` : src;

  return (
    <div className="relative w-full mt-6 md:mt-0 opacity-100 pointer-events-auto md:w-6/12 lg:w-7/12 md:h-full flex items-end justify-center md:justify-end select-none z-10 animate-slideInRight">
      {/* Giant Rotating Manga Star / Moon Motif with parallax */}
      <div 
        className="absolute top-1/2 left-1/2 md:left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-[420px] md:w-[600px] h-[420px] md:h-[600px] pointer-events-none opacity-30 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * -15}px), calc(-50% + ${mousePos.y * -15}px))`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2] animate-spin-slow">
          <polygon points="50,2 62,38 98,38 69,60 80,96 50,74 20,96 31,60 2,38 38,38" />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full stroke-zinc-500 fill-none stroke-[1.5] transform rotate-45 scale-85">
          <polygon points="50,2 62,38 98,38 69,60 80,96 50,74 20,96 31,60 2,38 38,38" />
        </svg>
      </div>

      {/* Floating Manga Sparks */}
      <div className="absolute top-8 right-16 text-white text-4xl font-black opacity-80 animate-bounce">
        ✦
      </div>
      <div className="absolute top-1/4 left-4 text-white text-3xl font-black opacity-40">
        ★
      </div>
      <div className="absolute bottom-40 left-0 text-white text-2xl font-black opacity-70">
        ✦
      </div>

      {/* Floating Sound Effect Onomatopoeia (スッ...) */}
      <div 
        className="absolute top-1/3 right-10 font-mono text-zinc-400 text-sm font-black tracking-widest opacity-60 animate-pulse pointer-events-none"
      >
        スッ...
      </div>

      {/* Authentic Manga Floating Kanji */}
      {kanjiTop && (
        <div 
          className="hidden lg:block absolute left-[-40px] top-1/4 text-white/[0.07] font-black text-9xl select-none pointer-events-none transition-transform duration-500"
          style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
        >
          {kanjiTop}
        </div>
      )}
      {kanjiBottom && (
        <div 
          className="hidden lg:block absolute right-[-10px] top-1/3 text-white/[0.07] font-black text-9xl select-none pointer-events-none transition-transform duration-500"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        >
          {kanjiBottom}
        </div>
      )}

      {/* Vertical Manga Label */}
      <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90 origin-right text-[11px] font-mono tracking-[0.4em] text-zinc-400 select-none pointer-events-none">
        {caption}
      </div>

      {/* LARGE ANCHORED CHARACTER CONTAINER */}
      <div 
        onClick={handleCharacterClick}
        onMouseEnter={() => {
          setIsHovered(true);
          sfx.playHover();
        }}
        onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-[340px] sm:w-[440px] md:w-[500px] lg:w-[580px] h-[68vh] md:h-[76vh] lg:h-[82vh] max-h-[760px] flex items-end justify-center cursor-pointer pointer-events-auto transition-transform duration-300 ease-out overflow-visible"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${mousePos.y * -4}deg) translateY(${isHovered ? '-8px' : '0px'})`,
        }}
      >
        {/* Subtle breathing / floating shadow */}
        <div className="w-full h-full flex items-end justify-center animate-idleFloat overflow-visible">
          <img
            src={resolvedSrc}
            alt={alt}
            className={`w-full h-full object-contain object-bottom transition-all duration-300 ${
              isHovered
                ? 'drop-shadow-[-4px_-4px_0px_#ffffff] drop-shadow-[0px_0px_24px_rgba(255,255,255,0.45)] scale-[1.02]'
                : 'drop-shadow-[-3px_-3px_0px_#ffffff] drop-shadow-[0px_0px_12px_rgba(255,255,255,0.2)]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
