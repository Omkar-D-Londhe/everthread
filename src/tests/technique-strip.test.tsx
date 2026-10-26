import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TechniqueStrip } from '../components/archive/TechniqueStrip.tsx';
import { TECHNIQUE_STRIP_DIAGRAM_IDS, DIAGRAM_ASSETS } from '../data/assetMap.ts';
import { ArchivePage } from '../pages/ArchivePage.tsx';

const EXPECTED_CANONICAL_ORDER = [
  'library-warp-weft-diagram-01',
  'library-textile-vocabulary-01',
  'library-technique-comparison-01',
  'library-embroidery-weaving-comparison-01',
  'library-resist-dyeing-process-01',
  'library-double-ikat-process-01',
  'library-block-printing-process-01',
  'library-garment-construction-01',
  'library-textile-to-garment-sequence-01',
];

describe('Stage 07: Technique Strip (N-06 / O-5 Mandatory Acceptance Gate)', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  describe('1. Canonical Diagram Inventory & Ordering', () => {
    it('renders exactly nine diagrams in the authoritative canonical order', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      expect(screen.getByTestId('technique-strip')).toBeInTheDocument();

      // Check all 9 items in exact order
      EXPECTED_CANONICAL_ORDER.forEach(id => {
        const item = screen.getByTestId(`technique-strip-item-${id}`);
        expect(item).toBeInTheDocument();
        expect(item).toHaveAttribute('data-diagram-id', id);

        const expectedTitle = DIAGRAM_ASSETS[id].title;
        expect(screen.getByTestId(`technique-strip-title-${id}`)).toHaveTextContent(expectedTitle);

        // Check target link
        expect(item).toHaveAttribute('href', `/archive?diagram=${id}`);
      });
    });

    it('matches TECHNIQUE_STRIP_DIAGRAM_IDS constant with the 9 authoritative diagrams', () => {
      expect(TECHNIQUE_STRIP_DIAGRAM_IDS).toHaveLength(9);
      expect([...TECHNIQUE_STRIP_DIAGRAM_IDS]).toEqual(EXPECTED_CANONICAL_ORDER);
    });
  });

  describe('2. SVG to PNG Fallback and Ultimate Text Graceful Degradation', () => {
    it('falls back to PNG when SVG fails to load', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      const testId = 'library-warp-weft-diagram-01';
      const img = screen.getByTestId(`technique-strip-img-${testId}`);
      expect(img).toHaveAttribute('src', DIAGRAM_ASSETS[testId].svg);

      // Trigger first error -> falls back to PNG
      fireEvent.error(img);

      const fallbackImg = screen.getByTestId(`technique-strip-img-${testId}`);
      expect(fallbackImg).toHaveAttribute('src', DIAGRAM_ASSETS[testId].fallbackPng);
    });

    it('falls back to title text when both SVG and PNG fail without breaking layout', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      const testId = 'library-block-printing-process-01';
      const img = screen.getByTestId(`technique-strip-img-${testId}`);

      // First error -> PNG
      fireEvent.error(img);
      // Second error -> Title text box
      fireEvent.error(img);

      const fallbackBox = screen.getByTestId(`technique-strip-fallback-${testId}`);
      expect(fallbackBox).toBeInTheDocument();
      expect(fallbackBox).toHaveTextContent(DIAGRAM_ASSETS[testId].title);
    });
  });

  describe('3. Keyboard Navigation & Scroll Snap Behavior', () => {
    it('calls scrollIntoView on focus for accessible horizontal keyboard navigation', () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(
        <MemoryRouter>
          <TechniqueStrip />
        </MemoryRouter>
      );

      const firstItem = screen.getByTestId('technique-strip-item-library-warp-weft-diagram-01');
      fireEvent.focus(firstItem);

      expect(scrollIntoViewMock).toHaveBeenCalled();
    });

    it('highlights active diagram when activeDiagramId matches', () => {
      render(
        <MemoryRouter>
          <TechniqueStrip activeDiagramId="library-double-ikat-process-01" />
        </MemoryRouter>
      );

      const activeItem = screen.getByTestId('technique-strip-item-library-double-ikat-process-01');
      expect(activeItem).toHaveClass('is-active');

      const inactiveItem = screen.getByTestId('technique-strip-item-library-warp-weft-diagram-01');
      expect(inactiveItem).not.toHaveClass('is-active');
    });
  });

  describe('4. Deep-Link URL Parameter Integration on ArchivePage', () => {
    it('reads ?diagram=<id> and selects active diagram in visualizer', async () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(
        <MemoryRouter initialEntries={['/archive?diagram=library-resist-dyeing-process-01']}>
          <Routes>
            <Route path="/archive" element={<ArchivePage />} />
          </Routes>
        </MemoryRouter>
      );

      // Active diagram title in viewer should match
      const title = screen.getByTestId('active-diagram-title');
      expect(title).toHaveTextContent('Resist Dyeing Process');
    });

    it('ignores unknown diagram parameter and falls back to default', () => {
      render(
        <MemoryRouter initialEntries={['/archive?diagram=unknown-non-existent-diagram']}>
          <Routes>
            <Route path="/archive" element={<ArchivePage />} />
          </Routes>
        </MemoryRouter>
      );

      // Default diagram is Warp & Weft
      const title = screen.getByTestId('active-diagram-title');
      expect(title).toHaveTextContent('Warp Weft Diagram');
    });
  });
});
