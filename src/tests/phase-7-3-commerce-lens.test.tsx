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
    it('displays canonical Pleated Indigo Chanderi Tunic (et-04) with Order Folio badge', () => {
      render(
        <MemoryRouter>
          <SearchModal isOpen={true} onClose={vi.fn()} />
        </MemoryRouter>
      );

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'Chanderi' } });

      // Product match for Chanderi
      const productLink = screen.getByText('Pleated Indigo Chanderi Tunic');
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
    it('accurately maps Chanderi tradition to et-04 (Pleated Indigo Chanderi Tunic, ₹32,000)', () => {
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

      const commerceCard = screen.getByTestId('exhibition-commerce-card');
      expect(commerceCard).toBeInTheDocument();
      expect(commerceCard.textContent).toContain('Pleated Indigo Chanderi Tunic');
      expect(commerceCard.textContent).toContain('₹32,000');
      // Must NOT be the Ivory Silk Coat (et-02)
      expect(commerceCard.textContent).not.toContain('Ivory Structured Raw Silk Coat');
    });

    it('accurately maps Pashmina tradition to et-07 (Fine Pashmina & Zari Reversible Stole, ₹38,000)', () => {
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

      const commerceCard = screen.getByTestId('exhibition-commerce-card');
      expect(commerceCard).toBeInTheDocument();
      expect(commerceCard.textContent).toContain('Fine Pashmina & Zari Reversible Stole in Ivory');
      expect(commerceCard.textContent).toContain('₹38,000');
      // Must NOT be the Chanderi Tunic (et-04)
      expect(commerceCard.textContent).not.toContain('Pleated Indigo Chanderi Tunic');
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
    it('opens 3.5× Atelier Lens on traditional outfit inspection and allows direct acquisition', () => {
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

      // Check direct acquire button inside lens
      const lensAcquireBtn = screen.getByTestId('lens-acquire-btn');
      expect(lensAcquireBtn).toBeInTheDocument();
      expect(lensAcquireBtn.textContent).toContain('Acquire Piece (₹68,500)');

      // Click acquire inside lens
      fireEvent.click(lensAcquireBtn);

      // Toast confirms addition
      const toast = screen.getByTestId('archive-bag-toast');
      expect(toast).toBeInTheDocument();
      expect(toast.textContent).toContain('Piece added to your bespoke bag');
    });
  });
});
