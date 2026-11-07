import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [selectedSlideArtwork, setSelectedSlideArtwork] = useState<{
    projectId: string;
    artworkIndex: number;
    timestamp: number;
  } | null>(null);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'vi' ? 'en' : 'vi'));
  };

  const handleSelectArtworkFromSlider = (projectId: string, artworkIndex: number) => {
    setSelectedSlideArtwork({
      projectId,
      artworkIndex,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 relative selection:bg-purple-600 selection:text-white flex flex-col justify-between">
      {/* Floating Navigation Header */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      <main className="flex-1 flex flex-col justify-center">
        {/* 2D Artwork Carousel / Slider Hero */}
        <Hero
          lang={lang}
          onSelectArtwork={handleSelectArtworkFromSlider}
        />

        {/* Projects Section */}
        <Projects
          lang={lang}
          externalSelection={selectedSlideArtwork}
        />
      </main>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
};

export default App;
