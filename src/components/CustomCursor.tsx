import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Track clickable elements
    const handleElementHover = () => {
      const interactives = document.querySelectorAll('button, a, input, textarea, select, [role="button"]');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    handleElementHover();
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      observer.disconnect();
    };
  }, [isVisible]);

  // Smooth trail animation
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setTrailingPos(prev => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18
      }));
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small crisp dot */}
      <div
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '12px' : '6px',
          height: isHovering ? '12px' : '6px',
          backgroundColor: '#ffffff',
        }}
      />
      {/* Outer luminous glow aura */}
      <div
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovering ? '64px' : '36px',
          height: isHovering ? '64px' : '36px',
          border: isHovering ? '1.5px solid rgba(168, 85, 247, 0.8)' : '1px solid rgba(255, 255, 255, 0.25)',
          background: isHovering 
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 100%)' 
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 80%)',
          boxShadow: isHovering ? '0 0 25px rgba(168, 85, 247, 0.4)' : 'none',
        }}
      />
    </>
  );
};
