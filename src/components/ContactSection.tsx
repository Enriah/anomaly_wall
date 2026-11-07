import React, { useState } from 'react';
import { Copy, Check, Send, Sparkles, Box, Layers, Code, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactSectionProps {
  lang: 'vi' | 'en';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const [selectedService, setSelectedService] = useState<string>('3d');
  const [budget, setBudget] = useState<string>('$3k - $5k');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Trigger celebratory artistic confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#f43f5e', '#06b6d4', '#eab308']
    });

    setSubmitted(true);
  };

  const services = [
    { id: '3d', labelEn: '3D Art & CGI Direction', labelVi: 'Thiết kế 3D & CGI', icon: <Box className="w-4 h-4" /> },
    { id: '2d', labelEn: 'Brand & Visual Systems', labelVi: 'Nhận diện & Đồ họa 2D', icon: <Layers className="w-4 h-4" /> },
    { id: 'dev', labelEn: 'Creative Web & WebGL', labelVi: 'Lập trình Web & WebGL', icon: <Code className="w-4 h-4" /> },
    { id: 'all', labelEn: 'Full-Spectrum Polymath', labelVi: 'Trọn gói Đa ngành', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const budgetOptions = [
    '< $2,000',
    '$2,000 - $5,000',
    '$5,000 - $10,000',
    '> $10,000+'
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#060609]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMISSIONS & INQUIRIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            {lang === 'vi' ? 'Bắt Đầu Dự Án Mới' : 'Initiate Collaboration'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            {lang === 'vi'
              ? 'Hãy chia sẻ về ý tưởng dự án của bạn — dù là mô hình 3D, hệ nhận diện thương hiệu hay một ứng dụng web tương tác đột phá.'
              : 'Share your vision — whether it is spatial CGI world-building, a bespoke editorial identity, or an interactive WebGL reality.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Social Hub */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Email Copy Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-4 shadow-xl">
              <span className="text-xs font-mono uppercase text-zinc-400 block tracking-wider">
                {lang === 'vi' ? 'Hộp thư trực tiếp' : 'Direct Electronic Mail'}
              </span>

              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <span className="font-mono text-xs sm:text-sm text-purple-300 truncate font-semibold">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? (lang === 'vi' ? 'Đã sao chép' : 'Copied') : (lang === 'vi' ? 'Chép' : 'Copy')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === 'vi' ? 'Phản hồi trong vòng 24 - 48 giờ' : 'Standard response time: < 24-48 hrs'}</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
                {lang === 'vi' ? 'Kênh Chuyên Môn & Mạng Xã Hội' : 'Professional Presences'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PERSONAL_INFO.socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl glass-panel border border-white/5 hover:border-purple-500/30 text-xs font-mono text-zinc-300 hover:text-white transition-all group"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Studio Location & Timezone */}
            <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-1 font-mono text-xs text-zinc-400">
              <div className="text-white font-semibold">{lang === 'vi' ? PERSONAL_INFO.locationVi : PERSONAL_INFO.location}</div>
              <div>UTC+7 (Indochina Time) · Worldwide Remote Studio</div>
            </div>

          </div>

          {/* Right Column: Commission Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl glass-card border border-white/10 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {lang === 'vi' ? 'Thông Điệp Đã Được Gửi Thành Công!' : 'Transmission Received!'}
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto font-light">
                    {lang === 'vi'
                      ? 'Cảm ơn bạn đã liên hệ. Tôi sẽ xem xét yêu cầu và phản hồi sớm nhất qua email.'
                      : 'Thank you for reaching out. I will review your project brief and get back to you shortly.'}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full glass-panel border border-white/20 text-xs font-mono text-white hover:bg-white/10 transition-colors"
                  >
                    {lang === 'vi' ? 'Gửi một yêu cầu khác' : 'Send another inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Discipline / Service Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block">
                      {lang === 'vi' ? '01. Lĩnh vực bạn cần hợp tác:' : '01. Select Craft Discipline:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {services.map(svc => (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => setSelectedService(svc.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-mono transition-all text-left ${
                            selectedService === svc.id
                              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30 border-purple-500'
                              : 'glass-panel text-zinc-400 hover:text-white border-white/5'
                          } border`}
                        >
                          {svc.icon}
                          <span>{lang === 'vi' ? svc.labelVi : svc.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block">
                      {lang === 'vi' ? '02. Mức ngân sách dự kiến:' : '02. Projected Budget Tier:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setBudget(opt)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono transition-all ${
                            budget === opt
                              ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/20'
                              : 'glass-panel text-zinc-400 hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400">
                        {lang === 'vi' ? 'Họ và tên *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#101018] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400">
                        {lang === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#101018] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">
                      {lang === 'vi' ? 'Mô tả dự án & Yêu cầu *' : 'Project Vision & Timeline *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={lang === 'vi' ? 'Hãy mô tả ngắn gọn về sản phẩm, kỳ vọng và mốc thời gian...' : 'Briefly describe your objectives, deliverables, and target milestone...'}
                      className="w-full bg-[#101018] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-90 text-white font-mono text-sm font-semibold transition-all shadow-xl shadow-purple-600/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Gửi Yêu Cầu Hợp Tác' : 'Dispatch Commission Inquiry'}</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
