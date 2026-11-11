import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { sfx } from '../utils/sfx';

export const YofukashiMusicPlayer: React.FC = () => {
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const {
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentTime,
    duration,
    seek,
    currentTrack,
    currentTrackIndex,
    playlist,
    nextTrack,
    prevTrack,
    selectTrack,
  } = useMusicPlayer();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayToggle = () => {
    sfx.playSelect();
    togglePlay();
  };

  const handlePrev = () => {
    sfx.playSelect();
    prevTrack();
  };

  const handleNext = () => {
    sfx.playSelect();
    nextTrack();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3 font-mono select-none">
      {/* Track Skip & Play Controls Group */}
      <div className="flex items-center gap-1">
        {/* Prev Track */}
        <button
          onClick={handlePrev}
          className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
          title="Previous Track (B)"
        >
          <SkipBack size={13} className="fill-current" />
        </button>

        {/* Play / Pause Manga Action Button */}
        <button
          onClick={handlePlayToggle}
          className={`px-2.5 py-1 flex items-center gap-1.5 font-black text-xs uppercase tracking-wider transition-all duration-150 transform active:scale-95 border-2 ${
            isPlaying
              ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
              : 'bg-black text-white border-white hover:bg-white hover:text-black'
          } -skew-x-6`}
          title={isPlaying ? 'Pause Track (Space)' : 'Play Track (Space)'}
        >
          <span className="skew-x-6 flex items-center gap-1">
            {isPlaying ? (
              <>
                <Pause size={12} className="fill-current" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            ) : (
              <>
                <Play size={12} className="fill-current" />
                <span className="hidden sm:inline">PLAY</span>
              </>
            )}
          </span>
        </button>

        {/* Next Track */}
        <button
          onClick={handleNext}
          className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
          title="Next Track (N)"
        >
          <SkipForward size={13} className="fill-current" />
        </button>
      </div>

      {/* Track Info & Vinyl Icon */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div
          onClick={handleNext}
          className="flex items-center gap-2 max-w-[130px] sm:max-w-[200px] lg:max-w-[240px] cursor-pointer group"
          title="Click to Switch Track (Next)"
        >
          <Disc3
            size={18}
            className={`text-white transition-transform shrink-0 ${
              isPlaying ? 'animate-spin' : 'opacity-40'
            }`}
            style={{ animationDuration: '4s' }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold truncate group-hover:text-zinc-200">
              <span className="bg-zinc-800 text-zinc-300 text-[9px] px-1 font-mono shrink-0">
                0{currentTrackIndex + 1}/0{playlist.length}
              </span>
              <span className="text-white truncate text-[11px] sm:text-xs">
                {currentTrack.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
              <span className="truncate hidden sm:inline">{currentTrack.subTitle}</span>
              <span className="text-zinc-600 hidden sm:inline">//</span>
              <span className="font-mono text-zinc-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Playlist Drawer Toggle */}
        <button
          onClick={() => {
            sfx.playSelect();
            setShowPlaylist(!showPlaylist);
          }}
          className={`px-1.5 py-0.5 text-[10px] flex items-center gap-1 font-mono font-bold transition-all cursor-pointer border ${
            showPlaylist
              ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
              : 'text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-500 bg-zinc-950'
          }`}
          title="Open Tracklist / Playlist"
        >
          <ListMusic size={12} />
          <span className="hidden md:inline">LIST</span>
        </button>
      </div>

      {/* Scrub / Progress Bar */}
      <div className="hidden lg:flex items-center gap-2 w-28 xl:w-36">
        <div className="relative w-full h-1.5 bg-zinc-800 border border-zinc-700 overflow-hidden cursor-pointer group">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeekChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Scrub Track"
          />
        </div>
      </div>

      {/* Mini Dancing Equalizer Bars */}
      <div className="hidden md:flex items-end gap-0.5 h-4 px-1 py-0.5 bg-zinc-900 border border-zinc-800" title="Audio Meter">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1 bg-white transition-all duration-75 ${
              isPlaying && !isMuted
                ? 'animate-pulse'
                : 'h-1 opacity-20'
            }`}
            style={{
              height: isPlaying && !isMuted ? `${Math.max(20, Math.sin(Date.now() / 150 + i) * 50 + 50) * volume}%` : '20%',
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Volume Controller (Slider & Mute Toggle) */}
      <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-800">
        <button
          onClick={toggleMute}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={15} className="text-zinc-500" />
          ) : (
            <Volume2 size={15} className="text-white" />
          )}
        </button>

        {/* Volume Slider */}
        <div className="hidden sm:flex items-center gap-1.5">
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-14 lg:w-16 h-1 bg-zinc-800 accent-white cursor-pointer"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
          <span className="text-[10px] font-mono text-zinc-400 w-6 text-right">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Playlist Popover Modal */}
      {showPlaylist && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-28 w-80 max-w-[92vw] bg-black border-2 border-white p-2.5 shadow-[4px_4px_0px_#ffffff] z-50 font-mono text-xs animate-slideIn">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-800 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-white">
              <ListMusic size={12} />
              <span>BGM TRACKLIST</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[9px]">{playlist.length} TRACKS</span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {playlist.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    sfx.playSelect();
                    selectTrack(idx);
                    setShowPlaylist(false);
                  }}
                  className={`w-full text-left p-1.5 flex items-center justify-between border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`text-[9px] px-1 font-mono font-bold shrink-0 ${isCurrent ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-[11px] leading-tight">{track.title}</span>
                      <span className={`text-[9px] truncate ${isCurrent ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {track.subTitle}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default YofukashiMusicPlayer;
