import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WallThread } from './WallThread.tsx';
import { PRODUCT_ASSET_MAP } from '../../data/assetMap.ts';

// Decision O-13 & Stage 05 Nudge Policy:
// Single 6% scroll nudge once per session behind feature flag (owner approval pending).
export const WALL_NUDGE_ENABLED = false;

export type WallTabId = 'contemporary' | 'living-inheritance';

interface WallStageProps {
  activeTab: WallTabId;
}

export const WallStage: React.FC<WallStageProps> = ({ activeTab }) => {
  const navigate = useNavigate();

  const trackRef = useRef<HTMLDivElement>(null);
  const panelContemporaryRef = useRef<HTMLDivElement>(null);
  const panelLivingRef = useRef<HTMLDivElement>(null);
  const tabContemporaryRef = useRef<HTMLButtonElement>(null);
  const tabLivingRef = useRef<HTMLButtonElement>(null);

  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const programmaticTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(activeTab === 'living-inheritance' ? 1 : 0);
  const [isSettled, setIsSettled] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Compute scroll offset for target wall
  const getTargetScrollLeft = useCallback((targetTab: WallTabId): number => {
    if (!trackRef.current) return 0;
    if (targetTab === 'contemporary') return 0;
    const livingPanel = panelLivingRef.current;
    if (livingPanel) {
      return livingPanel.offsetLeft;
    }
    return trackRef.current.clientWidth * 0.88;
  }, []);

  // Instant scroll on initial mount matching current route
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const targetLeft = getTargetScrollLeft(activeTab);
    track.scrollLeft = targetLeft;
    setScrollProgress(activeTab === 'living-inheritance' ? 1 : 0);
  }, [getTargetScrollLeft, activeTab]);

  // Handle route change from outside (Back/Forward, URL enter)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const targetLeft = getTargetScrollLeft(activeTab);
    const currentLeft = track.scrollLeft;

    // Only scroll if difference is significant (prevents feedback loops)
    if (Math.abs(currentLeft - targetLeft) > 20) {
      isProgrammaticScrollRef.current = true;
      setIsSettled(false);

      if (programmaticTimeoutRef.current) {
        clearTimeout(programmaticTimeoutRef.current);
      }

      if (isReducedMotion) {
        track.scrollLeft = targetLeft;
        isProgrammaticScrollRef.current = false;
        setIsSettled(true);
      } else {
        track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        programmaticTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
          setIsSettled(true);
        }, 600);
      }
    }
  }, [activeTab, getTargetScrollLeft, isReducedMotion]);

  // Native scroll listener with scrollend and fallback debounce
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, track.scrollLeft / maxScroll));
        setScrollProgress(progress);
      }
      setIsSettled(false);

      // Debounce fallback (140ms after last scroll event)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        onScrollSettled();
      }, 140);
    };

    const onScrollSettled = () => {
      setIsSettled(true);

      // If this scroll was triggered programmatically by tab/route click, ignore
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        return;
      }

      // Settle detection using ratio of visible panel
      const livingPanel = panelLivingRef.current;
      if (!livingPanel) return;

      const trackScroll = track.scrollLeft;
      const midpoint = livingPanel.offsetLeft * 0.5;

      const settledTab: WallTabId = trackScroll >= midpoint ? 'living-inheritance' : 'contemporary';

      if (settledTab !== activeTab) {
        if (settledTab === 'living-inheritance') {
          navigate('/collections/the-living-inheritance');
        } else {
          navigate('/collections');
        }
      }
    };

    const handleScrollEnd = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      onScrollSettled();
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    // 'scrollend' is supported in modern browsers
    track.addEventListener('scrollend', handleScrollEnd as EventListener);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      track.removeEventListener('scrollend', handleScrollEnd as EventListener);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (programmaticTimeoutRef.current) clearTimeout(programmaticTimeoutRef.current);
    };
  }, [activeTab, navigate]);

  // Tab activation
  const handleTabClick = (targetTab: WallTabId) => {
    if (targetTab === activeTab) return;
    if (targetTab === 'living-inheritance') {
      navigate('/collections/the-living-inheritance');
    } else {
      navigate('/collections');
    }
  };

  // Keyboard navigation on tabs (ArrowLeft, ArrowRight, Home, End)
  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: WallTabId) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextTab: WallTabId = currentTab === 'contemporary' ? 'living-inheritance' : 'contemporary';
      handleTabClick(nextTab);
      if (nextTab === 'contemporary') {
        tabContemporaryRef.current?.focus();
      } else {
        tabLivingRef.current?.focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabClick('contemporary');
      tabContemporaryRef.current?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabClick('living-inheritance');
      tabLivingRef.current?.focus();
    }
  };

  const et01Asset = PRODUCT_ASSET_MAP['et-01']?.primary;

  return (
    <div className="wall-stage-root bg-canvas border-hairline-b" data-testid="wall-stage">
      <div className="page-container pt-4 pb-2">
        {/* Stage Header Row: Brand Context & Accessible Tablist */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          <div>
            <span className="label-caps-wide text-champagne d-block mb-1">
              Atelier Curated Walls
            </span>
            <span className="body-sm text-muted-editorial">
              Two architectural perspectives on contemporary luxury and heritage lineage.
            </span>
          </div>

          <div 
            className="wall-tabs-container d-inline-flex p-1 bg-stone border-hairline rounded-1"
            role="tablist"
            aria-label="Collection Walls"
            data-testid="collection-wall-tabs"
          >
            <button
              ref={tabContemporaryRef}
              id="tab-contemporary"
              role="tab"
              type="button"
              className={`wall-tab-btn ${activeTab === 'contemporary' ? 'active' : ''}`}
              aria-selected={activeTab === 'contemporary'}
              aria-controls="wall-products"
              tabIndex={activeTab === 'contemporary' ? 0 : -1}
              onClick={() => handleTabClick('contemporary')}
              onKeyDown={e => handleTabKeyDown(e, 'contemporary')}
              data-testid="wall-tab-contemporary"
            >
              <span>Contemporary Collection</span>
            </button>

            <button
              ref={tabLivingRef}
              id="tab-living-inheritance"
              role="tab"
              type="button"
              className={`wall-tab-btn ${activeTab === 'living-inheritance' ? 'active' : ''}`}
              aria-selected={activeTab === 'living-inheritance'}
              aria-controls="wall-products"
              tabIndex={activeTab === 'living-inheritance' ? 0 : -1}
              onClick={() => handleTabClick('living-inheritance')}
              onKeyDown={e => handleTabKeyDown(e, 'living-inheritance')}
              data-testid="wall-tab-living-inheritance"
            >
              <span>The Living Inheritance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Native Scrolling Stage Track with Snap Points */}
      <div 
        ref={trackRef}
        className="wall-stage-track"
        tabIndex={-1}
        data-testid="wall-stage-track"
      >
        <div className="wall-stage-panels-wrap">
          {/* Visual Continuity Thread Layer */}
          <WallThread 
            progress={scrollProgress} 
            isSettled={isSettled} 
            isReducedMotion={isReducedMotion} 
          />

          {/* Panel 1: Contemporary Collection */}
          <section
            ref={panelContemporaryRef}
            className={`wall-stage-panel wall-stage-panel--contemporary ${activeTab === 'contemporary' ? 'is-active' : ''}`}
            aria-label="Contemporary Collection Stage Banner"
            data-testid="wall-slide-contemporary"
          >
            <div className="wall-panel-inner p-4 p-md-5 d-flex flex-column justify-content-between h-100">
              <div className="row g-4 align-items-center h-100">
                <div className="col-12 col-md-7">
                  <span className="label-caps text-champagne d-block mb-2">Permanent Repertoire</span>
                  <h2 className="headline-lg text-oxblood mb-2" data-testid="wall-title-contemporary">
                    Contemporary Collection
                  </h2>
                  <p className="body-lg text-muted-editorial mb-4" style={{ maxWidth: 540 }}>
                    Precision tailored silhouettes crafted with hand-loomed natural fibers.
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <a 
                      href="#wall-products" 
                      className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
                      data-testid="browse-contemporary-btn"
                    >
                      <span>Browse the collection</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="col-12 col-md-5 d-none d-md-block text-end">
                  {et01Asset ? (
                    <div className="wall-hero-crop border-hairline overflow-hidden shadow-sm d-inline-block">
                      <img 
                        src={et01Asset.src} 
                        srcSet={et01Asset.srcSet} 
                        alt="Contemporary tailored silhouette preview in atelier light"
                        className="wall-panel-img"
                        width={280}
                        height={380}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="wall-panel-typographic p-4 bg-stone border-hairline text-center">
                      <span className="label-caps-wide text-champagne d-block">Seven Core Silhouettes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edge Cue to Reveal Next Panel */}
              <div className="wall-edge-cue text-end pt-3">
                <button
                  type="button"
                  className="btn-link text-champagne body-sm p-0 border-0 bg-transparent"
                  onClick={() => handleTabClick('living-inheritance')}
                  data-testid="cue-to-living-inheritance"
                >
                  <span>The Living Inheritance →</span>
                </button>
              </div>
            </div>
          </section>

          {/* Panel 2: The Living Inheritance */}
          <section
            ref={panelLivingRef}
            className={`wall-stage-panel wall-stage-panel--living ${activeTab === 'living-inheritance' ? 'is-active' : ''}`}
            aria-label="The Living Inheritance Stage Banner"
            data-testid="wall-slide-living-inheritance"
          >
            <div className="wall-panel-inner p-4 p-md-5 d-flex flex-column justify-content-between h-100">
              <div className="row g-4 align-items-center h-100">
                <div className="col-12 col-md-7">
                  <span className="label-caps text-champagne d-block mb-2">Heritage Concept Archive</span>
                  <h2 className="headline-lg text-oxblood mb-2" data-testid="wall-title-living">
                    The Living Inheritance
                  </h2>
                  <p className="body-lg text-muted-editorial mb-4" style={{ maxWidth: 540 }}>
                    Exploratory atelier concept pieces inspired by classical subcontinental textile arts.
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <a 
                      href="#wall-products" 
                      className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
                      data-testid="browse-living-btn"
                    >
                      <span>Browse the collection</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="col-12 col-md-5 d-none d-md-block text-end">
                  <div className="wall-panel-typographic p-4 bg-stone border-hairline text-center d-inline-block" style={{ width: 280, height: 280 }}>
                    <span className="label-caps-wide text-champagne d-block mb-3">Archival Inquiry</span>
                    <p className="body-sm text-oxblood mb-0 fst-italic">
                      “An exploratory inquiry bridging classical craft geometry with contemporary drape.”
                    </p>
                  </div>
                </div>
              </div>

              {/* Edge Cue to Return to Contemporary */}
              <div className="wall-edge-cue text-start pt-3">
                <button
                  type="button"
                  className="btn-link text-champagne body-sm p-0 border-0 bg-transparent"
                  onClick={() => handleTabClick('contemporary')}
                  data-testid="cue-to-contemporary"
                >
                  <span>← Contemporary Collection</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
