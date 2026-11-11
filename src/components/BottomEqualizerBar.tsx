import React, { useEffect, useRef } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const BottomEqualizerBar: React.FC = () => {
  const { analyser, isPlaying, volume, isMuted } = useMusicPlayer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const peakCapsRef = useRef<number[]>([]);
  const animFrameIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 140);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 140;
    };
    window.addEventListener('resize', handleResize);

    const barCount = Math.min(64, Math.floor(width / 16));
    const frequencyData = new Uint8Array(analyser ? analyser.frequencyBinCount : 64);

    // Initialize peak caps array
    if (peakCapsRef.current.length !== barCount) {
      peakCapsRef.current = new Array(barCount).fill(0);
    }

    let idleTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Current effective volume factor (0 when muted)
      const effectiveVol = isMuted ? 0 : volume;

      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(frequencyData);
      }

      idleTime += 0.04;

      const totalGap = 4;
      const barWidth = Math.max(3, (width - barCount * totalGap) / barCount);
      const segmentHeight = 4;
      const segmentGap = 2;

      for (let i = 0; i < barCount; i++) {
        let normalizedHeight = 0;

        if (isPlaying && analyser) {
          // Sample from frequency spectrum (logarithmic spread: low bass to high treble)
          const freqIndex = Math.floor(Math.pow(i / barCount, 1.4) * (frequencyData.length * 0.75));
          const rawVal = frequencyData[freqIndex] || 0;
          // Scale by volume factor
          normalizedHeight = (rawVal / 255) * effectiveVol;
        } else {
          // Idle breathing wave when paused
          const wave1 = Math.sin(idleTime * 1.5 + i * 0.25);
          const wave2 = Math.cos(idleTime * 0.8 + i * 0.15);
          const baseHeight = 0.12 + 0.1 * Math.sin(idleTime + i * 0.1);
          normalizedHeight = Math.max(0.04, (wave1 + wave2) * 0.06 + baseHeight) * (isMuted ? 0.3 : Math.max(0.3, effectiveVol));
        }

        const maxBarPx = height - 12;
        const currentBarHeight = Math.max(4, normalizedHeight * maxBarPx);

        // Peak caps logic with gravity drop
        if (currentBarHeight > (peakCapsRef.current[i] || 0)) {
          peakCapsRef.current[i] = currentBarHeight;
        } else {
          peakCapsRef.current[i] = Math.max(0, (peakCapsRef.current[i] || 0) - 1.2);
        }

        const x = i * (barWidth + totalGap) + totalGap / 2;
        const yBottom = height;

        // Draw segmented stacked LED/Manga blocks
        const numSegments = Math.floor(currentBarHeight / (segmentHeight + segmentGap));

        for (let s = 0; s < numSegments; s++) {
          const segY = yBottom - (s + 1) * (segmentHeight + segmentGap);
          const isTopTier = s > numSegments * 0.75;
          const isMidTier = s > numSegments * 0.45;

          if (isTopTier) {
            // Stark pure white for top peaks
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 4;
          } else if (isMidTier) {
            // Crisp light manga gray
            ctx.fillStyle = '#e4e4e7';
            ctx.shadowBlur = 0;
          } else {
            // Noir zinc block
            ctx.fillStyle = '#a1a1aa';
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(x, segY, barWidth, segmentHeight);
        }

        // Draw Peak Cap Indicator (white floating dot/dash)
        const peakY = yBottom - (peakCapsRef.current[i] || 0) - segmentHeight;
        if (peakY < yBottom - 2) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 6;
          ctx.fillRect(x, peakY, barWidth, 2.5);
          ctx.shadowBlur = 0;
        }
      }

      // Base line baseline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, height - 1, width, 1);

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [analyser, isPlaying, volume, isMuted]);

  return (
    <div className="absolute bottom-[44px] left-0 right-0 h-28 pointer-events-none z-10 overflow-hidden flex flex-col justify-end">
      {/* Visualizer Status & Decibel Indicator */}
      <div className="flex items-center justify-between px-6 mb-1 text-[10px] font-mono tracking-widest text-zinc-400 uppercase select-none opacity-80">
        <span className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-white animate-pulse' : 'bg-zinc-600'}`} />
          {isPlaying ? 'FREQUENCY SPECTRUM // 64 BINS ACTIVE' : 'AUDIO EQUALIZER // STANDBY SPECTRUM'}
        </span>
        <span className="hidden sm:inline">
          VOL: {isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`} // CH: STEREO
        </span>
      </div>

      {/* The 60FPS Reactive Equalizer Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-24 block opacity-90"
      />
    </div>
  );
};
