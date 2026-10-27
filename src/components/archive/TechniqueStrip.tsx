import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DIAGRAM_ASSETS, TECHNIQUE_STRIP_DIAGRAM_IDS, DiagramAsset } from '../../data/assetMap.ts';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      }) as unknown as MediaQueryList;
  }
  gsap.registerPlugin(ScrollTrigger);
}

interface TechniqueStripProps {
  activeDiagramId?: string;
  onSelectDiagram?: (id: string) => void;
}

export const TechniqueStrip: React.FC<TechniqueStripProps> = ({
  activeDiagramId,
  onSelectDiagram
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  const prefersReduced = usePrefersReducedMotion();

  // Track image error states per diagram: 'none' -> 'svg-failed' (fallback to PNG) -> 'all-failed' (fallback to title text)
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, 'svg-failed' | 'all-failed'>>({});

  // Continuous movement states
  const [isUserPaused, setIsUserPaused] = useState<boolean>(() => prefersReduced);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (prefersReduced) {
      setIsUserPaused(true);
    }
  }, [prefersReduced]);

  const isPaused = isUserPaused;
  const isActivelyMoving = !isPaused && !isHovered && !isFocused && !isDragging;

  // Ensure track transform is clear and outer section stays completely stationary (Bug 4 Fix)
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = '';
    }
  }, []);

  // Continuous linear animation loop on inner track using high-precision accumulator
  useEffect(() => {
    if (!isActivelyMoving) return;
    const track = trackRef.current;
    if (!track) return;

    // Synchronize high-precision accumulator with current DOM scroll position
    scrollPosRef.current = track.scrollLeft;

    let rafId: number;
    let lastTime = performance.now();
    const speed = 45; // 45 pixels per second linear continuous glide

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (track) {
        const singleLoopWidth = track.scrollWidth / 2;
        scrollPosRef.current += speed * dt;
        if (singleLoopWidth > 0 && scrollPosRef.current >= singleLoopWidth) {
          scrollPosRef.current -= singleLoopWidth;
        }
        track.scrollLeft = scrollPosRef.current;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isActivelyMoving]);

  const handlePrevCard = () => {
    const track = trackRef.current;
    if (!track) return;
    const cardStep = 260; // 240px card + 20px gap
    const singleLoopWidth = track.scrollWidth / 2;
    if (track.scrollLeft <= 10) {
      const target = singleLoopWidth > 0 ? singleLoopWidth - cardStep : track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: Math.max(0, target), behavior: prefersReduced ? 'auto' : 'smooth' });
      return;
    }
    track.scrollBy({ left: -cardStep, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const handleNextCard = () => {
    const track = trackRef.current;
    if (!track) return;
    const cardStep = 260;
    const singleLoopWidth = track.scrollWidth / 2;
    if (singleLoopWidth > 0 && track.scrollLeft >= singleLoopWidth - 10) {
      track.scrollLeft -= singleLoopWidth;
    }
    track.scrollBy({ left: cardStep, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Isolate horizontal trackpad/wheel gestures to the inner track to prevent browser back/forward history navigation
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.stopPropagation();
    }
  };

  const handleImageError = (id: string) => {
    setImageErrorMap(prev => {
      const current = prev[id];
      if (!current) {
        return { ...prev, [id]: 'svg-failed' };
      }
      return { ...prev, [id]: 'all-failed' };
    });
  };

  const diagrams: DiagramAsset[] = TECHNIQUE_STRIP_DIAGRAM_IDS
    .map(id => DIAGRAM_ASSETS[id])
    .filter(Boolean);

  return (
    <section
      ref={sectionRef}
      className="py-5 bg-stone border-hairline-b technique-strip-section"
      data-testid="technique-strip"
      aria-label="Archival Technique Drafting Strip"
    >
      <div className="page-container">
        {/* Header Metadata & Stepping Controls */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-hairline-b">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
              <span className="label-caps text-champagne">Drafting Schematics &amp; Taxonomy</span>
            </div>
            <h2 className="headline-md text-oxblood mb-0">Technique Strip</h2>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="body-sm text-muted-editorial d-none d-md-inline">
              9 Archival Schematics • Scroll horizontally to examine
            </span>

            {/* Stepping controls with smooth looping */}
            <div className="d-flex align-items-center gap-1" role="group" aria-label="Technique Strip navigation">
              <button
                type="button"
                className="btn-icon-editorial"
                onClick={() => setIsUserPaused(prev => !prev)}
                aria-label={isUserPaused ? "Resume continuous movement" : "Pause continuous movement"}
                aria-pressed={isUserPaused}
                title={isUserPaused ? "Resume movement" : "Pause movement"}
                data-testid="technique-strip-pause-btn"
              >
                {isUserPaused ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                )}
              </button>
              <button
                type="button"
                className="btn-icon-editorial"
                onClick={handlePrevCard}
                aria-label="Previous technique diagram"
                title="Previous diagram"
                data-testid="technique-strip-prev-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                className="btn-icon-editorial"
                onClick={handleNextCard}
                aria-label="Next technique diagram"
                title="Next diagram"
                data-testid="technique-strip-next-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontally scrollable snap strip */}
        <div
          ref={trackRef}
          className={`technique-strip-track ${isActivelyMoving ? 'is-animating' : ''}`}
          data-testid="technique-strip-track"
          role="region"
          aria-label="Horizontal scrollable technique diagrams strip"
          onWheel={handleWheel}
          onScroll={() => {
            if (trackRef.current && !isActivelyMoving) {
              scrollPosRef.current = trackRef.current.scrollLeft;
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            if (document.activeElement && trackRef.current?.contains(document.activeElement)) {
              (document.activeElement as HTMLElement).blur();
              setIsFocused(false);
            }
          }}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
        >
          {diagrams.map((diag, index) => {
            const errState = imageErrorMap[diag.id];
            const isActive = activeDiagramId === diag.id;

            return (
              <Link
                key={diag.id}
                to={`/archive?diagram=${diag.id}`}
                onClick={() => {
                  if (onSelectDiagram) {
                    onSelectDiagram(diag.id);
                  }
                  (document.activeElement as HTMLElement)?.blur();
                  setIsFocused(false);
                }}
                onFocus={(e) => {
                  setIsFocused(true);
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                  });
                }}
                onBlur={(e) => {
                  if (!trackRef.current?.contains(e.relatedTarget as Node)) {
                    setIsFocused(false);
                  }
                }}
                className={`technique-strip-card ${isActive ? 'is-active' : ''}`}
                data-testid={`technique-strip-item-${diag.id}`}
                data-diagram-id={diag.id}
                aria-label={`Diagram 0${index + 1}: ${diag.title}`}
              >
                {/* Visual Thumbnail Frame */}
                <div className="technique-strip-thumb-wrap">
                  {errState === 'all-failed' ? (
                    <div
                      className="technique-strip-fallback-text"
                      data-testid={`technique-strip-fallback-${diag.id}`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="text-muted-editorial mb-1"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span className="body-xs text-oxblood fw-medium text-center px-2">
                        {diag.title}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={errState === 'svg-failed' ? diag.fallbackPng : diag.svg}
                      alt={diag.title}
                      className="technique-strip-img"
                      loading="lazy"
                      data-testid={`technique-strip-img-${diag.id}`}
                      onError={() => handleImageError(diag.id)}
                    />
                  )}
                  <span className="technique-strip-index-badge">
                    0{index + 1}
                  </span>
                </div>

                {/* Visible Title & Instruction */}
                <div className="technique-strip-meta">
                  <h3
                    className="technique-strip-title text-oxblood"
                    data-testid={`technique-strip-title-${diag.id}`}
                  >
                    {diag.title}
                  </h3>
                  <span className="technique-strip-cta text-muted-editorial body-xs">
                    Examine schematic →
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Seamless continuous loop duplicate set (inert and hidden from assistive technologies) */}
          {diagrams.map((diag, index) => {
            const errState = imageErrorMap[diag.id];
            return (
              <div
                key={`clone-${diag.id}`}
                className="technique-strip-card technique-strip-card--clone"
                data-testid={`technique-strip-clone-item-${diag.id}`}
                aria-hidden="true"
                tabIndex={-1}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                <div className="technique-strip-thumb-wrap" aria-hidden="true" tabIndex={-1}>
                  {errState === 'all-failed' ? (
                    <div className="technique-strip-fallback-text" aria-hidden="true" tabIndex={-1}>
                      <span className="body-xs text-oxblood fw-medium text-center px-2">
                        {diag.title}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={errState === 'svg-failed' ? diag.fallbackPng : diag.svg}
                      alt=""
                      className="technique-strip-img"
                      loading="lazy"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  )}
                  <span className="technique-strip-index-badge" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <div className="technique-strip-meta" aria-hidden="true" tabIndex={-1}>
                  <h3 className="technique-strip-title text-oxblood" aria-hidden="true">
                    {diag.title}
                  </h3>
                  <span className="technique-strip-cta text-muted-editorial body-xs" aria-hidden="true">
                    Examine schematic →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
