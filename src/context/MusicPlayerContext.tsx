import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface Track {
  id: string;
  title: string;
  src: string;
  subTitle: string;
}

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

export const PLAYLIST: Track[] = [
  {
    id: 'daten',
    title: 'NOCTURNAL BGM 01 // 堕天',
    src: getAssetUrl('/audio/track_daten.mp3'),
    subTitle: 'CALL OF THE NIGHT OST',
  },
  {
    id: 'yofukashi',
    title: 'NOCTURNAL BGM 02 // よふかしのうた',
    src: getAssetUrl('/audio/track_yofukashi.mp3'),
    subTitle: 'NIGHTFALL BEATS',
  },
  {
    id: 'theme',
    title: 'NOCTURNAL BGM 03 // NIGHT DRIVE',
    src: getAssetUrl('/audio/track_theme.mp3'),
    subTitle: 'CHILL NOIR THEME',
  },
  {
    id: 'losstime',
    title: 'NOCTURNAL BGM 04 // ロスタイム',
    src: getAssetUrl('/audio/track_losstime.mp3'),
    subTitle: 'MIDNIGHT LOSS TIME',
  },
];

interface MusicPlayerContextType {
  isPlaying: boolean;
  autoplayBlocked: boolean;
  togglePlay: () => void;
  play: (fromGesture?: boolean) => Promise<boolean>;
  pause: () => void;
  volume: number; // 0 to 1
  setVolume: (vol: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  currentTime: number;
  duration: number;
  seek: (seconds: number) => void;
  analyser: AnalyserNode | null;
  audioElement: HTMLAudioElement | null;
  currentTrack: Track;
  currentTrackIndex: number;
  playlist: Track[];
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number, autoStart?: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [previousVolume, setPreviousVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const userPausedRef = useRef<boolean>(false);

  const currentTrack = PLAYLIST[currentTrackIndex] || PLAYLIST[0];

  // Connect Web Audio API analyser safely inside/after user gesture so suspended AudioContext never mutes native autoplay
  const ensureAudioNodes = useCallback(() => {
    if (!audioRef.current) return;

    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 128;
      analyserNode.smoothingTimeConstant = 0.8;
      setAnalyser(analyserNode);

      const gain = ctx.createGain();
      gain.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current = gain;

      try {
        if (!sourceNodeRef.current) {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceNodeRef.current = source;
          source.connect(analyserNode);
          analyserNode.connect(gain);
          gain.connect(ctx.destination);
        }
      } catch (err) {
        console.warn('Audio source node connection error:', err);
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, [isMuted, volume]);

  const play = useCallback(
    async (fromGesture = false): Promise<boolean> => {
      const audio = audioRef.current;
      if (!audio) return false;

      // Resume/attach Web Audio graph ONLY on a real user gesture (or once context already exists),
      // calling audio.play() synchronously without awaiting ctx.resume() first so browser gesture token isn't lost.
      if (fromGesture || audioCtxRef.current) {
        ensureAudioNodes();
      }

      audio.volume = isMuted ? 0 : volume;
      userPausedRef.current = false;

      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        return true;
      } catch {
        setIsPlaying(false);
        setAutoplayBlocked(true);
        return false;
      }
    },
    [ensureAudioNodes, isMuted, volume],
  );

  const pause = useCallback(() => {
    userPausedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      void play(true);
    }
  }, [isPlaying, pause, play]);

  const selectTrack = useCallback(
    async (index: number, autoStart = false) => {
      const targetIndex = (index + PLAYLIST.length) % PLAYLIST.length;
      const targetTrack = PLAYLIST[targetIndex];
      const audio = audioRef.current;

      setCurrentTrackIndex(targetIndex);

      if (!audio) return;

      // Avoid resetting/calling .load() if the target track is already loaded on track 0 during boot
      const isAlreadyLoadedSameSrc =
        targetIndex === currentTrackIndex && audio.src.includes(targetTrack.src.split('/').pop() || targetTrack.src);

      if (!isAlreadyLoadedSameSrc) {
        const shouldResume = isPlaying || autoStart;
        audio.src = targetTrack.src;
        audio.load();
        setCurrentTime(0);

        if (shouldResume) {
          ensureAudioNodes();
          try {
            await audio.play();
            setIsPlaying(true);
            setAutoplayBlocked(false);
          } catch {
            setIsPlaying(false);
            setAutoplayBlocked(true);
          }
        }
      } else if (autoStart && !isPlaying) {
        await play(true);
      }
    },
    [currentTrackIndex, ensureAudioNodes, isPlaying, play],
  );

  const nextTrack = useCallback(() => {
    void selectTrack(currentTrackIndex + 1, isPlaying);
  }, [currentTrackIndex, isPlaying, selectTrack]);

  const prevTrack = useCallback(() => {
    void selectTrack(currentTrackIndex - 1, isPlaying);
  }, [currentTrackIndex, isPlaying, selectTrack]);

  const setVolume = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(1, newVol));
      setVolumeState(clamped);
      const effectiveMuted = clamped > 0 ? false : isMuted;
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
      }

      if (audioRef.current) {
        audioRef.current.volume = effectiveMuted ? 0 : clamped;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = effectiveMuted ? 0 : clamped;
      }
    },
    [isMuted],
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      const restored = previousVolume || 0.7;
      setVolumeState(restored);
      if (audioRef.current) audioRef.current.volume = restored;
      if (gainNodeRef.current) gainNodeRef.current.gain.value = restored;
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
      if (gainNodeRef.current) gainNodeRef.current.gain.value = 0;
    }
  }, [isMuted, previousVolume, volume]);

  const seek = useCallback(
    (seconds: number) => {
      if (audioRef.current) {
        const clamped = Math.max(0, Math.min(duration || 0, seconds));
        audioRef.current.currentTime = clamped;
        setCurrentTime(clamped);
      }
    },
    [duration],
  );

  // Setup HTML Audio element & try instant unmuted autoplay on mount
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0].src);
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handlePlay = () => {
      setIsPlaying(true);
      setAutoplayBlocked(false);
    };
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        const next = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[next].src;
        audio.load();
        audio.play().catch(() => {});
        return next;
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Attempt immediate unmuted autoplay (works directly in browsers allowing MEI/autoplay)
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      })
      .catch(() => {
        setIsPlaying(false);
        setAutoplayBlocked(true);
      });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Global first-gesture audio unlocker (persists across click/pointerdown/touchend/keydown until audio plays cleanly)
  useEffect(() => {
    if (isPlaying || userPausedRef.current) return;

    const unlockOnGesture = () => {
      if (userPausedRef.current) return;
      void play(true);
    };

    window.addEventListener('click', unlockOnGesture, { capture: true });
    window.addEventListener('pointerdown', unlockOnGesture, { capture: true });
    window.addEventListener('touchend', unlockOnGesture, { capture: true });
    window.addEventListener('keydown', unlockOnGesture, { capture: true });

    return () => {
      window.removeEventListener('click', unlockOnGesture, { capture: true });
      window.removeEventListener('pointerdown', unlockOnGesture, { capture: true });
      window.removeEventListener('touchend', unlockOnGesture, { capture: true });
      window.removeEventListener('keydown', unlockOnGesture, { capture: true });
    };
  }, [isPlaying, play]);

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        autoplayBlocked,
        togglePlay,
        play,
        pause,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        currentTime,
        duration,
        seek,
        analyser,
        audioElement: audioRef.current,
        currentTrack,
        currentTrackIndex,
        playlist: PLAYLIST,
        nextTrack,
        prevTrack,
        selectTrack,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
