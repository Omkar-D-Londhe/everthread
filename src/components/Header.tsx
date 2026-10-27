import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useSaved } from '../context/SavedContext.tsx';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { bagCount } = useCart();
  const { savedCount } = useSaved();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Header scroll appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header 
        className="atelier-header" 
        role="banner"
        style={{
          backgroundColor: isScrolled ? 'rgba(254, 249, 240, 0.98)' : 'rgba(254, 249, 240, 0.94)',
          boxShadow: isScrolled ? '0 2px 16px rgba(48, 35, 31, 0.06)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <div className="header-inner">
          <div className="d-flex align-items-center gap-1 gap-sm-3">
            {/* Mobile Hamburger Button */}
            <button
              className="d-lg-none action-icon-btn p-1 me-0 me-sm-2"
              type="button" 
              aria-label="Open Navigation Menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Brand Mark with Signature Thread Monogram */}
            <Link to="/" className="brand-mark" aria-label="EverThread Atelier Home">
              <div className="brand-title">
                <span>Ever</span>
                <span className="brand-t-wrap">
                  <span className="position-relative z-1">T</span>
                  <svg aria-hidden="true" className="header-thread-svg" viewBox="0 0 24 28" fill="none">
                    <defs>
                      <linearGradient id="headerThreadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dfc396" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="#B49A70" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#B49A70" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M-4 17 C2 17, 6 3, 12 3 C18 3, 17 14, 11 18 C7 21, 5 27, 13 26 C18 25, 23 20, 28 12 C33 5, 42 16, 52 14" 
                      stroke="url(#headerThreadGlow)" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                  </svg>
                </span>
                <span>hread</span>
              </div>
              <span className="brand-badge d-none d-sm-inline">Atelier</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center" role="navigation" aria-label="Primary Navigation">
            <NavLink 
              to="/collections" 
              className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}
            >
              Collections
            </NavLink>
            <NavLink 
              to="/compass" 
              className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}
            >
              Thread Compass
            </NavLink>
            <NavLink 
              to="/archive" 
              className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}
            >
              Cultural Archive
            </NavLink>
            <NavLink 
              to="/the-house" 
              className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}
            >
              The House
            </NavLink>
            <NavLink 
              to="/journal" 
              className={({ isActive }) => `nav-link-editorial ${isActive ? 'active' : ''}`}
            >
              Journal
            </NavLink>
          </nav>

          {/* Header Action Controls */}
          <div className="d-flex align-items-center gap-1 gap-sm-3 flex-shrink-0 header-actions">
            <button
              className="action-icon-btn d-inline-flex align-items-center gap-1"
              type="button" 
              aria-label="Search Collection (/)"
              title="Search Collection (/)"
              onClick={onOpenSearch}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <kbd className="editorial-kbd d-none d-lg-inline-flex" style={{ fontSize: '0.625rem' }}>/</kbd>
            </button>

            <Link 
              to="/saved" 
              className="action-icon-btn position-relative" 
              aria-label={`View Saved Pieces (${savedCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              {savedCount > 0 && (
                <span className="badge-count badge-sand js-saved-count">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link 
              to="/bag" 
              className="action-icon-btn position-relative" 
              aria-label={`View Bespoke Shopping Bag (${bagCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {bagCount > 0 && (
                <span className="badge-count badge-oxblood js-bag-count">
                  {bagCount}
                </span>
              )}
            </Link>

            <div className="ps-2 ms-1 border-start border-hairline d-none d-sm-flex align-items-center">
              <span className="label-caps-wide text-champagne" style={{ fontSize: '0.625rem' }}>
                Atelier Salon
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Drawer */}
      {mobileMenuOpen && (
        <div 
          className="offcanvas-backdrop fade show" 
          onClick={() => setMobileMenuOpen(false)}
          style={{ zIndex: 1040 }}
        />
      )}
      <div 
        className={`offcanvas offcanvas-start bg-canvas ${mobileMenuOpen ? 'show' : ''}`} 
        tabIndex={-1} 
        style={{ 
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          zIndex: 1045,
          transition: 'transform 0.3s ease-in-out'
        }}
        aria-modal="true"
        role="dialog"
      >
        <div className="offcanvas-header bg-cream border-hairline-b p-3">
          <div className="brand-title">
            <span>Ever</span>
            <span className="text-champagne">T</span>
            <span>hread</span>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between p-4">
          <div className="d-flex flex-column gap-3">
            <span className="label-caps-wide text-champagne">Main Atelier Navigation</span>
            <NavLink to="/" className="nav-link-editorial fs-6 py-2 border-hairline-b">Home</NavLink>
            <NavLink to="/collections" className="nav-link-editorial fs-6 py-2 border-hairline-b">Collections</NavLink>
            <NavLink to="/compass" className="nav-link-editorial fs-6 py-2 border-hairline-b">Thread Compass</NavLink>
            <NavLink to="/archive" className="nav-link-editorial fs-6 py-2 border-hairline-b">Cultural Archive</NavLink>
            <NavLink to="/the-house" className="nav-link-editorial fs-6 py-2 border-hairline-b">The House</NavLink>
            <NavLink to="/journal" className="nav-link-editorial fs-6 py-2 border-hairline-b">Journal</NavLink>
            <NavLink to="/saved" className="nav-link-editorial fs-6 py-2 border-hairline-b">Saved Pieces ({savedCount})</NavLink>
            <NavLink to="/bag" className="nav-link-editorial fs-6 py-2 border-hairline-b">Shopping Bag ({bagCount})</NavLink>
          </div>
          <div className="pt-4 border-hairline-t">
            <p className="label-editorial text-muted-editorial mb-1">“An heirloom, not a trend.”</p>
            <span className="label-caps text-outline">Paris • Milan • Kyoto • New Delhi</span>
          </div>
        </div>
      </div>
    </>
  );
};
