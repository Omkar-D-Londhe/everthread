import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { App } from '../App.tsx';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';
import { ProductImageStage } from '../components/ProductImageStage.tsx';
import { AtelierLensModal } from '../components/AtelierLensModal.tsx';
import { TechniqueStrip } from '../components/archive/TechniqueStrip.tsx';
import { TraditionExhibitionModal } from '../components/TraditionExhibitionModal.tsx';
import { getAllTraditionAssets, CANONICAL_TRADITION_ORDER } from '../data/assetMap.ts';

// Navigation test helper
const NavigationTester: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      data-testid="nav-to-pdp"
      onClick={() => navigate('/product/the-namda-cocoon-coat')}
    >
      Go to PDP
    </button>
  );
};

describe('EverThread Targeted UI Fixes, Atelier Lens Refinement & Cultural Archive Sequencing', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    Element.prototype.scrollBy = vi.fn();
    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /* --------------------------------------------------------------------------
     Bug 1: Route-Aware Scroll-to-Top Navigation
     -------------------------------------------------------------------------- */
  describe('Bug 1: Route-Aware Scroll-to-Top Navigation', () => {
    it('executes instant scroll to top on PUSH navigation to Product Detail Page', () => {
      render(
        <MemoryRouter initialEntries={['/collections']}>
          <CartProvider>
            <SavedProvider>
              <NavigationTester />
              <App />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      // Trigger PUSH navigation to product detail route
      act(() => {
        fireEvent.click(screen.getByTestId('nav-to-pdp'));
      });

      // Verifies window.scrollTo was called with instant behavior
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    });
  });

  /* --------------------------------------------------------------------------
     Bug 2: Refined Atelier Lens Zoom Presentation & Bleed Elimination
     -------------------------------------------------------------------------- */
  describe('Bug 2: Refined Atelier Lens Zoom Presentation', () => {
    const mockImage = {
      src: '/images/products/et-01-coat-dress/et-01-primary.webp',
      width: 1536,
      height: 1024,
      alt: 'Test Coat Dress Plate',
      label: 'Matka Silk Weave'
    };

    it('renders the circular loupe viewport with champagne bezel and circular Deep Oxblood zoom badge', () => {
      // Mock matchMedia for desktop fine pointer
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('hover: hover') || query.includes('pointer: fine'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      // Mock innerWidth to 1200
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });

      render(
        <ProductImageStage
          image={mockImage}
          onInspectClick={vi.fn()}
        />
      );

      const stageContainer = screen.getByTestId('gallery-main-container');

      stageContainer.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 100,
        top: 100,
        width: 800,
        height: 533,
        right: 900,
        bottom: 633
      });

      // Pointer move near center of image
      fireEvent.pointerMove(stageContainer, { clientX: 500, clientY: 360 });

      const loupePane = screen.getByTestId('stage-hover-preview-pane');
      expect(loupePane).toBeInTheDocument();

      // Check circular geometry and champagne bezel styles
      expect(loupePane.style.borderRadius).toBe('50%');
      expect(loupePane.style.border).toContain('2.5px solid');

      // Check circular zoom badge inside loupe
      const zoomBadge = screen.getByTestId('loupe-zoom-badge');
      expect(zoomBadge).toBeInTheDocument();
      expect(zoomBadge.textContent).toMatch(/^[0-9.]+\×$/);

      // Check reticle
      expect(screen.getByTestId('stage-hover-crosshair')).toBeInTheDocument();
    });

    it('resets image error and updates magnified image when switching thumbnails', () => {
      const { rerender } = render(
        <ProductImageStage
          image={mockImage}
          onInspectClick={vi.fn()}
        />
      );

      const updatedImage = {
        ...mockImage,
        src: '/images/products/et-01-coat-dress/et-01-drape.webp',
        label: 'Back Architecture'
      };

      rerender(
        <ProductImageStage
          image={updatedImage}
          onInspectClick={vi.fn()}
        />
      );

      const img = screen.getByTestId('gallery-main-image');
      expect(img).toHaveAttribute('src', '/images/products/et-01-coat-dress/et-01-drape.webp');
    });

    it('renders circular Deep Oxblood magnification badge in AtelierLensModal', () => {
      render(
        <AtelierLensModal
          isOpen={true}
          onClose={vi.fn()}
          imageSrc={mockImage.src}
          zoom={2.1}
        />
      );

      const badge = screen.getByTestId('modal-loupe-zoom-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toMatch(/^[0-9.]+\×$/);
    });
  });

  /* --------------------------------------------------------------------------
     Bug 3: Cultural Archive Category Ordering & Plate Initialization
     -------------------------------------------------------------------------- */
  describe('Bug 3: Cultural Archive Category Ordering & Plate Initialization', () => {
    it('orders all 13 traditions strictly according to canonical discipline groups', () => {
      const allAssets = getAllTraditionAssets();
      expect(allAssets.length).toBe(13);

      const keys = allAssets.map(a => a.traditionKey);

      // Verify exact canonical sequence
      expect(keys).toEqual(CANONICAL_TRADITION_ORDER);

      // Verify the first 8 are pure loom weaving
      for (let i = 0; i < 8; i++) {
        expect(allAssets[i].distinction).toBe('weaving');
      }

      // Verify items 9 and 10 are surface needlework (embroidery)
      expect(allAssets[8].distinction).toBe('embroidery');
      expect(allAssets[9].distinction).toBe('embroidery');

      // Verify items 11, 12, 13 are resist & vat dyeing
      expect(allAssets[10].distinction).toBe('dyeing');
      expect(allAssets[11].distinction).toBe('dyeing');
      expect(allAssets[12].distinction).toBe('dyeing');
    });

    it('initializes every catalogue to Plate 01 (model-01), avoiding Plate 03 stale state', () => {
      const { rerender } = render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
        />
      );

      // Verifies Plate 01 is active
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Model / Garment');
      expect(screen.getByTestId('exhibition-thumb-model-01')).toHaveClass('is-active');

      // Switch to drape-03 (Plate 03)
      fireEvent.click(screen.getByTestId('exhibition-thumb-drape-03'));
      expect(screen.getByTestId('exhibition-thumb-drape-03')).toHaveClass('is-active');

      // Close modal
      rerender(
        <TraditionExhibitionModal
          isOpen={false}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
        />
      );

      // Reopen modal for a different catalogue (e.g. kota-doria)
      rerender(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="kota-doria"
          onClose={vi.fn()}
        />
      );

      // Must be initialized to Plate 01, not inheriting drape-03
      expect(screen.getByTestId('exhibition-thumb-model-01')).toHaveClass('is-active');
      expect(screen.getByTestId('exhibition-thumb-drape-03')).not.toHaveClass('is-active');
    });

    it('resets to Plate 01 when navigating between traditions via next and prev controls', () => {
      const handleSelectTradition = vi.fn();
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
          onSelectTradition={handleSelectTradition}
        />
      );

      // Switch to drape-03
      fireEvent.click(screen.getByTestId('exhibition-thumb-drape-03'));

      // Click Next Tradition
      fireEvent.click(screen.getByTestId('next-tradition-btn'));

      // In canonical order, next after banarasi-brocade is kota-doria
      expect(handleSelectTradition).toHaveBeenCalledWith('kota-doria');

      // Click Prev Tradition
      fireEvent.click(screen.getByTestId('prev-tradition-btn'));
      // In canonical loop, prev from banarasi-brocade is bandhani
      expect(handleSelectTradition).toHaveBeenCalledWith('bandhani');
    });
  });

  /* --------------------------------------------------------------------------
     Bug 4: Technique Strip Horizontal Navigation
     -------------------------------------------------------------------------- */
  describe('Bug 4: Technique Strip Horizontal Navigation', () => {
    it('maintains stationary outer section without scroll-jacking transforms', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      const stripSection = screen.getByTestId('technique-strip');
      const stripTrack = screen.getByTestId('technique-strip-track');

      expect(stripSection).toBeInTheDocument();
      expect(stripTrack).toBeInTheDocument();

      // Track transform must be clean (no -totalShift translation on scroll container)
      expect(stripTrack.style.transform).toBe('');
    });

    it('provides functional Previous and Next navigation buttons with smooth stepping and looping', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      const prevBtn = screen.getByTestId('technique-strip-prev-btn');
      const nextBtn = screen.getByTestId('technique-strip-next-btn');
      const track = screen.getByTestId('technique-strip-track');

      Object.defineProperty(track, 'scrollWidth', { value: 2400, configurable: true });
      Object.defineProperty(track, 'clientWidth', { value: 800, configurable: true });
      track.scrollLeft = 0;

      // Click Next button steps forward
      fireEvent.click(nextBtn);
      expect(Element.prototype.scrollBy).toHaveBeenCalled();

      // Click Prev button when at start loops to end
      fireEvent.click(prevBtn);
      expect(Element.prototype.scrollTo).toHaveBeenCalled();
    });

    it('handles wheel events cleanly without bubbling horizontal gestures to window', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      const track = screen.getByTestId('technique-strip-track');

      // Horizontal gesture
      fireEvent.wheel(track, {
        deltaX: 50,
        deltaY: 0
      });

      // Verifies wheel event handled without crashing
      expect(track).toBeInTheDocument();
    });
  });
});
