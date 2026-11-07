import React from 'react';
import { Sparkles, MapPin, Mail, Award, Palette, Layers, Code, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface AboutMeProps {
  lang: 'vi' | 'en';
}

export const AboutMe: React.FC<AboutMeProps> = ({ lang }) => {
  const journeys = [
    {
      period: '2023 - Present',
      roleVi: 'Nghệ sĩ 3D & Giám sát Kỹ thuật Sáng tạo',
      roleEn: 'Lead 3D Artist & Creative Technologist',
      placeVi: 'Freelance & Sáng lập Studio Thể nghiệm',
      placeEn: 'Independent Practice & Research Lab',
      descVi: 'Chuyên sâu vào CGI quang phổ, mô phỏng thế giới ảo, hard-surface topology và kiến trúc web WebGL thế hệ mới.',
      descEn: 'Focusing on spectral CGI, spatial world building, hard-surface topology, and real-time GPU WebGL experiences.'
    },
    {
      period: '2020 - 2023',
      roleVi: 'Chỉ đạo Mỹ thuật & Thiết kế Thương hiệu 2D',
      roleEn: 'Art Director & Brand Identity Designer',
      placeVi: 'Apex Studio & Các ấn phẩm xuất bản',
      placeEn: 'Apex Studio & Editorial Press',
      descVi: 'Thiết kế nhận diện thương hiệu, hệ thống typography biến thiên (variable type) và ấn bản sách kiến trúc phong cách Thụy Sĩ.',
      descEn: 'Crafted multi-touchpoint brand architectures, kinetic typographic systems, and Swiss-grid architectural monographs.'
    },
    {
      period: '2018 - 2020',
      roleVi: 'Kỹ sư Frontend & Creative Developer',
      roleEn: 'Frontend Engineer & Creative Developer',
      placeVi: 'Digital Experience Agency',
      placeEn: 'Digital Experience Agency',
      descVi: 'Phát triển các trang web tương tác giàu hình ảnh, shader canvas thời gian thực và tối ưu hiệu năng đồ họa.',
      descEn: 'Engineered high-performance web applications, interactive canvas shaders, and fluid responsive UI design systems.'
    }
  ];

  return (
    <section id="about-me" className="py-24 relative overflow-hidden bg-[#060609] border-t border-white/[0.06]">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT THE ARTIST & DEVELOPER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              {lang === 'vi' ? 'Về Bản Thân Tôi' : 'About Me'}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>{lang === 'vi' ? PERSONAL_INFO.locationVi : PERSONAL_INFO.location}</span>
          </div>
        </div>

        {/* Top Profile Hero & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Portrait / Monogram Artistic Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden glass-card border border-white/10 p-3 shadow-2xl">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-[#0d0d15] flex flex-col justify-between p-8">
                {/* Decorative grid & geometry lines */}
                <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-purple-600/30 via-rose-500/20 to-cyan-500/30 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-display text-2xl font-black text-white tracking-wider">
                    ENRIAH
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase px-3 py-1 rounded-full glass-panel border border-white/10">
                    POLY-CREATIVE
                  </span>
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400">
                    {lang === 'vi' ? '3 NGÀNH SÁNG TẠO' : 'TRI-DISCIPLINARY'}
                  </div>
                  <h3 className="text-3xl font-display font-black text-white">
                    {lang === 'vi' ? PERSONAL_INFO.nameVi : PERSONAL_INFO.name}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    {lang === 'vi' ? PERSONAL_INFO.taglineVi : PERSONAL_INFO.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Craft Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {lang === 'vi' 
                  ? 'Giao thoa giữa điêu khắc không gian, thẩm mỹ thị giác và tư duy thuật toán.' 
                  : 'Bridging spatial dimension, visual aesthetics, and algorithmic precision.'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                {lang === 'vi' ? PERSONAL_INFO.bio.vi : PERSONAL_INFO.bio.en}
              </p>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                {lang === 'vi'
                  ? 'Mục tiêu lớn nhất trong từng tác phẩm của tôi là không bao giờ thỏa hiệp: mỗi dự án vừa phải đạt chuẩn mực cao nhất về mặt nghệ thuật thị giác, vừa sở hữu nền tảng kiến trúc kỹ thuật tối ưu và mượt mà trên nền tảng web.'
                  : 'My primary goal across all works is uncompromising quality: every piece must achieve the highest standard of visual artistry while maintaining optimal technical execution and fluid interactive performance.'}
              </p>
            </div>

            {/* Core Values / 3 Disciplines Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 space-y-2">
                <Palette className="w-5 h-5 text-purple-400" />
                <div className="text-xs font-bold text-white font-mono">3D ART & CGI</div>
                <div className="text-[11px] text-zinc-400 font-light">
                  {lang === 'vi' ? 'Không gian, vật liệu & ánh sáng' : 'Spatial, shaders & lighting'}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-rose-500/20 space-y-2">
                <Layers className="w-5 h-5 text-rose-400" />
                <div className="text-xs font-bold text-white font-mono">2D DESIGN</div>
                <div className="text-[11px] text-zinc-400 font-light">
                  {lang === 'vi' ? 'Typography, bố cục & thương hiệu' : 'Typography, grid & identity'}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <div className="text-xs font-bold text-white font-mono">DEVELOPER</div>
                <div className="text-[11px] text-zinc-400 font-light">
                  {lang === 'vi' ? 'Three.js, WebGL & React 19' : 'Three.js, WebGL & React 19'}
                </div>
              </div>
            </div>

            {/* Direct Email Link */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 text-xs font-mono font-bold hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
              >
                <Mail className="w-4 h-4" />
                <span>{PERSONAL_INFO.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Creative Journey / Timeline */}
        <div className="pt-8 space-y-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
            <Award className="w-4 h-4 text-purple-400" />
            <span>{lang === 'vi' ? 'HÀNH TRÌNH SÁNG TẠO & KINH NGHIỆM' : 'CREATIVE JOURNEY & EXPERIENCE'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {journeys.map((j, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl glass-card border border-white/10 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30">
                    {j.period}
                  </span>
                  <h4 className="text-lg font-bold text-white font-display">
                    {lang === 'vi' ? j.roleVi : j.roleEn}
                  </h4>
                  <div className="text-xs font-mono text-zinc-400">
                    {lang === 'vi' ? j.placeVi : j.placeEn}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed pt-2 border-t border-white/5">
                    {lang === 'vi' ? j.descVi : j.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            {lang === 'vi' ? 'Theo dõi & Kết nối:' : 'Follow & Connect:'}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {PERSONAL_INFO.socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel border border-white/5 hover:border-purple-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
              >
                <span>{s.name}</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-purple-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
