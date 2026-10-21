import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AtelierLensModal } from '../components/AtelierLensModal.tsx';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
import { PRODUCTS } from '../data/products.ts';
import { STORIES } from '../data/stories.ts';
import { JOURNAL_ARTICLES } from '../data/journal.ts';

// Register ScrollTrigger safely in browser environment
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

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const getPathLength = (pathEl: SVGPathElement | null, defaultLength: number): number => {
  if (pathEl && typeof pathEl.getTotalLength === 'function') {
    try {
      const len = pathEl.getTotalLength();
      if (len > 0) return len;
    } catch {
      // Fallback for mock/test environments
    }
  }
  return defaultLength;
};

export const HomePage: React.FC = () => {
  const mainContainerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const signaturePathRef = useRef<SVGPathElement>(null);
  const secondaryPathRef = useRef<SVGPathElement>(null);
  const tertiaryPathRef = useRef<SVGPathElement>(null);

  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Highlights / Story Flow refs
  const highlightsSectionRef = useRef<HTMLElement>(null);
  const highlightsThreadRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const prefersReduced = usePrefersReducedMotion();
  const [isMotionActive, setIsMotionActive] = useState<boolean>(() => !prefersReduced);

  // Sync state if OS preference changes at runtime
  useEffect(() => {
    setIsMotionActive(!prefersReduced);
  }, [prefersReduced]);

  // Synchronize document-level .motion-paused class with toggle state for global CSS animation settling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!isMotionActive) {
        document.documentElement.classList.add('motion-paused');
      } else {
        document.documentElement.classList.remove('motion-paused');
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('motion-paused');
      }
    };
  }, [isMotionActive]);

  // Atelier Lens Inspection Modal state
  const [isLensOpen, setIsLensOpen] = useState<boolean>(false);
  const lastLensTriggerRef = useRef<HTMLElement | null>(null);

  const handleOpenLens = useCallback((e: React.MouseEvent<HTMLElement>) => {
    lastLensTriggerRef.current = e.currentTarget;
    setIsLensOpen(true);
  }, []);

  const handleCloseLens = useCallback(() => {
    setIsLensOpen(false);
    lastLensTriggerRef.current?.focus();
  }, []);

  // Coordinated Hero Entrance + ScrollTrigger Story Flow Weave
  useIsomorphicLayoutEffect(() => {
    // If reduced motion is requested or user toggled motion off:
    // Settle all elements immediately without scroll-linked or timed animation
    if (!isMotionActive) {
      if (signaturePathRef.current) {
        signaturePathRef.current.style.strokeDashoffset = '0';
        signaturePathRef.current.style.strokeDasharray = 'none';
        signaturePathRef.current.style.opacity = '0.95';
        signaturePathRef.current.style.transform = 'none';
      }
      if (secondaryPathRef.current) {
        secondaryPathRef.current.style.strokeDashoffset = '0';
        secondaryPathRef.current.style.opacity = '0.65';
        secondaryPathRef.current.style.transform = 'none';
      }
      if (tertiaryPathRef.current) {
        tertiaryPathRef.current.style.opacity = '0.7';
        tertiaryPathRef.current.style.transform = 'none';
      }
      if (highlightsThreadRef.current) {
        highlightsThreadRef.current.style.strokeDashoffset = '0';
        highlightsThreadRef.current.style.strokeDasharray = 'none';
        highlightsThreadRef.current.style.opacity = '0.85';
        highlightsThreadRef.current.style.transform = 'none';
      }
      [
        kickerRef.current,
        headlineRef.current,
        subheadRef.current,
        descRef.current,
        actionsRef.current,
        metadataRef.current,
        visualRef.current
      ].forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      cardsRef.current.forEach(card => {
        if (card) {
          card.style.opacity = '1';
          card.style.transform = 'none';
        }
      });
      return;
    }

    // Standard high-performance GSAP context scoped to mainContainerRef
    const ctx = gsap.context(() => {
      const primaryLen = getPathLength(signaturePathRef.current, 1800);
      const secondaryLen = getPathLength(secondaryPathRef.current, 1200);
      const highlightsLen = getPathLength(highlightsThreadRef.current, 1250);

      // 1. Initial State: Establish clean starting hero composition
      gsap.set(signaturePathRef.current, {
        strokeDasharray: primaryLen,
        strokeDashoffset: primaryLen,
        opacity: 0.95
      });

      if (secondaryPathRef.current) {
        gsap.set(secondaryPathRef.current, {
          strokeDasharray: secondaryLen,
          strokeDashoffset: secondaryLen,
          opacity: 0.65
        });
      }

      if (tertiaryPathRef.current) {
        gsap.set(tertiaryPathRef.current, { opacity: 0 });
      }

      if (highlightsThreadRef.current) {
        gsap.set(highlightsThreadRef.current, {
          strokeDasharray: highlightsLen,
          strokeDashoffset: highlightsLen,
          opacity: 0.85
        });
      }

      gsap.set(
        [
          kickerRef.current,
          subheadRef.current,
          descRef.current,
          actionsRef.current,
          metadataRef.current
        ],
        {
          opacity: 0,
          y: 16
        }
      );

      // Editorial headline unmasking start state
      if (headlineRef.current) {
        gsap.set(headlineRef.current, {
          opacity: 0,
          y: 40
        });
      }

      gsap.set(visualRef.current, {
        opacity: 0,
        y: 20
      });

      // =========================================================================
      // A. HERO CINEMATIC CURTAIN REVEAL TIMELINE (~2.4s total)
      // Filament -> Baseline trace -> Editorial unmasking -> Plinth illumination -> Settle
      // =========================================================================
      const heroTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          // Settle complete: clear transforms for pixel-crisp subpixel text
          gsap.set(
            [
              kickerRef.current,
              headlineRef.current,
              subheadRef.current,
              descRef.current,
              actionsRef.current,
              metadataRef.current,
              visualRef.current
            ],
            {
              clearProps: 'transform'
            }
          );
          ScrollTrigger.refresh();
        }
      });

      // 1. Filament Entrance & Baseline Trace (0s - 2.4s)
      heroTl
        .to(
          signaturePathRef.current,
          {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: 'power2.inOut'
          },
          0
        )
        // Chapter Kicker enters early
        .to(
          kickerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6
          },
          0.1
        )
        // 2. Editorial Unmasking: Headline rises cleanly from the mask
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out'
          },
          0.35
        )
        // 3. Garment Plinth Illumination: Editorial visual softly resolves
        .to(
          visualRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power2.out'
          },
          0.65
        )
        // 4. Subhead, Secondary Path & Description unfold
        .to(
          subheadRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          0.75
        )
        .to(
          secondaryPathRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.out'
          },
          0.8
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          0.95
        )
        // 5. Actions & Metadata resolve into final position
        .to(
          actionsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          1.15
        )
        .to(
          metadataRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          1.35
        );

      if (tertiaryPathRef.current) {
        heroTl.to(
          tertiaryPathRef.current,
          {
            opacity: 0.7,
            duration: 1.0
          },
          1.5
        );
      }

      // =========================================================================
      // B. SCROLL-LINKED THREAD HAND-OFF: Hero to Highlights
      // =========================================================================
      if (heroRef.current && signaturePathRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
          animation: gsap.to(signaturePathRef.current, {
            y: 80,
            opacity: 0.45,
            ease: 'none'
          })
        });

        if (secondaryPathRef.current) {
          ScrollTrigger.create({
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true,
            animation: gsap.to(secondaryPathRef.current, {
              y: 110,
              opacity: 0.35,
              ease: 'none'
            })
          });
        }
      }

      // Highlights Narrative Connector Thread Weave
      if (highlightsSectionRef.current && highlightsThreadRef.current) {
        ScrollTrigger.create({
          trigger: highlightsSectionRef.current,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 0.8,
          invalidateOnRefresh: true,
          animation: gsap.to(highlightsThreadRef.current, {
            strokeDashoffset: 0,
            ease: 'none'
          })
        });
      }

      // Highlights Plinth Cards: Editorial settle on scroll entrance
      const validCards = cardsRef.current.filter((c): c is HTMLDivElement => c !== null);
      if (highlightsSectionRef.current && validCards.length > 0) {
        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: highlightsSectionRef.current,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });

        cardTimeline.fromTo(
          validCards,
          { y: 24, opacity: 0.75 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power1.out'
          }
        );
      }
    }, mainContainerRef);

    return () => {
      ctx.revert();
    };
  }, [isMotionActive]);

  const handleToggleMotion = useCallback(() => {
    setIsMotionActive(prev => !prev);
  }, []);

  const flagshipProduct = PRODUCTS[0];
  const leadStory = STORIES[0];
  const leadMonograph = JOURNAL_ARTICLES[0];

  return (
    <main id="main-content" ref={mainContainerRef} className="main-content">
      {/* =========================================================================
           CHAPTER 01: HERO — The Unfolding & Living Weave
           ========================================================================= */}
      <section
        id="hero"
        ref={heroRef}
        className="position-relative w-100 min-vh-100 d-flex align-items-center bg-canvas overflow-hidden py-5"
        style={{ minHeight: '850px' }}
      >
        {/* Signature Champagne Silk Thread SVG Canvas Layer */}
        <div
          className="position-absolute inset-0 w-100 h-100 pointer-events-none overflow-visible"
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
        >
          <svg
            aria-hidden="true"
            role="presentation"
            className="w-100 h-100 overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 1440 960"
            fill="none"
            data-testid="hero-thread-canvas"
          >
            <defs>
              <linearGradient id="organicSilkFilament" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dfc396" stopOpacity="0.95" />
                <stop offset="20%" stopColor="#B49A70" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#dfc396" stopOpacity="0.9" />
                <stop offset="75%" stopColor="#B49A70" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#B49A70" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="subtleEchoFilament" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B49A70" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#dfc396" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#B49A70" stopOpacity="0.15" />
              </linearGradient>
              <filter id="threadGlowSoft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.75" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Signature Drawing Silk Paths */}
            <path
              ref={signaturePathRef}
              id="signatureThreadPath"
              data-testid="signature-thread-path"
              className="thread-path"
              d="M 98,0 C 120,70 85,150 140,220 C 195,290 320,240 280,390 C 240,540 80,480 110,610 C 140,740 370,760 510,720 C 660,680 720,530 840,480 C 960,430 1120,510 1250,460 C 1370,410 1430,300 1480,260"
              stroke="url(#organicSilkFilament)"
              strokeWidth="1.3"
              strokeLinecap="round"
              filter="url(#threadGlowSoft)"
              style={{ transition: 'none' }}
            />
            <path
              ref={secondaryPathRef}
              id="secondaryThreadPath"
              data-testid="secondary-thread-path"
              className="thread-path"
              d="M 140,220 C 20,380 40,580 160,700 C 280,820 490,830 620,890 C 740,950 780,1000 810,1050"
              stroke="url(#organicSilkFilament)"
              strokeWidth="0.85"
              strokeDasharray="6 3"
              strokeLinecap="round"
              opacity="0.65"
              style={{ transition: 'none' }}
            />
            <path
              ref={tertiaryPathRef}
              id="tertiaryThreadPath"
              data-testid="tertiary-thread-path"
              className="thread-path"
              d="M 510,720 C 600,780 720,860 880,880 C 1040,900 1200,840 1320,930"
              stroke="url(#subtleEchoFilament)"
              strokeWidth="0.65"
              strokeLinecap="round"
              style={{ transition: 'none' }}
            />
          </svg>
        </div>

        <div className="page-container position-relative w-100" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            {/* Narrative Typography Column */}
            <div className="col-12 col-lg-6 pe-lg-4">
              {/* Chapter Marker & Unfold Flag */}
              <div ref={kickerRef} className="d-inline-flex align-items-center gap-2 gap-sm-3 mb-4 flex-wrap">
                <span style={{ width: 32, height: 1, backgroundColor: 'var(--color-champagne-thread)' }} />
                <span className="label-caps text-champagne">Chapter 01: The Spring Solstice Archive</span>
                <span className="px-2 py-0.5 label-caps-wide bg-stone text-muted-editorial">Unfold</span>
                {/* Animation Skip/Pause Control (Homepage Scope) */}
                <button
                  type="button"
                  className="animation-toggle-btn ms-sm-2"
                  aria-label="Toggle Thread Motion Animation (Homepage)"
                  title="Toggle signature thread motion on this page"
                  data-testid="motion-toggle-btn"
                  onClick={handleToggleMotion}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                    {isMotionActive ? 'grain' : 'pause'}
                  </span>
                  <span>{isMotionActive ? 'Motion Active' : 'Motion Paused'}</span>
                </button>
              </div>

              {/* Hero Headlines with Editorial Curtain Reveal Mask */}
              <div className="mb-4">
                <div className="headline-mask-wrapper">
                  <h1
                    ref={headlineRef}
                    className="display-hero text-oxblood mb-2 hero-curtain-headline"
                    data-testid="hero-headline"
                  >
                    An heirloom,<br />
                    <span className="fst-italic text-muted-editorial font-serif">not a trend.</span>
                  </h1>
                </div>
                <p ref={subheadRef} className="headline-sm text-on-surface fst-italic fw-light mb-0" data-testid="hero-subhead">
                  Every thread carries a story.
                </p>
              </div>

              {/* Brand Philosophy Statement */}
              <p ref={descRef} className="body-lg text-muted-editorial mb-4" style={{ maxWidth: 540 }} data-testid="hero-description">
                EverThread stands at the intersection of living heritage and contemporary couture. Conceived as garments destined to outlive fleeting seasons, our pieces unite ancestral craft, noble raw fibers, and architectural silhouettes.
              </p>

              {/* Primary Direct Actions */}
              <div ref={actionsRef} className="d-flex flex-wrap align-items-center gap-3 mb-5" data-testid="hero-actions">
                <Link to="/collections" className="btn-oxblood" data-testid="hero-primary-cta">
                  <span>Explore the collection</span>
                  <span className="material-symbols-outlined fs-6 text-champagne-glow">arrow_forward</span>
                </Link>
                <Link to="/archive" className="link-editorial ms-2" data-testid="hero-secondary-cta">
                  <span>Discover the stories</span>
                </Link>
              </div>

              {/* Archival Metadata Plinth */}
              <div ref={metadataRef} className="pt-4 border-hairline-t row g-3 text-muted-editorial" style={{ maxWidth: 480 }} data-testid="hero-metadata">
                <div className="col-4">
                  <span className="label-caps text-champagne d-block">FIBER PURITY</span>
                  <span className="body-sm text-on-surface fw-medium d-block pt-1">100% Unblended</span>
                </div>
                <div className="col-4">
                  <span className="label-caps text-champagne d-block">CONSTRUCTION</span>
                  <span className="body-sm text-on-surface fw-medium d-block pt-1">Pit-Loomed Jacquard</span>
                </div>
                <div className="col-4">
                  <span className="label-caps text-champagne d-block">EDITION</span>
                  <span className="body-sm text-on-surface fw-medium d-block pt-1">Numbered 01–64</span>
                </div>
              </div>
            </div>

            {/* Editorial Fashion Visual Column */}
            <div ref={visualRef} className="col-12 col-lg-6 position-relative d-flex justify-content-center justify-content-lg-end" data-testid="hero-visual">
              {/* Shadow Plinth Geometry */}
              <div className="position-absolute bg-stone-high d-none d-sm-block" style={{ right: '-1rem', top: '2rem', width: '85%', height: '90%', zIndex: 1 }} />

              {/* Primary Editorial Visual Frame */}
              <div className="position-relative z-2 w-100 hero-plinth-frame" style={{ maxWidth: 500, aspectRatio: '4/5' }}>
                <picture className="w-100 h-100 d-block">
                  <source
                    media="(max-width: 768px)"
                    srcSet="/images/home/everthread-hero-mobile-01.webp 800w, /images/home/everthread-hero-mobile-01-400w.webp 400w"
                    sizes="100vw"
                  />
                  <source
                    media="(min-width: 769px)"
                    srcSet="/images/home/everthread-hero-01.webp 1678w, /images/home/everthread-hero-01-1200w.webp 1200w, /images/home/everthread-hero-01-800w.webp 800w, /images/home/everthread-hero-01-400w.webp 400w"
                    sizes="(max-width: 1200px) 50vw, 500px"
                  />
                  <img
                    src="/images/home/everthread-hero-01.webp"
                    alt="Editorial high-fashion campaign photograph featuring model draped in layered mulberry silk and structured cashmere"
                    className="w-100 h-100 object-fit-cover hero-editorial__image"
                    loading="eager"
                  />
                </picture>

                {/* Single Consolidated Loupe Badge Trigger */}
                <button
                  type="button"
                  className="loupe-badge-trigger position-absolute bottom-0 start-0 m-4 d-flex align-items-center gap-3 shadow-sm z-3"
                  onClick={handleOpenLens}
                  aria-label="Inspect living weave detail (opens textile close-up view)"
                  aria-haspopup="dialog"
                  aria-expanded={isLensOpen}
                  data-testid="atelier-lens-badge-trigger"
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: '1px solid var(--color-champagne-thread)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined fs-6 text-champagne">loupe</span>
                  </div>
                  <div className="text-start">
                    <p className="label-caps text-oxblood mb-0">Mulberry Silk &amp; Cashmere</p>
                    <span className="body-sm text-muted-editorial font-sans" style={{ fontSize: '0.75rem' }}>
                      A closer look at the weave
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           FOLIO PAGE 01: HIGHLIGHTS PLINTH GRID (Discovery, Lineage & Repertoire)
           ========================================================================= */}
      <section
        id="highlights"
        ref={highlightsSectionRef}
        data-testid="highlights-section"
        className="py-5 bg-stone border-hairline-b position-relative"
      >
        <div className="page-container">
          {/* Archival Crease Header */}
          <div className="editorial-crease mb-4">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne" style={{ letterSpacing: '0.24em' }}>
                FOLIO PAGE 01 / UNFOLDING CHAPTER: DISCOVERY
              </span>
            </div>
            <div className="d-none d-sm-flex align-items-center gap-2 label-caps text-outline">
              <span className="text-oxblood fw-medium">FOLIO COMPASS</span>
              <span className="material-symbols-outlined fs-6 text-champagne">unfold_more</span>
            </div>
          </div>

          {/* Narrative Weft Connector Thread SVG Canvas */}
          <div
            className="position-relative w-100 mb-4 overflow-hidden pointer-events-none"
            style={{ height: 36 }}
          >
            <svg
              aria-hidden="true"
              role="presentation"
              className="w-100 h-100 overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 1200 36"
              fill="none"
              data-testid="highlights-thread-canvas"
            >
              <defs>
                <linearGradient id="highlightsWeftGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dfc396" stopOpacity="0.2" />
                  <stop offset="25%" stopColor="#B49A70" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#dfc396" stopOpacity="0.9" />
                  <stop offset="85%" stopColor="#B49A70" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#B49A70" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                ref={highlightsThreadRef}
                id="highlightsThreadPath"
                data-testid="highlights-thread-path"
                d="M 0,18 C 150,4 300,32 450,16 C 600,2 750,34 900,18 C 1050,4 1150,26 1200,18"
                stroke="url(#highlightsWeftGlow)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'none' }}
              />
            </svg>
          </div>

          {/* 3 Editorial Invitation Plinth Cards */}
          <div className="row g-4 text-start">
            <div
              ref={el => { cardsRef.current[0] = el; }}
              data-testid="highlight-card-compass"
              className="col-12 col-md-4"
            >
              <div className="p-4 bg-canvas border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-2">01 / Curated Guidance</span>
                  <h2 className="title-md text-oxblood mb-2">Thread Compass</h2>
                  <p className="body-sm text-muted-editorial mb-3">
                    Tactile discovery matching noble fibers and drape silhouettes to your personal cadence.
                  </p>
                </div>
                <Link to="/compass" className="text-oxblood fw-medium body-sm d-inline-flex align-items-center gap-1">
                  Start Consultation <span className="material-symbols-outlined fs-6">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div
              ref={el => { cardsRef.current[1] = el; }}
              data-testid="highlight-card-archive"
              className="col-12 col-md-4"
            >
              <div className="p-4 bg-oxblood text-white border-champagne h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne-glow d-block mb-2">02 / Lineage Documentation</span>
                  <h2 className="title-md text-white mb-2">Cultural Archive &amp; Weave Library</h2>
                  <p className="body-sm text-white-50 mb-3">
                    Documenting endangered handloom disciplines from Varanasi pit looms to uncut radial draping.
                  </p>
                </div>
                <Link to="/archive" className="text-champagne-glow fw-medium body-sm d-inline-flex align-items-center gap-1">
                  Examine Folios <span className="material-symbols-outlined fs-6">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div
              ref={el => { cardsRef.current[2] = el; }}
              data-testid="highlight-card-capsule"
              className="col-12 col-md-4"
            >
              <div className="p-4 bg-canvas border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-2">03 / Permanent Repertoire</span>
                  <h2 className="title-md text-oxblood mb-2">The Permanent Capsule</h2>
                  <p className="body-sm text-muted-editorial mb-3">
                    Numbered heirloom silhouettes exploring architectural tailoring and ancestral handloom disciplines.
                  </p>
                </div>
                <Link to="/collections" className="text-oxblood fw-medium body-sm d-inline-flex align-items-center gap-1">
                  View Silhouettes <span className="material-symbols-outlined fs-6">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           CHAPTER 02: THREAD COMPASS — Curated Tactile Diagnostic
           ========================================================================= */}
      <section
        id="chapter-compass"
        data-testid="chapter-compass-section"
        className="section-chapter bg-canvas border-hairline-b position-relative overflow-hidden"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 02 / TACTILE DIAGNOSTIC</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">STEP 01 OF 05</span>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="label-caps text-champagne d-block mb-2">FIBER INTUITION</span>
              <h2 className="display-editorial text-oxblood mb-3">The Thread Compass</h2>
              <p className="lead-editorial mb-4">
                Curated fiber and silhouette guidance tuned to your seasonal climate and tactile sensitivity.
              </p>
              <p className="body-md text-muted-editorial mb-4">
                Bypassing seasonal novelty, our diagnostic aligns human tactile preference with authentic handloom heritage. Discover whether your body seeks the crisp architectural drape of hand-twisted wild tussar or the weightless thermal embrace of high-altitude Changthangi pashmina.
              </p>
              <div className="pt-2">
                <Link to="/compass" className="btn-oxblood" data-testid="chapter-compass-cta">
                  <span>Begin Personal Consultation</span>
                  <span className="material-symbols-outlined fs-6 text-champagne-glow">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="overflow-hidden border-hairline bg-stone position-relative">
                <div className="position-relative" style={{ aspectRatio: '16/9' }}>
                  <img
                    src="/images/home/everthread-textile-folds-01.webp"
                    srcSet="/images/home/everthread-textile-folds-01.webp 1536w, /images/home/everthread-textile-folds-01-1200w.webp 1200w, /images/home/everthread-textile-folds-01-800w.webp 800w, /images/home/everthread-textile-folds-01-400w.webp 400w"
                    sizes="(max-width: 768px) 100vw, 550px"
                    alt="Tactile fluid folds of wild tussar silk and Changthangi pashmina"
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                  <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-oxblood text-white border-hairline">
                    <span className="label-caps-wide text-champagne-glow" style={{ fontSize: '0.625rem' }}>
                      TACTILE GRAIN STUDY • FLUID BIAS FLEX
                    </span>
                  </div>
                </div>
                <div className="p-4 p-md-5">
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-hairline-b">
                    <span className="label-caps text-oxblood">Diagnostic Matrix</span>
                    <span className="body-xs text-muted-editorial font-mono">4-AXIS RADIAL</span>
                  </div>
                  <div className="row g-4 text-start">
                    <div className="col-6">
                      <span className="label-caps-wide text-champagne d-block mb-1">01 / WEIGHT</span>
                      <span className="title-md text-oxblood d-block">Subtle · 220 GSM</span>
                      <span className="body-xs text-muted-editorial">Year-round climate adaptability</span>
                    </div>
                    <div className="col-6">
                      <span className="label-caps-wide text-champagne d-block mb-1">02 / DRAPE</span>
                      <span className="title-md text-oxblood d-block">Fluid Bias Flex</span>
                      <span className="body-xs text-muted-editorial">Follows motion without stiffness</span>
                    </div>
                    <div className="col-6">
                      <span className="label-caps-wide text-champagne d-block mb-1">03 / BREATHABILITY</span>
                      <span className="title-md text-oxblood d-block">High Permeability</span>
                      <span className="body-xs text-muted-editorial">Unfused natural reed air lanes</span>
                    </div>
                    <div className="col-6">
                      <span className="label-caps-wide text-champagne d-block mb-1">04 / THERMAL MEMORY</span>
                      <span className="title-md text-oxblood d-block">Botanical Retention</span>
                      <span className="body-xs text-muted-editorial">Hollow core animal/wild silk fibers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           CHAPTER 03: CULTURAL ARCHIVE — Living Memory & Lineage
           ========================================================================= */}
      <section
        id="chapter-archive"
        data-testid="chapter-archive-section"
        className="section-chapter bg-stone border-hairline-b position-relative overflow-hidden"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 03 / LIVING MEMORY &amp; LINEAGE</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">{leadStory.folio}</span>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-5 order-2 order-lg-1">
              <span className="label-caps text-champagne d-block mb-2">{leadStory.chapter} · {leadStory.focus}</span>
              <h2 className="display-editorial text-oxblood mb-2">{leadStory.title}</h2>
              <p className="headline-sm text-on-surface fst-italic fw-light mb-3">{leadStory.subtitle}</p>
              <p className="body-md text-muted-editorial mb-4">
                {leadStory.summary}
              </p>
              <div className="p-3 bg-canvas border-hairline mb-4">
                <div className="row g-2">
                  <div className="col-6">
                    <span className="label-caps text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>HISTORICAL CRAFT LINEAGE</span>
                    <span className="body-sm text-oxblood fw-medium d-block">Varanasi Kadwa Brocade Tradition</span>
                  </div>
                  <div className="col-6">
                    <span className="label-caps text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>DOCUMENTATION REGION</span>
                    <span className="body-sm text-oxblood fw-medium d-block">{leadStory.location}</span>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Link
                  to={`/archive/${leadStory.slug}`}
                  className="btn-secondary-editorial"
                  data-testid="chapter-archive-story-cta"
                >
                  <span>Read Folio 1.1</span>
                  <span className="material-symbols-outlined fs-6">arrow_forward</span>
                </Link>
                <Link to="/archive" className="link-editorial" data-testid="chapter-archive-index-cta">
                  <span>View Complete Archive (8 Folios)</span>
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-7 order-1 order-lg-2">
              <div className="position-relative bg-canvas border-hairline overflow-hidden ratio-cinematic">
                <img
                  src={leadStory.image}
                  alt={leadStory.imageAlt}
                  className="w-100 h-100 object-fit-cover"
                />
                <div
                  className="position-absolute bottom-0 inset-x-0 p-3 text-start"
                  style={{ background: 'linear-gradient(to top, rgba(20,13,11,0.75), transparent)' }}
                >
                  <span className="body-xs text-champagne font-mono">{leadStory.imageCredit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           CHAPTER 04: THE PERMANENT CAPSULE — Numbered Heirloom Works
           ========================================================================= */}
      <section
        id="chapter-capsule"
        data-testid="chapter-capsule-section"
        className="section-chapter bg-canvas border-hairline-b position-relative overflow-hidden"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 04 / PERMANENT SILHOUETTES</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">ET-01 / 07</span>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="position-relative bg-stone border-hairline overflow-hidden ratio-folio">
                <img
                  src={flagshipProduct.image}
                  alt={flagshipProduct.imageAlt}
                  className="w-100 h-100 object-fit-cover"
                />
                <div
                  className="position-absolute top-0 end-0 m-3 px-3 py-1 bg-canvas border-hairline"
                >
                  <span className="label-caps-wide text-oxblood">Archival Specimen · Limited Commission</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <span className="label-caps text-champagne d-block mb-2">FLAGSHIP SILHOUETTE · {flagshipProduct.category}</span>
              <h2 className="display-editorial text-oxblood mb-2">{flagshipProduct.title}</h2>
              <p className="headline-sm text-on-surface fst-italic fw-light mb-3">{flagshipProduct.subtitle}</p>
              <div className="mb-4">
                <span className="title-lg text-oxblood font-serif">
                  {flagshipProduct.currency}{flagshipProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="body-xs text-muted-editorial ms-2">Bespoke atelier commission · Made to Order</span>
              </div>
              <p className="body-md text-muted-editorial mb-4">
                {flagshipProduct.description}
              </p>

              <div className="row g-3 pb-4 mb-4 border-hairline-b">
                <div className="col-6">
                  <span className="label-caps text-champagne d-block" style={{ fontSize: '0.625rem' }}>TAILORING SILHOUETTE</span>
                  <span className="body-sm text-oxblood fw-medium d-block pt-1">Structured Razor-Lapel Coat-Dress</span>
                </div>
                <div className="col-6">
                  <span className="label-caps text-champagne d-block" style={{ fontSize: '0.625rem' }}>WEAVE ACCENT</span>
                  <span className="body-sm text-oxblood fw-medium d-block pt-1">Asymmetric Handloom Brocade Facing</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <Link
                  to={`/product/${flagshipProduct.slug}`}
                  className="btn-oxblood"
                  data-testid="chapter-capsule-flagship-cta"
                >
                  <span>Examine Coat-Dress</span>
                  <span className="material-symbols-outlined fs-6 text-champagne-glow">arrow_forward</span>
                </Link>
                <Link to="/collections" className="link-editorial" data-testid="chapter-capsule-collection-cta">
                  <span>Explore All 7 Capsule Works</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           CHAPTER 05: THE MAKING — Architectural Tailoring & Ancestral Discipline
           ========================================================================= */}
      <section
        id="chapter-making"
        data-testid="chapter-making-section"
        className="section-chapter bg-oxblood text-white border-hairline-b position-relative overflow-hidden"
      >
        <div className="page-container">
          <div className="d-flex align-items-center justify-content-between mb-5 pb-3 border-hairline-b" style={{ borderColor: 'rgba(223, 195, 150, 0.2)' }}>
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" style={{ backgroundColor: 'var(--color-champagne-glow)' }} />
              <span className="label-caps-wide text-champagne-glow">CHAPTER 05 / ARCHITECTURAL TAILORING</span>
            </div>
            <span className="body-xs text-white-50 font-mono">DISCIPLINE OVER SPEED</span>
          </div>

          <div className="row g-5 mb-5">
            <div className="col-12 col-md-4">
              <span className="label-caps text-champagne-glow d-block mb-2">01 / SUBTERRANEAN WEFT</span>
              <h3 className="title-md text-white mb-2">Pit-Loomed Humidity</h3>
              <p className="body-sm text-white-50">
                Traditional subterranean pit looms utilize earth-regulated ambient humidity to maintain raw silk tensile elasticity, demonstrating how regional topography historically shaped architectural handlooms.
              </p>
            </div>
            <div className="col-12 col-md-4">
              <span className="label-caps text-champagne-glow d-block mb-2">02 / ZERO SYNTHETIC FUSING</span>
              <h3 className="title-md text-white mb-2">Floating Canvases</h3>
              <p className="body-sm text-white-50">
                Bespoke tailoring traditions favor floating natural interfacings over chemical fusible adhesives, allowing structured garments to flex with human movement and breathe with ambient climate.
              </p>
            </div>
            <div className="col-12 col-md-4">
              <span className="label-caps text-champagne-glow d-block mb-2">03 / LIVING CULTURAL ARCHIVE</span>
              <h3 className="title-md text-white mb-2">Honoring Artisan Lineage</h3>
              <p className="body-sm text-white-50">
                EverThread explores and documents ancestral weaving disciplines, advocating for public cultural recognition and the preservation of generational handcraft knowledge.
              </p>
            </div>
          </div>

          <div className="pt-3 border-hairline-t text-start" style={{ borderColor: 'rgba(223, 195, 150, 0.2)' }}>
            <Link to="/the-house" className="text-champagne-glow fw-medium body-sm d-inline-flex align-items-center gap-2" data-testid="chapter-making-house-cta">
              <span>Explore The Atelier Archive &amp; Craft Philosophy</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
           CHAPTER 06: THE EVERTHREAD PROMISE — Heirloom Covenant
           ========================================================================= */}
      <section
        id="chapter-promise"
        data-testid="chapter-promise-section"
        className="section-chapter bg-stone border-hairline-b position-relative overflow-hidden"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 06 / HEIRLOOM COVENANT</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">PERMANENT STANDARDS</span>
          </div>

          <div className="row g-4 text-start">
            <div className="col-12 col-md-4">
              <div className="p-4 p-lg-5 bg-canvas border-hairline h-100">
                <span className="label-caps text-champagne d-block mb-2">COVENANT I</span>
                <h3 className="title-md text-oxblood mb-2">Uncut Botanical Purity</h3>
                <p className="body-sm text-muted-editorial mb-0">
                  A commitment to championing natural noble fibers—such as raw tussar, mulberry silk, and fine wool—celebrating the tactile integrity of organic materials over synthetic fast fashion.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 p-lg-5 bg-canvas border-hairline h-100">
                <span className="label-caps text-champagne d-block mb-2">COVENANT II</span>
                <h3 className="title-md text-oxblood mb-2">Generational Inlay Margins</h3>
                <p className="body-sm text-muted-editorial mb-0">
                  Reflecting on the classic couture philosophy of generous internal allowances, prioritizing garments designed for adaptability, patient alterations, and lasting wear across generations.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 p-lg-5 bg-canvas border-hairline h-100">
                <span className="label-caps text-champagne d-block mb-2">COVENANT III</span>
                <h3 className="title-md text-oxblood mb-2">Documented Provenance</h3>
                <p className="body-sm text-muted-editorial mb-0">
                  Dedicated to documenting and preserving textile stories, illuminating the cultural histories, craft techniques, and living lineages behind enduring handloom traditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           CHAPTER 07: THE GAZETTE — Critical Monograph Series
           ========================================================================= */}
      <section
        id="chapter-gazette"
        data-testid="chapter-gazette-section"
        className="section-chapter bg-canvas position-relative overflow-hidden"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 07 / CRITICAL MONOGRAPHS</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">{leadMonograph.date}</span>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-8">
              <span className="label-caps text-champagne d-block mb-2">{leadMonograph.category} · {leadMonograph.readTime}</span>
              <h2 className="display-editorial text-oxblood mb-3">{leadMonograph.title}</h2>
              <p className="headline-sm text-on-surface fst-italic fw-light mb-3">{leadMonograph.subtitle}</p>
              <p className="body-md text-muted-editorial mb-4">
                {leadMonograph.excerpt}
              </p>
              <div className="d-flex align-items-center gap-3">
                <Link
                  to={`/journal/${leadMonograph.slug}`}
                  className="btn-oxblood"
                  data-testid="chapter-gazette-lead-cta"
                >
                  <span>Read Monograph</span>
                  <span className="material-symbols-outlined fs-6 text-champagne-glow">arrow_forward</span>
                </Link>
                <Link to="/journal" className="link-editorial" data-testid="chapter-gazette-index-cta">
                  <span>Atelier Gazette Index</span>
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="p-4 bg-stone border-hairline">
                <span className="label-caps text-oxblood d-block mb-2">AUTHORIAL DISCLOSURE</span>
                <span className="body-sm text-on-surface fw-medium d-block mb-1">{leadMonograph.author}</span>
                <span className="body-xs text-muted-editorial d-block mb-3">{leadMonograph.authorRole}</span>
                <p className="body-xs text-muted-editorial mb-0 fst-italic">
                  EverThread Monographs are curatorial essays examining textile culture, slow craftsmanship, and living handloom heritage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Fabric Inspection Modal */}
      <AtelierLensModal
        isOpen={isLensOpen}
        onClose={handleCloseLens}
        imageSrc="/images/home/everthread-textile-folds-01.webp"
        fallbackImageSrc="/images/home/everthread-hero-01.webp"
        title="Living Weave Detail"
        subtitle="Hand-spun Mulberry Silk & Structured Cashmere"
        caption="A closer look at the weave. High-resolution study of the raw silk fibers and structured weft geometry."
      />
    </main>
  );
};
