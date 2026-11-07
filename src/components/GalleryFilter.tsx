import React from 'react';
import { Sparkles, Box, Layers, Code, Search, X } from 'lucide-react';
import { Discipline } from '../types';

interface GalleryFilterProps {
  currentDiscipline: Discipline;
  onDisciplineChange: (discipline: Discipline) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  availableTags: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemCount: number;
  totalCount: number;
  lang: 'vi' | 'en';
}

export const GalleryFilter: React.FC<GalleryFilterProps> = ({
  currentDiscipline,
  onDisciplineChange,
  selectedTag,
  onSelectTag,
  availableTags,
  searchQuery,
  onSearchChange,
  itemCount,
  totalCount,
  lang,
}) => {
  const tabs: { id: Discipline; labelEn: string; labelVi: string; icon: React.ReactNode; color: string }[] = [
    { id: 'all', labelEn: 'All Works', labelVi: 'Tất cả tác phẩm', icon: <Sparkles className="w-4 h-4" />, color: 'purple' },
    { id: '3d', labelEn: '3D Art & CGI', labelVi: '3D Art & CGI', icon: <Box className="w-4 h-4" />, color: 'purple' },
    { id: '2d', labelEn: '2D & Branding', labelVi: '2D Design & Thương hiệu', icon: <Layers className="w-4 h-4" />, color: 'rose' },
    { id: 'dev', labelEn: 'Creative Code', labelVi: 'Lập trình Sáng tạo', icon: <Code className="w-4 h-4" />, color: 'cyan' },
  ];

  return (
    <div className="space-y-6">
      {/* Upper Control Bar: Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Main Discipline Buttons */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10">
          {tabs.map(tab => {
            const isActive = currentDiscipline === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onDisciplineChange(tab.id);
                  onSelectTag(null); // Clear tag when switching disciplines
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-zinc-950 font-bold shadow-lg shadow-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{lang === 'vi' ? tab.labelVi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search input & Counter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={lang === 'vi' ? 'Tìm tác phẩm, công nghệ...' : 'Search craft, tools...'}
              className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="px-3 py-2 rounded-xl glass-panel text-xs font-mono text-zinc-400 whitespace-nowrap border border-white/5">
            <span className="text-white font-bold">{itemCount}</span>
            <span className="text-zinc-600"> / </span>
            <span>{totalCount}</span>
          </div>
        </div>

      </div>

      {/* Filter by Technology/Medium Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
        <span className="text-zinc-500 uppercase text-[11px] whitespace-nowrap mr-1">
          {lang === 'vi' ? 'Lọc thẻ:' : 'Filter tag:'}
        </span>

        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/50 hover:bg-purple-600/40 transition-colors"
          >
            <span>{selectedTag}</span>
            <X className="w-3 h-3" />
          </button>
        )}

        {availableTags.slice(0, 10).map(tag => {
          const isSelected = selectedTag === tag;
          if (isSelected) return null; // already shown above
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className="px-3 py-1 rounded-full glass-panel border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
