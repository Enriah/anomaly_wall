import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, BookOpen, Folder, Maximize2, Layers } from 'lucide-react';
import { FINAL_STARS_STORY } from '../data/finalStarsStory';

interface ProjectArtwork {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  description?: {
    vi: string;
    en: string;
  };
}

interface ProjectAlbum {
  id: string;
  title: {
    vi: string;
    en: string;
  };
  subtitle?: {
    vi: string;
    en: string;
  };
  description?: {
    vi: string;
    en: string;
  };
  artworks: ProjectArtwork[];
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
  albums?: ProjectAlbum[];
  artworks?: ProjectArtwork[];
  development?: ProjectDevelopment;
  story?: ProjectStory;
}

type ProjectTab = 'overview' | 'album' | 'development' | 'story';

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
      albums: [
        {
          id: 'album-saldevie',
          title: {
            vi: 'Khu Rừng Cấm Saldevie',
            en: 'Saldevie Forbidden Forest',
          },
          subtitle: {
            vi: 'Môi trường, Sinh thái & Khí quyển',
            en: 'Environment, Ecology & Atmosphere',
          },
          description: {
            vi: 'Khu rừng nguyên sinh Saldevie là nơi ẩn náu của các sinh linh cổ đại và là bức tường thành tự nhiên ngăn cách thế giới loài người với vùng đất cấm.',
            en: 'The primordial forest of Saldevie serves as a sanctuary for ancient spirits and a natural boundary shielding the human realm from the forbidden lands.',
          },
          artworks: [
            {
              id: 'sal-1',
              title: 'Saldevie',
              subtitle: 'Forbidden Forest — Canopy of the Beast',
              imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-forbidden-forest.jpg`,
              aspectRatio: 'landscape',
              description: {
                vi: 'Khung cảnh đại ngàn Saldevie với bạch thú đang nằm nghỉ dưới tán thông già, nơi ánh sáng ban mai xuyên qua màn sương lạnh.',
                en: 'The deep primordial canopy of Saldevie where the great white beast rests under ancient pines, with morning light filtering through dense mist.',
              },
            },
            {
              id: 'sal-2',
              title: 'Sương Mù Ban Mai',
              subtitle: 'Morning Mist & Canopy Study',
              aspectRatio: 'portrait',
              description: {
                vi: 'Nghiên cứu góc chiếu ánh sáng buổi sớm len lỏi qua các tầng lá rậm rạp.',
                en: 'Atmospheric study of dawn rays piercing through heavy woodland canopies.',
              },
            },
            {
              id: 'sal-3',
              title: 'Hốc Cây Ngàn Năm',
              subtitle: 'Ancient Hollow Root Sanctuary',
              aspectRatio: 'square',
              description: {
                vi: 'Trú tích cổ xưa bên trong gốc cây đại thụ được các linh hồn bảo hộ.',
                en: 'An ancient resting shelter carved inside millennium roots guarded by spirits.',
              },
            },
            {
              id: 'sal-4',
              title: 'Lối Mòn Vách Đá',
              subtitle: 'Cliffside Moss Path',
              aspectRatio: 'landscape',
              description: {
                vi: 'Con đường đá bám đầy rêu phong dẫn lên đỉnh núi quan sát của người dẫn đường.',
                en: 'Moss-covered cliffside trail leading up to the pathfinders lookout.',
              },
            },
            {
              id: 'sal-5',
              title: 'Thảm Thực Vật Phát Quang',
              subtitle: 'Bioluminescent Flora',
              aspectRatio: 'portrait',
              description: {
                vi: 'Các loài nấm và hoa phát sáng tự nhiên vào ban đêm dẫn lối cho lữ khách.',
                en: 'Luminescent flora and fungi that illuminate paths during twilight hours.',
              },
            },
            {
              id: 'sal-6',
              title: 'Tổ Chim Khổng Lồ',
              subtitle: 'Elder Roc Nesting Grounds',
              aspectRatio: 'square',
              description: {
                vi: 'Khu vực làm tổ trên các ngọn đại thụ cao chọc trời nhìn ra toàn cảnh thung lũng.',
                en: 'Nesting platforms on colossal treetops overlooking the vast woodland valley.',
              },
            },
          ],
        },
        {
          id: 'album-characters',
          title: {
            vi: 'Nhân Vật & Sinh Vật',
            en: 'Characters & Creatures',
          },
          subtitle: {
            vi: 'Tạo hình Enriah, Merin & Hộ vệ thần thoại',
            en: 'Enriah, Merin & Mythical Guardians',
          },
          description: {
            vi: 'Bản thiết kế tạo hình nhân vật, trang phục thám hiểm và các loài thú thần bí mang dấu ấn Tinh Cầu.',
            en: 'Character concept designs, exploration gear, and mythical creatures carrying the Astral Crest.',
          },
          artworks: [
            {
              id: 'char-1',
              title: 'Enriah — Người Canh Giữ',
              subtitle: 'Main Protagonist Concept Sheet',
              aspectRatio: 'portrait',
              description: {
                vi: 'Tạo hình Enriah trong bộ giáp du mục và áo choàng chống sương mù độc.',
                en: 'Full concept sheet of Enriah featuring nomadic armor and mist-resistant cloak.',
              },
            },
            {
              id: 'char-2',
              title: 'Bạch Thao Canh Cửa',
              subtitle: 'White Forest Drake Study',
              aspectRatio: 'landscape',
              description: {
                vi: 'Sinh vật huyền bí sở hữu bộ lông dày và đôi mắt nhìn thấu linh hồn kẻ xâm lấn.',
                en: 'Mythical guardian drake with dense fur and eyes that pierce through astral deceit.',
              },
            },
            {
              id: 'char-3',
              title: 'Bác Sĩ Vidir',
              subtitle: 'Field Alchemist & Archivist',
              aspectRatio: 'portrait',
              description: {
                vi: 'Nhà giả kim nghiên cứu độc tố thảo dược và tinh thể ma thuật.',
                en: 'Field researcher studying herbal toxins and celestial mineral properties.',
              },
            },
            {
              id: 'char-4',
              title: 'Merin — Kiếm Sĩ Gió',
              subtitle: 'Windstrider Scout Stance',
              aspectRatio: 'square',
              description: {
                vi: 'Bản phác thảo tư thế chiến đấu nhanh và chuyển động kiếm thuật.',
                en: 'Action pose sketches highlighting rapid agility and swift blade techniques.',
              },
            },
            {
              id: 'char-5',
              title: 'Cú Đêm Tinh Thể',
              subtitle: 'Crystalline Nocturnal Scout',
              aspectRatio: 'square',
              description: {
                vi: 'Loài chim trinh sát mang tinh thể phát sáng trên trán hỗ trợ định vị ban đêm.',
                en: 'Nocturnal scout bird with forehead crystal aiding night flight navigation.',
              },
            },
          ],
        },
        {
          id: 'album-architecture',
          title: {
            vi: 'Kiến Trúc & Thành Trì',
            en: 'Architecture & Citadels',
          },
          subtitle: {
            vi: 'Hoàng thành Adious, Hải đăng Đen & Cảng Noha',
            en: 'Adious Capital, Black Lighthouse & Noha Port',
          },
          description: {
            vi: 'Công trình kiến trúc cổ kính đan xen giữa phong cách gothic cổ điển và công nghệ tinh thạch năng lượng.',
            en: 'Monolithic architectural blueprints blending classical gothic grandeur with crystalline power structures.',
          },
          artworks: [
            {
              id: 'arch-1',
              title: 'Hoàng Thành Adious',
              subtitle: 'The Imperial Citadel Gates',
              aspectRatio: 'landscape',
              description: {
                vi: 'Cổng thành sừng sững cao hơn 80 mét bảo vệ thủ phủ phương bắc.',
                en: 'Colossal fortified gateway standing 80 meters tall guarding northern dominions.',
              },
            },
            {
              id: 'arch-2',
              title: 'Hải Đăng Đen',
              subtitle: 'The Black Lighthouse Tower',
              aspectRatio: 'portrait',
              description: {
                vi: 'Ngọn tháp phát sáng luồng ánh sáng xanh lam dẫn lối cho tàu thuyền vượt qua bão sương mù.',
                en: 'Obsidian tower casting cyan beacons guiding vessels across treacherous fog tides.',
              },
            },
            {
              id: 'arch-3',
              title: 'Khu Phố Cảng Noha',
              subtitle: 'Noha Harbor Waterway District',
              aspectRatio: 'landscape',
              description: {
                vi: 'Khu buôn bán sầm uất với những cây cầu gỗ treo và xưởng đóng tàu cổ.',
                en: 'Bustling maritime marketplace linked by suspended wooden bridges and docks.',
              },
            },
            {
              id: 'arch-4',
              title: 'Hầm Trú Ẩn Ivelf',
              subtitle: 'Underground Vault & Archives',
              aspectRatio: 'square',
              description: {
                vi: 'Kho tàng dưới lòng đất nơi lưu giữ các văn bản lịch sử cổ xưa.',
                en: 'Subterranean archives preserving millennia of astronomical records.',
              },
            },
          ],
        },
        {
          id: 'album-visuals',
          title: {
            vi: 'Key Visuals & Minh Họa',
            en: 'Key Visuals & Illustrations',
          },
          subtitle: {
            vi: 'Áp phích chính thức & Bìa tiểu thuyết',
            en: 'Official Posters & Novel Covers',
          },
          description: {
            vi: 'Các bức tranh minh họa hoàn thiện dành cho quảng bá dự án và các trang bìa artbook.',
            en: 'Finished high-resolution illustrations for key visuals, artbooks, and novel chapters.',
          },
          artworks: [
            {
              id: 'vis-1',
              title: 'The End to the Beginning',
              subtitle: 'Official Teaser Visual',
              aspectRatio: 'portrait',
              description: {
                vi: 'Áp phích biểu tượng khắc họa khoảnh khắc ngôi sao cuối cùng rơi xuống vòm trời.',
                en: 'Flagship teaser visual illustrating the moment the last star descends onto the skyline.',
              },
            },
            {
              id: 'vis-2',
              title: 'Dấu Ấn Tinh Cầu',
              subtitle: 'Astral Crest Awakening',
              aspectRatio: 'square',
              description: {
                vi: 'Minh họa khoảnh khắc kích hoạt vòng cổ chứa mảnh thiên thạch nguyên bản.',
                en: 'Close-up composition of the celestial meteorite amulet resonance.',
              },
            },
            {
              id: 'vis-3',
              title: 'Cây Vĩnh Hằng Trong Bão',
              subtitle: 'The Everbranch in Winter Gale',
              aspectRatio: 'landscape',
              description: {
                vi: 'Tranh toàn cảnh cây thế giới giữa cơn bão tuyết vĩnh cửu.',
                en: 'Wide panoramic scene depicting the world tree enduring an eternal blizzard.',
              },
            },
          ],
        },
      ],
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

  // Tự động mở dự án, chuyển sang tab Album và chọn đúng ảnh khi bấm từ Slider phía trên
  useEffect(() => {
    if (!externalSelection) return;
    const targetProject = projects.find((p) => p.id === externalSelection.projectId);
    if (!targetProject || targetProject.isComingSoon) return;

    setRenderedProjectId(targetProject.id);
    setActiveProjectId(targetProject.id);
    setActiveTab('album');

    // Xác định album và ảnh tương ứng với artworkIndex được truyền vào
    const artIdx = externalSelection.artworkIndex;
    if (targetProject.albums && targetProject.albums.length > 0) {
      let foundAlbumIdx = 0;
      let foundArtIdx = 0;
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
      setSelectedAlbumIndex(foundAlbumIdx);
      setSelectedArtIndex(foundArtIdx);
    } else {
      setSelectedArtIndex(artIdx);
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
      className="pt-6 sm:pt-8 lg:pt-0 pb-0 relative z-10 overflow-hidden flex flex-col justify-between"
    >
      <div className="w-full min-h-[calc(100vh-58px)] lg:h-[calc(100vh-58px)] px-6 sm:px-12 lg:px-20 pt-4 sm:pt-6 lg:pt-5 pb-6 lg:pb-8 flex flex-col justify-between box-border">
        
        {/* Tiêu đề phần PROJECTS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6 flex-shrink-0">
          <h2 className="font-accent text-2xl sm:text-3xl font-black tracking-widest text-white uppercase">
            PROJECTS
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
                                      alt={art.title}
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
                                          {art.title}
                                        </h4>
                                        <p className="font-sans text-xs text-zinc-400 line-clamp-2 font-light">
                                          {art.subtitle}
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
                                            {art.title}
                                          </h4>
                                          <p className="font-sans text-xs text-zinc-300 font-light truncate">
                                            {art.subtitle}
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
                            aria-label="Close lightbox"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          {/* Nút lùi ảnh trong Album */}
                          <button
                            onClick={prevArt}
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>

                          {/* Nút tiến ảnh trong Album */}
                          <button
                            onClick={nextArt}
                            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
                            aria-label="Next photo"
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
                                  alt={currentArt.title}
                                  className="w-auto h-auto max-w-full max-h-[75vh] object-contain shadow-2xl"
                                />
                              ) : (
                                <div className="w-full h-80 sm:h-96 flex flex-col items-center justify-center gap-4 p-8 text-center bg-gradient-to-br from-[#181829] via-[#0d0d17] to-[#08080f]">
                                  <div className="w-16 h-16 rounded-none bg-white/10 border border-white/20 flex items-center justify-center text-white">
                                    <ImageIcon className="w-8 h-8" />
                                  </div>
                                  <div className="space-y-1 max-w-md">
                                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                                      {currentArt.aspectRatio === 'portrait' ? '3:4 Portrait' : currentArt.aspectRatio === 'square' ? '1:1 Square' : '16:9 Landscape'}
                                    </span>
                                    <h3 className="font-display text-2xl font-bold text-white">
                                      {currentArt.title}
                                    </h3>
                                    <p className="text-sm text-zinc-300 font-light">
                                      {currentArt.subtitle}
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
                                  {currentArt.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-zinc-400 font-light">
                                  {currentArt.description?.[lang] || currentArt.subtitle}
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
