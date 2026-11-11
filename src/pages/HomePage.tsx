import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MangaCharacter } from '../components/MangaCharacter';
import { YofukashiButton } from '../components/YofukashiButton';
import { YofukashiTitle } from '../components/YofukashiTitle';
import { PageId } from '../components/HeaderNav';
import { sfx } from '../utils/sfx';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

interface MenuItemData {
  key: PageId;
  num: string;
  title: string;
  kanji: string;
  tag: string;
}

const MENU_ITEMS: MenuItemData[] = [
  {
    key: 'about',
    num: '01',
    title: 'ABOUT ME',
    kanji: '概要・探偵調査',
    tag: 'INVESTIGATOR DOSSIER & PROFILE',
  },
  {
    key: 'skills',
    num: '02',
    title: 'SKILL ARSENAL',
    kanji: '武装・技術仕様',
    tag: '3D MODELING, UNITY PIPELINE & SHADERS',
  },
  {
    key: 'projects',
    num: '03',
    title: 'CASE PROJECTS',
    kanji: '実績・機密案件',
    tag: 'ALGORHYTHM, SILENT UNIVERSE & 3D ART',
  },
  {
    key: 'contact',
    num: '04',
    title: 'NIGHT INQUIRY',
    kanji: '接触・夜間通信',
    tag: 'SEND CALLING CARD & SOCIAL CHANNELS',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(2); // Default PROJECTS
  const prefersReduced = useReducedMotion() ?? false;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        sfx.playHover();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        sfx.playHover();
        setSelectedIndex((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        sfx.playSelect();
        onNavigate(MENU_ITEMS[selectedIndex].key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onNavigate]);

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-4 md:py-0">
      {/* LEFT COLUMN: TITLE & YOFUKASHI NO UTA NOCTURNAL MENU */}
      <div className="w-full md:w-7/12 flex flex-col justify-center space-y-3 max-w-2xl py-1 z-20">
        {/* YOFUKASHI NO UTA MANGA TITLE: ENDRICO */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReduced ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <YofukashiTitle
            name="ENDRICO"
            fullName="ENDRICO ROVSANS KURNIA"
            tagline="3D ARTIST & GAME DESIGNER // rewsaqy"
          />
        </motion.div>

        {/* Manga Noir Mission / Bio Box */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, x: 0, rotate: -1 } : { opacity: 0, x: -20, rotate: -2 }}
          animate={{ opacity: 1, x: 0, rotate: -1 }}
          transition={{ duration: prefersReduced ? 0.01 : 0.4, delay: prefersReduced ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-black text-white p-3 border-2 border-white shadow-[4px_4px_0px_#ffffff] max-w-xl"
          style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}
        >
          <p className="font-mono text-xs leading-relaxed text-zinc-300">
            3D Artist &amp; Game Designer: fokus pada 3D modeling stylized &amp; PSX, map dan level design atmosferik, serta core gameplay mechanics.
          </p>
        </motion.div>

        {/* YOFUKASHI NO UTA NOCTURNAL BUTTONS */}
        <nav className="flex flex-col space-y-2 pt-1 w-full max-w-xl">
          {MENU_ITEMS.map((item, index) => (
            <motion.div
              key={item.key}
              initial={prefersReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: prefersReduced ? 0.01 : 0.36,
                delay: prefersReduced ? 0 : 0.14 + index * 0.055,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <YofukashiButton
                num={item.num}
                title={item.title}
                kanji={item.kanji}
                tag={item.tag}
                isActive={selectedIndex === index}
                onClick={() => {
                  setSelectedIndex(index);
                  onNavigate(item.key);
                }}
                onHover={() => setSelectedIndex(index)}
              />
            </motion.div>
          ))}
        </nav>
      </div>

      {/* RIGHT COLUMN: LARGE ANKO UGUISU WALKING TRENCHCOAT */}
      <MangaCharacter
        src="/manga_chars/large_anko_home.png"
        alt="Anko Uguisu Detective - Call of the Night"
        kanjiTop="夜行"
        kanjiBottom="探偵"
        caption="DETECTIVE // ANKO UGUISU // YOFUKASHI NO UTA"
        priority
      />
    </div>
  );
};
