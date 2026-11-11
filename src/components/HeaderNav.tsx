import React from 'react';
import { Moon, ArrowLeft } from 'lucide-react';
import { sfx } from '../utils/sfx';

export type PageId = 'home' | 'about' | 'skills' | 'projects' | 'contact';

interface HeaderNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="relative z-20 flex items-center justify-between px-3 sm:px-6 md:px-12 pt-2.5 sm:pt-4 md:pt-6">
      {/* Left Badge / Brand Logo */}
      {currentPage === 'home' ? (
        <div className="bg-black text-white px-3 sm:px-5 py-1.5 sm:py-2 border-2 border-white shadow-[3px_3px_0px_#ffffff] sm:shadow-[4px_4px_0px_#ffffff] yofu-badge-skew flex items-center gap-2 shrink-0">
          <div className="yofu-badge-unskew flex items-center gap-2">
            {/* Yofukashi Manga Crescent & Star Logo */}
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
              <Moon size={15} className="fill-white text-white transform -rotate-12" />
              <span className="absolute -top-1 -right-1 text-[8px] sm:text-[10px] text-white">✦</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-sans font-black text-xs sm:text-sm tracking-wider uppercase">
                  よふかしのうた
                </span>
                <span className="text-[10px] text-zinc-400 font-mono hidden md:inline">// CALL OF THE NIGHT</span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono text-zinc-400 tracking-widest uppercase leading-none mt-0.5">
                ENDRICO // REWSAQY
              </span>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            sfx.playBack();
            onNavigate('home');
          }}
          className="min-h-[44px] bg-white text-black hover:bg-zinc-200 px-3 sm:px-5 py-2 border-2 border-black shadow-[3px_3px_0px_#ffffff] sm:shadow-[4px_4px_0px_#ffffff] yofu-badge-skew flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-x-1 shrink-0 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          <div className="yofu-badge-unskew flex items-center gap-1.5 sm:gap-2">
            <ArrowLeft size={14} aria-hidden="true" className="text-black sm:w-4 sm:h-4" />
            <span className="font-mono text-xs sm:text-sm font-black tracking-widest uppercase">
              KEMBALI
            </span>
          </div>
        </button>
      )}

      {/* Right Badge: 3D ARTIST & GAME DESIGNER */}
      <div className="bg-white text-black px-3 sm:px-6 py-1.5 sm:py-2 border-2 border-black shadow-[3px_3px_0px_#ffffff] sm:shadow-[4px_4px_0px_#ffffff] yofu-badge-skew shrink-0">
        <div className="yofu-badge-unskew">
          <span className="font-mono text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase">
            3D ARTIST || GAME DESIGNER
          </span>
        </div>
      </div>
    </header>
  );
};
