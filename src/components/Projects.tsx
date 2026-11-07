import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, BookOpen } from 'lucide-react';
import { FINAL_STARS_STORY } from '../data/finalStarsStory';

interface ProjectArtwork {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

interface ProjectDevelopment {
  tools: string[];
  techStack: string[];
  notes: {
    vi: string;
    en: string;
  };
}

interface ProjectStory {
  synopsis: {
    vi: string;
    en: string;
  };
  chapters: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
  }[];
}

interface ProjectItem {
  id: string;
  title: string;
  isComingSoon?: boolean;
  tag?: string;
  details?: {
    vi: string;
    en: string;
  };
  artworks?: ProjectArtwork[];
  development?: ProjectDevelopment;
  story?: ProjectStory;
}

type ProjectTab = 'overview' | 'art' | 'development' | 'story';

interface ProjectsProps {
  lang: 'vi' | 'en';
  externalSelection?: {
    projectId: string;
    artworkIndex: number;
    timestamp: number;
  } | null;
}

export const Projects: React.FC<ProjectsProps> = ({ lang, externalSelection }) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [renderedProjectId, setRenderedProjectId] = useState<string | null>('finalstars');
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  const [selectedArtIndex, setSelectedArtIndex] = useState<number>(0);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const storyReaderRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);

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

  const projects: ProjectItem[] = [
    {
      id: 'finalstars',
      title: 'FinalStars',
      isComingSoon: false,
      tag: 'game',
      details: {
        vi: 'FinalStars là dự án game và vũ trụ nghệ thuật giả tưởng nguyên bản do Enriah & AnomalyWall phát triển, tập trung vào chiều sâu thế giới quan, thiết kế mỹ thuật 2D sắc nét và cơ chế nhập vai chiến thuật.',
        en: 'FinalStars is an original fantasy game and artistic universe developed by Enriah & AnomalyWall, focusing on deep world-building, atmospheric 2D art direction, and tactical RPG mechanics.',
      },
      artworks: [
        {
          id: 'art-1',
          title: 'Saldevie',
          subtitle: 'Forbidden Forest',
          imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-forbidden-forest.jpg`,
        },
        {
          id: 'art-2',
          title: 'Concept Art #02',
          subtitle: 'Environment & Lighting Study',
        },
        {
          id: 'art-3',
          title: 'Concept Art #03',
          subtitle: 'Character & Creature Design',
        },
        {
          id: 'art-4',
          title: 'Concept Art #04',
          subtitle: 'Ancient Ruins & Architecture',
        },
        {
          id: 'art-5',
          title: 'Concept Art #05',
          subtitle: 'Key Visual Illustration',
        },
      ],
      development: {
        tools: ['Photoshop', 'Clip Studio Paint', 'Blender', 'Unity / Unreal Engine', 'Git'],
        techStack: ['C# / C++', 'Shader Graph / HLSL', '2D Skeletal & VFX Pipeline', 'Custom Dialogue & Lore System'],
        notes: {
          vi: 'Hệ thống phát triển kết hợp pipeline dựng cảnh 2.5D, shader ánh sáng môi trường thời gian thực và bộ công cụ quản lý nhánh cốt truyện tương tác.',
          en: 'Development pipeline combining 2.5D environment staging, real-time atmospheric lighting shaders, and custom interactive narrative branching tools.',
        },
      },
      story: {
        synopsis: {
          vi: 'Khi những vì sao cuối cùng trên bầu trời cổ đại dần lụi tàn, thế giới rơi vào kỷ nguyên chạng vạng vĩnh cửu. Tại khu rừng cấm Saldevie, những kẻ lữ hành mang dấu ấn Tinh Cầu bắt đầu hành trình đánh thức di sản bị lãng quên.',
          en: 'As the final stars in the ancient sky fade into embers, the world plunges into an eternal twilight. Within the Forbidden Forest of Saldevie, travelers bearing the Astral Mark embark on a journey to awaken a forgotten legacy.',
        },
        chapters: [
          {
            title: { vi: 'Chương I — Khu Rừng Cấm Saldevie', en: 'Chapter I — The Forbidden Forest of Saldevie' },
            content: {
              vi: 'Nơi ranh giới giữa thực tại và ký ức cổ xưa đan xen dưới tán cây già cỗi, được canh giữ bởi những sinh linh thần thoại.',
              en: 'Where the boundary between reality and ancient memory intertwines beneath primordial canopies guarded by mythical beings.',
            },
          },
          {
            title: { vi: 'Chương II — Dư Âm Những Vì Sao', en: 'Chapter II — Echoes of the Final Stars' },
            content: {
              vi: 'Khám phá nguồn gốc của mảnh vỡ thiên tinh và lời nguyền phong ấn các vương quốc cổ đại.',
              en: 'Uncovering the origin of the celestial shards and the curse sealing the ancient kingdoms.',
            },
          },
        ],
      },
    },
    {
      id: 'project-2',
      title: 'Coming Soon',
      isComingSoon: true,
    },
    {
      id: 'project-3',
      title: 'Coming Soon',
      isComingSoon: true,
    },
    {
      id: 'project-4',
      title: 'Coming Soon',
      isComingSoon: true,
    },
    {
      id: 'project-5',
      title: 'Coming Soon',
      isComingSoon: true,
    },
  ];

  const isOpenDropdown = activeProjectId !== null;
  const activeProject = projects.find((p) => p.id === (activeProjectId || renderedProjectId));

  // Tự động mở dự án, chuyển sang tab Art và chọn đúng ảnh khi bấm từ Slider phía trên
  useEffect(() => {
    if (!externalSelection) return;
    const targetProject = projects.find((p) => p.id === externalSelection.projectId);
    if (!targetProject || targetProject.isComingSoon) return;

    setRenderedProjectId(targetProject.id);
    setActiveProjectId(targetProject.id);
    setActiveTab('art');
    setSelectedArtIndex(externalSelection.artworkIndex);

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
      id: 'art',
      label: { vi: 'Art', en: 'Art' },
    },
    {
      id: 'development',
      label: { vi: 'Development', en: 'Development' },
    },
    {
      id: 'story',
      label: { vi: 'Cốt truyện', en: 'Story / Lore' },
    },
  ];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="pt-12 pb-0 relative z-10 overflow-hidden flex flex-col justify-between"
    >
      <div className="w-full min-h-[calc(100vh-58px)] px-6 sm:px-12 lg:px-20 flex flex-col">
        
        {/* Tiêu đề phần PROJECTS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <h2 className="font-accent text-2xl sm:text-3xl font-black tracking-widest text-white uppercase">
            PROJECTS
          </h2>
        </div>

        {/* Dải 5 hình bình hành chéo: Xếp dọc nối khít nhau trên điện thoại (-skew-y-6) và xếp ngang trên máy tính (-skew-x-12) */}
        <div className="px-2 sm:px-6 lg:px-12 py-6 lg:py-0 flex-1 flex flex-col">
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-0 flex-1">
            {projects.map((project) => {
              const isOpen = activeProjectId === project.id;
              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`group relative h-28 sm:h-32 lg:h-full lg:min-h-[80vh] w-full -skew-y-6 lg:skew-y-0 lg:-skew-x-12 -mt-px first:mt-0 lg:mt-0 lg:-ml-px lg:first:ml-0 transition-all duration-300 ease-out overflow-hidden border-y border-x-0 lg:border-x lg:border-y-0 hover:z-30 hover:scale-y-[1.06] lg:hover:scale-y-100 lg:hover:scale-x-[1.05] hover:shadow-[0_0_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.2)] ${
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090910] via-[#090910]/60 to-transparent" />
                    </div>
                  )}

                  {/* Ánh sáng trang trí bên trong cho dự án chính */}
                  {!project.isComingSoon && (
                    <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none" />
                  )}

                  {/* Khử độ nghiêng (un-skew) cho phần chữ bên trong */}
                  <div className="skew-y-6 lg:skew-y-0 lg:skew-x-12 w-full h-full px-6 py-4 lg:px-8 lg:py-7 flex flex-col justify-center lg:justify-end relative z-10">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`font-display tracking-tight transition-colors ${
                            project.isComingSoon
                              ? 'font-medium text-zinc-600 uppercase tracking-widest font-mono text-xs'
                              : 'text-2xl font-bold text-white group-hover:text-zinc-100'
                          }`}
                        >
                          {project.title}
                        </h3>
                      </div>
                      {project.tag && (
                        <div>
                          <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-zinc-200 bg-white/10 border border-white/30">
                            {project.tag}
                          </span>
                        </div>
                      )}
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
              className={`w-full min-h-[calc(100vh-58px)] flex flex-col border-t border-white/10 bg-[#0b0b14] px-4 sm:px-8 lg:px-14 py-8 sm:py-10 relative shadow-[inset_0_20px_40px_-15px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpenDropdown ? 'translate-y-0' : '-translate-y-4'
              }`}
            >
              <div className="max-w-[1800px] w-full mx-auto flex-1 flex flex-col">
                
                {/* Thanh điều hướng các tính năng (Tabs) + Nút đóng */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3 mb-8">
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

                {/* 2. ART (ALBUM TRƯNG BÀY CÁC ARTWORK THUỘC DỰ ÁN: TRÁI THUMBNAIL DỌC - GIỮA ẢNH CHÍNH - PHẢI MÔ TẢ) */}
                {activeTab === 'art' && activeProject.artworks && activeProject.artworks.length > 0 && (() => {
                  const artworks = activeProject.artworks;
                  const currentArt = artworks[selectedArtIndex] || artworks[0];
                  const prevArt = () => setSelectedArtIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
                  const nextArt = () => setSelectedArtIndex((prev) => (prev + 1) % artworks.length);

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      
                      {/* CỘT TRÁI (2/12): Thanh danh sách ảnh thu nhỏ xếp dọc */}
                      <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[560px] pr-1">
                        {artworks.map((art, idx) => {
                          const isSelected = idx === selectedArtIndex;
                          return (
                            <button
                              key={art.id}
                              onClick={() => setSelectedArtIndex(idx)}
                              className={`group relative w-36 lg:w-full flex-shrink-0 aspect-video overflow-hidden border text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-white ring-2 ring-white/30 z-10'
                                  : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/40'
                              }`}
                            >
                              {art.imageUrl ? (
                                <img
                                  src={art.imageUrl}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#090912] flex flex-col items-center justify-center gap-1 text-zinc-600">
                                  <ImageIcon className="w-4 h-4" />
                                  <span className="font-mono text-[9px] uppercase tracking-wider">
                                    #{idx + 1}
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <p className="font-display text-[11px] font-semibold text-white truncate">
                                  {art.title}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* CỘT GIỮA (7/12): Khung trưng bày ảnh chính thuần khiết không có chữ đè lên */}
                      <div className="lg:col-span-7 relative w-full aspect-video bg-[#06060b] border border-white/10 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95)] overflow-hidden group">
                        {currentArt.imageUrl ? (
                          <img
                            src={currentArt.imageUrl}
                            alt={`${currentArt.title} ${currentArt.subtitle}`}
                            onClick={() => setIsLightboxOpen(true)}
                            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-600 bg-[#08080f]">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}

                        {/* Nút lật trang Album Trái / Phải (ẩn mặc định, hiện khi di chuột) */}
                        <button
                          onClick={prevArt}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-200 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Previous artwork"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextArt}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-200 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Next artwork"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* CỘT PHẢI (3/12): Phần mô tả của bức ảnh đó */}
                      <div className="lg:col-span-3 bg-white/[0.02] border border-white/10 p-6 flex flex-col justify-start">
                        <h5 className="font-display text-lg font-bold text-white tracking-wide">
                          {lang === 'vi' ? 'Mô tả' : 'Description'}
                        </h5>
                      </div>

                      {/* Chế độ xem toàn màn hình (Lightbox Modal) khi bấm vào ảnh */}
                      {isLightboxOpen && currentArt.imageUrl && (
                        <div
                          onClick={() => setIsLightboxOpen(false)}
                          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
                        >
                          <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-6xl w-full space-y-3 cursor-default"
                          >
                            <img
                              src={currentArt.imageUrl}
                              alt={currentArt.title}
                              className="w-full max-h-[82vh] object-contain shadow-2xl border border-white/10"
                            />
                            <div className="flex items-center justify-between text-white px-1">
                              <div>
                                <h4 className="font-display text-xl font-bold">
                                  {currentArt.title}
                                </h4>
                                <p className="text-xs text-zinc-400">
                                  {currentArt.subtitle}
                                </p>
                              </div>
                              <span className="font-mono text-xs text-zinc-500">
                                {selectedArtIndex + 1} / {artworks.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. DEVELOPMENT (TOOLS) */}
                {activeTab === 'development' && activeProject.development && (
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-white">
                      {lang === 'vi' ? 'Công cụ (Tools)' : 'Tools & Software'}
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

                {/* 4. CỐT TRUYỆN (STORY / LORE) */}
                {activeTab === 'story' && (
                  <div className="max-w-5xl space-y-6" ref={storyReaderRef}>
                    {activeProject.id === 'finalstars' ? (
                      <>
                        {/* Series Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-zinc-100 bg-white/10 border border-white/30">
                              {FINAL_STARS_STORY.seriesTitle}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">
                              {lang === 'vi'
                                ? `${FINAL_STARS_STORY.chapters.length} Chương`
                                : `${FINAL_STARS_STORY.chapters.length} Chapter(s)`}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-zinc-400">
                            {lang === 'vi'
                              ? 'Bấm vào chương để mở danh sách các tập'
                              : 'Click on a chapter to view episodes'}
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
                                className={`border transition-all duration-300 ${
                                  isChapterOpen
                                    ? 'border-white bg-white/[0.02] shadow-[0_0_25px_rgba(255,255,255,0.07)]'
                                    : 'border-white/15 bg-white/[0.01] hover:border-white/50 hover:bg-white/[0.03]'
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
                                  className="w-full text-left p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                >
                                  <div className="space-y-2 max-w-3xl">
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

                                  <div className="flex-shrink-0 self-start md:self-center">
                                    <span
                                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                                        isChapterOpen
                                          ? 'bg-white text-black border-white font-semibold'
                                          : 'border-white/25 text-zinc-200 hover:border-white hover:text-white'
                                      }`}
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                      <span>
                                        {isChapterOpen
                                          ? lang === 'vi'
                                            ? 'Thu gọn chương'
                                            : 'Hide Episodes'
                                          : lang === 'vi'
                                          ? 'Mở danh sách tập'
                                          : 'View Episodes'}
                                      </span>
                                    </span>
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
                      activeProject.story && (
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
                      )
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
