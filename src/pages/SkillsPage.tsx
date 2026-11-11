import React, { useState } from 'react';
import { Box, Gamepad2, Wrench } from 'lucide-react';
import { MangaCharacter } from '../components/MangaCharacter';
import { PageId } from '../components/HeaderNav';
import { sfx } from '../utils/sfx';

interface SkillsPageProps {
  onNavigate: (page: PageId) => void;
}

interface SkillItem {
  name: string;
  level: 'INTERMEDIATE' | 'BEGINNER';
  score: number; // 1 to 10
}

const SKILLS_3D: SkillItem[] = [
  { name: 'Blender 3D', level: 'INTERMEDIATE', score: 7 },
  { name: 'Stylized 3D Modeling', level: 'INTERMEDIATE', score: 7 },
  { name: 'PSX Modeling', level: 'INTERMEDIATE', score: 7 },
  { name: 'UV Unwrapping', level: 'INTERMEDIATE', score: 7 },
  { name: 'Rigging', level: 'BEGINNER', score: 4 },
];

const SKILLS_GAME_DESIGN: SkillItem[] = [
  { name: 'Level & Atmosphere', level: 'INTERMEDIATE', score: 8 },
  { name: 'Gameplay Mechanics', level: 'INTERMEDIATE', score: 7 },
  { name: 'Unity Engine', level: 'INTERMEDIATE', score: 7 },
  { name: 'C# Scripting', level: 'BEGINNER', score: 4 },
];

const SKILLS_PIPELINE: SkillItem[] = [
  { name: 'Krita', level: 'INTERMEDIATE', score: 7 },
  { name: 'Aseprite', level: 'INTERMEDIATE', score: 7 },
  { name: 'Unity Version Control', level: 'INTERMEDIATE', score: 7 },
  { name: 'Git & GitHub', level: 'INTERMEDIATE', score: 7 },
  { name: 'Linux Arch', level: 'INTERMEDIATE', score: 7 },
];

// Clean 10-Segment Discrete Gauge Meter (Pengukuran Kotak 1/10)
const SkillMeter: React.FC<SkillItem> = ({ name, level, score }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800/80 px-2.5 py-1.5 hover:border-zinc-400 transition-all group">
      {/* Row 1: Full Skill Name (never truncated) */}
      <div className="text-white font-bold text-xs font-mono tracking-tight leading-tight mb-1 truncate group-hover:text-zinc-200">
        {name}
      </div>

      {/* Row 2: Level Badge & Score */}
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <span
          className={`text-[8px] font-mono font-black px-1.5 py-0.2 tracking-wider ${
            level === 'INTERMEDIATE'
              ? 'bg-white text-black'
              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
          }`}
        >
          {level}
        </span>
        <span className="text-zinc-300 text-[10px] font-mono font-bold">
          {score}/10
        </span>
      </div>

      {/* Row 3: 10 Discrete Gauge Blocks */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const isFilled = i < score;
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 transition-all ${
                isFilled
                  ? 'bg-white shadow-[0_0_2px_rgba(255,255,255,0.7)]'
                  : 'bg-zinc-800/80 border border-zinc-900'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export const SkillsPage: React.FC<SkillsPageProps> = ({ onNavigate }) => {
  const [mobileTab, setMobileTab] = useState<'3d' | 'game' | 'pipeline'>('3d');

  const render3DCard = () => (
    <div className="bg-black border-2 border-white p-2.5 shadow-[4px_4px_0px_#ffffff] flex flex-col space-y-1.5">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-1">
        <Box size={14} className="text-white shrink-0" />
        <h3 className="font-mono text-[11px] font-black text-white uppercase tracking-wider truncate">
          3D ART & ASSETS
        </h3>
      </div>
      <div className="space-y-1">
        {SKILLS_3D.map((skill) => (
          <SkillMeter key={skill.name} {...skill} />
        ))}
      </div>
    </div>
  );

  const renderGameCard = () => (
    <div className="bg-black border-2 border-white p-2.5 shadow-[4px_4px_0px_#ffffff] flex flex-col space-y-1.5">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-1">
        <Gamepad2 size={14} className="text-white shrink-0" />
        <h3 className="font-mono text-[11px] font-black text-white uppercase tracking-wider truncate">
          GAME DESIGN & MAP
        </h3>
      </div>
      <div className="space-y-1">
        {SKILLS_GAME_DESIGN.map((skill) => (
          <SkillMeter key={skill.name} {...skill} />
        ))}
      </div>
    </div>
  );

  const renderPipelineCard = () => (
    <div className="bg-black border-2 border-white p-2.5 shadow-[4px_4px_0px_#ffffff] flex flex-col space-y-1.5">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-1">
        <Wrench size={14} className="text-white shrink-0" />
        <h3 className="font-mono text-[11px] font-black text-white uppercase tracking-wider truncate">
          PIPELINE & TOOLS
        </h3>
      </div>
      <div className="space-y-1">
        {SKILLS_PIPELINE.map((skill) => (
          <SkillMeter key={skill.name} {...skill} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 animate-slideInLeft py-4 md:py-0">
      {/* LEFT COLUMN: SKILLS ARSENAL */}
      <div className="w-full md:w-7/12 flex flex-col justify-center space-y-2.5 max-w-2xl py-1 z-10">
        {/* Title Badge */}
        <div className="flex items-center gap-2">
          <span className="bg-white text-black font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 uppercase tracking-widest">
            FILE 02 // ARSENAL
          </span>
          <span className="text-zinc-400 font-mono text-[10px] sm:text-xs tracking-wider">
            CAPABILITIES [1/10]
          </span>
        </div>

        {/* Title Yofukashi Style */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase text-white drop-shadow-[4px_4px_0px_#000000]">
            SKILLS
          </h1>
          <span className="font-mono text-[10px] sm:text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 px-2 py-0.5">
            [ 武装・技術仕様 1/10 ]
          </span>
        </div>

        {/* Mobile Category Switcher (Visible only on mobile < md) */}
        <div
          role="tablist"
          aria-label="Kategori Keahlian"
          className="flex md:hidden items-center gap-1.5 font-mono text-[10px] pt-0.5"
        >
          <button
            type="button"
            role="tab"
            id="tab-skills-3d"
            aria-selected={mobileTab === '3d'}
            aria-controls="panel-skills-mobile"
            onClick={() => {
              sfx.playHover();
              setMobileTab('3d');
            }}
            className={`min-h-[44px] flex-1 py-2 px-1.5 border font-bold uppercase transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
              mobileTab === '3d'
                ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
                : 'bg-zinc-950 text-zinc-300 border-zinc-800'
            }`}
          >
            3D ART
          </button>
          <button
            type="button"
            role="tab"
            id="tab-skills-game"
            aria-selected={mobileTab === 'game'}
            aria-controls="panel-skills-mobile"
            onClick={() => {
              sfx.playHover();
              setMobileTab('game');
            }}
            className={`min-h-[44px] flex-1 py-2 px-1.5 border font-bold uppercase transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
              mobileTab === 'game'
                ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
                : 'bg-zinc-950 text-zinc-300 border-zinc-800'
            }`}
          >
            GAME DESIGN
          </button>
          <button
            type="button"
            role="tab"
            id="tab-skills-pipeline"
            aria-selected={mobileTab === 'pipeline'}
            aria-controls="panel-skills-mobile"
            onClick={() => {
              sfx.playHover();
              setMobileTab('pipeline');
            }}
            className={`min-h-[44px] flex-1 py-2 px-1.5 border font-bold uppercase transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
              mobileTab === 'pipeline'
                ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
                : 'bg-zinc-950 text-zinc-300 border-zinc-800'
            }`}
          >
            PIPELINE
          </button>
        </div>

        {/* Mobile View: Render active card */}
        <div
          id="panel-skills-mobile"
          role="tabpanel"
          aria-labelledby={`tab-skills-${mobileTab}`}
          className="block md:hidden w-full"
        >
          {mobileTab === '3d' && render3DCard()}
          {mobileTab === 'game' && renderGameCard()}
          {mobileTab === 'pipeline' && renderPipelineCard()}
        </div>

        {/* Desktop & Laptop View: 3 Columns Grid Side-by-Side */}
        <div className="hidden md:grid md:grid-cols-3 gap-2 w-full">
          {render3DCard()}
          {renderGameCard()}
          {renderPipelineCard()}
        </div>

        {/* Navigation Action Button */}
        <div className="pt-0.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sfx.playBack();
              onNavigate('home');
            }}
            className="min-h-[44px] flex items-center gap-2 bg-white text-black font-black font-mono text-xs px-4 py-2.5 hover:bg-zinc-200 transition-all shadow-[4px_4px_0px_#ffffff] border-2 border-black cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <span>◀ KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: LARGE ANKO IN CHECKERED SUIT WITH CIGARETTE */}
      <MangaCharacter
        src="/manga_chars/large_anko_skills.png"
        alt="Anko Uguisu Checkered Suit Detective Pose"
        kanjiTop="能力"
        kanjiBottom="武装"
        caption="ARSENAL // ANKO UGUISU // SUIT EDITION"
      />
    </div>
  );
};

export default SkillsPage;
