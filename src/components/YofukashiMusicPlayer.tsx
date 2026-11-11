import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, SkipBack, SkipForward, ListMusic, X } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { sfx } from '../utils/sfx';

export const YofukashiMusicPlayer: React.FC = () => {
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const {
    isPlaying,
    autoplayBlocked,
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
      <div className="flex items-center gap-1 shrink-0">
        {/* Prev Track */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Lagu sebelumnya"
          className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-white"
          title="Previous Track (B)"
        >
          <SkipBack size={13} aria-hidden="true" className="fill-current" />
        </button>

        {/* Play / Pause Manga Action Button */}
        <button
          type="button"
          onClick={handlePlayToggle}
          aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
          className={`px-2.5 py-1 flex items-center gap-1.5 font-black text-xs uppercase tracking-wider transition-all duration-150 transform active:scale-95 border-2 focus-visible:outline-2 focus-visible:outline-white ${
            isPlaying
              ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
              : 'bg-black text-white border-white hover:bg-white hover:text-black'
          } -skew-x-6`}
          title={isPlaying ? 'Pause Track (Space)' : 'Play Track (Space)'}
        >
          <span className="skew-x-6 flex items-center gap-1">
            {isPlaying ? (
              <>
                <Pause size={12} aria-hidden="true" className="fill-current" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            ) : (
              <>
                <Play size={12} aria-hidden="true" className="fill-current" />
                <span className="hidden sm:inline">PLAY</span>
              </>
            )}
          </span>
        </button>

        {/* Next Track */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Lagu berikutnya"
          className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-white"
          title="Next Track (N)"
        >
          <SkipForward size={13} aria-hidden="true" className="fill-current" />
        </button>
      </div>

      {/* Track Info & Vinyl Icon */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <button
          type="button"
          onClick={handleNext}
          aria-label={`Ganti ke lagu berikutnya, sedang diputar ${currentTrack.title}`}
          className="flex items-center gap-2 max-w-[115px] sm:max-w-[165px] xl:max-w-[210px] min-w-0 cursor-pointer group bg-transparent border-0 p-0 text-left focus-visible:outline-2 focus-visible:outline-white"
          title="Click to Switch Track (Next)"
        >
          <Disc3
            size={18}
            aria-hidden="true"
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
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 whitespace-nowrap">
              <span className="truncate hidden 2xl:inline max-w-[100px]">
                {autoplayBlocked && !isPlaying ? 'KLIK UNTUK AUDIO' : currentTrack.subTitle}
              </span>
              <span aria-hidden="true" className="text-zinc-400 hidden 2xl:inline">//</span>
              <span className="font-mono text-zinc-300 shrink-0">
                {autoplayBlocked && !isPlaying ? 'TAP/KEY -> AUDIO' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
              </span>
            </div>
          </div>
        </button>

        {/* Quick Playlist Drawer Toggle */}
        <button
          type="button"
          onClick={() => {
            sfx.playSelect();
            setShowPlaylist(!showPlaylist);
          }}
          aria-expanded={showPlaylist}
          aria-label="Buka atau tutup daftar putar lagu"
          className={`shrink-0 px-1.5 py-0.5 text-[10px] flex items-center gap-1 font-mono font-bold transition-all cursor-pointer border focus-visible:outline-2 focus-visible:outline-white ${
            showPlaylist
              ? 'bg-white text-black border-white shadow-[2px_2px_0px_#ffffff]'
              : 'text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-500 bg-zinc-950'
          }`}
          title="Open Tracklist / Playlist"
        >
          <ListMusic size={12} aria-hidden="true" />
          <span className="hidden md:inline">LIST</span>
        </button>
      </div>

      {/* Scrub / Progress Bar */}
      <div className="hidden 2xl:flex items-center gap-2 w-24 shrink-0">
        <div className="relative w-full h-1.5 bg-zinc-800 border border-zinc-700 overflow-hidden cursor-pointer group">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            aria-label="Posisi waktu lagu"
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

      {/* Mini Audio Bars */}
      <div aria-hidden="true" className="hidden md:flex items-end gap-0.5 h-4 px-1 py-0.5 bg-zinc-900 border border-zinc-800" title="Audio Meter">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1 bg-white transition-all duration-75 ${
              isPlaying && !isMuted
                ? 'opacity-90'
                : 'h-1 opacity-20'
            }`}
            style={{
              height: isPlaying && !isMuted ? `${Math.max(20, Math.sin(currentTime * 4 + i) * 40 + 60) * volume}%` : '20%',
            }}
          />
        ))}
      </div>

      {/* Volume Controller (Slider & Mute Toggle) */}
      <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-800">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted || volume === 0 ? 'Bunyikan musik' : 'Bisukan musik'}
          className="text-zinc-300 hover:text-white transition-colors cursor-pointer p-0.5 focus-visible:outline-2 focus-visible:outline-white"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={15} aria-hidden="true" className="text-zinc-400" />
          ) : (
            <Volume2 size={15} aria-hidden="true" className="text-white" />
          )}
        </button>

        {/* Volume Slider */}
        <div className="hidden sm:flex items-center gap-1.5">
          <input
            type="range"
            aria-label="Atur volume musik"
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
        <div
          role="dialog"
          aria-label="Daftar putar BGM"
          className="fixed bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-28 w-80 max-w-[92vw] bg-black border-2 border-white p-2.5 shadow-[4px_4px_0px_#ffffff] z-50 font-mono text-xs animate-slideIn"
        >
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-800 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-white">
              <ListMusic size={12} aria-hidden="true" />
              <span>BGM TRACKLIST</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[9px]">{playlist.length} TRACKS</span>
              <button
                type="button"
                aria-label="Tutup daftar putar"
                onClick={() => setShowPlaylist(false)}
                className="text-zinc-300 hover:text-white p-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {playlist.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <button
                  type="button"
                  key={track.id}
                  onClick={() => {
                    sfx.playSelect();
                    selectTrack(idx, true);
                    setShowPlaylist(false);
                  }}
                  className={`w-full text-left p-1.5 flex items-center justify-between border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
                    isCurrent
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`text-[9px] px-1 font-mono font-bold shrink-0 ${isCurrent ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-[11px] leading-tight">{track.title}</span>
                      <span className={`text-[9px] truncate ${isCurrent ? 'text-zinc-700' : 'text-zinc-400'}`}>
                        {track.subTitle}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span aria-label="Sedang diputar" className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 ml-1" />
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
