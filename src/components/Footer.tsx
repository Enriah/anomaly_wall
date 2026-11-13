import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  lang: 'vi' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const footerRef = useRef<HTMLElement>(null);
  const [showFloatingTop, setShowFloatingTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
      className="py-10 border-t border-white/[0.08] bg-[#050508] relative z-10 text-xs font-mono text-zinc-500 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hàng trên: Logo & About Us có gạch chân */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          {/* Logo & Tên dự án */}
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}anw-logo.svg`}
              alt="AnomalyWall Logo"
              className="w-7 h-7 object-contain"
            />
            <span className="font-accent tracking-wider text-lg font-bold text-white">
              AnomalyWall
            </span>
          </div>

          {/* Các nút bên phải: Join Team (Discord) & About Us */}
          <div className="flex items-center gap-6">
            <a
              href="https://discord.gg/K8jCAbAj3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-500 hover:decoration-white transition-all py-1 select-none"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Join Team</span>
            </a>

            {/* Nút About Us có gạch chân, bấm để dropdown mở rộng phần thông tin bên trong Footer */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="font-mono text-xs uppercase tracking-widest text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-500 hover:decoration-white transition-all py-1 select-none cursor-pointer"
              aria-expanded={isExpanded}
            >
              About Us
            </button>
          </div>
        </div>

        {/* Khối dropdown mở rộng trực tiếp bên trong Footer và kéo dài chiều đứng của Footer */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="py-6 border-b border-white/[0.08]">
              {/* Vùng chứa linh hoạt (Flex wrap): Các thẻ thành viên xếp ngang cạnh nhau theo hàng */}
              <div className="flex flex-wrap gap-4">
                {/* Thẻ thành viên thu nhỏ vừa vặn với nội dung */}
                <div className="p-4 border border-white/10 bg-white/[0.02] flex flex-col gap-2.5 w-fit max-w-full">
                  <span className="text-white font-bold tracking-wider font-accent text-sm sm:text-base">
                    ENRIAH
                  </span>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-mono text-xs text-zinc-300">
                    <a
                      href="https://github.com/enriah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-white transition-colors w-fit"
                    >
                      <svg className="w-4 h-4 fill-current text-zinc-400 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>github.com/enriah</span>
                    </a>
                    <a
                      href="mailto:khoarossi911@gmail.com"
                      className="flex items-center gap-2 hover:text-white transition-colors w-fit"
                    >
                      <Mail className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                      <span>khoarossi911@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng dưới: Bản quyền */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            {lang === 'vi'
              ? '© 2026 AnomalyWall. Mọi quyền được bảo lưu.'
              : '© 2026 AnomalyWall. All rights reserved.'}
          </div>
        </div>
      </div>

      {/* Nút Back to top không bo góc */}
      <button
        onClick={scrollToTop}
        aria-label={lang === 'vi' ? 'Về đầu trang' : 'Back to Top'}
        title={lang === 'vi' ? 'Về đầu trang' : 'Back to Top'}
        className={`fixed bottom-8 right-8 z-50 w-10 h-10 bg-zinc-900/90 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white text-zinc-200 hover:text-white shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-300 ${
          showFloatingTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};
