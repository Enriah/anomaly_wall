export type Discipline = 'all' | '3d' | '2d' | 'dev';

export interface ProjectMedia {
  type: 'image' | '3d-mesh' | 'video';
  url: string;
  caption?: string;
  meshType?: 'torusKnot' | 'icosahedron' | 'sphere' | 'abstractWave';
}

export interface Project {
  id: string;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  discipline: '3d' | '2d' | 'dev';
  category: string;
  categoryVi: string;
  year: string;
  client?: string;
  coverImage: string;
  additionalImages?: string[];
  tags: string[];
  featured: boolean;
  color: string;
  meshConfig?: {
    geometry: 'torusKnot' | 'icosahedron' | 'cyberSkull' | 'torus' | 'octahedron' | 'abstractWave';
    wireframe?: boolean;
    metalness?: number;
    roughness?: number;
    color: string;
  };
  details: {
    overview: string;
    overviewVi: string;
    concept: string;
    conceptVi: string;
    process: string;
    processVi: string;
    tools: string[];
    role: string;
    roleVi: string;
    liveUrl?: string;
    githubUrl?: string;
    stats?: { label: string; labelVi: string; value: string }[];
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  nameVi: string;
  discipline: '3d' | '2d' | 'dev';
  icon: string;
  accentColor: string;
  description: string;
  descriptionVi: string;
  skills: {
    name: string;
    level: number; // 1-100
    category: string;
    badge?: string;
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  quoteVi: string;
  avatar: string;
}
