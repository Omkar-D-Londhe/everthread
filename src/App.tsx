import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { ThreadLoader } from './components/ThreadLoader.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { CollectionWallsLayout } from './pages/collections/CollectionWallsLayout.tsx';
import { ContemporaryWall } from './pages/collections/ContemporaryWall.tsx';
import { LivingInheritanceWall } from './pages/collections/LivingInheritanceWall.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CompassPage } from './pages/CompassPage.tsx';
import { ArchivePage } from './pages/ArchivePage.tsx';
import { ArchiveStoryPage } from './pages/ArchiveStoryPage.tsx';
import { HousePage } from './pages/HousePage.tsx';
import { JournalPage } from './pages/JournalPage.tsx';
import { JournalArticlePage } from './pages/JournalArticlePage.tsx';
import { SavedPiecesPage } from './pages/SavedPiecesPage.tsx';
import { BagPage } from './pages/BagPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  // Initial loading reveal
  useEffect(() => {
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, isTest ? 0 : 750);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Global '/' keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' && 
        !searchOpen && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="atelier-app-root d-flex flex-column min-vh-100 bg-canvas">
      {/* EverThread Custom Minimal Loading Animation */}
      <ThreadLoader 
        variant="fullscreen" 
        isLoading={initialLoading} 
        message="An heirloom, not a trend." 
      />

      <Header onOpenSearch={() => setSearchOpen(true)} />
      
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionWallsLayout />}>
            <Route index element={<ContemporaryWall />} />
            <Route path="the-living-inheritance" element={<LivingInheritanceWall />} />
          </Route>
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/compass" element={<CompassPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/archive/:storySlug" element={<ArchiveStoryPage />} />
          <Route path="/the-house" element={<HousePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:articleSlug" element={<JournalArticlePage />} />
          <Route path="/saved" element={<SavedPiecesPage />} />
          <Route path="/bag" element={<BagPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />

      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </div>
  );
};
