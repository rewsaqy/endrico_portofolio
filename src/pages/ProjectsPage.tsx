import React, { useState } from 'react';
import { 
  Eye, 
  ShieldAlert, 
  Radio, 
  Activity, 
  Volume2, 
  Cpu, 
  Sparkles, 
  Trophy, 
  Shield, 
  Search, 
  FileText, 
  Box, 
  Layers, 
  Clock 
} from 'lucide-react';
import { MangaCharacter } from '../components/MangaCharacter';
import { PageId } from '../components/HeaderNav';
import { sfx } from '../utils/sfx';

interface ProjectsPageProps {
  onNavigate: (page: PageId) => void;
}

interface Project {
  id: string;
  tag: string;
  title: string;
  engine: string;
  description: string;
  highlights: string[];
  isFnaf?: boolean;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'silent-universe',
    tag: 'SURVIVAL HORROR 3D // HIATUS (DISCONTINUED)',
    title: 'Silent Universe: Last Shift',
    engine: 'PSX SHADERS',
    description: 'Survival horror retro 3D atmosferik dengan sistem CCTV surveillance dan Lost One AI. Status proyek: Hiatus dan kemungkinan besar discontinued (arsip proyek).',
    highlights: ['Status: Hiatus', 'Discontinued', 'URP PSX Shaders', 'CCTV System'],
    isFnaf: true,
  },
  {
    id: 'algorhythm',
    tag: 'LOMBA OTN 8 // JUARA 2 NASIONAL',
    title: 'AlgoRhythm: CODE IS SHIELD',
    engine: 'UNITY 2D/3D',
    description: 'Game investigasi ketukan ritme dan cyber defense yang dikembangkan untuk Lomba OTN 8 (Olimpiade Teknologi Nasional 8) dan sukses meraih Juara 2 Nasional. Dilengkapi sinkronisasi audio DSP clock.',
    highlights: ['Juara 2 OTN 8', 'Lomba OTN 8', 'DSP Audio Sync', 'Modular C#'],
  },
  {
    id: 'eight-months',
    tag: 'DALAM PROSES / HIATUS // PROYEK CBT',
    title: 'Eight Months of Silence',
    engine: '3D DEDUCTION',
    description: 'First-person crime psychological thriller dengan sistem inspeksi barang bukti 3D dan deduksi kasus kriminal. Proyek tahap CBT dalam proses pembuatan, saat ini berstatus Hiatus.',
    highlights: ['Proyek CBT', 'Dalam Pembuatan', 'Status: Hiatus', '3D Deduction'],
  },
  {
    id: 'anime-3d-models',
    tag: '3D CHARACTER ARTWORK // ACTIVE',
    title: 'Stylized 3D Anime Characters',
    engine: 'BLENDER & NPR',
    description: 'Koleksi model 3D karakter anime lengkap dengan rigging fleksibel, facial shapekeys, dan custom cel-shading.',
    highlights: ['Blender Sculpting', 'Weight Painting', 'Manga Cel Shader', 'Portfolio Aktif'],
  },
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [activeProject, setActiveProject] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('algorhythm')) return 'algorhythm';
      if (hash.includes('eight-months')) return 'eight-months';
      if (hash.includes('anime-3d-models') || hash.includes('blender')) return 'anime-3d-models';
    }
    return 'silent-universe';
  });

  const selectedProj = PROJECTS_DATA.find((p) => p.id === activeProject) || PROJECTS_DATA[0];

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 animate-slideInLeft py-4 md:py-0">
      {/* LEFT COLUMN: PROJECTS SHOWCASE */}
      <div className="w-full md:w-7/12 flex flex-col justify-center space-y-3.5 max-w-2xl py-2 z-10">
        {/* Title Badge */}
        <div className="flex items-center gap-2">
          <span className="bg-white text-black font-mono text-xs font-black px-2 py-0.5 uppercase tracking-widest">
            FILE 03 // MISSIONS
          </span>
          <span className="text-zinc-400 font-mono text-xs tracking-wider">
            FEATURED GAME DESIGN & 3D ART
          </span>
        </div>

        {/* Title Yofukashi Style */}
        <div className="flex items-center gap-3">
          <h1 className="font-sans font-black text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase text-white drop-shadow-[4px_4px_0px_#000000]">
            PROJECTS
          </h1>
          <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 px-2 py-1">
            [ 機密案件・実績 ]
          </span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 max-h-[26vh] sm:max-h-[32vh] md:max-h-[38vh] overflow-y-auto pr-1">
          {PROJECTS_DATA.map((proj) => {
            const isSelected = activeProject === proj.id;
            
            // Themed borders based on project
            const borderTheme = isSelected
              ? proj.id === 'silent-universe'
                ? 'border-red-600 shadow-[3px_3px_0px_#990000] scale-[1.01]'
                : proj.id === 'algorhythm'
                ? 'border-cyan-400 shadow-[3px_3px_0px_#06b6d4] scale-[1.01]'
                : proj.id === 'eight-months'
                ? 'border-amber-500 shadow-[3px_3px_0px_#d97706] scale-[1.01]'
                : 'border-white shadow-[3px_3px_0px_#ffffff] scale-[1.01]'
              : 'border-zinc-800 hover:border-zinc-500 hover:scale-[1.005]';

            return (
              <div
                key={proj.id}
                onClick={() => {
                  sfx.playSelect();
                  setActiveProject(proj.id);
                }}
                className={`relative overflow-hidden bg-black border-2 p-2.5 sm:p-3 transition-all duration-300 cursor-pointer ${borderTheme}`}
              >
                {/* Visual badges/effects for each specific project */}
                {proj.id === 'silent-universe' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent pointer-events-none opacity-40 animate-fnafScanline" />
                    <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] text-red-500 font-bold bg-black/80 px-1 border border-red-900 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-recBlink" />
                      <span>REC [CAM-02]</span>
                    </div>
                  </>
                )}

                {proj.id === 'algorhythm' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] text-cyan-400 font-bold bg-black/80 px-1 border border-cyan-800 z-10">
                    <Trophy size={10} className="text-cyan-400" />
                    <span>JUARA 2 OTN 8</span>
                  </div>
                )}

                {proj.id === 'eight-months' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] text-amber-400 font-bold bg-black/80 px-1 border border-amber-800 z-10">
                    <Search size={10} className="text-amber-400" />
                    <span>CBT // HIATUS</span>
                  </div>
                )}

                {proj.id === 'anime-3d-models' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] text-white font-bold bg-black/80 px-1 border border-zinc-700 z-10">
                    <Box size={10} className="text-white" />
                    <span>BLENDER 3D</span>
                  </div>
                )}

                <div className="flex items-start justify-between pr-20">
                  <span className={`text-[10px] font-mono font-bold block truncate ${
                    proj.id === 'silent-universe' 
                      ? 'text-red-400' 
                      : proj.id === 'algorhythm'
                      ? 'text-cyan-400'
                      : proj.id === 'eight-months'
                      ? 'text-amber-400'
                      : 'text-zinc-300'
                  }`}>
                    {proj.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">
                    {proj.title}
                  </h4>
                  <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.2 shrink-0 ml-1">
                    {proj.engine}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-1 leading-snug line-clamp-2">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.highlights.map((h, i) => (
                    <span 
                      key={i} 
                      className={`text-[9px] font-mono px-1 py-0.5 border ${
                        isSelected
                          ? proj.id === 'silent-universe'
                            ? 'bg-red-950/40 border-red-800 text-red-300'
                            : proj.id === 'algorhythm'
                            ? 'bg-cyan-950/40 border-cyan-800 text-cyan-300'
                            : proj.id === 'eight-months'
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                            : 'bg-zinc-800 border-zinc-500 text-white'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* BESPOKE INTERACTIVE HUD DRAWER FOR EACH PROJECT */}
        {selectedProj.id === 'silent-universe' && (
          <div className="relative overflow-hidden bg-black border-2 border-red-700/80 p-2 sm:p-3 shadow-[3px_3px_0px_#990000] sm:shadow-[4px_4px_0px_#990000] font-mono text-xs">
            {/* Background CRT scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none animate-fnafScanline opacity-50" />

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 mb-1.5 sm:mb-2 border-b border-red-900 text-red-400 text-[10px] sm:text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-red-500 animate-pulse sm:w-3.5 sm:h-3.5" />
                <span className="truncate">SURVEILLANCE NIGHT MONITOR</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] sm:text-[10px] bg-red-950 text-red-300 px-1 border border-red-800">FEED: HIATUS</span>
                <span className="text-zinc-400 text-[9px] sm:text-[10px] hidden sm:inline">DISCONTINUED</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px]">
              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-red-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Activity size={9} className="text-red-400" />
                  <span className="truncate">STATUS</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 sm:h-1.5 mt-0.5 sm:mt-1 border border-zinc-700 overflow-hidden">
                  <div className="bg-red-500 h-full w-[100%] opacity-60" />
                </div>
                <span className="text-red-300 font-bold mt-0.5 block truncate">HIATUS</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-red-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Volume2 size={9} className="text-red-400" />
                  <span className="truncate">RADAR</span>
                </div>
                <div className="flex gap-0.5 mt-0.5 sm:mt-1 items-end h-2">
                  <span className="w-1 bg-red-800 h-full" />
                  <span className="w-1 bg-red-800 h-2/3" />
                  <span className="w-1 bg-red-900 h-1/2" />
                  <span className="w-1 bg-red-800 h-3/4" />
                </div>
                <span className="text-zinc-400 font-bold mt-0.5 block truncate">STANDBY</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-red-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Cpu size={9} className="text-red-400" />
                  <span className="truncate">AI STATE</span>
                </div>
                <span className="text-white font-bold block mt-0.5 truncate">HALLWAY 03</span>
                <span className="text-[8px] sm:text-[9px] text-red-400 block truncate">OFFLINE</span>
              </div>
            </div>
          </div>
        )}

        {selectedProj.id === 'algorhythm' && (
          <div className="relative overflow-hidden bg-black border-2 border-cyan-500/80 p-2 sm:p-3 shadow-[3px_3px_0px_#06b6d4] sm:shadow-[4px_4px_0px_#06b6d4] font-mono text-xs">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 mb-1.5 sm:mb-2 border-b border-cyan-900/70 text-cyan-400 text-[10px] sm:text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <Trophy size={13} className="text-cyan-400 animate-pulse sm:w-3.5 sm:h-3.5" />
                <span className="truncate">CYBER RHYTHM TERMINAL // OTN 8</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] sm:text-[10px] bg-cyan-950 text-cyan-300 px-1 border border-cyan-800 font-bold">
                  JUARA 2 NASIONAL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px]">
              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-cyan-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Radio size={9} className="text-cyan-400" />
                  <span className="truncate">DSP CLOCK</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-300 font-bold truncate">140 BPM</span>
                </div>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 block truncate">0ms Audio Drift</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-cyan-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Shield size={9} className="text-cyan-400" />
                  <span className="truncate">CYBER SHIELD</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 sm:h-1.5 mt-0.5 sm:mt-1 border border-zinc-700 overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[92%]" />
                </div>
                <span className="text-cyan-300 font-bold mt-0.5 block truncate">92% INTEGRITY</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-cyan-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Cpu size={9} className="text-cyan-400" />
                  <span className="truncate">ARCHITECTURE</span>
                </div>
                <span className="text-white font-bold block mt-0.5 truncate">MODULAR C#</span>
                <span className="text-[8px] sm:text-[9px] text-cyan-300 block truncate">Rhythm Core</span>
              </div>
            </div>
          </div>
        )}

        {selectedProj.id === 'eight-months' && (
          <div className="relative overflow-hidden bg-black border-2 border-amber-600/80 p-2 sm:p-3 shadow-[3px_3px_0px_#d97706] sm:shadow-[4px_4px_0px_#d97706] font-mono text-xs">
            {/* Subtle dossier watermark */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 border border-amber-600/10 rounded-full pointer-events-none" />

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 mb-1.5 sm:mb-2 border-b border-amber-900/70 text-amber-400 text-[10px] sm:text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <Search size={13} className="text-amber-500 animate-pulse sm:w-3.5 sm:h-3.5" />
                <span className="truncate">CRIME DEDUCTION DOSSIER // CBT</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] sm:text-[10px] bg-amber-950 text-amber-300 px-1 border border-amber-800 font-bold">
                  DALAM PROSES / HIATUS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px]">
              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-amber-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <FileText size={9} className="text-amber-400" />
                  <span className="truncate">CASE FILE</span>
                </div>
                <span className="text-white font-bold block mt-0.5 sm:mt-1 truncate">#08-SILENCE</span>
                <span className="text-[8px] sm:text-[9px] text-amber-300 block truncate">Psychological Thriller</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-amber-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Box size={9} className="text-amber-400" />
                  <span className="truncate">3D EVIDENCE</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 sm:h-1.5 mt-0.5 sm:mt-1 border border-zinc-700 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[67%]" />
                </div>
                <span className="text-amber-300 font-bold mt-0.5 block truncate">8/12 SAMPLES</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-amber-900/60">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Clock size={9} className="text-amber-400" />
                  <span className="truncate">TIMELINE</span>
                </div>
                <span className="text-white font-bold block mt-0.5 truncate">OCT 14, 02:40 AM</span>
                <span className="text-[8px] sm:text-[9px] text-amber-400 block truncate">CBT Test Phase</span>
              </div>
            </div>
          </div>
        )}

        {selectedProj.id === 'anime-3d-models' && (
          <div className="relative overflow-hidden bg-black border-2 border-zinc-200 p-2 sm:p-3 shadow-[3px_3px_0px_#ffffff] sm:shadow-[4px_4px_0px_#ffffff] font-mono text-xs">
            {/* Manga dot matrix overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px] opacity-10 pointer-events-none" />

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 mb-1.5 sm:mb-2 border-b border-zinc-700 text-white text-[10px] sm:text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <Layers size={13} className="text-white animate-pulse sm:w-3.5 sm:h-3.5" />
                <span className="truncate">BLENDER 3D VIEWPORT // TOPOLOGY</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] sm:text-[10px] bg-white text-black px-1 font-black">
                  ACTIVE PORTFOLIO
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px]">
              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-zinc-700">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Box size={9} className="text-zinc-200" />
                  <span className="truncate">TOPOLOGY</span>
                </div>
                <span className="text-white font-bold block mt-0.5 sm:mt-1 truncate">24.8K QUADS</span>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 block truncate">Sub-D Clean Flow</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-zinc-700">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Activity size={9} className="text-zinc-200" />
                  <span className="truncate">RIG & BLENDSHAPES</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 sm:h-1.5 mt-0.5 sm:mt-1 border border-zinc-700 overflow-hidden">
                  <div className="bg-white h-full w-[85%]" />
                </div>
                <span className="text-zinc-200 font-bold mt-0.5 block truncate">IK/FK + FACIAL 52</span>
              </div>

              <div className="bg-zinc-950 p-1 sm:p-1.5 border border-zinc-700">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Sparkles size={9} className="text-zinc-200" />
                  <span className="truncate">SHADER</span>
                </div>
                <span className="text-white font-bold block mt-0.5 truncate">NPR CEL-SHADE</span>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 block truncate">Blender &rarr; Unity</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="pt-1 flex items-center gap-3">
          <button
            onClick={() => {
              sfx.playBack();
              onNavigate('home');
            }}
            className="flex items-center gap-2 bg-white text-black font-black font-mono text-xs px-5 py-2.5 hover:bg-zinc-200 transition-all shadow-[4px_4px_0px_#000000] border-2 border-black cursor-pointer"
          >
            <span>◀ KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: LARGE ANKO STANDING TRENCH COAT */}
      <MangaCharacter
        src="/manga_chars/large_anko_projects.png"
        alt="Anko Uguisu Standing Detective Pose"
        kanjiTop="事件"
        kanjiBottom="計画"
        caption="MISSIONS // ANKO UGUISU // YOFUKASHI NO UTA"
      />
    </div>
  );
};
