import React from 'react';
import { Sparkles, Terminal, MapPin, Gamepad2, ShieldCheck, ArrowRight } from 'lucide-react';
import { RansomWord } from '../components/RansomWord';
import { MangaCharacter } from '../components/MangaCharacter';
import { PageId } from '../components/HeaderNav';
import { sfx } from '../utils/sfx';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 animate-slideInLeft py-4 md:py-0">
      {/* LEFT COLUMN: ABOUT DOSSIER */}
      <div className="w-full md:w-7/12 flex flex-col justify-center space-y-3 sm:space-y-4 max-w-2xl py-1 sm:py-2 z-10">
        {/* Title Badge */}
        <div className="flex items-center gap-2">
          <span className="bg-white text-black font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 uppercase tracking-widest">
            FILE 01 // DOSSIER
          </span>
          <span className="text-zinc-400 font-mono text-[10px] sm:text-xs tracking-wider">
            INVESTIGATOR PROFILE
          </span>
        </div>

        {/* Title Yofukashi Style */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase text-white drop-shadow-[4px_4px_0px_#000000]">
            ABOUT ME
          </h1>
          <span className="font-mono text-[10px] sm:text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 px-2 py-0.5 sm:py-1">
            [ 概要・探偵調査 ]
          </span>
        </div>

        {/* Bio Card in Manga Noir Style */}
        <div className="bg-black border-2 border-white p-3.5 sm:p-5 shadow-[4px_4px_0px_#ffffff] sm:shadow-[6px_6px_0px_#ffffff] space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3 border-b border-zinc-800 pb-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black flex items-center justify-center font-mono font-black text-lg sm:text-xl shrink-0">
              ER
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight truncate">
                ENDRICO ROVSANS KURNIA
              </h2>
              <p className="font-mono text-[11px] sm:text-xs text-zinc-400 truncate">
                Codename: <span className="text-white font-bold">rewsaqy</span> // 3D Artist & Game Designer
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            Halo! Aku seorang <strong>3D Artist dan Game Designer</strong> yang berfokus pada pembuatan model karakter anime/stylized, aset PSX, map & level design atmosfer malam, serta mekanik gameplay di Unity Engine.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">
            <div className="bg-zinc-950 p-2 sm:p-2.5 border border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] sm:text-xs">
                <MapPin size={11} className="text-white" />
                <span>BASE LOCATION</span>
              </div>
              <p className="font-mono text-xs sm:text-sm font-bold text-white mt-0.5">Indonesia</p>
            </div>

            <div className="bg-zinc-950 p-2 sm:p-2.5 border border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] sm:text-xs">
                <Gamepad2 size={11} className="text-white" />
                <span>FOCUS DOMAIN</span>
              </div>
              <p className="font-mono text-xs sm:text-sm font-bold text-white mt-0.5">Stylized 3D & Games</p>
            </div>

            <div className="bg-zinc-950 p-2 sm:p-2.5 border border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] sm:text-xs">
                <Terminal size={11} className="text-white" />
                <span>PRIMARY TOOLSET</span>
              </div>
              <p className="font-mono text-xs sm:text-sm font-bold text-white mt-0.5">Blender & Unity</p>
            </div>

            <div className="bg-zinc-950 p-2 sm:p-2.5 border border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] sm:text-xs">
                <ShieldCheck size={11} className="text-white" />
                <span>WORK STATUS</span>
              </div>
              <p className="font-mono text-[11px] sm:text-xs font-bold text-black bg-white inline-block px-1 mt-0.5">AVAILABLE</p>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-1 flex items-center gap-3">
          <button
            onClick={() => {
              sfx.playBack();
              onNavigate('home');
            }}
            className="flex items-center gap-2 bg-white text-black font-black font-mono text-xs px-4 sm:px-5 py-2 sm:py-2.5 hover:bg-zinc-200 transition-all shadow-[4px_4px_0px_#000000] border-2 border-black cursor-pointer"
          >
            <span>◀ KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: LARGE ANKO IN WINTER COAT STANDING */}
      <MangaCharacter
        src="/manga_chars/large_anko_about.png"
        alt="Anko Uguisu Winter Coat Standing"
        kanjiTop="餡子"
        kanjiBottom="調査"
        caption="INVESTIGATOR // ANKO UGUISU // WINTER EDITION"
      />
    </div>
  );
};
