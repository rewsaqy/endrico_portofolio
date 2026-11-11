import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Box, Gamepad2, Wrench, Send, Moon } from 'lucide-react';
import { sfx } from '../utils/sfx';

interface ContentModalProps {
  section: 'about' | 'skills' | 'projects' | 'contact' | null;
  onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({ section, onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!section) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sfx.playBack();
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      prevFocus?.focus();
    };
  }, [section, onClose]);

  if (!section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 animate-fadeIn">
      {/* Dynamic angled backdrop - Manga Noir Style */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-modal-title"
        className="relative w-full max-w-4xl bg-[#09090d] border-[3px] border-white shadow-[12px_12px_0px_#ffffff] overflow-hidden transform -rotate-1 transition-all"
        style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}
      >
        {/* Top diagonal stripe */}
        <div className="bg-white text-black font-black px-6 py-3.5 flex items-center justify-between border-b-[3px] border-black">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white px-2 py-0.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1">
              <Moon size={12} aria-hidden="true" className="fill-white" />
              YOFUKASHI // CASE FILE
            </span>
            <span id="content-modal-title" className="text-xl tracking-tighter uppercase font-extrabold text-black">
              {section}
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Tutup dialog"
            onClick={() => {
              sfx.playBack();
              onClose();
            }}
            className="min-h-[44px] bg-black text-white hover:bg-zinc-800 font-bold py-1.5 px-3 border border-black transition-all flex items-center gap-1 text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
          >
            <X size={18} aria-hidden="true" />
            <span>[ESC] CLOSE</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6 text-gray-200">
          {section === 'about' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 bg-black p-4 border-2 border-white shadow-[6px_6px_0px_#ffffff]">
                  <img
                    src={`${import.meta.env.BASE_URL}anko.png`}
                    alt="Anko Uguisu Detective"
                    width={320}
                    height={400}
                    className="w-full h-auto object-cover grayscale contrast-125 border border-zinc-800"
                  />
                  <div className="mt-3 text-center">
                    <p className="font-mono text-xs text-zinc-400 font-bold tracking-widest uppercase">INVESTIGATOR</p>
                    <p className="font-extrabold text-white text-lg tracking-wider">REWSAQY</p>
                    <p className="text-xs text-zinc-400">Endrico Rovsans Kurnia</p>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                  <div className="bg-[#121218] p-5 border-l-4 border-white">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <span aria-hidden="true" className="text-white">✦</span>
                      3D Artist &amp; Game Designer
                    </h3>
                    <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                      Menciptakan aset 3D bergaya anime/stylized, environment game bernuansa malam atmosferik (Call of the Night aesthetic), dan perancangan gameplay mechanics mendalam. Menggabungkan estetika visual manga dengan logika game development.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-black p-3 border border-zinc-800">
                      <span className="text-xs text-zinc-400 font-mono block">ORIGIN</span>
                      <strong className="text-white">Indonesia</strong>
                    </div>
                    <div className="bg-black p-3 border border-zinc-800">
                      <span className="text-xs text-zinc-400 font-mono block">SPECIALIZATION</span>
                      <strong className="text-white">3D Art & Game Design</strong>
                    </div>
                    <div className="bg-black p-3 border border-zinc-800">
                      <span className="text-xs text-zinc-400 font-mono block">PRIMARY TOOLS</span>
                      <strong className="text-white">Blender & Unity</strong>
                    </div>
                    <div className="bg-black p-3 border border-zinc-800">
                      <span className="text-xs text-zinc-400 font-mono block">STATUS</span>
                      <strong className="text-white bg-zinc-800 px-1 py-0.5">OPEN FOR COMMISSIONS</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'skills' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 3D ART & MODELING */}
                <div className="bg-black p-4 border-2 border-zinc-700 hover:border-white transition-all shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-center gap-2 text-white font-bold mb-3">
                    <Box size={20} />
                    <h4 className="font-extrabold text-white tracking-wider">3D ART & ASSETS</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Blender 3D</span>
                      <span className="text-white font-mono text-xs font-bold bg-zinc-800 px-1.5">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Stylized 3D Modeling</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>PSX Modeling</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>UV Unwrapping</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Rigging</span>
                      <span className="text-zinc-400 font-mono text-xs">BEGINNER [4/10]</span>
                    </li>
                  </ul>
                </div>

                {/* GAME DESIGN */}
                <div className="bg-black p-4 border-2 border-zinc-700 hover:border-white transition-all shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-center gap-2 text-white font-bold mb-3">
                    <Gamepad2 size={20} />
                    <h4 className="font-extrabold text-white tracking-wider">GAME DESIGN & MAP</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Level & Atmosphere Design</span>
                      <span className="text-white font-mono text-xs font-bold bg-zinc-800 px-1.5">INTERMEDIATE [8/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Gameplay Mechanics</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Unity Engine (Asset & Map)</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>C# Scripting (Core Basics)</span>
                      <span className="text-zinc-400 font-mono text-xs">BEGINNER [4/10]</span>
                    </li>
                  </ul>
                </div>

                {/* TOOLS & PIPELINE */}
                <div className="bg-black p-4 border-2 border-zinc-700 hover:border-white transition-all shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-center gap-2 text-white font-bold mb-3">
                    <Wrench size={20} />
                    <h4 className="font-extrabold text-white tracking-wider">PIPELINE & TOOLS</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Krita</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Aseprite</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Unity Version Control (Plastic)</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Git &amp; GitHub</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                    <li className="flex items-center justify-between bg-zinc-900 px-2 py-1 border border-zinc-800">
                      <span>Linux Arch</span>
                      <span className="text-zinc-300 font-mono text-xs">INTERMEDIATE [7/10]</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {section === 'projects' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project 1 */}
                <div className="bg-black border-2 border-zinc-700 p-4 hover:border-white transition-all group shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">LOMBA OTN 8 // JUARA 2 NASIONAL</span>
                      <h4 className="text-lg font-black text-white group-hover:underline">
                        AlgoRhythm: CODE IS SHIELD
                      </h4>
                    </div>
                    <span className="bg-white text-black text-xs font-black px-2 py-0.5">UNITY 2D/3D</span>
                  </div>
                  <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                    Game investigasi ketukan ritme dan cyber defense yang dikembangkan untuk Lomba OTN 8 (Olimpiade Teknologi Nasional 8) dan meraih Juara 2 Nasional. Sinkronisasi audio DSP clock dan modular AI.
                  </p>
                </div>

                {/* Project 2 */}
                <div className="bg-black border-2 border-zinc-700 p-4 hover:border-white transition-all group shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-red-400 font-bold">SURVIVAL HORROR 3D // HIATUS (DISCONTINUED)</span>
                      <h4 className="text-lg font-black text-white group-hover:underline">
                        Silent Universe: Last Shift
                      </h4>
                    </div>
                    <span className="bg-white text-black text-xs font-black px-2 py-0.5">PSX SHADERS</span>
                  </div>
                  <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                    Survival horror retro 3D atmosferik dengan sistem CCTV surveillance dan Lost One AI. Status proyek: Hiatus dan kemungkinan besar discontinued (arsip proyek).
                  </p>
                </div>

                {/* Project 3 */}
                <div className="bg-black border-2 border-zinc-700 p-4 hover:border-white transition-all group shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">DALAM PROSES / HIATUS // PROYEK CBT</span>
                      <h4 className="text-lg font-black text-white group-hover:underline">
                        Eight Months of Silence
                      </h4>
                    </div>
                    <span className="bg-white text-black text-xs font-black px-2 py-0.5">3D DEDUCTION</span>
                  </div>
                  <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                    First-person psychological thriller dengan inspeksi bukti fisik 3D dan deduksi kriminal. Proyek tahap CBT dalam proses pembuatan, saat ini berstatus Hiatus.
                  </p>
                </div>

                {/* Project 4 */}
                <div className="bg-black border-2 border-zinc-700 p-4 hover:border-white transition-all group shadow-[4px_4px_0px_#ffffff]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">3D CHARACTER ARTWORK // ACTIVE</span>
                      <h4 className="text-lg font-black text-white group-hover:underline">
                        Stylized Anime Models & Rigging
                      </h4>
                    </div>
                    <span className="bg-white text-black text-xs font-black px-2 py-0.5">BLENDER</span>
                  </div>
                  <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                    Koleksi model 3D karakter anime lengkap dengan rigging fleksibel, facial shapekeys, dan custom cel-shading manga.
                  </p>
                </div>
              </div>
            </div>
          )}

          {section === 'contact' && (
            <div className="space-y-6">
              <div className="bg-black p-6 border-2 border-white shadow-[6px_6px_0px_#ffffff]">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-3">
                  <Send className="text-white" size={20} />
                  SEND A MESSAGE // NIGHT INQUIRY
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  Tertarik bekerja sama untuk proyek game, aset 3D, atau commission? Silakan hubungi melalui saluran berikut:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-sm">
                    <span>EMAIL // DIRECT INBOX</span>
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 text-zinc-300">[REAL DATA]</span>
                  </div>

                  <a
                    href="https://github.com/rewsaqy"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-700 hover:border-white hover:bg-zinc-900 transition-all text-white font-mono text-sm"
                  >
                    <span>GITHUB // @rewsaqy</span>
                    <ExternalLink size={16} aria-hidden="true" className="text-white" />
                  </a>

                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-700 text-white font-mono text-sm">
                    <span>DISCORD // rewsaqy</span>
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 text-zinc-300">USERNAME</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-sm">
                    <span>ARTSTATION // COMING SOON</span>
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 text-zinc-300">WIP</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-black text-xs font-mono text-zinc-400 px-6 py-3 flex items-center justify-between border-t border-zinc-800">
          <span>ENDRICO ROVSANS KURNIA // YOFUKASHI NO UTA NOIR EDITION</span>
          <span>PRESS [ESC] TO RETURN</span>
        </div>
      </div>
    </div>
  );
};
