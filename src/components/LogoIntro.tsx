import React, { useEffect, useState, useRef } from 'react';

interface LogoIntroProps {
  onComplete: () => void;
  lang?: 'vi' | 'en';
}

export const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'docking'>('idle');
  const [dockTransform, setDockTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const lastTapRef = useRef<number>(0);

  const triggerDocking = () => {
    const navLogo = document.getElementById('navbar-logo-target');
    const isMobile = window.innerWidth < 640;
    const initialSize = isMobile ? 220 : 300;

    if (navLogo) {
      const rect = navLogo.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      setDockTransform({
        x: targetCenterX - viewportCenterX,
        y: targetCenterY - viewportCenterY,
        scale: rect.width / initialSize,
      });
    } else {
      setDockTransform({
        x: -window.innerWidth * 0.42,
        y: -window.innerHeight * 0.45,
        scale: 0.1,
      });
    }
    setPhase('docking');
  };

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dockTimer = setTimeout(() => {
      triggerDocking();
    }, 500);

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      onComplete();
    }, 1450);

    return () => {
      clearTimeout(dockTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete]);

  const handleScreenTap = () => {
    const now = performance.now();
    if (now - lastTapRef.current < 350) {
      onComplete();
    }
    lastTapRef.current = now;
  };

  return (
    <div
      onClick={handleScreenTap}
      onDoubleClick={onComplete}
      className={`fixed inset-0 z-[100] flex items-center justify-center select-none ${
        phase === 'docking' ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      {/* Solid black backdrop that fades out smoothly */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-[900ms] ease-out ${
          phase === 'docking' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Static Logo that glides smoothly to the top-left navbar target */}
      <div
        style={{
          transform:
            phase === 'docking'
              ? `translate3d(${dockTransform.x}px, ${dockTransform.y}px, 0) scale(${dockTransform.scale})`
              : 'translate3d(0px, 0px, 0) scale(1)',
          transition:
            phase === 'docking'
              ? 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
        }}
        className="relative z-10 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] flex items-center justify-center will-change-transform"
      >
        <img
          src={`${import.meta.env.BASE_URL}anw-logo.svg`}
          alt="AnomalyWall Logo"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};
