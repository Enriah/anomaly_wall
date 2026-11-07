import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';

interface NavbarProps {
  lang: 'vi' | 'en';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillatorNode, setOscillatorNode] = useState<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const scrollAnimRef = useRef<number | null>(null);

  const smoothScrollToElement = (targetEl: HTMLElement | null, duration = 750) => {
    if (!targetEl) return;
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
    }

    const startY = window.scrollY;
    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 58;
      const liveTargetY = Math.max(
        0,
        targetEl.getBoundingClientRect().top + window.scrollY - headerHeight
      );

      window.scrollTo(0, startY + (liveTargetY - startY) * eased);

      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambient soundscape generator using Web Audio API
  const toggleSound = () => {
    if (!isSoundActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        
        // Gentle meditative drone sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, ctx.currentTime); // Soft calming 108Hz harmonic

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        setAudioContext(ctx);
        setOscillatorNode({ osc, gain });
        setIsSoundActive(true);
      } catch {
        console.warn('Web Audio not allowed or supported.');
      }
    } else {
      if (oscillatorNode && audioContext) {
        oscillatorNode.gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);
        setTimeout(() => {
          oscillatorNode.osc.stop();
          audioContext.close();
        }, 900);
      }
      setIsSoundActive(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-zinc-500 border-b border-black/15 ${
      isScrolled ? 'py-2.5 sm:py-3 shadow-2xl' : 'py-3 sm:py-4 shadow-lg'
    }`}>
      <div className="w-full px-3 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Name & Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="AnomalyWall Logo"
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
            />
            <span className="inline-block font-accent tracking-tight sm:tracking-wider text-[11px] sm:text-xl font-bold scale-y-125 text-black hover:text-zinc-900 transition-colors truncate">
              AnomalyWall
            </span>
          </a>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
            {/* Nút cuộn xuống phần Project */}
            <button
              onClick={() => {
                const projectsEl = document.getElementById('projects');
                smoothScrollToElement(projectsEl, 750);
              }}
              className="px-1 sm:px-1.5 py-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black hover:opacity-70 transition-opacity"
            >
              Project
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-1.5 py-1 text-[11px] sm:text-xs font-mono font-bold text-black hover:opacity-70 transition-opacity"
              title="Chuyển ngôn ngữ / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={toggleSound}
              className="p-1 sm:p-1.5 text-black hover:opacity-70 transition-opacity"
              title={isSoundActive ? (lang === 'vi' ? 'Tắt âm thanh triển lãm' : 'Mute ambient soundscape') : (lang === 'vi' ? 'Bật âm thanh triển lãm số' : 'Enable ambient soundscape')}
            >
              {isSoundActive ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
