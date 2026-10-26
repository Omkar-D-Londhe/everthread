import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AtelierLensModal } from '../components/AtelierLensModal.tsx';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
import { getProductById } from '../data/products.ts';
import { STORIES } from '../data/stories.ts';
import { JOURNAL_ARTICLES } from '../data/journal.ts';
import { WallsPreview } from '../components/home/WallsPreview.tsx';
import { NarrativeSpine } from '../components/home/NarrativeSpine.tsx';

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
      return defaultLength;
    }
  }
  return defaultLength;
};

export const HomePage: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();

  // Root container ref for GSAP context scoping and cleanup
  const mainContainerRef = useRef<HTMLElement>(null);

  // Section Refs for ScrollTrigger Story Flow pinning/scrubbing
  const heroRef = useRef<HTMLElement>(null);
  const highlightsSectionRef = useRef<HTMLElement>(null);

  // Hero Content Refs
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // SVG Silk Thread Path Refs (Hero layer)
  const signaturePathRef = useRef<SVGPathElement>(null);
  const secondaryPathRef = useRef<SVGPathElement>(null);
  const tertiaryPathRef = useRef<SVGPathElement>(null);

  // SVG Highlights Story-flow connector path ref
  const highlightsThreadRef = useRef<SVGPathElement>(null);

  // Highlights Plinth Cards Refs
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Motion Active state
  const [isMotionActive, setIsMotionActive] = useState<boolean>(!prefersReduced);

  // Synchronize OS prefers-reduced-motion dynamically
  useEffect(() => {
    setIsMotionActive(!prefersReduced);
  }, [prefersReduced]);

  // Synchronize documentElement class for global CSS transition/animation suppression
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
        tertiaryPathRef.current.style.opacity = '0.25';
        tertiaryPathRef.current.style.transform = 'none';
      }
      if (highlightsThreadRef.current) {
        highlightsThreadRef.current.style.strokeDashoffset = '0';
        highlightsThreadRef.current.style.opacity = '0.85';
      }
      [headlineRef, subheadRef, descRef, actionsRef, metadataRef, visualRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'none';
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

    // Motion Enabled: Build coordinated GSAP Context and timeline
    const ctx = gsap.context(() => {
      const sigLen = getPathLength(signaturePathRef.current, 2400);
      const secLen = getPathLength(secondaryPathRef.current, 1950);
      const highLen = getPathLength(highlightsThreadRef.current, 1300);

      // Initial Path Attributes
      if (signaturePathRef.current) {
        gsap.set(signaturePathRef.current, {
          strokeDasharray: sigLen,
          strokeDashoffset: sigLen,
          opacity: 0.95
        });
      }
      if (secondaryPathRef.current) {
        gsap.set(secondaryPathRef.current, {
          strokeDasharray: secLen,
          strokeDashoffset: secLen,
          opacity: 0
        });
      }
      if (tertiaryPathRef.current) {
        gsap.set(tertiaryPathRef.current, { opacity: 0 });
      }
      if (highlightsThreadRef.current) {
        gsap.set(highlightsThreadRef.current, {
          strokeDasharray: highLen,
          strokeDashoffset: highLen,
          opacity: 0.35
        });
      }

      // Initial Content Styles
      gsap.set([headlineRef.current, subheadRef.current, descRef.current, actionsRef.current, metadataRef.current], {
        opacity: 0,
        y: 18
      });
      if (visualRef.current) {
        gsap.set(visualRef.current, { opacity: 0, scale: 0.985 });
      }
      cardsRef.current.forEach(card => {
        if (card) {
          gsap.set(card, { opacity: 0, y: 24 });
        }
      });

      // Master Timeline for Chapter 01 Hero Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Step 1: Thread draws across the canvas
      if (signaturePathRef.current) {
        tl.to(signaturePathRef.current, {
          strokeDashoffset: 0,
          duration: 1.3,
          ease: 'power3.inOut'
        }, 0.1);
      }
      if (secondaryPathRef.current) {
        tl.to(secondaryPathRef.current, {
          strokeDashoffset: 0,
          opacity: 0.65,
          duration: 1.4,
          ease: 'power2.inOut'
        }, 0.3);
      }
      if (tertiaryPathRef.current) {
        tl.to(tertiaryPathRef.current, {
          opacity: 0.25,
          duration: 1.0
        }, 0.6);
      }

      // Step 2: Editorial Content reveals in cascade
      tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0.45)
        .to(subheadRef.current, { opacity: 1, y: 0, duration: 0.65 }, 0.6)
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.65 }, 0.7)
        .to(actionsRef.current, { opacity: 1, y: 0, duration: 0.65 }, 0.8)
        .to(metadataRef.current, { opacity: 1, y: 0, duration: 0.65 }, 0.9);

      // Step 3: Visual Frame appears and settles
      if (visualRef.current) {
        tl.to(visualRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.65);
      }

      // ScrollTrigger Story Flow Weave: Connects Hero to Folio Highlights Plinth
      if (highlightsSectionRef.current && highlightsThreadRef.current) {
        ScrollTrigger.create({
          trigger: highlightsSectionRef.current,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.8,
          onUpdate: self => {
            const progress = self.progress;
            if (highlightsThreadRef.current) {
              const offset = highLen * (1 - progress);
              gsap.set(highlightsThreadRef.current, {
                strokeDashoffset: offset,
                opacity: 0.35 + (progress * 0.55)
              });
            }
          }
        });

        // Highlights Plinth Cards Staggered Reveal
        const validCards = cardsRef.current.filter((c): c is HTMLDivElement => c !== null);
        if (validCards.length > 0) {
          ScrollTrigger.create({
            trigger: highlightsSectionRef.current,
            start: 'top 75%',
            onEnter: () => {
              gsap.to(validCards, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            }
          });
        }
      }
    }, mainContainerRef);

    return () => {
      ctx.revert();
    };
  }, [isMotionActive]);

  const handleToggleMotion = useCallback(() => {
    setIsMotionActive(prev => !prev);
  }, []);

  // Stage 06 Data Binding: Bind ET-01 strictly via getProductById('et-01')
  const heroProduct = getProductById('et-01');
  const leadStory = STORIES[0];
  const leadMonograph = JOURNAL_ARTICLES[0];

  return (
    <main id="main-content" ref={mainContainerRef} className="main-content">
      {/* =========================================================================
           SCENE 1: HOME-HERO (The Unfolding & Living Weave)
           ========================================================================= */}
      <section
        id="hero"
        ref={heroRef}
        data-testid="home-hero"
        className="position-relative w-100 min-vh-100 d-flex align-items-center bg-canvas overflow-hidden py-5"
        style={{ minHeight: '850px' }}
      >
        {/* Signature Champagne Silk Thread SVG Canvas Layer */}
        <div
          className="hero-thread-canvas-container pointer-events-none overflow-visible"
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

            {/* Primary Filament */}
            <path
              ref={signaturePathRef}
              id="signatureThreadPath"
              data-testid="signature-thread-path"
              d="M 98,0 C 130,120 180,240 240,320 C 320,430 480,480 620,440 C 760,400 840,280 940,310 C 1040,340 1100,460 1180,560 C 1260,660 1350,750 1440,820"
              stroke="url(#organicSilkFilament)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#threadGlowSoft)"
              style={{ transition: 'none' }}
            />

            {/* Harmonic Secondary Filament */}
            <path
              ref={secondaryPathRef}
              id="secondaryThreadPath"
              data-testid="secondary-thread-path"
              className="thread-path"
              d="M 140,220 C 20,380 40,580 160,700 C 280,820 490,830 620,890 C 740,950 780,1000 810,1050"
              stroke="url(#organicSilkFilament)"
              strokeWidth="0.85"
              strokeDasharray="6 3"
              style={{ transition: 'none' }}
            />

            {/* Whisper Tertiary Echo */}
            <path
              ref={tertiaryPathRef}
              id="tertiaryThreadPath"
              data-testid="tertiary-thread-path"
              className="thread-path"
              d="M 510,720 C 600,780 720,860 880,880 C 1040,900 1200,840 1320,930"
              stroke="url(#subtleEchoFilament)"
              strokeWidth="0.65"
              style={{ transition: 'none' }}
            />
          </svg>
        </div>

        <div className="page-container position-relative z-2">
          {/* Subtle Ambient Motion Control Trigger */}
          <div className="d-flex justify-content-end mb-2">
            <button
              type="button"
              className="motion-toggle-btn d-inline-flex align-items-center gap-2 px-3 py-1 bg-stone border-hairline rounded-1 body-sm"
              onClick={handleToggleMotion}
              aria-label={isMotionActive ? 'Pause ambient line animation' : 'Enable ambient line animation'}
              aria-pressed={isMotionActive}
              data-testid="motion-toggle-btn"
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: isMotionActive ? 'var(--color-champagne-thread)' : 'var(--color-muted-editorial)',
                  display: 'inline-block'
                }}
              />
              <span className="label-caps" style={{ fontSize: '0.6875rem' }}>
                {isMotionActive ? 'Motion Active' : 'Motion Paused'}
              </span>
            </button>
          </div>

          <div className="row align-items-center g-5">
            {/* Editorial Fashion Copy Column */}
            <div className="col-12 col-lg-6 text-start">
              <div className="mb-4">
                <span className="label-caps-wide text-champagne d-block mb-2" style={{ letterSpacing: '0.18em' }}>
                  ATELIER MONOGRAPH · N° 01
                </span>
                <div className="headline-mask-wrapper">
                  <h1
                    ref={headlineRef}
                    className="display-hero text-oxblood mb-2 hero-curtain-headline"
                    data-testid="hero-headline"
                  >
                    An heirloom, <br />
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
                {/* Secondary CTA: Standardized to "Enter the Archive" linking /archive per Stage 06 §7.4 */}
                <Link to="/archive" className="link-editorial ms-2" data-testid="hero-secondary-cta">
                  <span>Enter the Archive</span>
                </Link>
              </div>

              {/* Archival Metadata Plinth: Bound strictly to ET-01 fields; edition cell removed per Stage 06 §7.3 */}
              {heroProduct && (
                <div ref={metadataRef} className="pt-4 border-hairline-t row g-3 text-muted-editorial" style={{ maxWidth: 520 }} data-testid="hero-metadata">
                  <div className="col-12 col-sm-4">
                    <span className="label-caps text-champagne d-block">MATERIAL</span>
                    <span className="body-sm text-on-surface fw-medium d-block pt-1" data-testid="hero-meta-material">
                      {heroProduct.fiberPurity}
                    </span>
                  </div>
                  <div className="col-12 col-sm-4">
                    <span className="label-caps text-champagne d-block">CONSTRUCTION</span>
                    <span className="body-sm text-on-surface fw-medium d-block pt-1" data-testid="hero-meta-construction">
                      {heroProduct.weaveType}
                    </span>
                  </div>
                  <div className="col-12 col-sm-4">
                    <span className="label-caps text-champagne d-block">PIECE</span>
                    <span className="body-sm text-on-surface fw-medium d-block pt-1" data-testid="hero-meta-piece">
                      {heroProduct.category}
                    </span>
                  </div>
                </div>
              )}
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
                    alt="Editorial high-fashion campaign photograph featuring model draped in layered noble fibers"
                    className="w-100 h-100 object-fit-cover hero-editorial__image"
                    loading="eager"
                  />
                </picture>

                {/* Single Consolidated Loupe Badge Trigger: Caption strictly from ET-01 fiberPurity */}
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
                    <p className="label-caps text-oxblood mb-0" data-testid="hero-image-caption">
                      {heroProduct ? heroProduct.fiberPurity : 'Atelier Natural Weave'}
                    </p>
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
           SCENE 2: HOME-INDEX (Chapter Index I–III, data-scene="H1")
           ========================================================================= */}
      <section
        id="highlights"
        ref={highlightsSectionRef}
        data-testid="home-index"
        data-scene="H1"
        className="py-5 bg-stone border-hairline-b position-relative"
      >
        <div className="page-container">
          {/* Archival Crease Header */}
          <div className="editorial-crease mb-4">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne" style={{ letterSpacing: '0.24em' }}>
                FOLIO PAGE 01 / CHAPTER INDEX
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

          {/* 3 Numbered Chapter Entries (H3 headings per Stage 06 §7.5) */}
          <div className="row g-4 text-start">
            <div
              ref={el => { cardsRef.current[0] = el; }}
              data-testid="highlight-card-compass"
              className="col-12 col-md-4"
            >
              <div className="p-4 bg-canvas border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-2">Chapter I / Guidance</span>
                  <h3 className="title-md text-oxblood mb-2 font-serif">Thread Compass</h3>
                  <p className="body-sm text-muted-editorial mb-3">
                    Tactile diagnostic matching noble fibers and drape silhouettes to your personal cadence.
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
                  <span className="label-caps text-champagne-glow d-block mb-2">Chapter II / Lineage</span>
                  <h3 className="title-md text-white mb-2 font-serif">Cultural Archive</h3>
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
                  <span className="label-caps text-champagne d-block mb-2">Chapter III / Collections</span>
                  <h3 className="title-md text-oxblood mb-2 font-serif">Curated Collections</h3>
                  <p className="body-sm text-muted-editorial mb-3">
                    Two architectural volumes exploring contemporary luxury and living subcontinental heritage.
                  </p>
                </div>
                <Link to="/collections" className="text-oxblood fw-medium body-sm d-inline-flex align-items-center gap-1">
                  View Collections <span className="material-symbols-outlined fs-6">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           SCENE 3: HOME-COMPASS (Single Compass Teaser per Stage 06 §7.6)
           ========================================================================= */}
      <section
        id="chapter-compass"
        data-testid="home-compass"
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
              {/* Only H2 with "Thread Compass" on the page */}
              <h2 className="display-editorial text-oxblood mb-3">The Thread Compass</h2>
              <p className="lead-editorial mb-4">
                How do you wish the garment to hold space?
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
                      <span className="body-xs text-muted-editorial">Hollow core natural fibers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           SCENE 4: HOME-CRAFT (The Living Loom & Technical Diagram Strip per Stage 06 §7.7)
           ========================================================================= */}
      <section
        id="chapter-archive"
        data-testid="home-craft"
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
              <h2 className="display-editorial text-oxblood mb-2">The Living Loom</h2>
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

          {/* Three Static Diagram Thumbnails Strip (REPO-DIAG-01..03 per Stage 06 §7.7) */}
          <div className="mt-5 pt-4 border-hairline-t" data-testid="craft-diagrams-strip">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
              <span className="label-caps text-champagne">Weave Library Technical Diagrams</span>
            </div>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <Link to="/archive" className="craft-diagram-thumb h-100" data-testid="diagram-thumb-warp-weft">
                  <img src="/images/weave-library/diagrams/library-warp-weft-diagram-01.svg" alt="Warp and Weft Interlacing Structure Diagram" loading="lazy" />
                  <span className="body-sm text-oxblood fw-medium text-center">Warp &amp; Weft Interlacing</span>
                  <span className="body-xs text-muted-editorial text-center mt-1">Loom tension and cross-weave geometry</span>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to="/archive" className="craft-diagram-thumb h-100" data-testid="diagram-thumb-vocab">
                  <img src="/images/weave-library/diagrams/library-textile-vocabulary-01.svg" alt="Textile Anatomy and Terminology Diagram" loading="lazy" />
                  <span className="body-sm text-oxblood fw-medium text-center">Textile Vocabulary</span>
                  <span className="body-xs text-muted-editorial text-center mt-1">Selvedge, reed density, and yarn twist taxonomy</span>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to="/archive" className="craft-diagram-thumb h-100" data-testid="diagram-thumb-technique">
                  <img src="/images/weave-library/diagrams/library-technique-comparison-01.svg" alt="Handloom vs Machine Weave Technique Comparison Diagram" loading="lazy" />
                  <span className="body-sm text-oxblood fw-medium text-center">Technique Comparison</span>
                  <span className="body-xs text-muted-editorial text-center mt-1">Subterranean pit loom vs automated industrial weave</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
           SCENE 5: HOME-WALLS (Two-Wall Preview Doors, data-scene="H2" per Stage 06 §7.8)
           ========================================================================= */}
      <section
        id="home-walls"
        data-testid="home-walls"
        data-scene="H2"
        className="section-chapter bg-canvas border-hairline-b position-relative overflow-hidden py-5"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 04 / CURATED REPERTOIRE</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">TWO VOLUMES</span>
          </div>

          <div className="text-center mb-5" style={{ maxWidth: 680, margin: '0 auto' }}>
            <h2 className="display-editorial text-oxblood mb-2 font-serif">
              Two Curated Walls
            </h2>
            <p className="body-lg text-muted-editorial mb-0">
              Two distinct architectural environments uniting contemporary tailoring and classical subcontinental textile arts.
            </p>
          </div>

          {/* Integrated WallsPreview Component (Door 1: AST-HOME-PLATE; Door 2: AST-HOME-CAMP-R1) */}
          <WallsPreview />
        </div>
      </section>

      {/* =========================================================================
           SCENE 6: HOME-MAKING & HOME-PROMISE (Claim-Free Composite, data-scene="H3" per Stage 06 §7.9)
           ========================================================================= */}
      <section
        id="home-making"
        data-testid="home-making"
        data-scene="H3"
        className="section-chapter bg-cream border-hairline-b position-relative overflow-hidden py-5"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 05 / ARCHITECTURAL DISCIPLINE</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">CLAIM-FREE COVENANT</span>
          </div>

          {/* Integrated NarrativeSpine: 5-Stage Spine + 3 Verbatim Brand Lines */}
          <NarrativeSpine />
        </div>
      </section>

      {/* =========================================================================
           SCENE 7: HOME-JOURNAL (The Gazette Monograph Series per Stage 06 §7.11)
           ========================================================================= */}
      <section
        id="chapter-gazette"
        data-testid="home-journal"
        className="section-chapter bg-canvas border-hairline-b position-relative overflow-hidden py-5"
      >
        <div className="page-container">
          <div className="editorial-crease mb-5">
            <div className="d-inline-flex align-items-center gap-2">
              <span className="crease-diamond" />
              <span className="label-caps-wide text-champagne">CHAPTER 06 / MONOGRAPH SERIES</span>
            </div>
            <span className="body-xs text-muted-editorial font-mono">{leadMonograph.date}</span>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-8">
              <span className="label-caps text-champagne d-block mb-2">{leadMonograph.category} · {leadMonograph.readTime}</span>
              <h2 className="display-editorial text-oxblood mb-3 font-serif">{leadMonograph.title}</h2>
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

      {/* =========================================================================
           SCENE 8: HOME-CLOSING (Deliberate House Closing Sequence per Stage 06 §7.11)
           ========================================================================= */}
      <section
        id="home-closing"
        data-testid="home-closing"
        className="home-closing-scene py-5 text-center position-relative"
      >
        <div className="page-container py-4">
          <div className="d-inline-flex align-items-center gap-2 mb-3">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps-wide text-champagne">EverThread Atelier</span>
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          </div>
          <h2 className="headline-lg text-oxblood font-serif mb-4 fst-italic">
            “One thread. A world of stories.”
          </h2>
          <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            <Link to="/archive" className="btn-oxblood py-2 px-4" data-testid="home-closing-archive-cta">
              <span>Enter the Archive</span>
            </Link>
            <Link to="/collections" className="btn-outline-editorial py-2 px-4" data-testid="home-closing-collections-cta">
              <span>Explore the collections</span>
            </Link>
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
        subtitle={heroProduct ? heroProduct.fiberPurity : 'Atelier Natural Weave'}
        caption="A closer look at the weave. High-resolution study of raw noble fibers and structured weft geometry."
        zoom={3.5}
      />
    </main>
  );
};
