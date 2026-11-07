import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  lang: 'vi' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const footerRef = useRef<HTMLElement>(null);
  const [showFloatingTop, setShowFloatingTop] = useState(false);
  const scrollAnimRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingTop(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
    }
    const startY = window.scrollY;
    if (startY < 2) return;

    const duration = 700;
    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY * (1 - eased));
      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  };

  return (
    <footer
      ref={footerRef}
      className="py-12 border-t border-white/[0.08] bg-[#050508] relative z-10 text-xs font-mono text-zinc-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          <div className="flex flex-col items-center md:items-start gap-2.5">
            <span className="text-white font-black tracking-wider font-accent text-base">
              ENRIAH
            </span>
            <div className="flex flex-col items-center md:items-start gap-1.5 text-zinc-400 text-xs font-mono">
              <a
                href="https://github.com/enriah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>github.com/enriah</span>
              </a>
              <a
                href="mailto:khoarossi911@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>khoarossi911@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="AnomalyWall Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="text-zinc-300 font-semibold tracking-wider text-sm font-sans">
                AnomalyWall Team
              </span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            2026 AnomalyWall Team. All rights reserved.
          </div>
        </div>

      </div>

      {/* Nút nổi mũi tên hướng lên ở góc dưới bên phải chỉ xuất hiện khi đã cuộn xuống Footer */}
      <button
        onClick={scrollToTop}
        aria-label={lang === 'vi' ? 'Về đầu trang' : 'Back to Top'}
        title={lang === 'vi' ? 'Về đầu trang' : 'Back to Top'}
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-purple-600/30 backdrop-blur-md border border-white/15 hover:border-purple-400 text-zinc-200 hover:text-white shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-300 ${
          showFloatingTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};
