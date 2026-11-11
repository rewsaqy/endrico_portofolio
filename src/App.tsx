import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { HeaderNav, PageId } from './components/HeaderNav';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
import { NightAtmosphereCanvas } from './components/NightAtmosphereCanvas';
import { BottomEqualizerBar } from './components/BottomEqualizerBar';
import { YofukashiMusicPlayer } from './components/YofukashiMusicPlayer';
import { MusicPlayerProvider, useMusicPlayer } from './context/MusicPlayerContext';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContactPage } from './pages/ContactPage';
import { MangaLoadingScreen } from './components/MangaLoadingScreen';
import { sfx } from './utils/sfx';

const AppContent: React.FC = () => {
  const getInitialPage = (): PageId => {
    const raw = window.location.hash.replace('#', '').split('/')[0].split('?')[0] as PageId;
    if (['home', 'about', 'skills', 'projects', 'contact'].includes(raw)) {
      return raw;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timeString, setTimeString] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { togglePlay, nextTrack, prevTrack, play, selectTrack } = useMusicPlayer();

  const handleLoadingComplete = () => {
    // Enforce Track 01: DATEN as the initial first track
    selectTrack(0);
    play();
    setIsLoading(false);
  };

  // Browser Autoplay Unlock on earliest user touch/click/key
  useEffect(() => {
    const handleFirstInteraction = () => {
      selectTrack(0);
      play();
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Sync hash changes
  useEffect(() => {
    const handleHash = () => {
      const p = getInitialPage();
      setCurrentPage(p);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Page Transition Handler with Silky Smooth Manga Slash Effect
  const handleNavigate = (newPage: PageId) => {
    if (newPage === currentPage || isTransitioning) return;

    sfx.playSelect();
    setIsTransitioning(true);

    // Switch page precisely at midpoint when the curtain fully covers the screen
    setTimeout(() => {
      setCurrentPage(newPage);
      window.location.hash = newPage === 'home' ? '' : newPage;
    }, 320);

    // Complete transition smoothly
    setTimeout(() => {
      setIsTransitioning(false);
    }, 720);
  };

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs/textareas
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (isTransitioning) return;

      if (e.key === 'Escape') {
        if (currentPage !== 'home') {
          handleNavigate('home');
        }
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'n' || e.key === 'N') {
        nextTrack();
      } else if (e.key === 'b' || e.key === 'B') {
        prevTrack();
      } else if (e.key === '1') {
        handleNavigate('home');
      } else if (e.key === '2') {
        handleNavigate('about');
      } else if (e.key === '3') {
        handleNavigate('skills');
      } else if (e.key === '4') {
        handleNavigate('projects');
      } else if (e.key === '5') {
        handleNavigate('contact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isTransitioning, togglePlay]);

  const toggleSound = () => {
    const next = !soundEnabled;
    sfx.enabled = next;
    setSoundEnabled(next);
    if (next) sfx.playSelect();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#040407] flex flex-col justify-between font-sans select-none text-white">
      {/* Background Manga Action Slashes */}
      <div className="absolute inset-0 yofu-slash-bg pointer-events-none" />

      {/* Halftone Screentone Overlay */}
      <div className="absolute inset-0 manga-screentone pointer-events-none" />

      {/* Manga Speedlines Subtle Texture */}
      <div className="absolute inset-0 manga-speedlines pointer-events-none" />

      {/* Atmospheric Twinkling Stars & Cigarette Smoke Canvas */}
      <NightAtmosphereCanvas />

      {/* Stylized Manga Giant Night Moon (Call of the Night motif) */}
      <div className="absolute top-12 right-24 md:right-1/4 w-72 md:w-96 h-72 md:h-96 rounded-full border-4 border-dashed border-white/20 pointer-events-none animate-spin-slow">
        <div className="absolute top-4 left-6 w-12 h-12 rounded-full border border-white/30" />
      </div>

      {/* Subtle Japanese Watermark: よふかしのうた (Call of the Night) */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/[0.04] font-black text-7xl md:text-9xl tracking-[0.4em] select-none whitespace-nowrap">
        よふかしのうた
      </div>

      {/* City Skyline Silhouette at Bottom Background */}
      <div
        className="absolute bottom-12 left-0 right-0 h-24 bg-repeat-x opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,20 L0,12 L5,12 L5,6 L12,6 L12,14 L18,14 L18,4 L24,4 L24,20 L30,20 L30,10 L38,10 L38,20 L45,20 L45,2 L52,2 L52,20 L60,20 L60,8 L68,8 L68,15 L75,15 L75,5 L82,5 L82,20 L90,20 L90,11 L96,11 L96,20 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '240px 100%',
        }}
      />

      {/* REACTIVE MUSIC EQUALIZER BARS (Dancing to Frequency & Volume) */}
      <BottomEqualizerBar />

      {/* TOP HEADER NAVIGATION */}
      <div className="shrink-0">
        <HeaderNav currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* ACTIVE PAGE CONTENT */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col justify-start md:justify-center overflow-y-auto md:overflow-hidden">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'skills' && <SkillsPage onNavigate={handleNavigate} />}
        {currentPage === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      {/* BOTTOM CONTROLLER BAR & MUSIC PLAYER DECK */}
      <footer className="relative z-20 shrink-0 w-full max-w-full bg-black text-white px-3 md:px-8 py-2 border-t-[3px] border-white flex items-center justify-between text-xs font-mono gap-2 sm:gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Navigation Keybinds (Desktop only for keyboard hints) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {currentPage === 'home' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="bg-white text-black px-1.5 py-0.5 font-bold font-mono">W / S</span>
                <span className="text-zinc-300">NAVIGATE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-white text-black px-1.5 py-0.5 font-bold font-mono">ENTER</span>
                <span className="text-zinc-300">CONFIRM</span>
              </div>
            </>
          ) : (
            <div 
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-white text-zinc-300"
            >
              <span className="bg-white text-black px-1.5 py-0.5 font-bold font-mono">ESC</span>
              <span>KEMBALI KE HOME</span>
            </div>
          )}

          <div className="hidden xl:flex items-center gap-1.5 text-zinc-400">
            <span className="bg-zinc-800 text-white px-1.5 py-0.5 font-bold font-mono border border-zinc-700">1 - 5</span>
            <span>JUMP PAGE</span>
          </div>
        </div>

        {/* YOFUKASHI NO UTA MUSIC PLAYER DECK */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <YofukashiMusicPlayer />
        </div>

        {/* Audio Toggle & Clock (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle SFX (M)"
          >
            {soundEnabled ? (
              <>
                <Volume2 size={15} className="text-white" />
                <span className="inline text-[11px]">SFX: ON</span>
              </>
            ) : (
              <>
                <VolumeX size={15} className="text-zinc-500" />
                <span className="inline text-zinc-500 text-[11px]">SFX: OFF</span>
              </>
            )}
          </button>

          <div className="hidden md:flex items-center gap-2 text-zinc-400 text-[11px]">
            <span className="text-white">●</span>
            <span>NOCTURNAL // {timeString || '00:00:00'}</span>
          </div>
        </div>
      </footer>

      {/* MANGA CINEMATIC LOADING SCREEN / AUTOPLAY UNLOCK */}
      {isLoading && <MangaLoadingScreen onComplete={handleLoadingComplete} />}

      {/* MANGA SCREEN SLASH OVERLAY */}
      <PageTransitionOverlay isTransitioning={isTransitioning} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MusicPlayerProvider>
      <AppContent />
    </MusicPlayerProvider>
  );
};

export default App;
