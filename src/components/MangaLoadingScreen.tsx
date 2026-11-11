import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Disc3, Terminal, Zap, Radio } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { sfx } from '../utils/sfx';

interface MangaLoadingScreenProps {
  onComplete: () => void;
}

const GAME_SYSTEM_LOGS = [
  { text: 'SYSTEM BIOS // DETECTIVE OS v1.0.4', code: '0x8001' },
  { text: 'LOADING RETRO PSX SHADER PIPELINE', code: '0x8024' },
  { text: 'MOUNTING 3D BLENDER NPR RIG ASSETS', code: '0x804F' },
  { text: 'CALIBRATING 44.1kHz DSP AUDIO ANALYSER', code: '0x809A' },
  { text: 'ARMING TRACK 01 // 堕天 (DATEN)', code: '0x80FF' },
  { text: 'COMMENCING NIGHTFALL OPERATION // 始動', code: '0x9999' },
];

export const MangaLoadingScreen: React.FC<MangaLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [isSlashing, setIsSlashing] = useState<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);
  const prefersReduced = useReducedMotion() ?? false;
  const { isPlaying, autoplayBlocked } = useMusicPlayer();

  // Trigger completion sequence (Katana slash + audio start)
  const triggerGameStart = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    
    sfx.playSlash();
    setIsSlashing(true);

    // Call onComplete after diagonal slash animation executes
    setTimeout(() => {
      onComplete();
    }, 550);
  };

  // Video Game Boot Simulation (0% -> 100% automatically in ~2.2s)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (hasFinishedRef.current) {
        clearInterval(interval);
        return;
      }

      // Classic arcade cadence: fast bursts with brief suspense ticks
      let increment = Math.floor(Math.random() * 5) + 3;
      if (current > 75 && current < 88) {
        increment = 2; // Brief dramatic suspense before 100%
      }

      current += increment;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        setLogIndex(GAME_SYSTEM_LOGS.length - 1);
        clearInterval(interval);

        // Auto-play immediately upon hitting 100%
        setTimeout(() => {
          triggerGameStart();
        }, 350);
      } else {
        setProgress(current);
        const idx = Math.min(
          GAME_SYSTEM_LOGS.length - 2,
          Math.floor((current / 100) * (GAME_SYSTEM_LOGS.length - 1))
        );
        setLogIndex(idx);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Fast-Forward on tap/click or keypress (synced cleanly with browser click/keydown audio activation)
  useEffect(() => {
    const handleQuickSkip = () => {
      if (!hasFinishedRef.current) {
        setProgress(100);
        triggerGameStart();
      }
    };

    window.addEventListener('click', handleQuickSkip, { once: true });
    window.addEventListener('keydown', handleQuickSkip, { once: true });

    return () => {
      window.removeEventListener('click', handleQuickSkip);
      window.removeEventListener('keydown', handleQuickSkip);
    };
  }, []);

  const totalBoxes = 20;
  const filledBoxes = Math.floor((progress / 100) * totalBoxes);

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const characterSrc = `${cleanBase}manga_chars/large_anko_home.png`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none pointer-events-auto">
      {/* KATANA SCREEN SLASH WHITE LIGHTNING BEAM */}
      {isSlashing && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="w-[180vw] h-2 sm:h-3 bg-white shadow-[0_0_40px_#ffffff] transform -rotate-12 animate-pulse" />
          <div className="absolute font-sans font-black text-6xl sm:text-8xl text-white tracking-widest drop-shadow-[6px_6px_0px_#000000] -rotate-12 italic">
            ズバッ!!
          </div>
        </div>
      )}

      {/* TOP SLICE PANEL (Splits top-left on exit) */}
      <div
        className={`absolute inset-0 bg-[#070104] flex flex-col justify-between p-4 sm:p-8 md:p-10 transition-transform duration-500 ease-out ${
          isSlashing ? '-translate-x-full -translate-y-12 opacity-0' : 'translate-x-0 translate-y-0'
        }`}
      >
        {/* Manga Screentone Dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

        {/* Diagonal Action Speedlines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(255,255,255,0.02)_8px,rgba(255,255,255,0.02)_16px)] pointer-events-none" />

        {/* Rotating Manga Star Motif with Pulse */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] pointer-events-none opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[1.5] animate-spin-slow">
            <polygon points="50,2 62,38 98,38 69,60 80,96 50,74 20,96 31,60 2,38 38,38" />
          </svg>
        </div>

        {/* ARCADE HEADER HUD */}
        <header className="relative z-10 flex items-center justify-between border-b-2 border-white pb-2.5 font-mono text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-2.5 h-2.5 bg-red-600 inline-block" />
            <span className="bg-white text-black font-black px-1.5 py-0.5 uppercase tracking-widest">
              SYSTEM BOOT
            </span>
            <span className="text-zinc-300 font-bold hidden sm:inline">
              // ARCADE NOIR ENGINE 1.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-zinc-950 px-2 py-0.5 border border-zinc-800 text-[10px] sm:text-[11px] text-zinc-300">
              <Radio size={11} aria-hidden="true" className="text-red-500" />
              <span>DEFAULT BGM: 01 // 堕天 (DATEN)</span>
            </div>
            <span className="text-zinc-400 hidden md:inline font-bold">60 FPS</span>
          </div>
        </header>

        {/* MAIN GAME STAGE (Tactical Character Cell & Terminal Stream) */}
        <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center my-3 sm:my-6 gap-6 sm:gap-10 max-w-5xl mx-auto w-full">
          {/* Tactical Character Target Cell */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-40 sm:w-56 md:w-64 h-52 sm:h-72 md:h-80 flex items-end justify-center shrink-0"
          >
            {/* Comic Frame Crosshair Accents */}
            <div aria-hidden="true" className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
            <div aria-hidden="true" className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
            <div aria-hidden="true" className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />

            {/* Target Reticle Indicator */}
            <div className="absolute top-2 left-2 bg-black/80 px-1 border border-zinc-700 text-[9px] font-mono text-zinc-300 z-10">
              [ TARGET: OPERATIVE REWSAQY ]
            </div>

            <img
              src={characterSrc}
              alt="Anko Uguisu Detective Boot"
              width={256}
              height={320}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_0_24px_rgba(255,255,255,0.35)] filter contrast-125"
            />

            {/* Authentic Manga Onomatopoeia Stamp */}
            <div aria-hidden="true" className="absolute -top-3 -right-3 font-sans font-black text-2xl text-white tracking-widest opacity-80 drop-shadow-[3px_3px_0px_#000000]">
              ドォン!
            </div>
          </motion.div>

          {/* Right Column: Game Title & Realtime Memory Stream */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReduced ? 0.01 : 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-3.5 max-w-lg w-full text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 font-mono text-xs font-bold">
              <span className="bg-white text-black px-1.5 py-0.2 font-black text-[10px]">
                STAGE 00
              </span>
              <span className="tracking-widest text-zinc-300">
                [ 接続中・よふかしのうた ]
              </span>
            </div>

            <div>
              <h1 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-white drop-shadow-[4px_4px_0px_#000000] leading-none">
                ENDRICO
              </h1>
              <p className="font-mono text-xs sm:text-sm font-bold text-zinc-400 tracking-wider mt-1">
                3D ARTIST &amp; GAME DESIGNER // <span className="text-white">rewsaqy</span>
              </p>
            </div>

            {/* Retro Game Memory Feed Terminal */}
            <div className="relative overflow-hidden bg-black/95 border-2 border-zinc-800 p-3 sm:p-4 shadow-[4px_4px_0px_#27272a] font-mono text-xs space-y-2 text-left">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 w-16 bg-white/10 animate-mangaSweep pointer-events-none"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-900 pb-1">
                <span className="flex items-center gap-1.5 text-white">
                  <Terminal size={11} aria-hidden="true" className="text-red-500" />
                  <span>MEMORY HEAP ALLOCATION</span>
                </span>
                <span className="font-bold text-white">
                  MEM: {GAME_SYSTEM_LOGS[logIndex].code}
                </span>
              </div>

              <div className="text-[11px] sm:text-xs text-white flex items-center gap-2">
                <span aria-hidden="true" className="text-red-500 font-black">❯</span>
                <span className="truncate">{GAME_SYSTEM_LOGS[logIndex].text}</span>
              </div>

              {/* 20-Segment High-Density Game Progress Gauge */}
              <div className="flex items-center gap-0.5 sm:gap-1 pt-1.5">
                {Array.from({ length: totalBoxes }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 sm:h-2.5 transition-all duration-75 ${
                      i < filledBoxes
                        ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                        : 'bg-zinc-900 border border-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Status / Arcade State */}
            <div className="flex items-center justify-between pt-1 font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Disc3
                  size={16}
                  aria-hidden="true"
                  className="animate-spin text-white shrink-0"
                  style={{ animationDuration: '2s' }}
                />
                <span className="font-black tracking-wider text-xs sm:text-sm">
                  {progress >= 100
                    ? 'READY! ENTERING NIGHTFALL...'
                    : `NOW LOADING... [ ロード中 ${progress}% ]`}
                </span>
              </div>

              <span className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 border border-zinc-800">
                {isPlaying ? 'BGM AKTIF // 堕天' : autoplayBlocked ? 'TAP UNTUK AUDIO' : 'AUTO-PLAY READY'}
              </span>
            </div>

            <p className="font-mono text-[9px] sm:text-[10px] text-zinc-400 tracking-wider">
              ✦ TAP / KLIK / TEKAN TOMBOL APA SAJA UNTUK FAST-FORWARD &amp; NYALAKAN AUDIO &quot;堕天 (DATEN)&quot;
            </p>
          </motion.div>
        </main>

        {/* BOTTOM HUD FOOTER */}
        <footer className="relative z-10 flex items-center justify-between border-t border-zinc-800 pt-2 font-mono text-[10px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Zap size={11} aria-hidden="true" className="text-white" />
            <span>STREAM: 44.1kHz • STEREO • DSP CLOCK SYNC</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-bold">STARTING TRACK: 01 // 堕天</span>
            <span>© 2026 rewsaqy</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MangaLoadingScreen;