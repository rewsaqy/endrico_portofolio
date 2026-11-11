import React, { useState } from 'react';
import { Copy, ExternalLink, Mail, Code2, MessageSquare, CheckCircle } from 'lucide-react';
import { MangaCharacter } from '../components/MangaCharacter';
import { PageId } from '../components/HeaderNav';
import { sfx } from '../utils/sfx';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sfx.playSelect();

    try {
      await navigator.clipboard.writeText(trimmed);
      setFormStatus('copied');
    } catch {
      setFormStatus('fallback');
    }

    setTimeout(() => {
      setFormStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 animate-slideInLeft py-4 md:py-0">
      {/* LEFT COLUMN: CONTACT CHANNELS & CALLING CARD */}
      <div className="w-full md:w-7/12 flex flex-col justify-center space-y-3 sm:space-y-4 max-w-2xl py-1 sm:py-2 z-10">
        {/* Title Badge */}
        <div className="flex items-center gap-2">
          <span className="bg-white text-black font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 uppercase tracking-widest">
            FILE 04 // TRANSMISSION
          </span>
          <span className="text-zinc-400 font-mono text-[10px] sm:text-xs tracking-wider">
            DIRECT INQUIRY &amp; COLLABORATION
          </span>
        </div>

        {/* Title Yofukashi Style */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase text-white drop-shadow-[4px_4px_0px_#000000]">
            CONTACT
          </h1>
          <span className="font-mono text-[10px] sm:text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 px-2 py-0.5 sm:py-1">
            [ 接触・夜間通信 ]
          </span>
        </div>

        {/* Contact Container in Manga Noir Style */}
        <div className="bg-black border-2 border-white p-3.5 sm:p-5 shadow-[4px_4px_0px_#ffffff] sm:shadow-[6px_6px_0px_#ffffff] space-y-3">
          <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed">
            Terbuka untuk kolaborasi pembuatan aset 3D stylized/PSX, map/level design atmosferik, atau proyek game development.
          </p>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 sm:p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Mail size={13} aria-hidden="true" className="text-zinc-300" />
                <span>EMAIL DIRECT</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 text-zinc-300">[REAL DATA]</span>
            </div>

            <a
              href="https://github.com/rewsaqy"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-800 hover:border-white hover:bg-zinc-900 transition-all text-white font-mono text-xs group focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="flex items-center gap-2">
                <Code2 size={14} aria-hidden="true" className="text-white" />
                <span>GITHUB // @rewsaqy</span>
              </div>
              <ExternalLink size={12} aria-hidden="true" className="text-zinc-400 group-hover:text-white" />
            </a>

            <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} aria-hidden="true" className="text-white" />
                <span>DISCORD // rewsaqy</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 text-zinc-300">USERNAME</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-xs">
              <span>ARTSTATION PORTFOLIO</span>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 text-zinc-300">COMING SOON</span>
            </div>
          </div>

          {/* Quick Note Form (Copies note cleanly to clipboard for sending via GitHub/Discord) */}
          <form onSubmit={handleSubmit} className="pt-2 border-t border-zinc-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="calling-note-input"
                className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider"
              >
                PREPARE CALLING NOTE (COPY KE CLIPBOARD)
              </label>
              {formStatus === 'copied' && (
                <span role="status" className="text-emerald-400 text-xs font-mono flex items-center gap-1 font-bold">
                  <CheckCircle size={12} aria-hidden="true" /> DISALIN KE CLIPBOARD
                </span>
              )}
              {formStatus === 'fallback' && (
                <span role="status" className="text-zinc-300 text-xs font-mono font-bold">
                  SIAP DIKIRIM VIA DISCORD/GITHUB
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                id="calling-note-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan atau tawaran proyek di sini..."
                className="min-h-[44px] flex-1 bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs font-mono text-white placeholder-zinc-400 focus:outline-none focus:border-white"
                required
              />
              <button
                type="submit"
                className="min-h-[44px] bg-white text-black font-black font-mono text-xs px-4 py-2 hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <Copy size={14} aria-hidden="true" />
                <span>COPY NOTE</span>
              </button>
            </div>
          </form>

          {/* Return Home Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sfx.playBack();
                onNavigate('home');
              }}
              className="min-h-[44px] flex items-center gap-2 bg-white text-black font-black font-mono text-xs px-5 py-2.5 hover:bg-zinc-200 transition-all shadow-[4px_4px_0px_#ffffff] border-2 border-black cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              <span>◀ KEMBALI KE MENU UTAMA</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LARGE ANKO LAUGHING TRENCHCOAT */}
      <MangaCharacter
        src="/manga_chars/large_anko_contact.png"
        alt="Anko Uguisu Laughing Detective Pose"
        kanjiTop="通信"
        kanjiBottom="夜更"
        caption="CONTACT // ANKO UGUISU // NIGHTFALL"
      />
    </div>
  );
};
