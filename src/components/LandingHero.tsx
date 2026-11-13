import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { WaterBackground, WaterBackgroundHandle } from './WaterBackground';
import { FloatingPetals } from './FloatingPetals';

interface LandingHeroProps {
  lang: 'vi' | 'en';
}

export const LandingHero: React.FC<LandingHeroProps> = ({ lang }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const waterRef = useRef<WaterBackgroundHandle>(null);
  const scrollAnimRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
      }
    };
  }, []);

  // Cuộn mượt mà điện ảnh (Cinematic Smooth Scroll) bằng requestAnimationFrame với gia tốc easeInOutCubic
  const handleScrollToSlider = (duration = 850) => {
    const sliderEl = document.getElementById('slider');
    if (!sliderEl) return;

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
        sliderEl.getBoundingClientRect().top + window.scrollY - headerHeight
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

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    waterRef.current?.addRipple(e.clientX, e.clientY);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerDown={handlePointerDown}
      className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-white text-zinc-900 select-none pt-24 sm:pt-28 pb-10 sm:pb-12"
    >
      {/* 1. Bề mặt nước WebGL tương tác thời gian thực (Interactive WebGL Water Surface) */}
      <WaterBackground ref={waterRef} containerRef={sectionRef} />

      {/* 2. Cánh hoa anh đào lững thững trôi, dập dềnh nhô lên hạ xuống và bật nhẹ vào 4 mép trang */}
      <FloatingPetals containerRef={sectionRef} waterRef={waterRef} />

      {/* Spacer đỉnh để căn chỉnh trung tâm hoàn hảo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4" />

      {/* TRỌNG TÂM: Chữ AnomalyWall nổi bật trên nền mặt nước trắng */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col items-center justify-center text-center my-auto pointer-events-auto">
        <div className="relative inline-block">
          <h1 className="font-accent font-bold tracking-tight text-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.95] drop-shadow-[0_4px_20px_rgba(0,0,0,0.1)] select-none">
            AnomalyWall
          </h1>
        </div>
      </div>

      {/* Nút chỉ báo cuộn xuống xem Slider tác phẩm bên dưới */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScrollToSlider(850);
          }}
          className="group relative p-3.5 rounded-full flex items-center justify-center text-zinc-400 hover:text-black transition-all duration-300 cursor-pointer"
          aria-label={lang === 'vi' ? 'Cuộn xuống xem các tác phẩm' : 'Scroll down to view artworks'}
        >
          {/* Vùng mờ nhẹ xung quanh mũi tên */}
          <div className="absolute inset-0 rounded-full bg-black/[0.035] blur-md group-hover:bg-black/[0.07] transition-all duration-300 pointer-events-none" />
          <div className="relative z-10 transition-transform duration-300 group-hover:translate-y-1">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500 group-hover:text-black transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]" />
          </div>
        </button>
      </div>
    </section>
  );
};
