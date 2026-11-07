import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ArtworkSlide {
  id: string;
  title: string;
  subtitle: string;
  project?: string;
  projectId?: string;
  artworkIndex?: number;
  imageUrl?: string;
}

interface RippleItem {
  id: number;
  x: number;
  y: number;
  type: 'move' | 'click';
}

interface HeroProps {
  lang: 'vi' | 'en';
  onSelectArtwork?: (projectId: string, artworkIndex: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onSelectArtwork }) => {
  // Danh sách các slide Artwork 2D ngang 16:9
  const [artworks] = useState<ArtworkSlide[]>([
    {
      id: '1',
      title: 'Saldevie',
      subtitle: 'Forbidden Forest',
      project: 'FinalStars',
      projectId: 'finalstars',
      artworkIndex: 0,
      imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-forbidden-forest.jpg`,
    },
    { id: '2', title: 'Artwork 02', subtitle: 'Environment Matte Painting', projectId: 'finalstars', artworkIndex: 1, imageUrl: '' },
    { id: '3', title: 'Artwork 03', subtitle: 'Editorial & Brand Direction', projectId: 'finalstars', artworkIndex: 2, imageUrl: '' },
    { id: '4', title: 'Artwork 04', subtitle: 'Character & World Concept', projectId: 'finalstars', artworkIndex: 3, imageUrl: '' },
    { id: '5', title: 'Artwork 05', subtitle: 'Promotional Keyframe', projectId: 'finalstars', artworkIndex: 4, imageUrl: '' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
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

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseDown={handleSectionClick}
      className="relative min-h-screen pt-20 pb-6 flex flex-col justify-center overflow-hidden bg-gradient-to-b from-[#f4f4f8] via-[#ebebf2] to-[#e2e2ec] select-none"
    >
      {/* Lớp gợn sóng CSS3 Ripple Effect phía sau slider */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{ left: r.x, top: r.y }}
            className={r.type === 'click' ? 'ripple-wave-click' : 'ripple-wave-move'}
          />
        ))}
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 space-y-5 relative z-10">
        
        {/* Ảnh 16:9 ngang lớn vừa vặn, có khoảng thở đẹp mắt với thanh Navbar */}
        <div
          className="relative w-full max-w-[calc((100vh-148px)*16/9)] mx-auto aspect-video overflow-hidden bg-[#0c0c14] shadow-[0_30px_70px_-12px_rgba(15,15,30,0.65),0_15px_35px_-10px_rgba(0,0,0,0.45)] group"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseMove={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          
          {/* Dải băng chuyền trượt ngang */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {artworks.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => {
                  if (art.projectId && onSelectArtwork) {
                    onSelectArtwork(art.projectId, art.artworkIndex ?? 0);
                  }
                }}
                className={`w-full h-full flex-shrink-0 relative ${
                  art.projectId ? 'cursor-pointer' : ''
                }`}
              >
                {art.imageUrl ? (
                  <img
                    src={art.imageUrl}
                    alt={`${art.title} ${art.subtitle}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder 16:9 trực tiếp */
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center bg-[#0d0d16] border border-white/[0.06]">
                    <div className="w-14 h-14 bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-xs sm:text-sm text-zinc-300 uppercase tracking-widest">
                      {lang === 'vi' ? `SLIDE #0${idx + 1} — ẢNH 2D ARTWORK NGANG (16:9)` : `SLIDE #0${idx + 1} — WIDESCREEN 2D ARTWORK (16:9)`}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      1920 × 1080
                    </span>
                  </div>
                )}

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
                    {art.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light tracking-wide mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {art.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Nút điều hướng Trái / Phải */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Thanh chấm chỉ báo (Pagination Dots) bên dưới trên nền sáng */}
        <div className="flex items-center justify-center gap-2.5">
          {artworks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-10 bg-purple-600'
                  : 'w-2.5 bg-zinc-900/20 hover:bg-zinc-900/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
