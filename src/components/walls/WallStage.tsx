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
    <div className="wall-stage-root" data-testid="wall-stage">
      {/* Stage Header Row: Curatorial Brand Context & Segmented Tab Navigation */}
      <div className="wall-stage-header bg-canvas py-3">
        <div className="page-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                <span className="label-caps-wide text-champagne">Atelier Curated Walls</span>
              </div>
              <div className="h6 text-oxblood mb-0 font-serif" style={{ letterSpacing: '0.04em' }}>
                EverThread Curatorial Repertoire
              </div>
            </div>

            <div 
              className="wall-tabs-container"
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
                <span 
                  data-testid="tab-contemporary" 
                  aria-selected={activeTab === 'contemporary'} 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Contemporary Collection</span>
                  <span className="wall-tab-badge">(7)</span>
                </span>
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
                <span 
                  data-testid="tab-living-inheritance" 
                  aria-selected={activeTab === 'living-inheritance'} 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>The Living Inheritance</span>
                  <span className="wall-tab-badge">(7)</span>
                </span>
              </button>
            </div>
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
          {/* Visual Continuity Thread Layer (Positioned firmly along bottom plinth line) */}
          <WallThread 
            progress={scrollProgress} 
            isSettled={isSettled} 
            isReducedMotion={isReducedMotion} 
          />

          {/* Panel 1: Contemporary Collection (Atelier Aesthetic) */}
          <section
            ref={panelContemporaryRef}
            className={`wall-stage-panel wall-stage-panel--contemporary ${activeTab === 'contemporary' ? 'is-active' : ''}`}
            aria-label={activeTab === 'contemporary' ? 'Contemporary Collection Stage Banner' : 'Switch to Contemporary Collection'}
            data-testid="wall-slide-contemporary"
            onClick={() => {
              if (activeTab !== 'contemporary') {
                handleTabClick('contemporary');
              }
            }}
            role={activeTab !== 'contemporary' ? 'button' : undefined}
            tabIndex={activeTab !== 'contemporary' ? 0 : undefined}
            onKeyDown={activeTab !== 'contemporary' ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick('contemporary');
              }
            } : undefined}
          >
            <div className="wall-panel-inner p-4 p-md-5">
              <div className="row g-4 align-items-center flex-grow-1">
                {/* Left Column: Typographic Hierarchy & Intentional Curatorial Details */}
                <div className="col-12 col-lg-6 col-xl-5">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ width: 14, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                    <span className="label-caps text-champagne">Atelier Repertoire · Volume 01</span>
                  </div>

                  <h2 className="headline-lg text-oxblood mb-2" data-testid="wall-title-contemporary">
                    Contemporary Collection
                  </h2>

                  <p className="body-md text-muted-editorial mb-3" style={{ maxWidth: 480, lineHeight: 1.6 }}>
                    Architectural tailoring crafted from hand-loomed natural fibers. Seven permanent silhouettes numbered and registered in the House Ledger.
                  </p>

                  <div className="wall-curatorial-badges">
                    <span className="wall-badge-pill">07 Heirlooms</span>
                    <span className="wall-badge-pill wall-badge-pill--stone">Pure Botanical Fibers</span>
                    <span className="wall-badge-pill wall-badge-pill--stone">Zero-Waste Draping</span>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-1">
                    <a 
                      href="#wall-products" 
                      className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
                      data-testid="browse-contemporary-btn"
                      tabIndex={activeTab === 'contemporary' ? 0 : -1}
                      onClick={(e) => {
                        if (activeTab !== 'contemporary') {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span>Browse the collection</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Right Column: Layered Atelier Showcase Plinths */}
                <div className="col-12 col-lg-6 col-xl-7">
                  <div className="wall-atelier-showcase">
                    {/* Background Architectural Plate */}
                    <div className="wall-plate-backframe">
                      <img 
                        src="/images/home/contemporary-collection-plate.webp"
                        srcSet="/images/home/contemporary-collection-plate-800w.webp 800w, /images/home/contemporary-collection-plate-1280w.webp 1280w"
                        sizes="(max-width: 1200px) 280px, 320px"
                        alt="Contemporary Atelier sculptural fabric drape"
                        loading="lazy"
                      />
                    </div>

                    {/* Foreground Flagship Silhouettes Plinth */}
                    {et01Asset && (
                      <div className="wall-plinth-foreground">
                        <img 
                          src={et01Asset.src}
                          srcSet={et01Asset.srcSet}
                          alt="ET-01 Sculptural Mantle Coat in atelier natural light"
                          loading="lazy"
                        />
                        <div className="wall-plinth-caption">
                          ET-01 · Mantle Coat
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edge Navigation Cue to Wing 2 */}
              <div className="wall-edge-cue">
                <span className="body-xs text-muted-editorial font-serif">
                  Gallery Wing 01 of 02
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClick('living-inheritance');
                  }}
                  data-testid="cue-to-living-inheritance"
                  aria-label="Navigate to The Living Inheritance wall"
                  tabIndex={activeTab === 'contemporary' ? 0 : -1}
                >
                  <span>The Living Inheritance</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Panel 2: The Living Inheritance (Museum Archive Aesthetic) */}
          <section
            ref={panelLivingRef}
            className={`wall-stage-panel wall-stage-panel--living ${activeTab === 'living-inheritance' ? 'is-active' : ''}`}
            aria-label={activeTab === 'living-inheritance' ? 'The Living Inheritance Stage Banner' : 'Switch to The Living Inheritance collection'}
            data-testid="wall-slide-living-inheritance"
            onClick={() => {
              if (activeTab !== 'living-inheritance') {
                handleTabClick('living-inheritance');
              }
            }}
            role={activeTab !== 'living-inheritance' ? 'button' : undefined}
            tabIndex={activeTab !== 'living-inheritance' ? 0 : undefined}
            onKeyDown={activeTab !== 'living-inheritance' ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick('living-inheritance');
              }
            } : undefined}
          >
            <div className="wall-panel-inner p-4 p-md-5">
              <div className="row g-4 align-items-center flex-grow-1">
                {/* Left Column: Exhibition Meta & Archival Narrative */}
                <div className="col-12 col-lg-6 col-xl-5">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ width: 14, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                    <span className="label-caps text-champagne">Heritage Concept Archive · Volume 02</span>
                  </div>

                  <h2 className="headline-lg text-oxblood mb-2" data-testid="wall-title-living">
                    The Living Inheritance
                  </h2>

                  <p className="body-md text-muted-editorial mb-3" style={{ maxWidth: 480, lineHeight: 1.6 }}>
                    Exploratory atelier concept studies inspired by classical subcontinental textile arts—translating ancient korvai geometries and kadwa brocades into modern drape.
                  </p>

                  <div className="wall-curatorial-badges">
                    <span className="wall-badge-pill">Curatorial Reserve</span>
                    <span className="wall-badge-pill wall-badge-pill--stone">Protocol O-6 Integrity</span>
                    <span className="wall-badge-pill wall-badge-pill--stone">Private Consultation</span>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-1">
                    <a 
                      href="#wall-products" 
                      className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
                      data-testid="browse-living-btn"
                      tabIndex={activeTab === 'living-inheritance' ? 0 : -1}
                      onClick={(e) => {
                        if (activeTab !== 'living-inheritance') {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span>Browse the collection</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Right Column: Museum Vitrine Showcase & Elevated Inquiry Card */}
                <div className="col-12 col-lg-6 col-xl-7">
                  <div className="wall-museum-showcase">
                    {/* Primary Atmospheric Exhibition Plate */}
                    <div className="wall-museum-vitrine">
                      <img 
                        src="/images/home/living-inheritance-campaign-r1.webp"
                        srcSet="/images/home/living-inheritance-campaign-r1-800w.webp 800w, /images/home/living-inheritance-campaign-r1-1280w.webp 1280w"
                        sizes="(max-width: 1200px) 280px, 320px"
                        alt="Atelier loom and textile craft atmospheric plate"
                        loading="lazy"
                      />
                    </div>

                    {/* Elevated Curatorial Inquiry Card */}
                    <div className="wall-inquiry-elevation-card">
                      <div className="wall-inquiry-seal">
                        <span>◇</span>
                        <span>Acquisition Protocol</span>
                      </div>
                      <p className="wall-inquiry-quote">
                        “Prototypes in The Living Inheritance are held in curatorial documentation reserve. Bespoke viewings arranged via consultation.”
                      </p>
                      <a
                        href="#wall-products"
                        className="wall-inquiry-action"
                        tabIndex={activeTab === 'living-inheritance' ? 0 : -1}
                        onClick={(e) => {
                          if (activeTab !== 'living-inheritance') {
                            e.preventDefault();
                          }
                        }}
                      >
                        <span>View Curatorial Dossier</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </a>
                    </div>

                    {/* Micro Craft Detail Callout */}
                    <div className="wall-detail-micro-accent">
                      <img 
                        src="/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail-400w.webp"
                        alt="Kadwa zari gold needlework close-up"
                        loading="lazy"
                      />
                      <span>Kadwa Zari Lineage</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edge Navigation Cue back to Wing 1 */}
              <div className="wall-edge-cue">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClick('contemporary');
                  }}
                  data-testid="cue-to-contemporary"
                  aria-label="Return to Contemporary Collection wall"
                  tabIndex={activeTab === 'living-inheritance' ? 0 : -1}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Contemporary Collection</span>
                </button>
                <span className="body-xs text-muted-editorial font-serif">
                  Gallery Wing 02 of 02
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
