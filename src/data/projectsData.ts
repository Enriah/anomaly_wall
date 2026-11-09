export interface ProjectArtwork {
  id: string;
  title: string | { vi: string; en: string };
  subtitle: string | { vi: string; en: string };
  imageUrl?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  description?: {
    vi: string;
    en: string;
  };
}

export interface ProjectAlbum {
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

export interface ProjectDevelopment {
  tools?: string[];
  techStack?: string[];
  toolProject?: {
    name: string;
    repo: string;
    description: {
      vi: string;
      en: string;
    };
    githubUrl: string;
    tags?: string[];
  };
  notes?: {
    vi: string;
    en: string;
  };
}

export interface ProjectStory {
  synopsis: {
    vi: string;
    en: string;
  };
  chapters: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  isComingSoon: boolean;
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

export interface ArtworkSlide {
  id: string;
  title: string | { vi: string; en: string };
  subtitle: string | { vi: string; en: string };
  project?: string;
  projectId?: string;
  albumId?: string;
  artworkId?: string;
  artworkIndex?: number;
  imageUrl?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
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
          vi: 'Saldevie',
          en: 'Saldevie',
        },
        subtitle: {
          vi: 'Lục dịa phía Tây Nam biển Trắng',
          en: 'The continent southwest of the White Sea',
        },
        description: {
          vi: 'Khu rừng nguyên sinh Saldevie là nơi ẩn náu của các tinh linh Ivelif và là bức tường thành tự nhiên ngăn cách thế giới loài người với vùng đất cấm.',
          en: 'The primordial forest of Saldevie serves as a sanctuary for ancient spirits and a natural boundary shielding the human realm from the forbidden lands.',
        },
        artworks: [
          {
            id: 'sal-1',
            title: 'Khu Rừng Cấm',
            subtitle: {
              vi: 'Rừng Lulla - Saldevie',
              en: 'Lulla Forest - Saldevie',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-forbidden-forest.jpg`,
            aspectRatio: 'landscape',
            description: {
              vi: 'Khung cảnh đại ngàn Saldevie với bạch thú đang nằm nghỉ dưới tán thông già, nơi ánh sáng ban mai xuyên qua màn sương lạnh.',
              en: 'The deep primordial canopy of Saldevie where the great white beast rests under ancient pines, with morning light filtering through dense mist.',
            },
          },
          {
            id: 'sal-2',
            title: 'Hồ Larimor',
            subtitle: {
              vi: 'Dãy Southel',
              en: 'Southel Mountain',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-frozen-lake.jpg`,
            aspectRatio: 'landscape',
          },
          {
            id: 'sal-3',
            title: 'Đường Mòn Tuyết phủ',
            subtitle: {
              vi: 'Rừng Lá Kim Lanac',
              en: 'Lanac Coniferous Forest',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-snowy-forest.jpg`,
            aspectRatio: 'landscape',
          },
          {
            id: 'sal-4',
            title: 'Eo Biển Volrage',
            subtitle: {
              vi: 'Tây Bắc Dãy Southel',
              en: 'Northwest of the Southel Range',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-fjord-cliffs.jpg`,
            aspectRatio: 'landscape',
          },
          {
            id: 'sal-5',
            title: 'Thị Trấn Lanac',
            subtitle: {
              vi: 'Thung Lũng dãy Southel',
              en: 'Southel Mountain Valley',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-aurora-village.jpg`,
            aspectRatio: 'landscape',
          },
        ],
      },
      {
        id: 'album-adious',
        title: {
          vi: 'Adious',
          en: 'Adious',
        },
        subtitle: {
          vi: 'Lục địa phía Tây Biển Trắng',
          en: 'The west continent of White Sea',
        },
        description: {
          vi: 'Lục địa của ngọn lửa lụi',
          en: 'Continent of the Fall Flame',
        },
        artworks: [
          {
            id: 'adious-1',
            title: 'Đồng Cỏ Sương eo biển Ririnoth',
            subtitle: {
              vi: 'Phía Đông vùng Runoroth',
              en: 'Runoroth East',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/adious-river-meadow.jpg`,
            aspectRatio: 'landscape',
          },
          {
            id: 'adious-2',
            title: 'Hẻm Núi Sa Thạch',
            subtitle: {
              vi: 'Vùng Núi Đá Cằn Cỗi miền Viễn Tây',
              en: 'Western Arid Canyons',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/adious-desert-canyon.jpg`,
            aspectRatio: 'landscape',
          },
          {
            id: 'adious-3',
            title: 'Cầu Aou',
            subtitle: {
              vi: 'Sông Aou - Huyết Mạch Adious',
              en: 'Aou River — Artery of Adious',
            },
            imageUrl: `${import.meta.env.BASE_URL}artworks/adious-aou-bridge.jpg`,
            aspectRatio: 'landscape',
            description: {
              vi: 'Cây cầu thép vĩ đại bắc qua dòng sông Aou nối liền hai bờ đông - tây của đại lục Adious, chứng tích lịch sử của những ký ức bi tráng.',
              en: 'The colossal steel bridge spanning the Aou River, connecting the East and West of Adious — a monumental witness to tragic history.',
            },
          },
        ],
      },
      {
        id: 'album-tacoune',
        title: {
          vi: 'Tacoune',
          en: 'Tacoune',
        },
        subtitle: {
          vi: 'Vùng đất Trung tâm thế giới',
          en: 'Middle of the World — Heartland Plains & Vistas',
        },
        description: {
          vi: 'Bộ sưu tập tranh phong cảnh tại Tacoune — vùng bình nguyên trung tâm trù phú nơi giao thoa của các nền văn minh và khởi đầu của những định mệnh lớn.',
          en: 'Landscape and environmental concept art of Tacoune — the fertile and boundless central plains at the heart of the world where destinies converge.',
        },
        artworks: [
          {
            id: 'tac-1',
            title: {
              vi: 'Bình Nguyên Tacoune',
              en: 'Tacoune Sunlit Plains',
            },
            subtitle: {
              vi: 'Thảo nguyên trải dài đến tận chân trời',
              en: 'Vast grasslands stretching toward the golden horizon',
            },
            aspectRatio: 'landscape',
            description: {
              vi: 'Khung cảnh thảo nguyên bao la tại vùng trung tâm thế giới với ngọn gió thoảng và thảm thực vật trù phú.',
              en: 'Panoramic view of colossal fertile plains under expansive open skies at the center of the continent.',
            },
          },
          {
            id: 'tac-2',
            title: {
              vi: 'Hẻm Vực Kỳ Quan',
              en: 'The Great Chasm of Tacoune',
            },
            subtitle: {
              vi: 'Vết nứt địa chất cổ đại chia cắt vùng đồng bằng',
              en: 'Ancient geological rift dividing the heartland',
            },
            aspectRatio: 'landscape',
            description: {
              vi: 'Hẻm vực sâu thăm thẳm nơi dòng sông ngầm cổ xưa chảy qua các phiến đá phong hóa tự nhiên.',
              en: 'Dramatic geological canyon where subterranean waters cut through weathered ancient monoliths.',
            },
          },
          {
            id: 'tac-3',
            title: {
              vi: 'Đền Thờ Vọng Cảnh',
              en: 'Sanctuary of the Horizon',
            },
            subtitle: {
              vi: 'Đài quan sát cổ giữa ngã ba sông trung tâm',
              en: 'Ancient stone observatory at the river confluence',
            },
            aspectRatio: 'landscape',
            description: {
              vi: 'Tàn tích đá cổ kính nhìn ra toàn cảnh hoàng hôn rực rỡ trên vùng đất trung tâm thế giới.',
              en: 'Weathered stone sanctuary ruins overlooking panoramic sunsets across the heartland valleys.',
            },
          },
          {
            id: 'tac-4',
            title: {
              vi: 'Thung Lũng Gió & Mây Ngàn',
              en: 'Valley of the Winds',
            },
            subtitle: {
              vi: 'Khí quyển và mây vần trên rặng đồi Tacoune',
              en: 'Atmospheric cloudscape over rolling hills',
            },
            aspectRatio: 'landscape',
            description: {
              vi: 'Nghiên cứu khí quyển ánh sáng và các đợt mây cuộn hùng vĩ trên rặng đồi trập trùng.',
              en: 'Atmospheric study of shifting light and majestic stormclouds rolling across green foothills.',
            },
          },
          {
            id: 'tac-5',
            title: {
              vi: 'Rừng Thưa Biên Giới',
              en: 'Tacoune Border Woodlands',
            },
            subtitle: {
              vi: 'Vùng chuyển tiếp giữa đồng bằng và dãy núi cao',
              en: 'Transition zone between lowlands and high peaks',
            },
            aspectRatio: 'landscape',
            description: {
              vi: 'Khu rừng thưa ngập tràn ánh nắng ấm áp dẫn lối từ Tacoune sang các rặng núi bao quanh.',
              en: 'Warm sunlit woodland corridors marking the natural boundary of the central territories.',
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
            title: {
              vi: 'The End to the Beginning',
              en: 'The End to the Beginning',
            },
            subtitle: {
              vi: 'Áp phích quảng bá chính thức',
              en: 'Official Teaser Visual',
            },
            aspectRatio: 'portrait',
            description: {
              vi: 'Áp phích biểu tượng khắc họa khoảnh khắc ngôi sao cuối cùng rơi xuống vòm trời.',
              en: 'Flagship teaser visual illustrating the moment the last star descends onto the skyline.',
            },
          },
          {
            id: 'vis-2',
            title: {
              vi: 'Dấu Ấn Tinh Cầu',
              en: 'Astral Crest Awakening',
            },
            subtitle: {
              vi: 'Minh họa khoảnh khắc kích hoạt mảnh thiên thạch',
              en: 'Astral Crest Awakening',
            },
            aspectRatio: 'square',
            description: {
              vi: 'Minh họa khoảnh khắc kích hoạt vòng cổ chứa mảnh thiên thạch nguyên bản.',
              en: 'Close-up composition of the celestial meteorite amulet resonance.',
            },
          },
          {
            id: 'vis-3',
            title: {
              vi: 'Cây Vĩnh Hằng Trong Bão',
              en: 'The Everbranch in Winter Gale',
            },
            subtitle: {
              vi: 'Tranh toàn cảnh cây thế giới giữa bão tuyết',
              en: 'The Everbranch in Winter Gale',
            },
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
        subtitle: { vi: 'Khu Rừng Cấm', en: 'Forbidden Forest' },
        imageUrl: `${import.meta.env.BASE_URL}artworks/saldevie-forbidden-forest.jpg`,
      },
      {
        id: 'art-2',
        title: { vi: 'Phác Thảo #02', en: 'Concept Art #02' },
        subtitle: { vi: 'Nghiên cứu môi trường & ánh sáng', en: 'Environment & Lighting Study' },
      },
      {
        id: 'art-3',
        title: { vi: 'Phác Thảo #03', en: 'Concept Art #03' },
        subtitle: { vi: 'Thiết kế nhân vật & sinh vật', en: 'Character & Creature Design' },
      },
      {
        id: 'art-4',
        title: { vi: 'Phác Thảo #04', en: 'Concept Art #04' },
        subtitle: { vi: 'Tàn tích cổ xưa & kiến trúc', en: 'Ancient Ruins & Architecture' },
      },
      {
        id: 'art-5',
        title: { vi: 'Phác Thảo #05', en: 'Concept Art #05' },
        subtitle: { vi: 'Tranh minh họa chính', en: 'Key Visual Illustration' },
      },
    ],
    development: {
      toolProject: {
        name: 'finalstars_gp_tool',
        repo: 'Enriah/finalstars_gp_tool',
        description: {
          vi: 'Công cụ chuyên dụng quản lý và biên soạn cơ chế gameplay cho dự án FinalStars.',
          en: 'Tool for managing the gameplay of FinalStars Project.',
        },
        githubUrl: 'https://github.com/Enriah/finalstars_gp_tool',
        tags: ['Gameplay Management', 'Game Tool', 'GitHub Repository'],
      },
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

/**
 * Thu thập tất cả các tác phẩm có ảnh thật (imageUrl) từ tất cả các Album của mọi dự án
 */
export const getAllProjectArtworksWithImages = (projectsList: ProjectItem[] = PROJECTS_DATA): ArtworkSlide[] => {
  const result: ArtworkSlide[] = [];

  projectsList.forEach((project) => {
    if (project.isComingSoon || !project.albums) return;

    let cumulativeIdx = 0;
    project.albums.forEach((album) => {
      album.artworks.forEach((art) => {
        if (art.imageUrl && art.imageUrl.trim() !== '') {
          result.push({
            id: art.id,
            title: art.title,
            subtitle: art.subtitle,
            project: project.title,
            projectId: project.id,
            albumId: album.id,
            artworkId: art.id,
            artworkIndex: cumulativeIdx,
            imageUrl: art.imageUrl,
          });
        }
        cumulativeIdx++;
      });
    });
  });

  return result;
};

/**
 * Chọn ngẫu nhiên đúng `count` ảnh (mặc định 5 ảnh) để hiển thị trên Slider Hero.
 * Mỗi lần vào trang hoặc tải lại trang sẽ tạo ra một tổ hợp ngẫu nhiên mới.
 */
export const getRandomHeroArtworks = (count: number = 5, projectsList: ProjectItem[] = PROJECTS_DATA): ArtworkSlide[] => {
  const allImages = getAllProjectArtworksWithImages(projectsList);

  if (allImages.length === 0) {
    return [];
  }

  // Thuật toán xáo trộn ngẫu nhiên Fisher-Yates
  const shuffled = [...allImages];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Nếu số ảnh thực tế đủ hoặc nhiều hơn số lượng cần, lấy `count` ảnh độc nhất
  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  // Nếu số ảnh thực tế ít hơn `count`, lặp vòng tròn để luôn hiển thị đủ `count` ảnh
  const result: ArtworkSlide[] = [];
  let index = 0;
  while (result.length < count) {
    const base = shuffled[index % shuffled.length];
    result.push({
      ...base,
      id: `${base.id}-slot-${result.length + 1}`,
    });
    index++;
  }

  return result;
};
