import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

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
  togglePlay: () => void;
  play: () => void;
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
  selectTrack: (index: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [previousVolume, setPreviousVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex] || PLAYLIST[0];

  // Initialize Web Audio API safely on first user gesture
  const initAudioNodes = () => {
    if (!audioRef.current) return;

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create AnalyserNode
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128; // 64 frequency data bins
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Create GainNode
      const gain = ctx.createGain();
      gain.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current = gain;

      // Connect source only once
      try {
        if (!sourceNodeRef.current) {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceNodeRef.current = source;
          source.connect(analyser);
          analyser.connect(gain);
          gain.connect(ctx.destination);
        }
      } catch (err) {
        console.warn('Audio source node connection error:', err);
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const play = async () => {
    initAudioNodes();
    if (!audioRef.current) return;
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Autoplay prevented or audio play failed:', err);
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const selectTrack = async (index: number) => {
    const targetIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(targetIndex);
    const targetTrack = PLAYLIST[targetIndex];

    if (audioRef.current) {
      const shouldPlay = isPlaying;
      audioRef.current.src = targetTrack.src;
      audioRef.current.load();
      setCurrentTime(0);

      initAudioNodes();
      if (shouldPlay) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    }
  };

  const nextTrack = () => {
    selectTrack(currentTrackIndex + 1);
  };

  const prevTrack = () => {
    selectTrack(currentTrackIndex - 1);
  };

  const setVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }

    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : clamped;
    }
  };

  const toggleMute = () => {
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
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      const clamped = Math.max(0, Math.min(duration || 0, seconds));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  // Setup HTML Audio element
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0].src);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Auto-play next track in the playlist!
      setCurrentTrackIndex((prev) => {
        const next = (prev + 1) % PLAYLIST.length;
        if (audioRef.current) {
          audioRef.current.src = PLAYLIST[next].src;
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

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

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
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
        analyser: analyserRef.current,
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
