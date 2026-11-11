import React from 'react';

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
}

export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({ isTransitioning }) => {
  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden transition-opacity duration-300">
      {/* Motion Blur / Manga Speedline Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fadeOverlay" />

      {/* Layer 1: Leading White Blade */}
      <div 
        className="absolute inset-0 bg-white transform -skew-x-12 animate-smoothBlade1"
        style={{
          boxShadow: '0 0 80px rgba(255,255,255,0.9)',
          width: '150vw',
          left: '-25vw',
        }}
      />

      {/* Layer 2: Main Deep Midnight Obsidian Ink Curtain */}
      <div 
        className="absolute inset-0 bg-[#060609] transform -skew-x-12 animate-smoothBlade2 border-l-4 border-r-4 border-white"
        style={{
          boxShadow: '-20px 0 60px rgba(0,0,0,0.9), 20px 0 60px rgba(0,0,0,0.9)',
          width: '160vw',
          left: '-30vw',
        }}
      >
        {/* Manga Speedlines Texture inside the curtain */}
        <div className="absolute inset-0 manga-screentone opacity-20" />
      </div>

      {/* Layer 3: Central Cinematic Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center animate-smoothText">
        <div className="flex items-center gap-3">
          <span className="w-8 h-1 bg-white hidden sm:block" />
          <span className="font-mono text-white text-4xl sm:text-6xl md:text-8xl font-black tracking-[0.25em] uppercase drop-shadow-[8px_8px_0px_#000000]">
            SHIFT
          </span>
          <span className="w-8 h-1 bg-white hidden sm:block" />
        </div>
        <div className="mt-2 font-mono text-zinc-400 text-xs sm:text-sm tracking-[0.4em] uppercase flex items-center gap-2">
          <span>よふかしのうた</span>
          <span>//</span>
          <span>SCENE TRANSITION</span>
        </div>
      </div>
    </div>
  );
};
