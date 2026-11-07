import React from 'react';
import { ArrowUpRight, Box, Layers, Code, Sparkles, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  lang: 'vi' | 'en';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, lang }) => {
  const getDisciplineBadge = () => {
    switch (project.discipline) {
      case '3d':
        return {
          icon: <Box className="w-3.5 h-3.5" />,
          label: '3D ART & CGI',
          classes: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
        };
      case '2d':
        return {
          icon: <Layers className="w-3.5 h-3.5" />,
          label: '2D DESIGN',
          classes: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
        };
      case 'dev':
        return {
          icon: <Code className="w-3.5 h-3.5" />,
          label: 'CREATIVE TECH',
          classes: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
        };
    }
  };

  const badge = getDisciplineBadge();

  return (
    <article 
      onClick={() => onSelect(project)}
      className="group relative rounded-3xl overflow-hidden glass-card border border-white/[0.08] hover:border-white/25 transition-all duration-500 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image & Media Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border backdrop-blur-md ${badge.classes}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {project.featured && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                <span>FEATURED</span>
              </div>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-zinc-300 glass-panel border-white/10">
              {project.year}
            </span>
          </div>
        </div>

        {/* Interactive Badge Hint (3D mesh or live demo) */}
        {project.meshConfig && (
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-500/30">
            <Box className="w-3 h-3 animate-spin-slow" />
            <span>Interactive 3D Available</span>
          </div>
        )}
        {project.details.liveUrl && (
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
            <ExternalLink className="w-3 h-3" />
            <span>Live Interactive Demo</span>
          </div>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-400">
            {lang === 'vi' ? project.categoryVi : project.category}
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {lang === 'vi' ? project.titleVi : project.title}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 font-light line-clamp-2 leading-relaxed">
            {lang === 'vi' ? project.subtitleVi : project.subtitle}
          </p>
        </div>

        {/* Tags & Action Link */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 max-w-[80%]">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-purple-600 transition-all">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};
