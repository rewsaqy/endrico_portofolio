import React from 'react';

interface YofukashiTitleProps {
  name?: string;
  fullName?: string;
  tagline?: string;
}

export const YofukashiTitle: React.FC<YofukashiTitleProps> = ({
  name = 'ENDRICO',
  fullName = 'ENDRICO ROVSANS KURNIA',
  tagline = '3D ARTIST & GAME DESIGNER // REWSAQY',
}) => {
  return (
    <div className="relative select-none group">
      {/* Background Japanese Watermark Stamp */}
      <div className="text-[9px] sm:text-[11px] font-mono tracking-[0.2em] sm:tracking-[0.3em] text-zinc-400 uppercase flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white inline-block" />
        <span>よふかしのうた // NOCTURNAL OPERATIVE</span>
        <span className="text-zinc-400 hidden xs:inline">//</span>
        <span className="text-zinc-300 font-bold hidden xs:inline">2026</span>
      </div>

      {/* Main Giant Yofukashi Title */}
      <div className="relative inline-block">
        {/* Shadow layer */}
        <h1 
          className="font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase text-white leading-none drop-shadow-[4px_4px_0px_#000000] sm:drop-shadow-[6px_6px_0px_#000000]"
          style={{
            WebkitTextStroke: '1.5px #ffffff',
            letterSpacing: '-0.04em',
          }}
        >
          {name}
        </h1>

        {/* Kanji Accent Inset */}
        <span className="absolute -top-2.5 sm:-top-3 right-0 bg-white text-black font-mono font-black text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 tracking-widest uppercase transform rotate-2 shadow-[2px_2px_0px_#000000]">
          夜更かし
        </span>
      </div>

      {/* Full Name & Role Bar */}
      <div className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <div className="bg-white text-black font-mono text-[10px] sm:text-xs md:text-sm font-black px-2 sm:px-3 py-0.5 sm:py-1 shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] border border-black">
          {fullName}
        </div>
        <div className="bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">
          {tagline}
        </div>
      </div>
    </div>
  );
};
