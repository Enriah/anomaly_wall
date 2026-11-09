import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getRandomHeroArtworks, ArtworkSlide } from '../data/projectsData';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  type: 'move' | 'click';
}

interface HeroProps {
  lang: 'vi' | 'en';
  onSelectArtwork?: (
    projectId: string,
    artworkIndex: number,
    albumId?: string,
    artworkId?: string
  ) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onSelectArtwork }) => {
  // Danh sách 5 slide Artwork 2D ngang (16:9) được chọn ngẫu nhiên từ các Album
  // Mỗi lần vào hoặc tải lại trang sẽ tự động tạo một tổ hợp 5 ảnh mới
  const [artworks] = useState<ArtworkSlide[]>(() => getRandomHeroArtworks(5));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lastMoveTimeRef = useRef<number>(0);

  // Tự động chuyển slide mỗi 4.5 giây
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artworks.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, artworks.length]);

  const spawnRipple = (clientX: number, clientY: number, type: 'move' | 'click') => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev.slice(-18), { id, x, y, type }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, type === 'click' ? 1350 : 1150);
  };

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const now = performance.now();
    if (now - lastMoveTimeRef.current < 85) return;
    lastMoveTimeRef.current = now;
    spawnRipple(e.clientX, e.clientY, 'move');
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLElement>) => {
    spawnRipple(e.clientX, e.clientY, 'click');
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  // Xử lý giữ chuột hoặc vuốt chạm để kéo đổi ảnh (Drag & Swipe) đồng thời hỗ trợ nhấp chuột đổi ảnh
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Chỉ kích hoạt với chuột trái (button = 0) hoặc cảm ứng
    if (e.button !== 0) return;
    setIsAutoPlay(false);
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    pointerIdRef.current = e.pointerId;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - dragStartXRef.current;
    const diffY = currentY - dragStartYRef.current;

    // Chỉ chuyển sang trạng thái kéo (drag) khi người dùng di chuyển chuột hơn 8px theo chiều ngang
    // Tránh việc nhấp chuột (click) thông thường bị coi là kéo
    if (!hasDraggedRef.current) {
      if (Math.abs(diffX) > 8 && Math.abs(diffX) >= Math.abs(diffY)) {
        hasDraggedRef.current = true;
        setIsDragging(true);
        try {
          if (pointerIdRef.current !== null && e.currentTarget) {
            e.currentTarget.setPointerCapture(pointerIdRef.current);
          }
        } catch {
          // Bỏ qua nếu trình duyệt không hỗ trợ pointer capture
        }
      }
    }

    if (hasDraggedRef.current) {
      setDragOffset(diffX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const wasDragging = hasDraggedRef.current;
    const finalOffset = dragOffset;

    if (wasDragging) {
      try {
        if (pointerIdRef.current !== null && e.currentTarget?.hasPointerCapture(pointerIdRef.current)) {
          e.currentTarget.releasePointerCapture(pointerIdRef.current);
        }
      } catch {
        // Bỏ qua
      }
      setIsDragging(false);
      setDragOffset(0);

      const threshold = 50; // Khoảng cách kéo tối thiểu (pixels) để chuyển slide
      if (finalOffset < -threshold) {
        nextSlide();
      } else if (finalOffset > threshold) {
        prevSlide();
      }

      // Giữ cờ hasDraggedRef trong 80ms để ngăn sự kiện onClick vô tình kích hoạt mở modal
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    } else {
      // Người dùng chỉ click chuột chứ không kéo
      setIsDragging(false);
      setDragOffset(0);
      hasDraggedRef.current = false;
    }

    pointerIdRef.current = null;
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    if (hasDraggedRef.current) {
      try {
        if (pointerIdRef.current !== null && e.currentTarget?.hasPointerCapture(pointerIdRef.current)) {
          e.currentTarget.releasePointerCapture(pointerIdRef.current);
        }
      } catch {
        // Bỏ qua
      }
      setIsDragging(false);
      setDragOffset(0);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    } else {
      setIsDragging(false);
      setDragOffset(0);
      hasDraggedRef.current = false;
    }
    pointerIdRef.current = null;
  };

  const currentArtwork = artworks[currentIndex];
  const totalSlides = artworks.length;

  // Tính vị trí tương đối (-2, -1, 0, 1, 2) của từng slide so với slide chính
  const getRelativeOffset = (idx: number) => {
    let diff = idx - currentIndex;
    if (diff > totalSlides / 2) diff -= totalSlides;
    if (diff < -totalSlides / 2) diff += totalSlides;
    return diff;
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseDown={handleSectionClick}
      className="relative min-h-screen pt-20 pb-6 flex flex-col justify-center overflow-hidden bg-gradient-to-b from-[#f3f3f7] via-[#e7e7ef] to-[#d6d6e2] select-none"
    >
      {/* 1. Lớp ánh sáng Studio Vignette tạo chiều sâu hướng tâm */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255,255,255,0.88) 0%, rgba(232,232,242,0.38) 58%, rgba(162,164,184,0.45) 100%)',
        }}
      />

      {/* 2. Lớp lưới kiến trúc mảnh (Architectural Micro-Grid) mờ dần ra rìa */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-75"
        style={{
          backgroundSize: '56px 56px',
          backgroundImage:
            'linear-gradient(to right, rgba(20, 20, 35, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(20, 20, 35, 0.045) 1px, transparent 1px)',
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 35%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 50% 50%, black 35%, transparent 95%)',
        }}
      />

      {/* 3. Vòng quỹ đạo tinh cầu chìm (Celestial Rings) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="w-[92vw] max-w-[1480px] aspect-square rounded-full border border-zinc-900/[0.045]" />
        <div className="absolute w-[70vw] max-w-[1120px] aspect-square rounded-full border border-dashed border-zinc-900/[0.055]" />
      </div>

      {/* 4. Quầng sáng chuyển động & phản chiếu màu sắc từ tác phẩm đang chiếu */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="animate-gallery-orb absolute -top-10 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-white via-zinc-200/60 to-zinc-400/25 blur-3xl opacity-85" />
        <div className="animate-gallery-orb-reverse absolute -bottom-16 right-1/4 w-[560px] h-[560px] rounded-full bg-gradient-to-tl from-zinc-300/55 via-slate-200/45 to-white blur-3xl opacity-80" />

        {currentArtwork?.imageUrl && (
          <img
            src={currentArtwork.imageUrl}
            alt=""
            aria-hidden="true"
            className="w-[78%] max-w-[1280px] aspect-video object-cover blur-[75px] opacity-35 scale-105 saturate-150 transition-all duration-1000"
          />
        )}
      </div>

      {/* 5. Kết cấu vân giấy mỹ thuật (Fine-Art Paper & Film Grain SVG Filter) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.055] mix-blend-multiply pointer-events-none z-0" aria-hidden="true">
        <filter id="gallery-fine-paper">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gallery-fine-paper)" />
      </svg>

      {/* 6. Lớp gợn sóng CSS3 Ripple Effect phía sau slider */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{ left: r.x, top: r.y }}
            className={r.type === 'click' ? 'ripple-wave-click' : 'ripple-wave-move'}
          />
        ))}
      </div>

      {/* Sân khấu Carousel toàn chiều ngang cho phép lộ rìa phải của ảnh trước (bên trái) và rìa trái của ảnh sau (bên phải) */}
      <div className="w-full space-y-5 relative z-10">
        <div
          className={`relative w-full touch-pan-y ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseMove={() => setIsAutoPlay(false)}
          onMouseLeave={() => {
            if (!isDragging) setIsAutoPlay(true);
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {/* Khung định vị kích thước của Slide chính ở trung tâm */}
          <div className="relative w-[82vw] sm:w-[76vw] lg:w-[min(74vw,calc((100vh-152px)*16/9))] mx-auto aspect-video">
            {artworks.map((art, idx) => {
              const offset = getRelativeOffset(idx);
              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;
              const isVisible = isActive || isPrev || isNext;

              // Vị trí dịch chuyển:
              // - Slide chính (offset = 0): nằm chính giữa
              // - Slide trước (offset = -1): dịch sang trái (-88%) và thu nhỏ nhẹ (scale(0.9))
              // - Slide sau (offset = 1): dịch sang phải (+88%) và thu nhỏ nhẹ (scale(0.9))
              // Kết hợp dragOffset trong quá trình giữ và kéo chuột
              let transformStyle = `translate3d(calc(0% + ${dragOffset}px), 0, 0) scale(1)`;
              if (isPrev) {
                transformStyle = `translate3d(calc(-88% + ${dragOffset}px), 0, 0) scale(0.9)`;
              } else if (isNext) {
                transformStyle = `translate3d(calc(88% + ${dragOffset}px), 0, 0) scale(0.9)`;
              } else if (offset < -1) {
                transformStyle = `translate3d(calc(-170% + ${dragOffset}px), 0, 0) scale(0.82)`;
              } else if (offset > 1) {
                transformStyle = `translate3d(calc(170% + ${dragOffset}px), 0, 0) scale(0.82)`;
              }

              return (
                <div
                  key={art.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasDraggedRef.current) return;
                    if (isPrev) {
                      prevSlide();
                    } else if (isNext) {
                      nextSlide();
                    } else if (isActive && art.projectId && onSelectArtwork) {
                      onSelectArtwork(art.projectId, art.artworkIndex ?? 0, art.albumId, art.artworkId);
                    }
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex: isActive ? 30 : isPrev || isNext ? 20 : 10,
                    transition: isDragging
                      ? 'none'
                      : 'transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms cubic-bezier(0.22,1,0.36,1), box-shadow 700ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                  className={`absolute inset-0 w-full h-full overflow-hidden bg-[#0c0c14] select-none ${
                    isVisible ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
                  } ${
                    isActive
                      ? 'shadow-[0_38px_90px_-15px_rgba(10,10,22,0.72),0_18px_40px_-10px_rgba(10,10,22,0.45)] group'
                      : 'shadow-[0_20px_50px_-12px_rgba(10,10,22,0.45)] group/side hover:shadow-[0_25px_60px_-10px_rgba(10,10,22,0.65)]'
                  }`}
                >
                  {art.imageUrl ? (
                    <img
                      src={art.imageUrl}
                      alt={`${typeof art.title === 'object' ? art.title[lang] : art.title} ${typeof art.subtitle === 'object' ? art.subtitle[lang] : art.subtitle}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable={false}
                    />
                  ) : (
                    /* Placeholder 16:9 trực tiếp */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center bg-[#0d0d16] border border-white/[0.06] pointer-events-none">
                      <div className="w-14 h-14 bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <span className="font-mono text-xs sm:text-sm text-zinc-300 uppercase tracking-widest">
                        {lang === 'vi'
                          ? `SLIDE #0${idx + 1} — ẢNH 2D ARTWORK NGANG (16:9)`
                          : `SLIDE #0${idx + 1} — WIDESCREEN 2D ARTWORK (16:9)`}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        1920 × 1080
                      </span>
                    </div>
                  )}

                  {/* Lớp phủ làm tối nhẹ cho 2 ảnh ở rìa (trạng thái bị che khuất), sáng lên khi rê chuột vào */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/55 group-hover/side:bg-black/25 transition-colors duration-300 pointer-events-none" />
                  )}

                  {/* Nội dung chữ trên ảnh chính (ẩn đi khi ảnh đang ở rìa che khuất) */}
                  <div
                    className={`transition-opacity duration-500 ${
                      isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {/* Góc trên bên trái: Tên dự án kèm hiệu ứng mờ đen */}
                    {art.project && (
                      <>
                        <div className="absolute top-0 left-0 w-[360px] h-36 bg-gradient-to-br from-black/85 via-black/45 to-transparent blur-md pointer-events-none" />
                        <div className="absolute top-5 left-6 sm:top-7 sm:left-8 pointer-events-none">
                          <span className="font-display text-lg sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            {art.project}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Hiệu ứng làm mờ & tối nhẹ lan tỏa tự nhiên ở góc dưới bên trái để làm nổi chữ */}
                    <div className="absolute bottom-0 left-0 w-[420px] h-44 bg-gradient-to-tr from-black/85 via-black/45 to-transparent blur-md pointer-events-none" />

                    {/* Nhãn thông tin góc dưới bên trái không có khung viền */}
                    <div className="absolute bottom-5 left-6 sm:bottom-7 sm:left-8 pointer-events-none">
                      <h2 className="font-display text-xl sm:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                        {typeof art.title === 'object' ? art.title[lang] : art.title}
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light tracking-wide mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {typeof art.subtitle === 'object' ? art.subtitle[lang] : art.subtitle}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thanh chấm chỉ báo (Pagination Dots) bên dưới trên nền sáng */}
        <div className="flex items-center justify-center gap-2.5">
          {artworks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-10 bg-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
                  : 'w-2.5 bg-zinc-900/20 hover:bg-zinc-900/45'
              }`}
              aria-label={lang === 'vi' ? `Chuyển tới slide ${idx + 1}` : `Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
