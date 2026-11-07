import React, { useState } from 'react';
import { Box, Layers, Code, Sparkles, Quote } from 'lucide-react';
import { SKILL_CATEGORIES, PHILOSOPHY, TESTIMONIALS } from '../data/portfolioData';
import { Discipline } from '../types';

interface AboutSkillsProps {
  currentDiscipline: Discipline;
  lang: 'vi' | 'en';
}

export const AboutSkills: React.FC<AboutSkillsProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState<'3d' | '2d' | 'dev'>('3d');

  const selectedCategoryData = SKILL_CATEGORIES.find(c => c.id === activeCategory) || SKILL_CATEGORIES[0];

  return (
    <section id="about-skills" className="py-24 relative overflow-hidden bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>POLYMATH CRAFT & CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            {lang === 'vi' ? 'Hồ Sơ Năng Lực & Kỹ Năng' : 'Artistic Philosophy & Skills'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            {lang === 'vi' ? PHILOSOPHY.quote.vi : PHILOSOPHY.quote.en}
          </p>
        </div>

        {/* 3 Pillars of Craft */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PHILOSOPHY.pillars.map((pillar, idx) => {
            const icons = [<Box className="w-6 h-6 text-purple-400" />, <Layers className="w-6 h-6 text-rose-400" />, <Code className="w-6 h-6 text-cyan-400" />];
            const borderColors = ['hover:border-purple-500/40', 'hover:border-rose-500/40', 'hover:border-cyan-500/40'];
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl glass-card border border-white/10 ${borderColors[idx]} transition-all duration-300 space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border border-white/10">
                    {icons[idx]}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">
                    {lang === 'vi' ? pillar.titleVi : pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    {lang === 'vi' ? pillar.descVi : pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Skills Matrix */}
        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-10 shadow-2xl">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {SKILL_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const icons = {
                '3d': <Box className="w-4 h-4" />,
                '2d': <Layers className="w-4 h-4" />,
                'dev': <Code className="w-4 h-4" />
              };
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as '3d' | '2d' | 'dev')}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-mono transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-zinc-950 font-bold shadow-xl shadow-white/15 scale-105'
                      : 'glass-panel text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {icons[cat.id as '3d' | '2d' | 'dev']}
                  <span>{lang === 'vi' ? cat.nameVi : cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Description of active discipline */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-sm font-mono text-zinc-300">
              {lang === 'vi' ? selectedCategoryData.descriptionVi : selectedCategoryData.description}
            </p>
          </div>

          {/* Skill Bars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {selectedCategoryData.skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{skill.name}</span>
                    {skill.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {skill.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-[11px] text-zinc-500">{skill.category}</span>
                    <span className="text-white font-bold">{skill.level}%</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: selectedCategoryData.accentColor,
                      boxShadow: `0 0 12px ${selectedCategoryData.accentColor}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Client Recognition / Testimonials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 relative space-y-4">
              <Quote className="w-8 h-8 text-purple-500/40 absolute top-6 right-6" />
              <p className="text-sm sm:text-base text-zinc-300 font-light italic leading-relaxed pt-2">
                "{lang === 'vi' ? t.quoteVi : t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs font-mono text-zinc-400">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
