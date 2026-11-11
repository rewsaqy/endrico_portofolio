import React, { useEffect, useRef } from 'react';

export const NightAtmosphereCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Twinkling Night Stars
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      isCross: Math.random() > 0.75,
    }));

    // 2. Rising Cigarette Smoke Wisps (anchored around Anko's side on the right)
    const smokeParticles = Array.from({ length: 22 }, () => ({
      x: width * 0.75 + (Math.random() - 0.5) * 80,
      y: height * 0.55 + Math.random() * 100,
      vx: (Math.random() - 0.45) * 0.6,
      vy: -(Math.random() * 0.8 + 0.6),
      size: Math.random() * 15 + 10,
      maxSize: Math.random() * 60 + 40,
      alpha: Math.random() * 0.25 + 0.05,
      decay: Math.random() * 0.003 + 0.002,
    }));

    // 3. Occasional Shooting Star / Night Speed Streak
    let shootingStar: { x: number; y: number; length: number; speed: number; angle: number; alpha: number } | null = null;
    let lastShootTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Stars
      stars.forEach((s) => {
        s.alpha += s.speed;
        const currentAlpha = (Math.sin(s.alpha) + 1) * 0.4 + 0.1;

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        if (s.isCross) {
          // Manga 4-point cross star
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - s.size * 2.5);
          ctx.lineTo(s.x, s.y + s.size * 2.5);
          ctx.moveTo(s.x - s.size * 2.5, s.y);
          ctx.lineTo(s.x + s.size * 2.5, s.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Cigarette Smoke
      smokeParticles.forEach((p) => {
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.3;
        p.y += p.vy;
        p.size += 0.25;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < height * 0.1) {
          // Reset smoke particle near Anko's cigarette hand/mouth area
          p.x = width * (window.innerWidth > 768 ? 0.76 : 0.65) + (Math.random() - 0.5) * 40;
          p.y = height * 0.45 + Math.random() * 30;
          p.size = Math.random() * 10 + 6;
          p.alpha = Math.random() * 0.25 + 0.1;
          p.vx = (Math.random() - 0.4) * 0.6;
        }

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(220, 220, 240, ${p.alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Shooting star logic
      const now = Date.now();
      if (!shootingStar && now - lastShootTime > 5000 && Math.random() < 0.02) {
        shootingStar = {
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.3,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 12 + 10,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: 1,
        };
        lastShootTime = now;
      }

      if (shootingStar) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.02;

        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        starGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        starGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha})`);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar = null;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ opacity: 0.85 }}
    />
  );
};
