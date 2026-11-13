import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, BookOpen, Folder, Maximize2, Layers, ExternalLink } from 'lucide-react';
import { FINAL_STARS_STORY } from '../data/finalStarsStory';
import {
  PROJECTS_DATA,
  ProjectItem,
} from '../data/projectsData';

const getLocalized = (
  val: string | { vi: string; en: string } | undefined,
  currentLang: 'vi' | 'en'
): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[currentLang] || val.vi || '';
};

type ProjectTab = 'overview' | 'album' | 'development' | 'story' | 'news';

interface ProjectsProps {
  lang: 'vi' | 'en';
  externalSelection?: {
    projectId: string;
    artworkIndex: number;
    albumId?: string;
    artworkId?: string;
    timestamp: number;
  } | null;
}

export const Projects: React.FC<ProjectsProps> = ({ lang, externalSelection }) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [renderedProjectId, setRenderedProjectId] = useState<string | null>('finalstars');
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState<number>(0);
  const [selectedArtIndex, setSelectedArtIndex] = useState<number>(0);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const storyReaderRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);

  // Refs và cơ chế kéo cuộn bằng con trỏ chuột (Drag-to-scroll) độc lập cho Album và Thư viện ảnh
  const albumScrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const hasAlbumDraggedRef = useRef<boolean>(false);
  const hasGalleryDraggedRef = useRef<boolean>(false);

  const createDragScrollHandler = (
    targetRef: React.RefObject<HTMLDivElement | null>,
    hasDraggedRef: React.MutableRefObject<boolean>
  ) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      // Chỉ nhận nút chuột trái (button = 0)
      if (e.button !== 0) return;
      const el = targetRef.current;
      if (!el) return;

      const startY = e.clientY;
      const startScrollTop = el.scrollTop;
      let hasMoved = false;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientY - startY;
        if (Math.abs(delta) > 5) {
          hasMoved = true;
          hasDraggedRef.current = true;
        }
        if (hasMoved && targetRef.current) {
          targetRef.current.scrollTop = startScrollTop - delta;
        }
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        if (hasMoved) {
          setTimeout(() => {
            hasDraggedRef.current = false;
          }, 80);
        } else {
          hasDraggedRef.current = false;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
  };

  // Hàm cuộn mượt động theo dõi chính xác vị trí phần tử đích và chiều cao thật của Navbar ở mỗi khung hình
  const smoothScrollToElement = (targetEl: HTMLElement | null, duration = 700) => {
    if (!targetEl) return;
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
    }

    const startY = window.scrollY;
    const startTime = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 60;
      const liveTargetY = Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - headerHeight);

      window.scrollTo(0, startY + (liveTargetY - startY) * eased);

      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  };

  const closeProjectDropdown = () => {
    setActiveProjectId(null);
    smoothScrollToElement(sectionRef.current, 650);
  };

  const handleSelectEpisode = (idx: number) => {
    setSelectedEpisodeIndex(idx);
    if (storyReaderRef.current) {
      smoothScrollToElement(storyReaderRef.current, 500);
    }
  };

  const projects: ProjectItem[] = PROJECTS_DATA;

  const isOpenDropdown = activeProjectId !== null;
  const activeProject = projects.find((p) => p.id === (activeProjectId || renderedProjectId));

  // Tự động mở dự án, chuyển sang tab Album và chọn đúng ảnh khi bấm từ Slider phía trên
  useEffect(() => {
    if (!externalSelection) return;
    const targetProject = projects.find((p) => p.id === externalSelection.projectId);
    if (!targetProject || targetProject.isComingSoon) return;

    setRenderedProjectId(targetProject.id);
    setActiveProjectId(targetProject.id);
    setActiveTab('album');

    // Xác định album và ảnh tương ứng
    if (targetProject.albums && targetProject.albums.length > 0) {
      let foundAlbumIdx = 0;
      let foundArtIdx = 0;
      let matched = false;

      // Ưu tiên 1: Tìm chính xác theo artworkId nếu có
      if (externalSelection.artworkId) {
        for (let i = 0; i < targetProject.albums.length; i++) {
          const alb = targetProject.albums[i];
          if (externalSelection.albumId && alb.id !== externalSelection.albumId) continue;
          const artIdxInAlb = alb.artworks.findIndex((a) => a.id === externalSelection.artworkId);
          if (artIdxInAlb !== -1) {
            foundAlbumIdx = i;
            foundArtIdx = artIdxInAlb;
            matched = true;
            break;
          }
        }
      }

      // Ưu tiên 2: Tính theo cumulative index
      if (!matched) {
        const artIdx = externalSelection.artworkIndex;
        let cumulative = 0;
        for (let i = 0; i < targetProject.albums.length; i++) {
          const count = targetProject.albums[i].artworks.length;
          if (artIdx < cumulative + count) {
            foundAlbumIdx = i;
            foundArtIdx = artIdx - cumulative;
            break;
          }
          cumulative += count;
        }
      }

      setSelectedAlbumIndex(foundAlbumIdx);
      setSelectedArtIndex(foundArtIdx);
    } else {
      setSelectedArtIndex(externalSelection.artworkIndex);
    }

    requestAnimationFrame(() => {
      smoothScrollToElement(dropdownRef.current, 780);
    });
  }, [externalSelection]);

  const handleProjectClick = (project: ProjectItem) => {
    if (project.isComingSoon) return;
    if (activeProjectId === project.id) {
      closeProjectDropdown();
    } else {
      setRenderedProjectId(project.id);
      setActiveProjectId(project.id);
      setActiveTab('overview');
      setSelectedAlbumIndex(0);
      setSelectedArtIndex(0);
      requestAnimationFrame(() => {
        smoothScrollToElement(dropdownRef.current, 720);
      });
    }
  };

  const tabs: { id: ProjectTab; label: { vi: string; en: string } }[] = [
    {
      id: 'overview',
      label: { vi: 'Mô tả dự án', en: 'Overview' },
    },
    {
      id: 'album',
      label: { vi: 'Album', en: 'Album' },
    },
    {
      id: 'development',
      label: { vi: 'Quá trình phát triển', en: 'Development' },
    },
    {
      id: 'story',
      label: { vi: 'Cốt truyện', en: 'Story / Lore' },
    },
    {
      id: 'news',
      label: { vi: 'Tin tức', en: 'News' },
    },
  ];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="pt-6 sm:pt-8 lg:pt-0 pb-0 relative z-10 overflow-hidden flex flex-col justify-between"
    >
      <div className="w-full min-h-[calc(100vh-58px)] lg:h-[calc(100vh-58px)] px-6 sm:px-12 lg:px-20 pt-4 sm:pt-6 lg:pt-5 pb-6 lg:pb-8 flex flex-col justify-between box-border">
        
        {/* Tiêu đề phần PROJECTS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6 flex-shrink-0">
          <h2 className={`${lang === 'vi' ? 'font-accent-vi' : 'font-accent'} text-2xl sm:text-3xl font-black tracking-widest text-white uppercase`}>
            {lang === 'vi' ? 'DỰ ÁN' : 'PROJECTS'}
          </h2>
        </div>

        {/* Dải 5 hình bình hành chéo: Xếp dọc nối khít nhau trên điện thoại (-skew-y-6) và xếp ngang trên máy tính (-skew-x-12) */}
        <div className="px-2 sm:px-6 lg:px-12 py-4 lg:py-0 flex-1 min-h-0 flex flex-col">
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-0 flex-1 min-h-0">
            {projects.map((project) => {
              const isOpen = activeProjectId === project.id;
              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`group relative h-28 sm:h-32 lg:h-full w-full -skew-y-6 lg:skew-y-0 lg:-skew-x-12 -mt-px first:mt-0 lg:mt-0 lg:-ml-px lg:first:ml-0 transition-all duration-300 ease-out overflow-hidden border-y border-x-0 lg:border-x lg:border-y-0 hover:z-30 hover:scale-y-[1.06] lg:hover:scale-y-100 lg:hover:scale-x-[1.05] hover:shadow-[0_0_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.2)] lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_88%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_88%,transparent_100%)] ${
                    project.isComingSoon
                      ? 'bg-[#0b0b12]/95 border-white/[0.08] hover:bg-[#12121a] hover:border-white/60 cursor-default'
                      : isOpen
                      ? 'bg-gradient-to-r lg:bg-gradient-to-br from-[#1c1c26] via-[#12121a] to-[#090910] border-white z-20 cursor-pointer shadow-[0_0_35px_rgba(255,255,255,0.2)]'
                      : 'bg-gradient-to-r lg:bg-gradient-to-br from-[#161620] via-[#0e0e15] to-[#090910] border-white/75 hover:border-white z-10 cursor-pointer'
                  }`}
                >
                  {/* Lớp hình nền dự án (nếu có) được khử nghiêng để luôn hiển thị thẳng đứng tự nhiên cả trên điện thoại lẫn máy tính */}
                  {project.artworks?.[0]?.imageUrl && !project.isComingSoon && (
                    <div className="absolute inset-0 skew-y-6 lg:skew-y-0 lg:skew-x-12 scale-125 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-500">
                      <img
                        src={project.artworks[0].imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090910] via-[#090910]/40 to-[#090910]/80" />
                    </div>
                  )}

                  {/* Ánh sáng trang trí bên trong cho dự án chính */}
                  {!project.isComingSoon && (
                    <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none" />
                  )}

                  {/* Khử độ nghiêng (un-skew) cho phần chữ bên trong */}
                  <div className="skew-y-6 lg:skew-y-0 lg:skew-x-12 w-full h-full px-6 py-4 lg:px-8 lg:pb-10 lg:pt-6 flex flex-col justify-center lg:justify-end relative z-10">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`font-display tracking-tight transition-colors ${
                            project.isComingSoon
                              ? 'font-medium text-zinc-400 group-hover:text-zinc-200 uppercase tracking-widest font-mono text-xs'
                              : 'text-2xl font-bold text-white group-hover:text-zinc-100'
                          }`}
                        >
                          {project.isComingSoon
                            ? (lang === 'vi' ? 'Sắp ra mắt' : 'Coming Soon')
                            : project.cardLines
                            ? project.cardLines.map((line, i) => (
                                <span
                                  key={i}
                                  className={
                                    i === 0
                                      ? 'block leading-tight'
                                      : 'block text-lg font-semibold text-zinc-200 tracking-wide leading-tight mt-0.5'
                                  }
                                >
                                  {line}
                                </span>
                              ))
                            : getLocalized(project.title, lang)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cửa sổ mở xuống phía dưới trải rộng sang 2 bên màn hình khi bấm vào dự án */}
      <div
        ref={dropdownRef}
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full ${
          isOpenDropdown
            ? 'grid-rows-[1fr] opacity-100 pointer-events-auto'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden min-h-0 w-full">
          {activeProject && (
            <div
              className={`w-full ${
                activeTab === 'album'
                  ? 'h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] overflow-hidden'
                  : 'min-h-[calc(100vh-58px)]'
              } flex flex-col border-t border-white/10 bg-[#0b0b14] px-4 sm:px-8 lg:px-14 py-4 sm:py-5 relative shadow-[inset_0_20px_40px_-15px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpenDropdown ? 'translate-y-0' : '-translate-y-4'
              }`}
            >
              <div className="max-w-[1800px] w-full mx-auto flex-1 flex flex-col min-h-0 overflow-hidden">
                
                {/* Thanh điều hướng các tính năng (Tabs) + Nút đóng */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-2.5 mb-3.5 flex-shrink-0">
                  <div className="flex flex-wrap items-center gap-7">
                    {tabs.map((tab) => {
                      const isTabActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 border-b-2 ${
                            isTabActive
                              ? 'text-white border-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                              : 'text-zinc-500 border-transparent hover:text-zinc-200 hover:border-white/60 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]'
                          }`}
                        >
                          <span>{tab.label[lang]}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={closeProjectDropdown}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    aria-label="Close project details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1. MÔ TẢ DỰ ÁN */}
                {activeTab === 'overview' && (
                  <div className="max-w-3xl space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-zinc-100 bg-white/10 border border-white/30">
                        {activeProject.tag || 'PROJECT'}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        AnomalyWall
                      </span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      {activeProject.title}
                    </h3>
                    {activeProject.details && (
                      <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                        {activeProject.details[lang]}
                      </p>
                    )}
                  </div>
                )}

                {/* 2. ALBUM (TRƯNG BÀY CÁC ALBUM & THƯ VIỆN ẢNH ĐIỆN THOẠI) */}
                {activeTab === 'album' && (() => {
                  const albums = activeProject.albums || [];
                  const currentAlbum = albums[selectedAlbumIndex] || albums[0];
                  const albumArtworks = currentAlbum ? currentAlbum.artworks : (activeProject.artworks || []);
                  const currentArt = albumArtworks[selectedArtIndex] || albumArtworks[0];

                  if (albums.length === 0 && albumArtworks.length === 0) {
                    return (
                      <p className="text-sm font-mono text-zinc-500 py-8">
                        {lang === 'vi'
                          ? 'Album hình ảnh cho dự án này đang được cập nhật.'
                          : 'Artwork album for this project is currently being updated.'}
                      </p>
                    );
                  }

                  const prevArt = (e?: React.MouseEvent) => {
                    e?.stopPropagation();
                    setSelectedArtIndex((prev) => (prev - 1 + albumArtworks.length) % albumArtworks.length);
                  };
                  const nextArt = (e?: React.MouseEvent) => {
                    e?.stopPropagation();
                    setSelectedArtIndex((prev) => (prev + 1) % albumArtworks.length);
                  };

                  return (
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch overflow-hidden pb-1">
                      
                      {/* THANH DỌC BÊN TRÁI (3/12): Danh sách các Album của dự án */}
                      <div className="lg:col-span-3 h-full flex flex-col min-h-0 overflow-hidden">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-shrink-0 mb-1.5">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-white" />
                            <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                              {lang === 'vi' ? 'Danh Sách Album' : 'Albums'}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-zinc-500">
                            {albums.length} {lang === 'vi' ? 'album' : 'albums'}
                          </span>
                        </div>

                        {/* Danh sách cuộn độc lập: hỗ trợ cả cuộn chuột (wheel) và giữ kéo chuột (drag-to-scroll) */}
                        <div
                          ref={albumScrollRef}
                          onMouseDown={createDragScrollHandler(albumScrollRef, hasAlbumDraggedRef)}
                          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-1 pr-1.5 select-none cursor-grab active:cursor-grabbing"
                        >
                          {albums.map((album, idx) => {
                            const isSelected = idx === selectedAlbumIndex;
                            return (
                              <button
                                key={album.id}
                                onClick={() => {
                                  if (hasAlbumDraggedRef.current) return;
                                  setSelectedAlbumIndex(idx);
                                  setSelectedArtIndex(0);
                                  if (galleryScrollRef.current) {
                                    galleryScrollRef.current.scrollTop = 0;
                                  }
                                }}
                                className={`group relative text-left px-3.5 py-3 transition-colors duration-200 flex-shrink-0 w-full border border-transparent select-none ${
                                  isSelected
                                    ? 'bg-white/[0.06] text-white border-l-2 !border-l-white'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.025]'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3 pointer-events-none">
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Layers className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                      <h4 className={`font-display text-sm font-semibold truncate ${
                                        isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                                      }`}>
                                        {album.title[lang]}
                                      </h4>
                                    </div>
                                    {album.subtitle && (
                                      <p className="text-[11px] text-zinc-500 line-clamp-1 font-light pl-5.5">
                                        {album.subtitle[lang]}
                                      </p>
                                    )}
                                  </div>
                                  <span className={`text-[11px] font-mono flex-shrink-0 mt-0.5 ${
                                    isSelected
                                      ? 'text-zinc-200 font-medium'
                                      : 'text-zinc-500 group-hover:text-zinc-400'
                                  }`}>
                                    {album.artworks.length} {lang === 'vi' ? 'ảnh' : 'photos'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* PHẦN Ở GIỮA (9/12): Thư viện ảnh cuộn độc lập: hỗ trợ cả cuộn chuột (wheel) và giữ kéo chuột (drag-to-scroll) */}
                      <div
                        ref={galleryScrollRef}
                        onMouseDown={createDragScrollHandler(galleryScrollRef, hasGalleryDraggedRef)}
                        className="lg:col-span-9 h-full min-h-0 overflow-y-auto overflow-x-hidden pr-2 select-none cursor-grab active:cursor-grabbing"
                      >
                        <div className="columns-1 sm:columns-2 xl:columns-3 gap-1.5 space-y-1.5 pb-6">
                          {albumArtworks.map((art, artIdx) => {
                            const ratioClass =
                              art.aspectRatio === 'portrait'
                                ? 'aspect-[3/4]'
                                : art.aspectRatio === 'square'
                                ? 'aspect-square'
                                : 'aspect-video';

                            const ratioBadge =
                              art.aspectRatio === 'portrait'
                                ? (lang === 'vi' ? 'Dọc (3:4)' : 'Portrait 3:4')
                                : art.aspectRatio === 'square'
                                ? (lang === 'vi' ? 'Vuông (1:1)' : 'Square 1:1')
                                : (lang === 'vi' ? 'Ngang (16:9)' : 'Landscape 16:9');

                            return (
                              <div
                                key={art.id}
                                onClick={() => {
                                  if (hasGalleryDraggedRef.current) return;
                                  setSelectedArtIndex(artIdx);
                                  setIsLightboxOpen(true);
                                }}
                                className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-none bg-[#090913] border border-white/10 transition-all duration-300 ease-out hover:z-20 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_24px_rgba(255,255,255,0.15)] hover:border-white/50 select-none"
                              >
                                <div className={`w-full ${ratioClass} relative overflow-hidden bg-[#0c0c16]`}>
                                  {art.imageUrl ? (
                                    <img
                                      src={art.imageUrl}
                                      alt={getLocalized(art.title, lang)}
                                      draggable={false}
                                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
                                      loading="lazy"
                                    />
                                  ) : (
                                    /* Thẻ tác phẩm mô phỏng tỉ lệ ảnh trong thư viện */
                                    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-br from-[#161626] via-[#0d0d17] to-[#07070e] relative select-none pointer-events-none">
                                      {/* Họa tiết lưới tọa độ mỹ thuật */}
                                      <div
                                        className="absolute inset-0 opacity-[0.05] pointer-events-none"
                                        style={{
                                          backgroundImage:
                                            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                                          backgroundSize: '24px 24px',
                                        }}
                                      />

                                      {/* Đầu thẻ: Huy hiệu tỉ lệ ảnh + Icon ảnh */}
                                      <div className="flex items-center justify-between relative z-10 pointer-events-none">
                                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-none bg-white/5 border border-white/15 text-zinc-300 group-hover:border-white/40 group-hover:text-white transition-colors">
                                          {ratioBadge}
                                        </span>
                                        <div className="w-7 h-7 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/40 transition-colors">
                                          <ImageIcon className="w-3.5 h-3.5" />
                                        </div>
                                      </div>

                                      {/* Giữa thẻ: Tên tác phẩm & Mô tả ngắn */}
                                      <div className="space-y-1.5 relative z-10 my-auto py-2 pointer-events-none">
                                        <h4 className="font-display text-sm sm:text-base font-semibold text-white tracking-wide group-hover:text-zinc-100 transition-colors">
                                          {getLocalized(art.title, lang)}
                                        </h4>
                                        <p className="font-sans text-xs text-zinc-400 line-clamp-2 font-light">
                                          {getLocalized(art.subtitle, lang)}
                                        </p>
                                      </div>

                                      {/* Đáy thẻ: Số thứ tự + Nút xem lớn */}
                                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 pt-2 border-t border-white/5 pointer-events-none">
                                        <span>#{artIdx + 1 < 10 ? `0${artIdx + 1}` : artIdx + 1}</span>
                                        <span className="group-hover:text-white transition-colors flex items-center gap-1 text-zinc-300">
                                          <Maximize2 className="w-3 h-3" />
                                          {lang === 'vi' ? 'Xem chi tiết' : 'Preview'}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Lớp phủ hover khi có ảnh thật */}
                                  {art.imageUrl && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                                      <div className="flex items-end justify-between gap-2">
                                        <div className="min-w-0">
                                          <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-none bg-white/20 text-white mb-1.5 inline-block">
                                            {ratioBadge}
                                          </span>
                                          <h4 className="font-display text-sm sm:text-base font-bold text-white truncate">
                                            {getLocalized(art.title, lang)}
                                          </h4>
                                          <p className="font-sans text-xs text-zinc-300 font-light truncate">
                                            {getLocalized(art.subtitle, lang)}
                                          </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-none bg-black/70 border border-white/30 flex items-center justify-center text-white flex-shrink-0">
                                          <Maximize2 className="w-4 h-4" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chế độ xem toàn màn hình (Lightbox Modal) như khi nhấn vào một bức ảnh trong điện thoại */}
                      {isLightboxOpen && currentArt && (
                        <div
                          onClick={() => setIsLightboxOpen(false)}
                          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8 cursor-zoom-out"
                        >
                          {/* Nút đóng */}
                          <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-5 right-5 sm:top-7 sm:right-7 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-colors z-20 cursor-pointer"
                            aria-label={lang === 'vi' ? 'Đóng chế độ xem ảnh' : 'Close lightbox'}
                          >
                            <X className="w-5 h-5" />
                          </button>

                          {/* Nút lùi ảnh trong Album */}
                          <button
                            onClick={prevArt}
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
                            aria-label={lang === 'vi' ? 'Ảnh trước' : 'Previous photo'}
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>

                          {/* Nút tiến ảnh trong Album */}
                          <button
                            onClick={nextArt}
                            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
                            aria-label={lang === 'vi' ? 'Ảnh tiếp theo' : 'Next photo'}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>

                          {/* Khung nội dung ảnh phóng to */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full flex flex-col items-center gap-4 cursor-default max-h-[92vh]"
                          >
                            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-none border border-white/10 bg-[#07070d]">
                              {currentArt.imageUrl ? (
                                <img
                                  src={currentArt.imageUrl}
                                  alt={getLocalized(currentArt.title, lang)}
                                  className="w-auto h-auto max-w-full max-h-[75vh] object-contain shadow-2xl"
                                />
                              ) : (
                                <div className="w-full h-80 sm:h-96 flex flex-col items-center justify-center gap-4 p-8 text-center bg-gradient-to-br from-[#181829] via-[#0d0d17] to-[#08080f]">
                                  <div className="w-16 h-16 rounded-none bg-white/10 border border-white/20 flex items-center justify-center text-white">
                                    <ImageIcon className="w-8 h-8" />
                                  </div>
                                  <div className="space-y-1 max-w-md">
                                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                                      {currentArt.aspectRatio === 'portrait'
                                        ? (lang === 'vi' ? 'Dọc (3:4)' : '3:4 Portrait')
                                        : currentArt.aspectRatio === 'square'
                                        ? (lang === 'vi' ? 'Vuông (1:1)' : '1:1 Square')
                                        : (lang === 'vi' ? 'Ngang (16:9)' : '16:9 Landscape')}
                                    </span>
                                    <h3 className="font-display text-2xl font-bold text-white">
                                      {getLocalized(currentArt.title, lang)}
                                    </h3>
                                    <p className="text-sm text-zinc-300 font-light">
                                      {getLocalized(currentArt.subtitle, lang)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Thanh thông tin ảnh bên dưới */}
                            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white px-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none bg-white/10 border border-white/20 text-zinc-300">
                                    {currentAlbum?.title[lang]}
                                  </span>
                                  <span className="font-mono text-xs text-zinc-400">
                                    #{selectedArtIndex + 1}
                                  </span>
                                </div>
                                <h4 className="font-display text-lg sm:text-xl font-bold">
                                  {getLocalized(currentArt.title, lang)}
                                </h4>
                                <p className="text-xs sm:text-sm text-zinc-400 font-light">
                                  {currentArt.description?.[lang] || getLocalized(currentArt.subtitle, lang)}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 self-start sm:self-center flex-shrink-0">
                                <span className="px-3 py-1 rounded-none bg-white/5 border border-white/10 text-white">
                                  {selectedArtIndex + 1} / {albumArtworks.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. DEVELOPMENT (TOOLS & GITHUB REPO & NOTES) */}
                {activeTab === 'development' && (
                  activeProject.development ? (
                  <div className="space-y-6 max-w-4xl">
                    {/* Tool & GitHub Repository Section */}
                    {activeProject.development.toolProject && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          <h4 className="font-mono text-xs uppercase tracking-widest text-white">
                            {lang === 'vi' ? 'Công cụ phát triển' : 'Development Tool'}
                          </h4>
                        </div>

                        {/* GitHub Repository Card (Frameless with hover highlight) */}
                        <div className="px-4 py-5 sm:px-5 sm:py-6 hover:bg-white/[0.04] transition-colors duration-200">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2 min-w-0 flex-1">
                              <div className="flex items-center gap-2.5">
                                <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                <span className="font-mono text-sm font-semibold text-white tracking-wide truncate">
                                  {activeProject.development.toolProject.repo}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                                {activeProject.development.toolProject.description[lang]}
                              </p>
                              {activeProject.development.toolProject.tags && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {activeProject.development.toolProject.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 bg-white/[0.06]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <a
                              href={activeProject.development.toolProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-200 transition-colors flex-shrink-0"
                            >
                              <span>{lang === 'vi' ? 'Xem trên GitHub' : 'View on GitHub'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Optional Legacy Tools if present */}
                    {activeProject.development.tools && activeProject.development.tools.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-white">
                          {lang === 'vi' ? 'Công cụ đồ họa & Phần mềm' : 'Tools & Software'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.development.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1.5 text-xs font-mono text-zinc-200 bg-white/[0.04] border border-white/15"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optional Legacy TechStack if present */}
                    {activeProject.development.techStack && activeProject.development.techStack.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-white">
                          {lang === 'vi' ? 'Công nghệ & Kỹ thuật lập trình' : 'Tech Stack & Systems'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.development.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 text-xs font-mono text-zinc-300 bg-white/[0.03] border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                  ) : (
                    <p className="text-sm font-mono text-zinc-500 py-8">
                      {lang === 'vi'
                        ? 'Thông tin quá trình phát triển cho dự án này đang được cập nhật.'
                        : 'Development details for this project are currently being updated.'}
                    </p>
                  )
                )}

                {/* 4. CỐT TRUYỆN (STORY / LORE) */}
                {activeTab === 'story' && (
                  <div className="max-w-5xl space-y-6" ref={storyReaderRef}>
                    {activeProject.id === 'finalstars' ? (
                      <>
                        {/* Series Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold">
                            {FINAL_STARS_STORY.seriesTitle}
                          </span>
                        </div>

                        {/* Danh sách các Chương lớn (Chapters) */}
                        <div className="space-y-4">
                          {FINAL_STARS_STORY.chapters.map((chapter) => {
                            const isChapterOpen = activeChapterId === chapter.id;
                            const currentEp =
                              chapter.episodes[selectedEpisodeIndex] || chapter.episodes[0];
                            const hasPrev = selectedEpisodeIndex > 0;
                            const hasNext = selectedEpisodeIndex < chapter.episodes.length - 1;

                            const getEpisodeLabel = (epNumber: string, isSide: boolean) => {
                              if (lang === 'vi') {
                                return isSide
                                  ? `Ngoại truyện ${epNumber.replace('Side Episode ', '')}`
                                  : `Tập ${epNumber.replace('Episode ', '')}`;
                              }
                              return epNumber;
                            };

                            return (
                              <div
                                key={chapter.id}
                                className={`transition-all duration-300 ease-out border border-transparent ${
                                  isChapterOpen
                                    ? 'bg-white/[0.04] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                                    : 'bg-white/[0.015] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.06)]'
                                }`}
                              >
                                {/* Thẻ Chương lớn (Bấm vào để đóng/mở danh sách tập nhỏ) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!isChapterOpen) {
                                      setSelectedEpisodeIndex(0);
                                    }
                                    setActiveChapterId(isChapterOpen ? null : chapter.id);
                                  }}
                                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                                >
                                  <div className="space-y-2 max-w-4xl">
                                    <div className="flex items-center gap-3">
                                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-white text-black font-semibold">
                                        {lang === 'vi'
                                          ? `CHƯƠNG ${chapter.number}`
                                          : `CHAPTER ${chapter.number}`}
                                      </span>
                                      <span className="text-xs font-mono text-zinc-400">
                                        {lang === 'vi'
                                          ? `${chapter.episodes.length} Tập`
                                          : `${chapter.episodes.length} Episodes`}
                                      </span>
                                    </div>

                                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                                      {chapter.title[lang]}
                                    </h3>
                                  </div>
                                </button>

                                {/* Khi bấm vào Chương lớn -> Hiện các Tập nhỏ và Khung đọc truyện */}
                                {isChapterOpen && (
                                  <div className="border-t border-white/15 p-5 sm:p-8 bg-black/50 space-y-6">
                                    {/* Thanh chọn Tập nhỏ (Episodes) */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2">
                                          <BookOpen className="w-3.5 h-3.5" />
                                          {lang === 'vi'
                                            ? 'Danh sách Tập (Episodes)'
                                            : 'Select Episode'}
                                        </h4>
                                        <span className="font-mono text-xs text-zinc-400">
                                          {selectedEpisodeIndex + 1} / {chapter.episodes.length}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2.5 bg-[#050509] border border-white/10">
                                        {chapter.episodes.map((ep, idx) => {
                                          const isActive = idx === selectedEpisodeIndex;
                                          const isSide = ep.id.startsWith('side-');
                                          return (
                                            <button
                                              key={ep.id}
                                              type="button"
                                              onClick={() => handleSelectEpisode(idx)}
                                              className={`px-3 py-1.5 text-xs font-mono transition-all duration-200 border text-left flex items-center gap-2 cursor-pointer ${
                                                isActive
                                                  ? 'bg-white text-black font-semibold border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                                                  : 'bg-white/[0.02] text-zinc-300 border-white/15 hover:border-white/40 hover:text-white hover:bg-white/[0.06]'
                                              }`}
                                            >
                                              <span>{getEpisodeLabel(ep.number, isSide)}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Nội dung Tập đang chọn */}
                                    <div className="bg-[#07070d] border border-white/15 p-6 sm:p-10 shadow-2xl relative space-y-6">
                                      {/* Tiêu đề Tập */}
                                      <div className="border-b border-white/10 pb-5 space-y-1">
                                        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                                          {getEpisodeLabel(
                                            currentEp.number,
                                            currentEp.id.startsWith('side-')
                                          )}
                                        </span>
                                        <h4 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                                          {currentEp.title[lang]}
                                        </h4>
                                      </div>

                                      {/* Nội dung chữ */}
                                      <div className="text-zinc-300 font-light leading-relaxed text-sm sm:text-base space-y-4 tracking-wide font-sans selection:bg-white/20 selection:text-white">
                                        {currentEp.content.map((paragraph, pIdx) => (
                                          <p
                                            key={pIdx}
                                            className="indent-4 sm:indent-6 leading-7 sm:leading-8"
                                          >
                                            {paragraph}
                                          </p>
                                        ))}
                                      </div>

                                      {/* Điều hướng Tập trước / Tập tiếp theo */}
                                      <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            hasPrev &&
                                            handleSelectEpisode(selectedEpisodeIndex - 1)
                                          }
                                          disabled={!hasPrev}
                                          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                                            hasPrev
                                              ? 'border-white/20 text-zinc-200 hover:text-white hover:border-white hover:bg-white/5 cursor-pointer'
                                              : 'border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
                                          }`}
                                        >
                                          <ChevronLeft className="w-4 h-4" />
                                          <span>
                                            {lang === 'vi' ? 'Tập trước' : 'Previous Episode'}
                                          </span>
                                        </button>

                                        <span className="font-mono text-xs text-zinc-500">
                                          {getEpisodeLabel(
                                            currentEp.number,
                                            currentEp.id.startsWith('side-')
                                          )}{' '}
                                          ({selectedEpisodeIndex + 1} / {chapter.episodes.length})
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            hasNext &&
                                            handleSelectEpisode(selectedEpisodeIndex + 1)
                                          }
                                          disabled={!hasNext}
                                          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                                            hasNext
                                              ? 'border-white/20 text-zinc-200 hover:text-white hover:border-white hover:bg-white/5 cursor-pointer'
                                              : 'border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
                                          }`}
                                        >
                                          <span>
                                            {lang === 'vi' ? 'Tập tiếp theo' : 'Next Episode'}
                                          </span>
                                          <ChevronRight className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      activeProject.story ? (
                        <div className="space-y-6">
                          <div className="space-y-2 border-l-2 border-white pl-4">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-white">
                              {lang === 'vi' ? 'Tóm tắt thế giới quan' : 'World Synopsis'}
                            </span>
                            <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed italic">
                              "{activeProject.story.synopsis[lang]}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {activeProject.story.chapters.map((chapter, idx) => (
                              <div
                                key={idx}
                                className="p-5 bg-white/[0.02] border border-white/10 space-y-2"
                              >
                                <h4 className="font-display text-lg font-bold text-white">
                                  {chapter.title[lang]}
                                </h4>
                                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                                  {chapter.content[lang]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-mono text-zinc-500 py-8">
                          {lang === 'vi'
                            ? 'Cốt truyện cho dự án này đang được cập nhật.'
                            : 'Story & lore for this project are currently being updated.'}
                        </p>
                      )
                    )}
                  </div>
                )}

                {/* 5. NEWS (TIN TỨC & CẬP NHẬT DỰ ÁN) */}
                {activeTab === 'news' && (
                  <div className="space-y-4 max-w-4xl">
                    {activeProject.news && activeProject.news.length > 0 ? (
                      <div className="divide-y divide-white/[0.07]">
                        {activeProject.news.map((item) => (
                          <article
                            key={item.id}
                            className="group px-4 py-5 sm:px-5 sm:py-6 hover:bg-white/[0.04] transition-colors duration-200 space-y-2.5"
                          >
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                              <span className="px-2 py-0.5 uppercase tracking-wider text-zinc-200 bg-white/10">
                                {item.category[lang]}
                              </span>
                              <time className="text-zinc-500">{item.date}</time>
                            </div>
                            <h4 className="font-display text-lg sm:text-xl font-bold text-zinc-100 group-hover:text-white tracking-tight transition-colors">
                              {item.title[lang]}
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-300 font-light leading-relaxed transition-colors">
                              {item.summary[lang]}
                            </p>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-mono text-zinc-500 py-8">
                        {lang === 'vi'
                          ? 'Chưa có tin tức nào cho dự án này.'
                          : 'No news available for this project yet.'}
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};
