import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRef } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MOTION_TOKENS } from '../config/designTokens.ts';
import { SceneFold } from '../components/motion/SceneFold.tsx';
import { StrandThread } from '../components/motion/StrandThread.tsx';
import { useSceneFold } from '../hooks/useSceneFold.ts';
import { useExhibitionOpening } from '../hooks/useExhibitionOpening.ts';
import { HomePage } from '../pages/HomePage.tsx';
import { ArchivePage } from '../pages/ArchivePage.tsx';
import { HousePage } from '../pages/HousePage.tsx';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';

describe('EverThread Stage 08: Motion System, Fold Scenes & Thread Continuity Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.scrollTo = vi.fn();
    delete (window as unknown as { __EVERTHREAD_TEST_MOTION__?: boolean }).__EVERTHREAD_TEST_MOTION__;
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
    delete (window as unknown as { __EVERTHREAD_TEST_MOTION__?: boolean }).__EVERTHREAD_TEST_MOTION__;
  });

  /* -------------------------------------------------------------------------
     1. Motion Tokens Parameter Register (Section 9 Verification)
     ------------------------------------------------------------------------- */
  describe('1. Motion Tokens Parameter Register (§9)', () => {
    it('contains approved fold parameters', () => {
      expect(MOTION_TOKENS.fold.scrubSmoothing).toBe(0.5);
      expect(MOTION_TOKENS.fold.scrubStartViewportRatio).toBe(0.9);
      expect(MOTION_TOKENS.fold.scrubEndViewportRatio).toBe(0.4);
      expect(MOTION_TOKENS.fold.bandsDesktop).toBe(3);
      expect(MOTION_TOKENS.fold.bandsMobile).toBe(2);
      expect(MOTION_TOKENS.fold.bandStagger).toBe(0.12);
      expect(MOTION_TOKENS.fold.maxHingeAngleDesktop).toBe(90);
      expect(MOTION_TOKENS.fold.maxHingeAngleMobile).toBe(45);
      expect(MOTION_TOKENS.fold.restTiltMobile).toBe(6);
      expect(MOTION_TOKENS.fold.containerPerspective).toBe(1200);
      expect(MOTION_TOKENS.fold.idleDetectionMs).toBe(140);
      expect(MOTION_TOKENS.fold.settleDurationSec).toBe(0.35);
      expect(MOTION_TOKENS.fold.fastEntryThresholdViewportsPer100ms).toBe(1.0);
    });

    it('contains approved exhibition 5-step parameters', () => {
      expect(MOTION_TOKENS.exhibition.totalDurationMax).toBeLessThanOrEqual(1.2);
      expect(MOTION_TOKENS.exhibition.step1Cover.start).toBe(0);
      expect(MOTION_TOKENS.exhibition.step1Cover.end).toBe(0.2);
      expect(MOTION_TOKENS.exhibition.step2Surface.start).toBe(0.15);
      expect(MOTION_TOKENS.exhibition.step2Surface.end).toBe(0.45);
      expect(MOTION_TOKENS.exhibition.step3MainImage.start).toBe(0.3);
      expect(MOTION_TOKENS.exhibition.step3MainImage.end).toBe(0.7);
      expect(MOTION_TOKENS.exhibition.step4Views.start).toBe(0.55);
      expect(MOTION_TOKENS.exhibition.step4Views.end).toBe(1.0);
      expect(MOTION_TOKENS.exhibition.step4Views.stagger).toBe(0.06);
      expect(MOTION_TOKENS.exhibition.step5Thread.start).toBe(0.9);
      expect(MOTION_TOKENS.exhibition.step5Thread.end).toBe(1.2);
    });

    it('contains approved thread and wall parameters', () => {
      expect(MOTION_TOKENS.thread.drawDurationSec).toBe(0.6);
      expect(MOTION_TOKENS.thread.pulseDurationSec).toBe(0.4);
      expect(MOTION_TOKENS.wall.panelWidthDesktopVw).toBe(88);
      expect(MOTION_TOKENS.wall.panelWidthMobileVw).toBe(92);
      expect(MOTION_TOKENS.wall.peekRatio).toBe(0.12);
      expect(MOTION_TOKENS.wall.settleThreshold).toBe(0.6);
    });
  });

  /* -------------------------------------------------------------------------
     2. SceneFold Component & useSceneFold Hook Lifecycle
     ------------------------------------------------------------------------- */
  describe('2. SceneFold Component & useSceneFold Hook Lifecycle', () => {
    it('renders with 3 architectural bands on desktop when active in motion test mode', () => {
      (window as unknown as { __EVERTHREAD_TEST_MOTION__?: boolean }).__EVERTHREAD_TEST_MOTION__ = true;
      const originalGetBCR = HTMLElement.prototype.getBoundingClientRect;
      HTMLElement.prototype.getBoundingClientRect = function() {
        return {
          top: 1500,
          bottom: 2000,
          left: 0,
          right: 1000,
          width: 1000,
          height: 500,
          x: 0,
          y: 1500,
          toJSON: () => {}
        };
      };

      try {
        const { container } = render(
          <SceneFold sceneId="H1">
            <div data-testid="test-content">Content</div>
          </SceneFold>
        );

        const fold = container.querySelector('[data-scene="H1"]');
        expect(fold).toBeInTheDocument();
        expect(container.querySelector('[data-testid="test-content"]')).toBeInTheDocument();

        const panels = container.querySelector('.scene-fold__panels');
        expect(panels).toBeInTheDocument();
        expect(panels?.querySelectorAll('.scene-fold__band').length).toBe(3);
      } finally {
        HTMLElement.prototype.getBoundingClientRect = originalGetBCR;
      }
    });

    it('suppresses fold panels immediately when reduced motion is preferred', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }));

      const { container } = render(
        <SceneFold sceneId="H1">
          <div data-testid="test-content">Content</div>
        </SceneFold>
      );

      expect(container.querySelector('.scene-fold__panels')).toBeNull();
      expect(container.querySelector('.scene-fold')).toHaveClass('is-complete');
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('immediately completes fold on keyboard focusin when active', () => {
      (window as unknown as { __EVERTHREAD_TEST_MOTION__?: boolean }).__EVERTHREAD_TEST_MOTION__ = true;
      const originalGetBCR = HTMLElement.prototype.getBoundingClientRect;
      HTMLElement.prototype.getBoundingClientRect = function() {
        return {
          top: 1500,
          bottom: 2000,
          left: 0,
          right: 1000,
          width: 1000,
          height: 500,
          x: 0,
          y: 1500,
          toJSON: () => {}
        };
      };

      try {
        const { container } = render(
          <SceneFold sceneId="H2">
            <button data-testid="fold-inner-button">Action</button>
          </SceneFold>
        );

        const fold = container.querySelector('[data-scene="H2"]');
        expect(fold).not.toHaveClass('is-complete');

        const button = screen.getByTestId('fold-inner-button');
        fireEvent.focusIn(button);

        expect(fold).toHaveClass('is-complete');
      } finally {
        HTMLElement.prototype.getBoundingClientRect = originalGetBCR;
      }
    });

    it('tracks ScrollTrigger instance count for memory leak prevention', () => {
      window.__scrollTriggerCount = 0;

      const TestComponent = () => {
        const ref = useRef<HTMLDivElement>(null);
        useSceneFold(ref, { sceneId: 'H1' });
        return <div ref={ref} />;
      };

      const { unmount } = render(<TestComponent />);
      expect(typeof window.__scrollTriggerCount).toBe('number');
      unmount();
      expect(window.__scrollTriggerCount).toBe(0);
    });
  });

  /* -------------------------------------------------------------------------
     3. StrandThread Component & 5 Placements
     ------------------------------------------------------------------------- */
  describe('3. StrandThread Component', () => {
    it('renders crossing variant with correct path data', () => {
      const { container } = render(
        <StrandThread variant="crossing" width="100%" height={24} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1440 24');

      const path = container.querySelector('path');
      expect(path).toHaveAttribute('stroke', 'var(--color-champagne-thread, #B49A70)');
    });

    it('renders curve variant with 1200 viewBox', () => {
      const { container } = render(
        <StrandThread variant="curve" width="100%" height={28} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1200 24');
    });

    it('applies pulse class when pulse is true', () => {
      const { container } = render(
        <StrandThread variant="horizontal" pulse={true} />
      );

      const wrapper = container.querySelector('.strand-thread-container');
      expect(wrapper).toHaveClass('strand-thread-pulse');
    });
  });

  /* -------------------------------------------------------------------------
     4. useExhibitionOpening Hook
     ------------------------------------------------------------------------- */
  describe('4. useExhibitionOpening Hook', () => {
    it('provides interruptAndComplete to skip directly to finished state', () => {
      const modalElement = document.createElement('div');
      const step1 = document.createElement('div');
      step1.setAttribute('data-step', 'cover');
      modalElement.appendChild(step1);

      const modalRef = { current: modalElement };
      const { result } = renderHook(() =>
        useExhibitionOpening({
          modalRef,
          isOpen: true,
          activeRole: 'model-01'
        })
      );

      expect(typeof result.current.interruptAndComplete).toBe('function');
      act(() => {
        result.current.interruptAndComplete();
      });
      // After interruptAndComplete, all step elements in the modal have inline opacity '1'
      expect(step1.style.opacity).toBe('1');
    });
  });

  /* -------------------------------------------------------------------------
     5. Canonical 7 Fold Boundaries Across All 3 Pages
     ------------------------------------------------------------------------- */
  describe('5. Canonical 7 Fold Boundaries Across All 3 Pages', () => {
    it('HomePage contains H1, H2, and H3 SceneFolds in sequence', () => {
      const { container } = render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <HomePage />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(container.querySelector('[data-scene-fold="H1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-scene-fold="H2"]')).toBeInTheDocument();
      expect(container.querySelector('[data-scene-fold="H3"]')).toBeInTheDocument();
    });

    it('ArchivePage contains A1 and A2 SceneFolds with StrandThread handoff', () => {
      const { container } = render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <ArchivePage />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(container.querySelector('[data-scene-fold="A1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-scene-fold="A2"]')).toBeInTheDocument();
      // Thread placement 4
      expect(container.querySelector('[data-testid="strand-thread-curve"]')).toBeInTheDocument();
    });

    it('HousePage contains U1 and U2 SceneFolds', () => {
      const { container } = render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <HousePage />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(container.querySelector('[data-scene-fold="U1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-scene-fold="U2"]')).toBeInTheDocument();
      expect(container.querySelector('#ateliers')).toBeInTheDocument();
      expect(container.querySelector('#appointments')).toBeInTheDocument();
    });
  });
});
