import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sfx } from '../utils/sfx';

interface YofukashiButtonProps {
  num: string;
  title: string;
  kanji: string;
  tag: string;
  isActive?: boolean;
  onClick: () => void;
  onHover?: () => void;
}

export const YofukashiButton: React.FC<YofukashiButtonProps> = ({
  num,
  title,
  kanji,
  tag,
  isActive = false,
  onClick,
  onHover,
}) => {
  return (
    <button
      onClick={() => {
        sfx.playSelect();
        onClick();
      }}
      onMouseEnter={() => {
        if (onHover) onHover();
        sfx.playHover();
      }}
      className={`group relative w-full text-left transition-all duration-300 transform cursor-pointer ${
        isActive
          ? 'translate-x-4 scale-[1.02]'
          : 'hover:translate-x-3 hover:scale-[1.01]'
      }`}
    >
      {/* Background container with manga slant */}
      <div
        className={`relative overflow-hidden border-2 transition-all duration-300 ${
          isActive
            ? 'bg-white text-black border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)]'
            : 'bg-black/90 text-white border-zinc-700 hover:border-white shadow-[5px_5px_0px_#000000]'
        }`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
      >
        {/* Animated Light Sweep / Glitch Shimmer on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 transition-transform bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Content Layout */}
        <div className="flex items-center justify-between p-2 sm:p-2.5 md:p-3.5">
          {/* Left section: Number + Title + Kanji */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            {/* Number badge */}
            <div
              className={`font-mono text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 sm:py-1 border transition-colors shrink-0 ${
                isActive
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 group-hover:bg-white group-hover:text-black group-hover:border-white'
              }`}
            >
              {num}
            </div>

            {/* Title & Kanji */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`font-sans font-black text-base sm:text-xl md:text-2xl tracking-tighter uppercase transition-colors truncate ${
                    isActive ? 'text-black' : 'text-white group-hover:text-white'
                  }`}
                >
                  {title}
                </span>
                <span
                  className={`font-mono text-[9px] sm:text-xs font-bold transition-colors shrink-0 ${
                    isActive ? 'text-zinc-700' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  [ {kanji} ]
                </span>
              </div>
              <p
                className={`text-[9px] sm:text-[11px] font-mono tracking-wide mt-0.5 transition-colors truncate ${
                  isActive ? 'text-zinc-800 font-semibold' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                {tag}
              </p>
            </div>
          </div>

          {/* Right section: Arrow / Active Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span
              className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-widest hidden md:inline-block px-1.5 py-0.5 border ${
                isActive
                  ? 'border-black text-black bg-zinc-200'
                  : 'border-zinc-800 text-zinc-500 group-hover:border-zinc-600 group-hover:text-zinc-300'
              }`}
            >
              {isActive ? 'SELECT // OPEN' : 'VIEW FILE'}
            </span>

            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center border transition-all ${
                isActive
                  ? 'bg-black text-white border-black rotate-0'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:translate-x-1'
              }`}
            >
              <ArrowRight size={13} className="sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>

        {/* Bottom accent stripe */}
        <div
          className={`h-1 w-full transition-all duration-300 ${
            isActive
              ? 'bg-black'
              : 'bg-zinc-800 group-hover:bg-white'
          }`}
        />
      </div>
    </button>
  );
};
