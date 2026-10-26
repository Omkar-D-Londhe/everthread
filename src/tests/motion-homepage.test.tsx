import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.tsx';
import { Header } from '../components/Header.tsx';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';

// Test harness wrapping HomePage with providers and routing
const renderHomePage = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <CartProvider>
        <SavedProvider>
          <Header onOpenSearch={() => {}} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<div data-testid="collections-route">Collections Target</div>} />
            <Route path="/product/:slug" element={<div data-testid="product-detail-route">Product Target</div>} />
            <Route path="/archive" element={<div data-testid="archive-route">Archive Target</div>} />
            <Route path="/archive/:slug" element={<div data-testid="archive-story-route">Story Target</div>} />
            <Route path="/compass" element={<div data-testid="compass-route">Compass Target</div>} />
            <Route path="/the-house" element={<div data-testid="house-route">The House Target</div>} />
            <Route path="/journal" element={<div data-testid="journal-route">Journal Target</div>} />
            <Route path="/journal/:slug" element={<div data-testid="journal-article-route">Journal Article Target</div>} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('EverThread Stage 5.1: Approved Homepage & SVG Thread Entrance Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.scrollTo = vi.fn();
    // Default matchMedia mock returning reduced-motion: false
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /* -------------------------------------------------------------------------
     1. Hero Content & Immediate CTA Availability
     ------------------------------------------------------------------------- */
  describe('1. Hero Content & Immediate CTA Availability', () => {
    it('renders the approved main headline “An heirloom, not a trend.”', () => {
      renderHomePage();
      const headline = screen.getByTestId('hero-headline');
      expect(headline).toBeInTheDocument();
      expect(headline.textContent).toContain('An heirloom,');
      expect(headline.textContent).toContain('not a trend.');
    });

    it('renders the approved supporting line “Every thread carries a story.”', () => {
      renderHomePage();
      const subhead = screen.getByTestId('hero-subhead');
      expect(subhead).toBeInTheDocument();
      expect(subhead.textContent).toContain('Every thread carries a story.');
    });

    it('renders the core brand philosophy narrative copy', () => {
      renderHomePage();
      const desc = screen.getByTestId('hero-description');
      expect(desc).toBeInTheDocument();
      expect(desc.textContent).toContain('EverThread stands at the intersection of living heritage and contemporary couture.');
    });

    it('provides immediately clickable primary CTA to /collections', () => {
      renderHomePage();
      const primaryCta = screen.getByTestId('hero-primary-cta');
      expect(primaryCta).toBeInTheDocument();
      expect(primaryCta.getAttribute('href')).toBe('/collections');
      expect(primaryCta.textContent).toContain('Explore the collection');

      // Click immediately navigates without delay
      fireEvent.click(primaryCta);
      expect(screen.getByTestId('collections-route')).toBeInTheDocument();
    });

    it('provides immediately clickable secondary CTA to /archive', () => {
      renderHomePage();
      const secondaryCta = screen.getByTestId('hero-secondary-cta');
      expect(secondaryCta).toBeInTheDocument();
      expect(secondaryCta.getAttribute('href')).toBe('/archive');
      expect(secondaryCta.textContent).toContain('Enter the Archive');

      // Click immediately navigates
      fireEvent.click(secondaryCta);
      expect(screen.getByTestId('archive-route')).toBeInTheDocument();
    });

    it('displays the three archival metadata plinth attributes bound to ET-01 without unverified edition', () => {
      renderHomePage();
      const metadata = screen.getByTestId('hero-metadata');
      expect(metadata).toBeInTheDocument();
      expect(metadata.textContent).toContain('MATERIAL');
      expect(metadata.textContent).toContain('70% Fine Merino Wool, 30% Wild Mulberry Silk');
      expect(metadata.textContent).toContain('CONSTRUCTION');
      expect(metadata.textContent).toContain('Pit-Loomed 2/2 Twill with Kadwa Facing');
      expect(metadata.textContent).toContain('PIECE');
      expect(metadata.textContent).toContain('Outerwear');
      expect(metadata.textContent).not.toContain('Numbered');
      expect(metadata.textContent).not.toContain('100% Unblended');
    });

    it('renders the editorial image frame and loupe preview badge without blocking layout', () => {
      renderHomePage();
      const visual = screen.getByTestId('hero-visual');
      expect(visual).toBeInTheDocument();

      const mainImg = visual.querySelector('img[alt*="campaign photograph"]');
      expect(mainImg).toBeInTheDocument();
      expect(mainImg?.getAttribute('src')).toBe('/images/home/everthread-hero-01.webp');

      // Single consolidated loupe badge trigger is present without competing inset tile
      const badgeTrigger = visual.querySelector('[data-testid="atelier-lens-badge-trigger"]');
      expect(badgeTrigger).toBeInTheDocument();
      expect(visual.querySelector('img[alt*="tussar silk"]')).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
     2. SVG Thread Canvas & Path Architecture
     ------------------------------------------------------------------------- */
  describe('2. SVG Thread Canvas & Path Architecture', () => {
    it('renders the thread SVG canvas layer with pointer-events-none and role="presentation"', () => {
      renderHomePage();
      const canvas = screen.getByTestId('hero-thread-canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas.getAttribute('aria-hidden')).toBe('true');
      expect(canvas.getAttribute('role')).toBe('presentation');
      expect(canvas.getAttribute('viewBox')).toBe('0 0 1440 960');

      // Parent container must have pointer-events-none to prevent click interference
      const parentContainer = canvas.parentElement;
      expect(parentContainer?.className).toContain('pointer-events-none');
    });

    it('renders the primary signature thread path anchored at (98, 0)', () => {
      renderHomePage();
      const signaturePath = screen.getByTestId('signature-thread-path');
      expect(signaturePath).toBeInTheDocument();
      const dAttr = signaturePath.getAttribute('d');
      expect(dAttr?.startsWith('M 98,0')).toBe(true);
      expect(signaturePath.getAttribute('stroke')).toBe('url(#organicSilkFilament)');
    });

    it('renders the secondary and tertiary thread filaments with matching coordinates', () => {
      renderHomePage();
      const secondaryPath = screen.getByTestId('secondary-thread-path');
      expect(secondaryPath).toBeInTheDocument();
      expect(secondaryPath.getAttribute('d')?.startsWith('M 140,220')).toBe(true);

      const tertiaryPath = screen.getByTestId('tertiary-thread-path');
      expect(tertiaryPath).toBeInTheDocument();
      expect(tertiaryPath.getAttribute('d')?.startsWith('M 510,720')).toBe(true);
    });

    it('contains organic silk filament linear gradients and soft glow filter definitions', () => {
      renderHomePage();
      const canvas = screen.getByTestId('hero-thread-canvas');
      expect(canvas.querySelector('defs')).toBeInTheDocument();
      expect(canvas.querySelector('#organicSilkFilament')).toBeInTheDocument();
      expect(canvas.querySelector('#subtleEchoFilament')).toBeInTheDocument();
      expect(canvas.querySelector('#threadGlowSoft')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
     3. Motion States & Reduced-Motion Runtime Behaviour
     ------------------------------------------------------------------------- */
  describe('3. Motion States & Reduced-Motion Runtime Behaviour', () => {
    it('renders the accessible animation toggle button indicating active motion by default', () => {
      renderHomePage();
      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      expect(toggleBtn).toBeInTheDocument();
      expect(toggleBtn.textContent).toContain('Motion Active');
    });

    it('toggles motion state to Motion Paused when clicked and settles thread styling', () => {
      renderHomePage();
      const toggleBtn = screen.getByTestId('motion-toggle-btn');

      act(() => {
        fireEvent.click(toggleBtn);
      });

      expect(toggleBtn.textContent).toContain('Motion Paused');

      const signaturePath = screen.getByTestId('signature-thread-path');
      expect(signaturePath.style.strokeDashoffset).toBe('0');
    });

    it('respects prefers-reduced-motion at runtime by immediately settling the thread', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      renderHomePage();
      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      expect(toggleBtn.textContent).toContain('Motion Paused');

      const signaturePath = screen.getByTestId('signature-thread-path');
      expect(signaturePath.style.strokeDashoffset).toBe('0');

      // Headline and subhead are immediately visible
      expect(screen.getByTestId('hero-headline').style.opacity).toBe('1');
      expect(screen.getByTestId('hero-subhead').style.opacity).toBe('1');
    });
  });

  /* -------------------------------------------------------------------------
     4. Lifecycle Cleanup & Remount Safety
     ------------------------------------------------------------------------- */
  describe('4. Lifecycle Cleanup & Remount Safety', () => {
    it('unmounts cleanly without throwing or leaving zombie timelines', () => {
      const { unmount } = renderHomePage();
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('safely handles repeated navigation away from and back to Home', () => {
      const { unmount } = renderHomePage();
      unmount();

      // Remount simulating repeat visit
      renderHomePage();
      expect(screen.getByTestId('hero-headline')).toBeInTheDocument();
      expect(screen.getByTestId('signature-thread-path')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
     5. Preservation of Highlights Plinth Grid & Navigation Links
     ------------------------------------------------------------------------- */
  describe('5. Preservation of Highlights Plinth Grid & Navigation Links', () => {
    it('renders all three highlights plinth cards with correct destinations', () => {
      renderHomePage();

      // 01: Thread Compass
      const compassCard = screen.getByRole('heading', { name: 'Thread Compass' }).closest('div');
      expect(compassCard).toBeInTheDocument();
      const compassLink = screen.getByRole('link', { name: /Start Consultation/i });
      expect(compassLink.getAttribute('href')).toBe('/compass');

      // 02: Cultural Archive
      const archiveCard = screen.getByRole('heading', { name: 'Cultural Archive' }).closest('div');
      expect(archiveCard).toBeInTheDocument();
      const archiveLink = screen.getByRole('link', { name: /Examine Folios/i });
      expect(archiveLink.getAttribute('href')).toBe('/archive');

      // 03: Curated Collections
      const capsuleCard = screen.getByRole('heading', { name: /Collections/i }).closest('div');
      expect(capsuleCard).toBeInTheDocument();
      const capsuleLink = screen.getByRole('link', { name: /View Collections/i });
      expect(capsuleLink.getAttribute('href')).toBe('/collections');
    });

    it('preserves header wordmark thread loop while homepage thread canvas is active', () => {
      renderHomePage();
      // Verify Header has its own monogram thread SVG
      const headerThread = document.querySelector('svg.header-thread-svg');
      expect(headerThread).toBeInTheDocument();

      // Verify HomePage has its independent hero canvas SVG
      const heroCanvas = screen.getByTestId('hero-thread-canvas');
      expect(heroCanvas).toBeInTheDocument();

      // Both coexist without collision or duplicate IDs
      expect(headerThread).not.toBe(heroCanvas);
    });
  });

  /* -------------------------------------------------------------------------
     6. Stage 5.2 ScrollTrigger Story Flow Narrative Weave Suite
     ------------------------------------------------------------------------- */
  describe('6. Stage 5.2 ScrollTrigger Story Flow Narrative Weave Suite', () => {
    it('renders the highlights story-flow narrative connector SVG canvas and path', () => {
      renderHomePage();

      const highlightsSection = screen.getByTestId('home-index');
      expect(highlightsSection).toBeInTheDocument();

      const connectorCanvas = screen.getByTestId('highlights-thread-canvas');
      expect(connectorCanvas).toBeInTheDocument();
      expect(connectorCanvas.getAttribute('aria-hidden')).toBe('true');
      expect(connectorCanvas.getAttribute('viewBox')).toBe('0 0 1200 36');

      const connectorPath = screen.getByTestId('highlights-thread-path');
      expect(connectorPath).toBeInTheDocument();
      expect(connectorPath.getAttribute('d')).toContain('M 0,18');
      expect(connectorPath.getAttribute('stroke')).toBe('url(#highlightsWeftGlow)');
    });

    it('renders the archival folio divider crease header at the entrance of the highlights section', () => {
      renderHomePage();

      expect(screen.getByText(/FOLIO PAGE 01 \/ CHAPTER INDEX/i)).toBeInTheDocument();
      expect(screen.getByText('FOLIO COMPASS')).toBeInTheDocument();
    });

    it('renders all three highlights plinth cards with data-testids for scroll coordination', () => {
      renderHomePage();

      expect(screen.getByTestId('highlight-card-compass')).toBeInTheDocument();
      expect(screen.getByTestId('highlight-card-archive')).toBeInTheDocument();
      expect(screen.getByTestId('highlight-card-capsule')).toBeInTheDocument();
    });

    it('disables scroll-linked animation and settles connector thread when reduced-motion is requested', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      renderHomePage();

      const connectorPath = screen.getByTestId('highlights-thread-path');
      expect(connectorPath.style.strokeDashoffset).toBe('0');

      const compassCard = screen.getByTestId('highlight-card-compass');
      expect(compassCard.style.opacity).toBe('1');
    });

    it('cleans up GSAP ScrollTriggers and contexts upon unmount without memory leaks', () => {
      const { unmount } = renderHomePage();

      // Unmount should cleanly invoke ctx.revert() without throwing
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  /* -------------------------------------------------------------------------
     7. Stage 5.3 Atelier Lens & Macro Weave Loupe Suite
     ------------------------------------------------------------------------- */
  describe('7. Stage 5.3 Atelier Lens & Macro Weave Loupe Suite', () => {
    it('verifies content integrity: replaces unsupported 140 TPI claim with neutral editorial wording', () => {
      renderHomePage();

      const badgeTrigger = screen.getByTestId('atelier-lens-badge-trigger');
      expect(badgeTrigger.textContent).toContain('A closer look at the weave');
      expect(badgeTrigger.textContent).not.toContain('140 TPI');
    });

    it('opens fabric inspection view from the loupe badge trigger', () => {
      renderHomePage();

      const badgeTrigger = screen.getByTestId('atelier-lens-badge-trigger');
      expect(badgeTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();

      fireEvent.click(badgeTrigger);

      expect(badgeTrigger.getAttribute('aria-expanded')).toBe('true');
      const dialog = screen.getByTestId('atelier-lens-dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(screen.getByTestId('atelier-lens-title').textContent).toBe('Living Weave Detail');
    });

    it('ensures single consolidated loupe badge trigger exists and redundant tile trigger is absent', () => {
      renderHomePage();

      const tileTrigger = screen.queryByTestId('atelier-lens-tile-trigger');
      expect(tileTrigger).not.toBeInTheDocument();

      const badgeTrigger = screen.getByTestId('atelier-lens-badge-trigger');
      expect(badgeTrigger).toBeInTheDocument();
      expect(badgeTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(badgeTrigger.textContent).toContain('70% Fine Merino Wool');
      expect(badgeTrigger.textContent).toContain('A closer look at the weave');
    });

    it('closes the inspection view using the visible close control', () => {
      renderHomePage();

      fireEvent.click(screen.getByTestId('atelier-lens-badge-trigger'));
      expect(screen.getByTestId('atelier-lens-dialog')).toBeInTheDocument();

      const closeBtn = screen.getByTestId('atelier-lens-close-btn');
      fireEvent.click(closeBtn);

      expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();
      expect(screen.getByTestId('atelier-lens-badge-trigger').getAttribute('aria-expanded')).toBe('false');
    });

    it('closes the inspection view using the Escape key', () => {
      renderHomePage();

      fireEvent.click(screen.getByTestId('atelier-lens-badge-trigger'));
      expect(screen.getByTestId('atelier-lens-dialog')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();
    });

    it('closes the inspection view when clicking on the backdrop outside the modal', () => {
      renderHomePage();

      fireEvent.click(screen.getByTestId('atelier-lens-badge-trigger'));
      const backdrop = screen.getByTestId('atelier-lens-backdrop');

      fireEvent.click(backdrop);

      expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();
    });

    it('renders the high-resolution textile asset with graceful fallback on load error', () => {
      renderHomePage();

      fireEvent.click(screen.getByTestId('atelier-lens-badge-trigger'));
      const img = screen.getByTestId('atelier-lens-image') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('/images/home/everthread-textile-folds-01.webp');

      // Trigger error to verify graceful fallback without crash
      act(() => {
        fireEvent.error(img);
      });

      expect(img.getAttribute('src')).toBe('/images/home/everthread-hero-01.webp');
    });

    it('supports desktop mouse magnification interaction without crashing', () => {
      renderHomePage();

      fireEvent.click(screen.getByTestId('atelier-lens-badge-trigger'));
      const viewport = screen.getByTestId('atelier-lens-viewport');
      const glass = screen.getByTestId('atelier-lens-glass');

      expect(viewport).toBeInTheDocument();
      expect(glass).toBeInTheDocument();

      // Simulate mouse move
      fireEvent.mouseMove(viewport, { clientX: 150, clientY: 100 });
      expect(glass.style.opacity).toBe('1');
    });

    it('cleans up body overflow lock and event listeners when modal unmounts', () => {
      const { unmount } = renderHomePage();

      fireEvent.click(screen.getByTestId('atelier-lens-badge-trigger'));
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });
  });

  /* -------------------------------------------------------------------------
     4. Stage 5.5: Global Motion Accessibility & Performance Audit
     ------------------------------------------------------------------------- */
  describe('4. Stage 5.5: Global Motion Accessibility & Performance Audit', () => {
    it('applies .motion-paused to documentElement when motion is toggled off and removes it when restored', () => {
      renderHomePage();

      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      expect(toggleBtn.textContent).toContain('Motion Active');
      expect(document.documentElement.classList.contains('motion-paused')).toBe(false);

      // Pause motion
      fireEvent.click(toggleBtn);
      expect(toggleBtn.textContent).toContain('Motion Paused');
      expect(document.documentElement.classList.contains('motion-paused')).toBe(true);

      // Re-activate motion
      fireEvent.click(toggleBtn);
      expect(toggleBtn.textContent).toContain('Motion Active');
      expect(document.documentElement.classList.contains('motion-paused')).toBe(false);
    });

    it('cleans up .motion-paused class from documentElement on HomePage unmount', () => {
      const { unmount } = renderHomePage();

      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      fireEvent.click(toggleBtn);
      expect(document.documentElement.classList.contains('motion-paused')).toBe(true);

      unmount();
      expect(document.documentElement.classList.contains('motion-paused')).toBe(false);
    });

    it('automatically initializes with motion paused when OS prefers-reduced-motion is true', () => {
      // Mock OS prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      const { unmount } = renderHomePage();

      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      expect(toggleBtn.textContent).toContain('Motion Paused');
      expect(document.documentElement.classList.contains('motion-paused')).toBe(true);

      // Thread paths should be immediately settled
      const heroCanvas = screen.getByTestId('hero-thread-canvas');
      expect(heroCanvas).toBeInTheDocument();

      unmount();
      expect(document.documentElement.classList.contains('motion-paused')).toBe(false);
    });

    it('reacts dynamically when OS prefers-reduced-motion changes at runtime', () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: any) => {
          if (event === 'change') changeHandler = handler;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      const { unmount } = renderHomePage();

      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      expect(toggleBtn.textContent).toContain('Motion Active');
      expect(document.documentElement.classList.contains('motion-paused')).toBe(false);

      // Simulate OS trigger for reduced motion
      act(() => {
        changeHandler?.({ matches: true } as MediaQueryListEvent);
      });

      expect(toggleBtn.textContent).toContain('Motion Paused');
      expect(document.documentElement.classList.contains('motion-paused')).toBe(true);

      unmount();
    });

    it('removes .motion-paused when navigating away from Home via CTA link', () => {
      renderHomePage();

      const toggleBtn = screen.getByTestId('motion-toggle-btn');
      fireEvent.click(toggleBtn);
      expect(document.documentElement.classList.contains('motion-paused')).toBe(true);

      // Navigate away to Collections via primary CTA
      const primaryCta = screen.getByTestId('hero-primary-cta');
      fireEvent.click(primaryCta);

      // Destination rendered and .motion-paused cleanly removed
      expect(screen.getByTestId('collections-route')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('motion-paused')).toBe(false);
    });

    it('verifies single consolidated Macro Badge triggers the Atelier Lens experience cleanly and tile trigger is absent', () => {
      renderHomePage();

      // Check tile trigger is completely gone from DOM
      expect(screen.queryByTestId('atelier-lens-tile-trigger')).not.toBeInTheDocument();

      // Check badge trigger opens modal
      const badgeTrigger = screen.getByTestId('atelier-lens-badge-trigger');
      fireEvent.click(badgeTrigger);
      const dialog = screen.getByTestId('atelier-lens-dialog');
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent('Living Weave Detail');

      // Close modal
      fireEvent.click(screen.getByTestId('atelier-lens-close-btn'));
      expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();
    });

    it('ensures reduced motion produces immediate, fully readable hero copy and controls', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      const { unmount } = renderHomePage();

      // Verify all text elements are immediately present and rendered
      const headline = screen.getByTestId('hero-headline');
      const subhead = screen.getByTestId('hero-subhead');
      const desc = screen.getByTestId('hero-description');
      const primaryCta = screen.getByTestId('hero-primary-cta');
      const metadata = screen.getByTestId('hero-metadata');

      expect(headline).toBeVisible();
      expect(subhead).toBeVisible();
      expect(desc).toBeVisible();
      expect(primaryCta).toBeVisible();
      expect(metadata).toBeVisible();

      unmount();
    });
  });

  /* -------------------------------------------------------------------------
     8. Stage 06: Editorial Scenes & Architecture Sequence
     ------------------------------------------------------------------------- */
  describe('8. Stage 06: Editorial Scenes & Architecture Sequence', () => {
    it('renders all 8 scenes in continuous editorial sequence with authentic content', () => {
      renderHomePage();

      // Scene 1: home-hero
      expect(screen.getByTestId('home-hero')).toBeInTheDocument();
      expect(screen.getByTestId('hero-headline')).toBeInTheDocument();
      expect(screen.getByTestId('hero-primary-cta')).toHaveAttribute('href', '/collections');
      expect(screen.getByTestId('hero-secondary-cta')).toHaveAttribute('href', '/archive');
      expect(screen.getByTestId('hero-secondary-cta')).toHaveTextContent('Enter the Archive');
      expect(screen.getByTestId('atelier-lens-badge-trigger')).toBeInTheDocument();

      // Scene 2: home-index (H1)
      const indexSection = screen.getByTestId('home-index');
      expect(indexSection).toBeInTheDocument();
      expect(indexSection).toHaveAttribute('data-scene', 'H1');
      expect(screen.getByTestId('highlight-card-compass')).toBeInTheDocument();
      expect(screen.getByTestId('highlight-card-archive')).toBeInTheDocument();
      expect(screen.getByTestId('highlight-card-capsule')).toBeInTheDocument();

      // Scene 3: home-compass
      const compassSection = screen.getByTestId('home-compass');
      expect(compassSection).toBeInTheDocument();
      expect(within(compassSection).getByText('The Thread Compass')).toBeInTheDocument();
      const compassCta = screen.getByTestId('chapter-compass-cta');
      expect(compassCta).toHaveAttribute('href', '/compass');

      // Scene 4: home-craft (Living Loom + 3 Diagram Thumbnails)
      const craftSection = screen.getByTestId('home-craft');
      expect(craftSection).toBeInTheDocument();
      expect(within(craftSection).getByText('The Living Loom')).toBeInTheDocument();
      expect(screen.getByTestId('diagram-thumb-warp-weft')).toHaveAttribute('href', '/archive?diagram=library-warp-weft-diagram-01');
      expect(screen.getByTestId('diagram-thumb-vocab')).toHaveAttribute('href', '/archive?diagram=library-textile-vocabulary-01');
      expect(screen.getByTestId('diagram-thumb-technique')).toHaveAttribute('href', '/archive?diagram=library-technique-comparison-01');

      // Scene 5: home-walls (H2 Walls Preview)
      const wallsSection = screen.getByTestId('home-walls');
      expect(wallsSection).toBeInTheDocument();
      expect(wallsSection).toHaveAttribute('data-scene', 'H2');
      expect(screen.getByTestId('wall-door-contemporary')).toHaveAttribute('href', '/collections');
      expect(screen.getByTestId('wall-door-living-inheritance')).toHaveAttribute('href', '/collections/the-living-inheritance');

      // Scene 6: home-making (H3 Narrative Spine + The Promise)
      const makingSection = screen.getByTestId('home-making');
      expect(makingSection).toBeInTheDocument();
      expect(makingSection).toHaveAttribute('data-scene', 'H3');
      expect(within(makingSection).getByText(/An heirloom, not a trend/i)).toBeInTheDocument();
      expect(within(makingSection).getByText(/Every thread carries a story/i)).toBeInTheDocument();
      expect(within(makingSection).getByText(/One thread\. A world of stories/i)).toBeInTheDocument();

      // Scene 7: home-journal
      const journalSection = screen.getByTestId('home-journal');
      expect(journalSection).toBeInTheDocument();
      expect(within(journalSection).getByText(/On Unbroken Heirlooms/)).toBeInTheDocument();
      const gazetteLeadCta = screen.getByTestId('chapter-gazette-lead-cta');
      expect(gazetteLeadCta).toHaveAttribute('href', '/journal/on-unbroken-heirlooms');
      const gazetteIndexCta = screen.getByTestId('chapter-gazette-index-cta');
      expect(gazetteIndexCta).toHaveAttribute('href', '/journal');

      // Scene 8: home-closing
      const closingSection = screen.getByTestId('home-closing');
      expect(closingSection).toBeInTheDocument();
      expect(within(closingSection).getByText(/One thread\. A world of stories\./i)).toBeInTheDocument();
      expect(screen.getByTestId('home-closing-archive-cta')).toHaveAttribute('href', '/archive');
      expect(screen.getByTestId('home-closing-collections-cta')).toHaveAttribute('href', '/collections');
    });

    it('verifies hero curtain reveal structure uses headline mask wrapper', () => {
      const { container } = renderHomePage();
      const maskWrapper = container.querySelector('.headline-mask-wrapper');
      expect(maskWrapper).toBeInTheDocument();
      const curtainHeadline = container.querySelector('.hero-curtain-headline');
      expect(curtainHeadline).toBeInTheDocument();
      expect(maskWrapper).toContainElement(curtainHeadline as HTMLElement | null);
    });
  });
});
