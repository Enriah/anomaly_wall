import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { LogoIntro } from './components/LogoIntro';

const INTRO_SESSION_KEY = 'anw_intro_shown';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [selectedSlideArtwork, setSelectedSlideArtwork] = useState<{
    projectId: string;
    artworkIndex: number;
    albumId?: string;
    artworkId?: string;
    timestamp: number;
  } | null>(null);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // ignore storage errors
    }
    setShowIntro(false);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setShowIntro(true);
  }, []);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'vi' ? 'en' : 'vi'));
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleSelectArtworkFromSlider = (
    projectId: string,
    artworkIndex: number,
    albumId?: string,
    artworkId?: string
  ) => {
    setSelectedSlideArtwork({
      projectId,
      artworkIndex,
      albumId,
      artworkId,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 relative selection:bg-purple-600 selection:text-white flex flex-col justify-between">
      {/* Opening SVG Logo Intro Animation */}
      {showIntro && (
        <LogoIntro
          lang={lang}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Floating Navigation Header */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        isIntroActive={showIntro}
        onReplayIntro={handleReplayIntro}
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
