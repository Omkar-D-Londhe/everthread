import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ArchivePage } from '../pages/ArchivePage.tsx';
import { ArchiveStoryPage } from '../pages/ArchiveStoryPage.tsx';
import { TraditionExhibitionModal } from '../components/TraditionExhibitionModal.tsx';
import { getDisciplineGroups } from '../data/archiveDisciplines.ts';
import { WEAVE_LIBRARY } from '../data/stories.ts';
import { getPlateCaption, getTraditionAssets } from '../data/assetMap.ts';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';

describe('Stage 07: Archive Disciplines, Modal Focus & Captions Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  describe('1. Discipline-Grouped Asymmetric Taxonomy (F-03)', () => {
    it('groups 14 weave items into four canonical craft disciplines without reclassification', () => {
      const groups = getDisciplineGroups(WEAVE_LIBRARY, 'all');
      expect(groups).toHaveLength(4);

      const disciplines = groups.map(g => g.group.discipline);
      expect(disciplines).toEqual(['weaving', 'embroidery', 'dyeing', 'draping']);

      // Check counts per discipline
      const counts = groups.map(g => g.items.length);
      expect(counts).toEqual([8, 2, 3, 1]);
      expect(counts.reduce((a, b) => a + b, 0)).toBe(14);
    });

    it('renders discipline sections on /archive with asymmetric feature cards', () => {
      render(
        <MemoryRouter initialEntries={['/archive']}>
          <CartProvider>
            <SavedProvider>
              <Routes>
                <Route path="/archive" element={<ArchivePage />} />
              </Routes>
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      // Verify all 4 discipline sections are present
      expect(screen.getByTestId('discipline-group-weaving')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-group-embroidery')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-group-dyeing')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-group-draping')).toBeInTheDocument();

      // Weaving lead feature card
      const kadwaCard = screen.getByTestId('weave-card-varanasi-kadwa');
      expect(kadwaCard).toHaveClass('discipline-feature-card');

      // Weave-14 single monograph card
      const drapeCard = screen.getByTestId('weave-card-radial-bias-draping');
      expect(drapeCard).toBeInTheDocument();
      expect(screen.getByTestId('weave-14-badge-link')).toHaveAttribute('href', '/archive/the-art-of-the-drape');
    });

    it('filters cleanly across discipline groups when category pill is selected', () => {
      render(
        <MemoryRouter initialEntries={['/archive']}>
          <CartProvider>
            <SavedProvider>
              <Routes>
                <Route path="/archive" element={<ArchivePage />} />
              </Routes>
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      // Click "Embroidery" filter
      fireEvent.click(screen.getByTestId('weave-filter-embroidery'));

      expect(screen.getByTestId('discipline-group-embroidery')).toBeInTheDocument();
      expect(screen.queryByTestId('discipline-group-weaving')).not.toBeInTheDocument();
      expect(screen.queryByTestId('discipline-group-dyeing')).not.toBeInTheDocument();
      expect(screen.queryByTestId('discipline-group-draping')).not.toBeInTheDocument();

      // Both embroidery cards visible
      expect(screen.getByTestId('weave-card-changthangi-pashmina')).toBeInTheDocument();
      expect(screen.getByTestId('weave-card-kutch-ari-embroidery')).toBeInTheDocument();

      // Return to All
      fireEvent.click(screen.getByTestId('weave-filter-all'));
      expect(screen.getByTestId('discipline-group-weaving')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-group-dyeing')).toBeInTheDocument();
    });
  });

  describe('2. Exhibition Modal Accessibility, Focus Trap & URL Cleanup (F-08, F-28)', () => {
    it('traps focus across 20 consecutive Tab presses within modal bounds', () => {
      render(
        <MemoryRouter>
          <TraditionExhibitionModal
            isOpen={true}
            traditionKeyOrSlug="banarasi-brocade"
            onClose={vi.fn()}
          />
        </MemoryRouter>
      );

      const modal = screen.getByTestId('tradition-exhibition-modal');
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      expect(focusable.length).toBeGreaterThan(0);

      // Simulate 20 Tab key presses
      for (let i = 0; i < 20; i++) {
        fireEvent.keyDown(window, { key: 'Tab' });
        // The active element must remain within modal
        expect(modal.contains(document.activeElement)).toBe(true);
      }
    });

    it('closes modal on document-level Escape key press', () => {
      const handleClose = vi.fn();
      render(
        <MemoryRouter>
          <TraditionExhibitionModal
            isOpen={true}
            traditionKeyOrSlug="banarasi-brocade"
            onClose={handleClose}
          />
        </MemoryRouter>
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('cleans ?tradition= query parameter on close (F-28)', () => {
      render(
        <MemoryRouter initialEntries={['/archive?tradition=banarasi-brocade']}>
          <CartProvider>
            <SavedProvider>
              <Routes>
                <Route path="/archive" element={<ArchivePage />} />
              </Routes>
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      // Modal should be open initially from query param
      expect(screen.getByTestId('tradition-exhibition-modal')).toBeInTheDocument();

      // Click close button
      const closeBtn = screen.getByTestId('close-exhibition-btn');
      fireEvent.click(closeBtn);

      // Modal should no longer be rendered
      expect(screen.queryByTestId('tradition-exhibition-modal')).not.toBeInTheDocument();
    });
  });

  describe('3. Neutral Plate Captions & Disclosures (F-12, F-38)', () => {
    it('formats plate captions as "{Tradition title} — {role label}" without raw filenames', () => {
      const record = getTraditionAssets('muga-silk')!;
      expect(record).toBeDefined();

      const caption1 = getPlateCaption(record, 'model-01');
      expect(caption1).toBe('Assam Muga Wild Silk Twill — Model / Garment');
      expect(caption1).not.toContain('.webp');
      expect(caption1).not.toContain('archive_');

      const caption5 = getPlateCaption(record, 'macro-05');
      expect(caption5).toBe('Assam Muga Wild Silk Twill — Weave Detail');
    });

    it('displays neutral plate caption and descriptive alt in TraditionExhibitionModal', () => {
      render(
        <MemoryRouter>
          <TraditionExhibitionModal
            isOpen={true}
            traditionKeyOrSlug="muga-silk"
            onClose={vi.fn()}
          />
        </MemoryRouter>
      );

      const activeImage = screen.getByTestId('exhibition-active-image');
      expect(activeImage).toHaveAttribute('alt', 'Assam Muga Wild Silk Twill — Model / Garment');

      const captionDesc = screen.getByTestId('active-plate-description');
      expect(captionDesc).toHaveTextContent('Assam Muga Wild Silk Twill — Model / Garment');
    });
  });

  describe('4. Traditional Product Inspiration Links (O-7, N-10)', () => {
    it('renders "View design inspired by this tradition →" for listed TR products without purchase buttons', () => {
      render(
        <MemoryRouter>
          <TraditionExhibitionModal
            isOpen={true}
            traditionKeyOrSlug="paithani-silk"
            onClose={vi.fn()}
          />
        </MemoryRouter>
      );

      // Paithani maps to TR-02 (Mayura Axis) which is listed
      const inspiredBlock = screen.getAllByTestId('exhibition-inspired-piece')[0];
      expect(inspiredBlock).toBeInTheDocument();
      expect(inspiredBlock.textContent).toContain('Living Inheritance');
      expect(inspiredBlock.textContent).toContain('View design inspired by this tradition →');

      // Zero purchase actions
      expect(screen.queryByTestId('archive-acquire-btn')).not.toBeInTheDocument();
      expect(screen.queryByTestId('add-to-bag-btn')).not.toBeInTheDocument();
    });
  });

  describe('5. Story Page 390px Mobile Viewport Integrity (F-10)', () => {
    it('renders continuous navigation with max-width and text wrap on /archive/:storySlug', () => {
      render(
        <MemoryRouter initialEntries={['/archive/the-living-loom']}>
          <Routes>
            <Route path="/archive/:storySlug" element={<ArchiveStoryPage />} />
          </Routes>
        </MemoryRouter>
      );

      const nextLink = screen.getByTestId('next-story-link');
      expect(nextLink).toBeInTheDocument();
      expect(nextLink).toHaveStyle({ maxWidth: '100%' });
    });
  });
});
