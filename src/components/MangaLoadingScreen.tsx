import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Volume2, Shield, Radio, Terminal, Cpu } from 'lucide-react';
import { sfx } from '../utils/sfx';

interface MangaLoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING SYSTEM KERNEL // ARCH-LINUX 6.12',
  'LOADING 3D BLENDER NPR SHADERS & PSX PIPELINE',
  'CONFIGURING 44.1kHz DSP AUDIO BUFFER // STEREO',
  'MOUNTING NOCTURNAL PERSONA REWSAQY DOSSIER',
  'SYSTEM READY // ALL OPERATIONAL PROTOCOLS CLEAR',
];

export const MangaLoadingScreen: React.FC<MangaLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Progressive loading simulation (1.2s total smooth sequence)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const bounded = Math.min(100, next);
        
        // Update boot log based on progress
        const nextLog = Math.min(
          BOOT_LOGS.length - 1,
          Math.floor((bounded / 100) * BOOT_LOGS.length)
        );
        setLogIndex(nextLog);

        if (bounded >= 100) {
          setIsReady(true);
        }
        return bounded;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Enter handler (triggers audio play via onComplete + dramatic sound)
  const handleEnter = () => {
    if (isExiting) return;
    sfx.playSlash();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  // Keyboard shortcut listener (Enter or Space to enter anytime)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  const blockCount = Math.floor(progress / 10);

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const characterSrc = `${cleanBase}manga_chars/large_anko_home.png`;

  return (
    <div
      onClick={isReady ? handleEnter : undefined}
      className={`fixed inset-0 z-50 bg-[#060103] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-500 ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none translate-y-[-20px]'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Anime Screentone Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

      {/* Rotating Background Manga Star Motif */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] pointer-events-none opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[1.5] animate-spin-slow">
          <polygon points="50,2 62,38 98,38 69,60 80,96 50,74 20,96 31,60 2,38 38,38" />
        </svg>
      </div>

      {/* TOP BAR: SYSTEM STATUS & SKIP BUTTON */}
      <header className="relative z-10 flex items-center justify-between border-b-2 border-white/80 pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="font-black bg-white text-black px-1.5 py-0.5 tracking-wider">
            YOFUKASHI NO UTA
          </span>
          <span className="text-zinc-400 hidden sm:inline tracking-widest">
            // NOCTURNAL BOOT SEQUENCE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-[11px] hidden md:inline">
            SYSTEM 0.9.8 [STABLE]
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="text-zinc-400 hover:text-white border border-zinc-700 hover:border-white px-2 py-1 text-[11px] font-bold transition-all cursor-pointer bg-black/60"
          >
            SKIP INTRO ➔
          </button>
        </div>
      </header>

      {/* CENTER STAGE: CHARACTER SILHOUETTE & DRAMATIC TITLE */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center my-4 gap-6 max-w-5xl mx-auto w-full">
        {/* Left Side: Detective Anko Preview with Rim Light */}
        <div className="relative w-44 sm:w-56 md:w-64 h-56 sm:h-72 md:h-84 flex items-end justify-center shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img
            src={characterSrc}
            alt="Nocturnal Detective Anko"
            className="w-full h-full object-contain object-bottom drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] filter contrast-125"
          />
          {/* Manga Onomatopoeia */}
          <div className="absolute -top-2 -right-4 font-mono text-zinc-400 font-black text-xl tracking-widest animate-pulse opacity-70">
            ドォン!
          </div>
        </div>

        {/* Right Side: Big Manga Title & Live Terminal Stream */}
        <div className="flex flex-col space-y-4 max-w-lg w-full text-center md:text-left">
          {/* Japanese Chapter Heading */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 font-mono text-xs font-bold">
            <span className="bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-zinc-300">
              [ 第零夜・接続 ]
            </span>
            <span className="tracking-widest">NOCTURNAL OPERATIVE</span>
          </div>

          {/* Persona Manga Main Title */}
          <div>
            <h1 className="font-sans font-black text-4xl sm:text-6xl tracking-tighter uppercase text-white drop-shadow-[4px_4px_0px_#ffffff] leading-none">
              ENDRICO
            </h1>
            <p className="font-mono text-xs sm:text-sm font-bold text-zinc-400 tracking-wider mt-1">
              3D ARTIST & GAME DESIGNER // <span className="text-white">rewsaqy</span>
            </p>
          </div>

          {/* Terminal Boot Log Card */}
          <div className="bg-black/90 border-2 border-zinc-800 p-3 sm:p-4 shadow-[4px_4px_0px_#27272a] font-mono text-xs space-y-2 text-left">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-900 pb-1">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Terminal size={11} className="text-white" />
                <span>TERMINAL LOGS</span>
              </span>
              <span className="text-zinc-400">STATUS: {progress}%</span>
            </div>

            <div className="text-[11px] sm:text-xs text-zinc-300 flex items-center gap-2">
              <span className="text-red-500 font-black animate-pulse">❯</span>
              <span className="truncate">{BOOT_LOGS[logIndex]}</span>
            </div>

            {/* Discrete 10-box gauge */}
            <div className="flex items-center gap-1 pt-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 border transition-all duration-150 ${
                    i < blockCount
                      ? 'bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CALL TO ACTION BUTTON (Pulsing when ready) */}
          <div className="pt-2 flex flex-col items-center md:items-start space-y-2">
            {isReady ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnter();
                }}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-white text-black font-black font-mono text-xs sm:text-sm uppercase tracking-widest border-2 border-white shadow-[5px_5px_0px_#ffffff] hover:bg-black hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer -skew-x-6"
              >
                <span className="skew-x-6 flex items-center justify-center gap-2.5">
                  <Play size={15} className="fill-current text-red-600 group-hover:text-white animate-pulse" />
                  <span>START NIGHTFALL & PLAY BGM</span>
                  <span className="text-zinc-500 group-hover:text-zinc-300 text-[10px] hidden sm:inline">
                    [ 夜更かし開始 ]
                  </span>
                </span>
              </button>
            ) : (
              <div className="w-full sm:w-auto px-6 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-500 font-mono text-xs font-bold flex items-center justify-center gap-2 -skew-x-6">
                <span className="w-2 h-2 rounded-full bg-zinc-600 animate-ping" />
                <span className="skew-x-6">INITIALIZING ASSETS... {progress}%</span>
              </div>
            )}

            <p className="font-mono text-[10px] text-zinc-500 tracking-wider">
              {isReady
                ? '★ KLIK TOMBOL, TEKAN SPACE ATAU ENTER UNTUK MULAI DENGAN MUSIK'
                : 'SYNCHRONIZING AUDIO ENGINE & TEXTURE CACHE'}
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER BAR: COPYRIGHT & AUDIO SPECTRUM METER */}
      <footer className="relative z-10 flex items-center justify-between border-t border-zinc-800 pt-2 font-mono text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <Volume2 size={12} className="text-white" />
          <span>AUDIO ENGINE: AUTO-RESUME ON USER GESTURE</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">よふかしのうた NOIR ARCHIVE</span>
          <span className="text-zinc-400">© 2026 rewsaqy</span>
        </div>
      </footer>
    </div>
  );
};

export default MangaLoadingScreen;
