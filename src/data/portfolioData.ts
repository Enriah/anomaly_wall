import { Project, SkillCategory, Testimonial } from '../types';

export const PERSONAL_INFO = {
  name: "ENRIAH",
  nameVi: "ENRIAH",
  tagline: "Multidisciplinary Visual Artist & Creative Engineer",
  taglineVi: "Nghệ sĩ Thị giác Đa ngành & Kỹ sư Sáng tạo",
  location: "Ho Chi Minh City, Vietnam & Remote Worldwide",
  locationVi: "TP. Hồ Chí Minh, Việt Nam & Toàn cầu",
  email: "khoa.tran.creative@gmail.com",
  phone: "+84 (0) 90 888 2026",
  availability: "Available for Q3/Q4 Commissions & Select Collaborations",
  availabilityVi: "Nhận dự án tuyển chọn & Hợp tác sáng tạo Q3/Q4",
  stats: [
    { value: "8+", label: "Years of Craft", labelVi: "Năm kinh nghiệm" },
    { value: "45+", label: "Exhibited Works", labelVi: "Tác phẩm ra mắt" },
    { value: "3×", label: "Disciplines Mastered", labelVi: "Chuyên ngành dung hợp" },
    { value: "100%", label: "Passionate Precision", labelVi: "Tận tâm & Chuẩn xác" },
  ],
  bio: {
    en: "Operating at the nexus of spatial dimension, visual semiotics, and computational logic. I weave together intricate 3D worlds, high-impact 2D design systems, and fluid interactive web realities for visionary brands and forward-thinking studios.",
    vi: "Đứng tại điểm giao thoa giữa chiều không gian 3D, mỹ thuật thị giác 2D và tư duy thuật toán lập trình. Tôi kết hợp tạo tác hình khối 3 chiều, hệ thống nhận diện 2D sắc sảo và trải nghiệm web tương tác mượt mà cho các thương hiệu và dự án tiên phong."
  },
  socials: [
    { name: "ArtStation", url: "https://artstation.com", icon: "Palette" },
    { name: "Behance", url: "https://behance.net", icon: "Layers" },
    { name: "GitHub", url: "https://github.com", icon: "Github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
    { name: "Instagram", url: "https://instagram.com", icon: "Instagram" },
    { name: "Twitter / X", url: "https://twitter.com", icon: "Twitter" }
  ]
};

export const PROJECTS: Project[] = [
  // ===================== 3D ART & CGI =====================
  {
    id: "3d-aetheria-relic",
    title: "Aetheria: Neomorphic Relic",
    titleVi: "Aetheria: Thánh vật Không gian Số",
    subtitle: "High-spec CGI sculpture exploring chromatic aberration and tactile obsidian shaders.",
    subtitleVi: "Tác phẩm điêu khắc CGI khám phá khúc xạ quang sai và chất liệu đá obsidian siêu thực.",
    discipline: "3d",
    category: "CGI & Concept Sculpture",
    categoryVi: "CGI & Điêu khắc Trừu tượng",
    year: "2026",
    client: "Luminary Arts Collective",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Blender", "Octane Render", "Substance 3D", "Procedural Shaders", "3D Modeling"],
    featured: true,
    color: "#a855f7",
    meshConfig: {
      geometry: "torusKnot",
      metalness: 0.95,
      roughness: 0.15,
      color: "#9333ea"
    },
    details: {
      overview: "A flagship exploration in hard-surface procedural sculpting and optical light interaction. Aetheria investigates how ancient sacred geometry might evolve inside a hyper-advanced digital substrate.",
      overviewVi: "Dự án khám phá tạo hình điêu khắc bề mặt cứng cùng thuật toán tương tác khúc xạ ánh sáng. Aetheria mô phỏng lại cách hình học thiêng liêng cổ xưa tồn tại bên trong không gian điện toán lượng tử.",
      concept: "Synthesizing monolithic darkness with bioluminescent prism ribbons, emphasizing the contrast between void and luminance.",
      conceptVi: "Hòa quyện sắc đen nguyên khối với dải quang phổ tán sắc cầu vồng, tạo nên sự tương phản sâu sắc giữa hư vô và ánh sáng.",
      process: "Engineered in Blender with custom node-based micro-displacement maps, baked into 8K UDIM textures using Substance Painter, and rendered via spectral path tracing.",
      processVi: "Mô hình hóa trong Blender với bản đồ micro-displacement tùy biến, nướng vân bề mặt 8K UDIM bằng Substance 3D và render bằng path-tracing đa phổ.",
      tools: ["Blender 4.2", "Substance Painter", "Octane Standalone", "Adobe Photoshop"],
      role: "Lead 3D Artist & Shading Supervisor",
      roleVi: "Nghệ sĩ 3D Trưởng & Giám sát Vật liệu",
      stats: [
        { label: "Polygon Count", labelVi: "Số đa giác", value: "3.2M Triangles" },
        { label: "Render Time", labelVi: "Thời gian Render", value: "48h Path Tracing" },
        { label: "Resolution", labelVi: "Độ phân giải", value: "8192 × 8192 Native" }
      ]
    }
  },
  {
    id: "3d-chronos-horology",
    title: "Chronos Kinetic: Luxury Timepiece",
    titleVi: "Chronos Kinetic: Cỗ máy Thời gian",
    subtitle: "Microscopic precision watch rendering with tourbillon mechanics and sapphire casing.",
    subtitleVi: "Diễn họa CGI đồng hồ cơ học vi mô với bộ thoát Tourbillon lộ cơ và vỏ pha lê sapphire.",
    discipline: "3d",
    category: "Product Visualization",
    categoryVi: "Diễn họa Sản phẩm Cao cấp",
    year: "2025",
    client: "Geneva Haute Horlogerie",
    coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Cinema 4D", "Redshift", "Hard Surface", "Jewelry Lighting", "CAD Precision"],
    featured: false,
    color: "#eab308",
    meshConfig: {
      geometry: "torus",
      metalness: 0.9,
      roughness: 0.2,
      color: "#eab308"
    },
    details: {
      overview: "Complete CGI visualization of a dual-axis tourbillon luxury timepiece with authentic physical material properties including brushed titanium, anti-reflective crystal, and hand-stitched alligator leather.",
      overviewVi: "Dự án diễn họa CGI hoàn chỉnh cỗ máy thời gian tourbillon 2 trục với vật liệu chuẩn vật lý gồm titan phay xước, mặt kính sapphire chống lóa và dây da thủ công.",
      concept: "Capturing the poetic heartbeat of mechanical engineering through dramatic chiaroscuro studio lighting.",
      conceptVi: "Tôn vinh nhịp đập cơ khí thông qua nghệ thuật ánh sáng tương phản Chiaroscuro đậm chất điện ảnh.",
      process: "Engineered from engineering CAD blueprints into sub-D topology, rigged kinematics for 280+ moving gears, and rendered with custom anisotropic reflections.",
      processVi: "Chuyển đổi từ bản vẽ CAD kỹ thuật sang lưới Sub-D chuẩn mực, thiết lập chuyển động động lực học cho hơn 280 bánh răng và xử lý phản xạ quang học dị hướng.",
      tools: ["Cinema 4D", "Redshift 3.5", "ZBrush", "After Effects"],
      role: "3D Visualizer & Technical Director",
      roleVi: "Chuyên gia Diễn họa 3D & Kỹ thuật",
      stats: [
        { label: "Gears Rigged", labelVi: "Bánh răng chuyển động", value: "284 Parts" },
        { label: "Tolerance", labelVi: "Độ chính xác", value: "0.005mm" }
      ]
    }
  },
  {
    id: "3d-neo-biome",
    title: "Solitude 2099: Neo-Metropolis Biome",
    titleVi: "Solitude 2099: Đô thị Sinh quyển",
    subtitle: "Atmospheric sci-fi environment design featuring brutalist megastructures and volumetric weather.",
    subtitleVi: "Thiết kế bối cảnh viễn tưởng khí quyển với đại công trình thô mộc và hiệu ứng thời tiết thể tích.",
    discipline: "3d",
    category: "Environment Art & Matte Painting",
    categoryVi: "Môi trường 3D & Bối cảnh Điện ảnh",
    year: "2025",
    client: "Neon Horizon Studios",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Unreal Engine 5", "Blender", "World Creator", "Lumen", "Nanite"],
    featured: true,
    color: "#06b6d4",
    meshConfig: {
      geometry: "icosahedron",
      metalness: 0.7,
      roughness: 0.3,
      color: "#06b6d4"
    },
    details: {
      overview: "An expansive world-building exercise depicting humanity's vertical urban canopy enveloped in perpetual acid drizzle and holographic megaboards.",
      overviewVi: "Một dự án thế giới mở quy mô lớn khắc họa thành phố tương lai vươn cao qua tầng mây mù nhiệt đới với ánh sáng neon và màn hình ba chiều khổng lồ.",
      concept: "Juxtaposing colossal cold concrete monoliths with warm, flickering signs of fragile human life.",
      conceptVi: "Đặt cạnh nhau những khối bê tông khổng lồ lạnh lẽo với ánh đèn vàng ấm le lói của đời sống con người bên trong khe nứt đô thị.",
      process: "Terrain generation in World Creator, kitbashing 120 custom sci-fi architecture modules in Blender, assembled in Unreal Engine 5 with real-time Lumen volumetric lighting.",
      processVi: "Kiến tạo địa hình bằng World Creator, dựng 120 mô-đun kiến trúc tương lai trong Blender và kết nối thời gian thực trong Unreal Engine 5 với công nghệ ánh sáng Lumen.",
      tools: ["Unreal Engine 5.4", "Blender", "World Creator", "Nuke"],
      role: "World Builder & Lighting Artist",
      roleVi: "Họa sĩ Bối cảnh & Ánh sáng Điện ảnh"
    }
  },

  // ===================== 2D DESIGN & BRANDING =====================
  {
    id: "2d-aura-sound",
    title: "Aura Sound: Dynamic Identity & Type System",
    titleVi: "Aura Sound: Hệ Nhận diện Động & Typography",
    subtitle: "Complete brand identity, kinetic custom typeface, and vinyl packaging for a neo-jazz label.",
    subtitleVi: "Bộ nhận diện thương hiệu, bộ font động tùy biến và bao bì đĩa than cho hãng thu âm neo-jazz.",
    discipline: "2d",
    category: "Brand Identity & Editorial",
    categoryVi: "Nhận diện Thương hiệu & Báo chí",
    year: "2026",
    client: "Aura Records Berlin",
    coverImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Figma", "Adobe Illustrator", "Type Design", "Editorial Grid", "Print Production"],
    featured: true,
    color: "#f43f5e",
    details: {
      overview: "A comprehensive brand architecture for an avant-garde acoustic label. The visual identity translates sound frequencies and sonic warmth into variable geometric letterforms.",
      overviewVi: "Hệ thống nhận diện thương hiệu toàn diện cho hãng thu âm thể nghiệm. Ngôn ngữ thị giác chuyển hóa dao động sóng âm và độ ấm âm thanh thành các ký tự typography biến thiên.",
      concept: "Visualizing the unseen pulse of acoustic resonance through Swiss-style strict grids fractured by organic fluidity.",
      conceptVi: "Hiện thực hóa nhịp đập vô hình của âm hưởng thông qua lưới thiết kế Thụy Sĩ (Swiss Style) điểm xuyết những đường lượn hữu cơ.",
      process: "Designed a bespoke variable font family with 3 axes (weight, slant, vibration), printed silk-screen album sleeves on 380gsm uncoated cotton paper with holographic foil accents.",
      processVi: "Thiết kế bộ font biến thiên tùy biến 3 trục, in lưới thủ công trên giấy mỹ thuật cotton 380gsm với kỹ thuật ép kim holographic sắc sảo.",
      tools: ["Glyphs", "Adobe Illustrator", "InDesign", "Photoshop", "Figma"],
      role: "Creative Director & Brand Architect",
      roleVi: "Giám đốc Sáng tạo & Kiến trúc Thương hiệu",
      stats: [
        { label: "Type Weight", labelVi: "Biến thể font", value: "9 Weights + Variable" },
        { label: "Assets Delivered", labelVi: "Ấn phẩm hoàn thiện", value: "85+ Items" }
      ]
    }
  },
  {
    id: "2d-kanso-monograph",
    title: "Kanso: Minimalist Architecture Monograph",
    titleVi: "Kanso: Sách Ảnh Kiến Trúc Tối Giản",
    subtitle: "320-page hardcover publication celebrating brutalist concrete sanctuaries in Kyoto & Tokyo.",
    subtitleVi: "Ấn phẩm bìa cứng 320 trang tôn vinh các tuyệt tác kiến trúc bê tông thiền định tại Kyoto & Tokyo.",
    discipline: "2d",
    category: "Editorial & Print Design",
    categoryVi: "Thiết kế Xuất bản & In ấn",
    year: "2025",
    client: "Kyoto Press & Architecture Guild",
    coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["InDesign", "Editorial Layout", "Grid Systems", "Art Direction", "Paper Craft"],
    featured: false,
    color: "#f59e0b",
    details: {
      overview: "A tribute to Japanese architectural restraint. Designed with extreme attention to whitespace, baseline grid alignments, and tactile material finishes that honor natural shadow.",
      overviewVi: "Tác phẩm tri ân tinh thần kiến trúc tối giản Nhật Bản. Từng trang sách được sắp đặt tỉ mỉ theo hệ lưới chuẩn mực, tôn trọng khoảng trống và độ tương phản tự nhiên của ánh sáng.",
      concept: "Ma (間) — the Japanese aesthetic of negative space as a living, breathing participant in visual storytelling.",
      conceptVi: "Triết lý 'Ma' (Khoảng trống) của Nhật Bản — xem khoảng trắng như một thực thể sống chuyển tải cảm xúc thị giác.",
      process: "Engineered asymmetrical 12-column grid layout, paired bespoke bilingual typography (Kanji + Latin), bound with exposed Swiss Smyth-sewn stitching.",
      processVi: "Xây dựng hệ lưới 12 cột bất đối xứng, phối hợp typography song ngữ (Kanji + Latin) và hoàn thiện gia công khâu chỉ hở gáy phong cách Thụy Sĩ.",
      tools: ["Adobe InDesign", "Photoshop", "Lightroom Classic"],
      role: "Lead Book Designer & Art Director",
      roleVi: "Thiết kế Trưởng Ấn phẩm & Chỉ đạo Nghệ thuật",
      stats: [
        { label: "Pages", labelVi: "Số trang", value: "320 Pages" },
        { label: "Print Run", labelVi: "Số lượng in", value: "2,000 Copies" }
      ]
    }
  },
  {
    id: "2d-nova-fintech",
    title: "Nova Horizon: Next-Gen Financial UI/UX",
    titleVi: "Nova Horizon: Giao diện Tài chính Số Thế hệ Mới",
    subtitle: "High-contrast dark luxury interface system for algorithmic asset management and cross-border vaults.",
    subtitleVi: "Hệ thống giao diện tối sang trọng cho nền tảng quản lý tài sản thuật toán và thanh toán toàn cầu.",
    discipline: "2d",
    category: "UI/UX & Product Design",
    categoryVi: "Thiết kế UI/UX & Trải nghiệm Số",
    year: "2025",
    client: "Nova Financial Technologies Inc.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Figma", "Design Systems", "Prototyping", "Design Tokens", "Accessibility"],
    featured: true,
    color: "#8b5cf6",
    details: {
      overview: "Redefining the relationship between high-frequency financial metrics and serene aesthetic clarity. Engineered an end-to-end design system comprising 300+ tokenized components.",
      overviewVi: "Định nghĩa lại cách người dùng tiếp cận dữ liệu tài chính phức tạp bằng sự mạch lạc và sang trọng. Xây dựng hệ thống design system hoàn chỉnh với hơn 300 linh kiện chuẩn token.",
      concept: "Transforming dense data walls into intuitive, elegant visual hierarchy inspired by aircraft cockpit telemetry.",
      conceptVi: "Biến những bảng số liệu khô khan thành phân tầng thị giác trực quan, lấy cảm hứng từ bảng điều khiển buồng lái phi cơ hiện đại.",
      process: "Conducted 40+ user interviews, designed scalable auto-layout libraries, built interactive micro-prototypes in Figma with variable physics.",
      processVi: "Phỏng vấn người dùng chuyên sâu, thiết lập thư viện linh kiện quy chuẩn tự co giãn và tạo mẫu nguyên mẫu tương tác với chuyển động vật lý.",
      tools: ["Figma", "FigJam", "Protopie", "Illustrator"],
      role: "Principal Product Designer",
      roleVi: "Nhà thiết kế Sản phẩm Trưởng",
      stats: [
        { label: "Components", labelVi: "Linh kiện Design System", value: "320+ Tokens" },
        { label: "Conversion Lift", labelVi: "Tăng trưởng chuyển đổi", value: "+38%" }
      ]
    }
  },

  // ===================== DEVELOPER & CREATIVE TECH =====================
  {
    id: "dev-spectra-webgl",
    title: "Spectra WebGL: Generative Audio Reactor",
    titleVi: "Spectra WebGL: Trình Diễn Âm Thanh Ba Chiều",
    subtitle: "Real-time GPU-accelerated audio visualization canvas powered by custom GLSL fragment shaders.",
    subtitleVi: "Trình diễn thị giác âm thanh thời gian thực gia tốc GPU với các shader phân đoạn GLSL tùy biến.",
    discipline: "dev",
    category: "Creative Coding & Shaders",
    categoryVi: "Lập trình Sáng tạo & WebGL Shaders",
    year: "2026",
    client: "Open Source / Interactive Web",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["TypeScript", "Three.js", "GLSL", "Web Audio API", "Vite", "Canvas"],
    featured: true,
    color: "#06b6d4",
    meshConfig: {
      geometry: "abstractWave",
      wireframe: false,
      color: "#06b6d4"
    },
    details: {
      overview: "An experimental interactive web application that parses live microphone input or audio files via the Web Audio API, extracting Fast Fourier Transform (FFT) data to deform a vertex mesh in real-time at 60 FPS.",
      overviewVi: "Ứng dụng web tương tác thể nghiệm phân tích âm thanh trực tiếp từ micro hoặc file nhạc qua Web Audio API, trích xuất dữ liệu tần số FFT để biến dạng lưới đa giác theo thời gian thực ở tốc độ 60 khung hình/giây.",
      concept: "Creating a symbiotic loop between acoustic vibration and algorithmic generative geometry.",
      conceptVi: "Tạo nên vòng lặp cộng sinh giữa năng lượng dao động âm thanh và vẻ đẹp hình học tạo bởi thuật toán.",
      process: "Wrote custom vertex and fragment shaders in GLSL, implemented ping-pong framebuffers for smooth particle feedback trails, optimized WebGL draw calls for mobile battery efficiency.",
      processVi: "Tự viết shader đỉnh và phân đoạn bằng GLSL, triển khai kỹ thuật ping-pong framebuffers để tạo vệt hạt mờ ảo và tối ưu hóa lệnh vẽ WebGL tiết kiệm pin trên di động.",
      tools: ["WebGL 2.0", "Three.js", "GLSL Shaders", "TypeScript", "Web Audio API"],
      role: "Creative Technologist & Shader Engineer",
      roleVi: "Kỹ sư Công nghệ Sáng tạo & Lập trình Shader",
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      stats: [
        { label: "Frame Rate", labelVi: "Tốc độ khung hình", value: "60 FPS Locked" },
        { label: "Particles", labelVi: "Số hạt tính toán", value: "65,000 Live Points" }
      ]
    }
  },
  {
    id: "dev-omnistudio-3d",
    title: "OmniStudio: Cloud 3D Scene Configurator",
    titleVi: "OmniStudio: Trình Tùy Biến Không Gian 3D Trực Tuyến",
    subtitle: "Browser-based 3D workspace with real-time lighting control, material swapping, and glTF asset export.",
    subtitleVi: "Không gian làm việc 3D trên trình duyệt với khả năng điều khiển ánh sáng, đổi vật liệu và xuất file glTF.",
    discipline: "dev",
    category: "Web Application & 3D Engine",
    categoryVi: "Ứng dụng Web & Công cụ 3D Trực quan",
    year: "2025",
    client: "Studio Vertex Labs",
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["React 19", "Three.js", "Tailwind CSS", "Zustand", "TypeScript", "Web Workers"],
    featured: true,
    color: "#10b981",
    details: {
      overview: "A lightweight cloud-based 3D asset inspection and presentation tool empowering artists and clients to collaborate on 3D prototypes directly in the browser with zero installation required.",
      overviewVi: "Công cụ trực quan hóa và kiểm duyệt mô hình 3D trên nền tảng đám mây, cho phép các nghệ sĩ và khách hàng duyệt mẫu 3D tương tác ngay trên trình duyệt mà không cần cài đặt phần mềm nặng.",
      concept: "Democratizing high-fidelity 3D rendering through modern browser graphics pipelines.",
      conceptVi: "Phổ cập hóa trải nghiệm đồ họa 3D chân thực thông qua sức mạnh xử lý của trình duyệt hiện đại.",
      process: "Architected with React 19, Zustand state store, Three.js PBR lighting pipeline, and off-thread glTF Draco mesh decoders running on Web Workers.",
      processVi: "Xây dựng trên nền tảng React 19, quản lý trạng thái bằng Zustand, xử lý vật liệu chuẩn PBR và giải mã nén dữ liệu Draco bằng Web Workers chạy nền.",
      tools: ["React 19", "Three.js", "Zustand", "Tailwind CSS", "Web Workers"],
      role: "Full-Stack Creative Developer",
      roleVi: "Lập trình viên Sáng tạo Full-Stack",
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      stats: [
        { label: "Load Speed", labelVi: "Tốc độ tải mô hình", value: "< 1.2s via Draco" },
        { label: "Compatibility", labelVi: "Độ tương thích", value: "Mobile & Desktop WebGL" }
      ]
    }
  },
  {
    id: "dev-synapse-design-engine",
    title: "Synapse: Automated Design Token Pipeline",
    titleVi: "Synapse: Hệ Thống Đồng Bộ Hóa Design Token Tự Động",
    subtitle: "CLI tool & web dashboard bridging Figma style variables into CSS, Tailwind, and React design components.",
    subtitleVi: "Công cụ dòng lệnh & bảng điều khiển web đồng bộ biến thiết kế từ Figma sang CSS, Tailwind và React.",
    discipline: "dev",
    category: "Developer Tooling & Infrastructure",
    categoryVi: "Công cụ Lập trình & Hạ tầng Thiết kế",
    year: "2025",
    client: "DesignOps Engineering Collective",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Node.js", "TypeScript", "Next.js", "Figma REST API", "AST Parsing", "CI/CD"],
    featured: false,
    color: "#a855f7",
    details: {
      overview: "Built for fast-moving engineering teams to eliminate human error when syncing color tokens, typography scales, and spacing tokens between Figma and production codebases.",
      overviewVi: "Được xây dựng cho các nhóm kỹ sư phần mềm nhằm xóa bỏ sai sót thủ công khi đồng bộ mã màu, kích thước typography và khoảng cách từ Figma về kho mã nguồn dự án.",
      concept: "Closing the gap between the designer's intent and the developer's execution automatically.",
      conceptVi: "Tự động hóa tuyệt đối cầu nối giữa ý đồ của nhà thiết kế và mã nguồn của lập trình viên.",
      process: "Engineered a TypeScript parser utilizing Figma REST APIs, AST tree manipulation, and automated GitHub Action pull requests triggered by webhook events.",
      processVi: "Phát triển bộ phân tích cú pháp TypeScript kết nối Figma REST API, biến đổi cây cú pháp trừu tượng AST và tự động tạo Pull Request trên GitHub bằng Webhook.",
      tools: ["TypeScript", "Node.js", "Figma API", "GitHub Actions", "Tailwind CSS"],
      role: "Lead Software Architect",
      roleVi: "Kiến trúc sư Phần mềm Trưởng",
      githubUrl: "https://github.com",
      stats: [
        { label: "Sync Latency", labelVi: "Thời gian đồng bộ", value: "< 500ms" },
        { label: "Lines Saved", labelVi: "Giảm thiểu code thủ công", value: "10,000+ Lines" }
      ]
    }
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "3d",
    name: "3D Art & Spatial CGI",
    nameVi: "Nghệ thuật 3D & Không gian CGI",
    discipline: "3d",
    icon: "Box",
    accentColor: "#a855f7",
    description: "Sculpting digital matter, volumetric lighting, and hyper-tactile material simulations.",
    descriptionVi: "Tạo tác hình khối kỹ thuật số, ánh sáng thể tích và mô phỏng vật liệu chân thực.",
    skills: [
      { name: "Blender & Geometry Nodes", level: 95, category: "Core Software", badge: "Primary" },
      { name: "Cinema 4D & Octane/Redshift", level: 90, category: "Rendering Engine" },
      { name: "ZBrush Organic Sculpting", level: 85, category: "High-Poly Modeling" },
      { name: "Substance 3D Painter & Designer", level: 92, category: "Procedural Texturing" },
      { name: "Unreal Engine 5 (Lumen/Nanite)", level: 88, category: "Real-time Environments" },
      { name: "Hard-Surface Topology", level: 94, category: "Mesh Craft" }
    ]
  },
  {
    id: "2d",
    name: "2D Visuals & Design Systems",
    nameVi: "Thiết kế Thị giác 2D & Hệ thống Nhận diện",
    discipline: "2d",
    icon: "Layers",
    accentColor: "#f43f5e",
    description: "Editorial hierarchy, bespoke typography, Swiss grid precision, and emotional aesthetics.",
    descriptionVi: "Phân tầng thị giác báo chí, typography độc bản, hệ lưới chuẩn mực và cảm xúc thẩm mỹ.",
    skills: [
      { name: "Figma UI/UX & Design Systems", level: 96, category: "Product Design", badge: "Primary" },
      { name: "Adobe Illustrator (Vector Mastery)", level: 95, category: "Vector & Brand" },
      { name: "Adobe Photoshop & Retouching", level: 92, category: "Compositing" },
      { name: "Editorial Layout & Typography", level: 94, category: "Print & Publication" },
      { name: "Motion Graphics (After Effects)", level: 86, category: "Kinetic Visuals" },
      { name: "Packaging & Print Production", level: 88, category: "Material Finishes" }
    ]
  },
  {
    id: "dev",
    name: "Creative Code & Web Engineering",
    nameVi: "Lập trình Sáng tạo & Kỹ thuật Web",
    discipline: "dev",
    icon: "Code",
    accentColor: "#06b6d4",
    description: "Bridging aesthetics with performance via modern web stacks, WebGL, and reactive architectures.",
    descriptionVi: "Kết nối mỹ thuật với hiệu năng thông qua nền tảng web hiện đại, WebGL và tương tác mượt mà.",
    skills: [
      { name: "React 19 & Next.js", level: 95, category: "Frontend Framework", badge: "Primary" },
      { name: "TypeScript & Modern JS", level: 94, category: "Core Language" },
      { name: "Three.js & WebGL 2.0", level: 90, category: "3D on the Web" },
      { name: "Tailwind CSS & Animation", level: 96, category: "Styling & Motion" },
      { name: "GLSL Shader Programming", level: 84, category: "GPU Computation" },
      { name: "Node.js & REST/GraphQL APIs", level: 88, category: "Backend & Tooling" }
    ]
  }
];

export const PHILOSOPHY = {
  quote: {
    en: "Form follows intention. Code breathes life into static beauty, while dimension grants weight to ephemeral ideas.",
    vi: "Hình thái đi theo ý niệm. Lập trình thổi hồn vào vẻ đẹp tĩnh tại, còn chiều không gian trao sức nặng cho những ý tưởng bất tận."
  },
  pillars: [
    {
      title: "01. Spatial Depth (3D)",
      titleVi: "01. Chiều sâu Không gian (3D)",
      desc: "Creating tangible presence through geometry, refraction, and tactile physical materiality.",
      descVi: "Kiến tạo sự hiện diện chân thực thông qua hình khối, khúc xạ ánh sáng và vật liệu xúc giác."
    },
    {
      title: "02. Visual Harmony (2D)",
      titleVi: "02. Hài hòa Thị giác (2D)",
      desc: "Uncompromising composition, rigorous grid systems, and emotive typography that commands attention.",
      descVi: "Bố cục chuẩn mực, hệ thống lưới chặt chẽ và typography truyền tải xúc cảm lay động thị giác."
    },
    {
      title: "03. Fluid Interactivity (Code)",
      titleVi: "03. Tương tác Sống động (Code)",
      desc: "Butter-smooth frame rates, accessible reactive logic, and generative canvas wonders running at 60 FPS.",
      descVi: "Khung hình mượt mà như lụa, logic tương tác tức thì và những thử nghiệm đồ họa thời gian thực."
    }
  ]
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Alexandre Moreau",
    role: "Creative Director",
    company: "Studio Lumière Paris",
    quote: "Khoa is one of the rare polymaths who can render a breathtaking 3D scene, craft a flawless editorial identity, and code the entire interactive WebGL experience without missing a beat.",
    quoteVi: "Khoa là một trong những nhà sáng tạo hiếm hoi có thể vừa render một khung cảnh 3D ngoạn mục, vừa thiết kế bộ nhận diện xuất sắc và tự tay lập trình toàn bộ trải nghiệm tương tác WebGL mà không gặp bất kỳ trở ngại nào.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "2",
    name: "Elena Rostova",
    role: "Head of Product",
    company: "Apex Spatial Labs",
    quote: "His ability to bridge the gap between creative visual artistry and complex technical engineering made our product launch an unprecedented aesthetic triumph.",
    quoteVi: "Khả năng thu hẹp khoảng cách giữa nghệ thuật thị giác và kỹ thuật lập trình phức tạp của Khoa đã biến lần ra mắt sản phẩm của chúng tôi thành một dấu ấn thẩm mỹ vượt bậc.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];
