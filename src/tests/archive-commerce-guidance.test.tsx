import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { TraditionExhibitionModal } from '../components/TraditionExhibitionModal.tsx';
import { CartProvider } from '../context/CartContext.tsx';

describe('Archive Commerce & Right-Side Guidance Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('renders high-contrast downward scroll guidance on the right side', () => {
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

    const guidance = screen.getByTestId('exhibition-scroll-guidance');
    expect(guidance).toBeInTheDocument();
    expect(guidance.textContent).toContain('Scroll Down To Examine Plates');
  });

  it('links verified cultural tradition (Banarasi Brocade) to associated silhouette with bag flow', () => {
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

    const commerceCard = screen.getByTestId('exhibition-commerce-card');
    expect(commerceCard).toBeInTheDocument();
    expect(commerceCard.textContent).toContain('Oxblood Wool-Silk Signature Coat-Dress');
    expect(commerceCard.textContent).toContain('Repertoire Lineage');

    // Click Acquire to Bag
    const acquireBtn = screen.getByTestId('archive-acquire-btn');
    fireEvent.click(acquireBtn);

    const toast = screen.getByTestId('archive-bag-toast');
    expect(toast).toBeInTheDocument();
    expect(toast.textContent).toContain('Piece added to your bespoke bag');
  });

  it('renders restrained SVG textile illustrations without cluttering the exhibition', () => {
    const { container } = render(
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

    const illustration = container.querySelector('svg.archive-svg-illustration');
    expect(illustration).toBeInTheDocument();
    expect(illustration?.getAttribute('aria-hidden')).toBe('true');
  });
});
