import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { SearchModal } from '../components/SearchModal.tsx';
import { TraditionExhibitionModal } from '../components/TraditionExhibitionModal.tsx';
import { CartProvider } from '../context/CartContext.tsx';

describe('Phase 7.3: Commerce Corrections & Traditional Atelier Lens Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  describe('1. Search Modal Chanderi and Editorial Navigation', () => {
    it('displays canonical Angrakha Asymmetric Sheer Tunic (et-04) with Order Folio badge', () => {
      render(
        <MemoryRouter>
          <SearchModal isOpen={true} onClose={vi.fn()} />
        </MemoryRouter>
      );

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'Chanderi' } });

      // Product match for Chanderi
      const productLink = screen.getByText('Angrakha Asymmetric Sheer Tunic');
      expect(productLink).toBeInTheDocument();
      expect(screen.getByText(/₹32,000/)).toBeInTheDocument();

      // Check badges and links
      const orderFolioBadge = screen.getByText('Order Folio');
      expect(orderFolioBadge).toBeInTheDocument();

      const examineBadge = screen.getByText('Examine');
      expect(examineBadge).toBeInTheDocument();

      // Keyboard hints should use .editorial-kbd
      const kbdElements = document.querySelectorAll('.editorial-kbd');
      expect(kbdElements.length).toBeGreaterThan(0);
    });
  });

  describe('2. Tradition Exhibition Modal Commerce & Lineage Mappings', () => {
    it('enforces Decision O-7 / DEC D-25: blocks Kota Doria / Chanderi piece links pending candidate resolution', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <TraditionExhibitionModal
              isOpen={true}
              traditionKeyOrSlug="chanderi"
              onClose={vi.fn()}
            />
          </CartProvider>
        </MemoryRouter>
      );

      // Blocked per DEC D-25 — no unapproved commerce card or acquire button
      expect(screen.queryByTestId('exhibition-commerce-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('archive-acquire-btn')).not.toBeInTheDocument();
      const notice = screen.getByTestId('exhibition-curatorial-notice');
      expect(notice).toBeInTheDocument();
      expect(notice.textContent).toContain('Curatorial Archival Record');
    });

    it('enforces Decision O-7: maps Pashmina / Kashmiri Sozni to info-only archival context without Acquire button', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <TraditionExhibitionModal
              isOpen={true}
              traditionKeyOrSlug="pashmina"
              onClose={vi.fn()}
            />
          </CartProvider>
        </MemoryRouter>
      );

      // Info-only context per Decision O-7
      const infoNotice = screen.getByTestId('exhibition-info-notice');
      expect(infoNotice).toBeInTheDocument();
      expect(infoNotice.textContent).toContain('Pashmina is the ground fabric discussed in this folio.');
      expect(screen.queryByTestId('archive-acquire-btn')).not.toBeInTheDocument();
    });

    it('displays Curatorial Archival Record notice for educational non-sellable traditions (e.g. Ajrakh)', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <TraditionExhibitionModal
              isOpen={true}
              traditionKeyOrSlug="ajrakh"
              onClose={vi.fn()}
            />
          </CartProvider>
        </MemoryRouter>
      );

      // Should show curatorial notice
      const notice = screen.getByTestId('exhibition-curatorial-notice');
      expect(notice).toBeInTheDocument();
      expect(notice.textContent).toContain('Curatorial Archival Record');
      expect(notice.textContent).toContain('Educational Document');

      // Should NOT have acquire button
      expect(screen.queryByTestId('archive-acquire-btn')).toBeNull();
    });
  });

  describe('3. Atelier Lens Modal on Traditional Outfits', () => {
    it('opens 3.5× Atelier Lens on traditional outfit inspection without direct acquisition in Archive', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <TraditionExhibitionModal
              isOpen={true}
              traditionKeyOrSlug="banarasi-brocade"
              onClose={vi.fn()}
            />
          </CartProvider>
        </MemoryRouter>
      );

      // Verify Atelier Lens trigger button exists on stage plinth
      const inspectBtn = screen.getByTestId('inspect-tradition-lens-btn');
      expect(inspectBtn).toBeInTheDocument();
      expect(inspectBtn.textContent).toContain('Inspect with Atelier Lens (3.5×)');

      // Open Atelier Lens
      fireEvent.click(inspectBtn);

      // Check modal rendered
      const lensModal = screen.getByTestId('atelier-lens-dialog');
      expect(lensModal).toBeInTheDocument();
      expect(screen.getByText('3.5× Atelier Magnification')).toBeInTheDocument();

      // Enforce Decision O-7 / Stage 02: No direct acquire button inside lens when opened from Archive
      const lensAcquireBtn = screen.queryByTestId('lens-acquire-btn');
      expect(lensAcquireBtn).not.toBeInTheDocument();
    });
  });
});
