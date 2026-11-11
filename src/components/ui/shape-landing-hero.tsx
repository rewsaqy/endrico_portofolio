"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MangaStarOrbitProps {
  className?: string;
  size?: number;
  delay?: number;
  rotate?: number;
  mouseOffset?: { x: number; y: number };
  parallaxFactor?: number;
  reducedMotion: boolean;
}

/**
 * Twin wireframe 5-point manga star motif echoing the background behind Anko on Home.
 */
function MangaStarOrbit({
  className,
  size = 440,
  delay = 0,
  rotate = 0,
  mouseOffset = { x: 0, y: 0 },
  parallaxFactor = 14,
  reducedMotion,
}: MangaStarOrbitProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={
        reducedMotion
          ? { opacity: 0.3, scale: 1, rotate }
          : { opacity: 0, scale: 0.72, rotate: rotate - 36 }
      }
      animate={{
        opacity: 0.3,
        scale: 1,
        rotate,
        x: reducedMotion ? 0 : mouseOffset.x * -parallaxFactor,
        y: reducedMotion ? 0 : mouseOffset.y * -parallaxFactor,
      }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.65,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ width: size, height: size }}
      className={cn("absolute pointer-events-none select-none", className)}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full stroke-white fill-none stroke-[1.8] animate-spin-slow"
      >
        <polygon points="50,2 62,38 98,38 69,60 80,96 50,74 20,96 31,60 2,38 38,38" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full stroke-zinc-500 fill-none stroke-[1.2] transform rotate-45 scale-[0.84]"
      >
        <polygon points="50,2 62,38 98,38 69,60 80,96 50,74 20,96 31,60 2,38 38,38" />
      </svg>
    </motion.div>
  );
}

interface MangaSlashRibbonProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  fromRight?: boolean;
  reducedMotion: boolean;
}

/**
 * Monochrome diagonal manga ink action strip mirroring yofu-slash-bg and transition blades.
 */
function MangaSlashRibbon({
  className,
  delay = 0,
  width = 560,
  height = 72,
  rotate = -14,
  fromRight = false,
  reducedMotion,
}: MangaSlashRibbonProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={
        reducedMotion
          ? { opacity: 1, x: 0, rotate }
          : { opacity: 0, x: fromRight ? 140 : -140, scaleX: 0.75, rotate }
      }
      animate={{ opacity: 1, x: 0, scaleX: 1, rotate }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.48,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ width, height }}
      className={cn(
        "absolute pointer-events-none select-none -skew-x-12 border-y border-white/25 bg-white/[0.035] overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-1.5 h-[1px] bg-white/15" />
      {!reducedMotion && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "220%" }}
          transition={{ duration: 0.85, delay: delay + 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      )}
    </motion.div>
  );
}

export interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  quote?: string;
  author?: string;
  audioStatusText?: string;
  rotate?: number;
  width?: number;
  height?: number;
  y?: number;
  onProceed?: () => void;
  autoProceedSeconds?: number;
}

function HeroGeometric({
  badge = "NOCTURNAL PHILOSOPHY // よふかしのうた",
  title1 = "ENDRICO",
  title2 = "3D ARTIST & GAME DESIGNER",
  quote = "Malam bukan tentang kegelapan, melainkan ruang bebas tanpa batas bagi mereka yang berani merancang dunia mereka sendiri.",
  author = "ENDRICO ROVSANS KURNIA // rewsaqy",
  audioStatusText = "BGM ACTIVE // 堕天",
  rotate = 12,
  width = 560,
  height = 76,
  y = 10,
  onProceed,
  autoProceedSeconds = 2.4,
}: HeroGeometricProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Subtle Home-style mouse parallax for twin stars
  useEffect(() => {
    if (prefersReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMouseOffset({
        x: (e.clientX / innerWidth - 0.5) * 2,
        y: (e.clientY / innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReduced]);

  // Keyboard shortcut support (Enter / Space / Escape) in capture phase so background pages don't intercept
  useEffect(() => {
    if (!onProceed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onProceed();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onProceed]);

  const snapInVariants = {
    hidden: prefersReduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 },
    visible: (step: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0.01 : 0.36,
        delay: prefersReduced ? 0 : step * 0.06,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-quote-title"
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.02, transition: { duration: 0.2, ease: "easeIn" } }
      }
      transition={{ duration: prefersReduced ? 0.01 : 0.22 }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#040407] text-white select-none"
    >
      {/* LAYER 1: Home Manga Textures (Diagonal Slashes, Halftone Screentone, Speedlines) */}
      <div aria-hidden="true" className="absolute inset-0 yofu-slash-bg pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 manga-screentone pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 manga-speedlines pointer-events-none" />

      {/* Katana Light Beam Diagonal Strike on Entry */}
      {!prefersReduced && (
        <motion.div
          aria-hidden="true"
          initial={{ x: "-120%", opacity: 0.85 }}
          animate={{ x: "140%", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 w-44 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
        />
      )}

      {/* Nocturnal Shooting Star Streak matching NightAtmosphereCanvas */}
      {!prefersReduced && (
        <motion.div
          aria-hidden="true"
          initial={{ x: "-20vw", y: "-10vh", opacity: 0 }}
          animate={{ x: "85vw", y: "55vh", opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          className="absolute top-0 left-0 w-36 h-[2px] bg-gradient-to-r from-transparent via-white to-white rotate-[28deg] pointer-events-none"
        />
      )}

      {/* LAYER 2: Home Stylized Dashed Manga Moon Ring */}
      <motion.div
        aria-hidden="true"
        initial={
          prefersReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82, rotate: -20 }
        }
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: prefersReduced ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-10 -right-12 md:top-8 md:right-16 w-56 h-56 sm:w-72 sm:h-72 md:w-88 md:h-88 rounded-full border-4 border-dashed border-white/20 pointer-events-none animate-spin-slow"
      >
        <div className="absolute top-6 left-8 w-10 h-10 rounded-full border border-white/30" />
        <div className="absolute -bottom-1.5 right-1/3 w-3 h-3 bg-white rotate-45" />
      </motion.div>

      {/* LAYER 3: Home Watermark Kanji */}
      <motion.div
        aria-hidden="true"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, letterSpacing: "0.35em" }}
        transition={{ duration: prefersReduced ? 0.01 : 0.65, ease: "easeOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/[0.04] font-black text-6xl sm:text-8xl md:text-9xl tracking-[0.35em] whitespace-nowrap"
      >
        よふかしのうた
      </motion.div>

      {/* LAYER 4: Animated Twin 5-Point Manga Stars + Sharp Monochrome Action Ribbons */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <MangaStarOrbit
          size={460}
          rotate={rotate}
          delay={0.02}
          mouseOffset={mouseOffset}
          parallaxFactor={16}
          reducedMotion={prefersReduced}
          className="left-[-140px] sm:left-[-80px] top-[12%]"
        />

        <MangaStarOrbit
          size={360}
          rotate={-rotate * 1.5}
          delay={0.08}
          mouseOffset={mouseOffset}
          parallaxFactor={12}
          reducedMotion={prefersReduced}
          className="right-[-110px] sm:right-[-40px] bottom-[10%]"
        />

        <MangaSlashRibbon
          width={width}
          height={height}
          rotate={-12}
          delay={0.04}
          reducedMotion={prefersReduced}
          className="left-[-12%] top-[18%]"
        />

        <MangaSlashRibbon
          width={Math.round(width * 0.78)}
          height={Math.round(height * 0.72)}
          rotate={-12}
          delay={0.1}
          fromRight
          reducedMotion={prefersReduced}
          className="right-[-8%] bottom-[22%]"
        />

        {/* Crisp Manga Sparks matching MangaCharacter */}
        <motion.span
          initial={prefersReduced ? { opacity: 0.75, scale: 1 } : { opacity: 0, scale: 0.4, y: -y }}
          animate={{ opacity: 0.75, scale: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0.01 : 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="hidden sm:block absolute top-[18%] right-[14%] text-white text-3xl font-black"
        >
          ✦
        </motion.span>
        <motion.span
          initial={prefersReduced ? { opacity: 0.45, scale: 1 } : { opacity: 0, scale: 0.4, y: y }}
          animate={{ opacity: 0.45, scale: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0.01 : 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="hidden sm:block absolute bottom-[24%] left-[12%] text-white text-2xl font-black"
        >
          ★
        </motion.span>
        <motion.span
          initial={prefersReduced ? { opacity: 0.6, x: 0 } : { opacity: 0, x: -16 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: prefersReduced ? 0.01 : 0.45, delay: 0.2 }}
          className="hidden md:block absolute top-[28%] left-[8%] font-mono text-zinc-400 text-xs font-black tracking-widest"
        >
          スッ...
        </motion.span>
      </div>

      {/* LAYER 5: Rising Home City Skyline Silhouette */}
      <motion.div
        aria-hidden="true"
        initial={prefersReduced ? { y: 0, opacity: 0.25 } : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 0.25 }}
        transition={{ duration: prefersReduced ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-repeat-x pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,20 L0,12 L5,12 L5,6 L12,6 L12,14 L18,14 L18,4 L24,4 L24,20 L30,20 L30,10 L38,10 L38,20 L45,20 L45,2 L52,2 L52,20 L60,20 L60,8 L68,8 L68,15 L75,15 L75,5 L82,5 L82,20 L90,20 L90,11 L96,11 L96,20 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: "240px 100%",
        }}
      />

      {/* FOREGROUND MANGA CHAPTER CUT-IN STAGE */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 py-6">
        <div className="flex flex-col items-center text-center">
          {/* Skewed Chapter Eyebrow Stamp matching HeaderNav */}
          <motion.div
            custom={0}
            variants={snapInVariants}
            initial="hidden"
            animate="visible"
            className="mb-5 bg-black text-white px-4 py-1.5 border-2 border-white shadow-[3px_3px_0px_#ffffff] yofu-badge-skew inline-flex items-center"
          >
            <div className="yofu-badge-unskew flex items-center gap-2 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              <Moon size={13} className="fill-white text-white -rotate-12 shrink-0" aria-hidden="true" />
              <span>{badge}</span>
            </div>
          </motion.div>

          {/* Hero Title Stack matching YofukashiTitle */}
          <motion.div
            custom={1}
            variants={snapInVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <div className="relative inline-block">
              <h1
                id="hero-quote-title"
                className="font-sans font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter uppercase text-white leading-none drop-shadow-[4px_4px_0px_#000000] sm:drop-shadow-[6px_6px_0px_#000000]"
                style={{
                  WebkitTextStroke: "1.5px #ffffff",
                  letterSpacing: "-0.04em",
                }}
              >
                {title1}
              </h1>
              <motion.span
                aria-hidden="true"
                initial={prefersReduced ? { scale: 1, rotate: 2 } : { scale: 0.6, rotate: -10 }}
                animate={{ scale: 1, rotate: 2 }}
                transition={{ duration: prefersReduced ? 0.01 : 0.35, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-2.5 sm:-top-3 -right-2 sm:-right-4 bg-white text-black font-mono font-black text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 tracking-widest uppercase shadow-[2px_2px_0px_#000000]"
              >
                夜更かし
              </motion.span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="relative overflow-hidden bg-white text-black font-mono text-xs sm:text-sm font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#ffffff] uppercase tracking-wider">
                <span className="relative z-10">{title2}</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 w-10 bg-black/10 animate-mangaSweep pointer-events-none"
                />
              </span>
              <span className="bg-zinc-900 border border-zinc-600 text-zinc-200 font-mono text-[10px] sm:text-xs px-2.5 py-1 tracking-wider">
                STAGE 00 // NOCTURNAL
              </span>
            </div>
          </motion.div>

          {/* Nocturnal Quote Manga Panel matching HomePage Bio Box */}
          <motion.div
            custom={2}
            variants={snapInVariants}
            initial="hidden"
            animate="visible"
            className="relative my-6 w-full max-w-2xl"
          >
            <motion.div
              initial={prefersReduced ? { scale: 1 } : { scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ duration: prefersReduced ? 0.01 : 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-black border-2 border-white p-5 sm:p-6 shadow-[5px_5px_0px_#ffffff] text-left"
            >
              {/* Manga Viewfinder Corner Brackets */}
              <span aria-hidden="true" className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white bg-black" />
              <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white bg-black" />
              <span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white bg-black" />
              <span aria-hidden="true" className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white bg-black" />

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 border-b border-zinc-800 pb-2 mb-3">
                <span className="bg-white text-black font-black px-1.5 py-0.5 tracking-widest">
                  NOCTURNAL RECORD
                </span>
                <span aria-hidden="true" className="text-zinc-300 font-bold">
                  [ 思想・名言 ]
                </span>
              </div>

              <blockquote className="relative">
                <span
                  aria-hidden="true"
                  className="text-3xl leading-none font-serif text-zinc-400 mr-1 select-none"
                >
                  “
                </span>
                <span className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-sans font-bold">
                  {quote}
                </span>
              </blockquote>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-2.5 text-[11px] sm:text-xs font-mono">
                <span className="text-white font-bold tracking-wide">{author}</span>
                <span className="text-zinc-300">{audioStatusText}</span>
              </div>

              {/* Synced Auto-Proceed Progress Bar */}
              {onProceed && (
                <div
                  aria-hidden="true"
                  className="mt-3 h-1 w-full bg-zinc-900 overflow-hidden"
                >
                  <motion.div
                    initial={{ scaleX: prefersReduced ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: prefersReduced ? 0.01 : autoProceedSeconds,
                      ease: "linear",
                    }}
                    className="h-full w-full bg-white origin-left"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Snappy Action CTA matching YofukashiButton */}
          {onProceed && (
            <motion.div
              custom={3}
              variants={snapInVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-2.5"
            >
              <button
                type="button"
                onClick={onProceed}
                className="group min-h-[44px] px-7 py-2.5 bg-white text-black font-black font-mono text-xs sm:text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer -skew-x-6 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
              >
                <span className="skew-x-6 flex items-center gap-2">
                  <span>MASUK KE HOME</span>
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>

              <p className="text-[10px] sm:text-[11px] font-mono text-zinc-300 tracking-wider">
                OTOMATIS MASUK DALAM {autoProceedSeconds}s // TEKAN ENTER ATAU ESC UNTUK LANGSUNG
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export { HeroGeometric };
export default HeroGeometric;
