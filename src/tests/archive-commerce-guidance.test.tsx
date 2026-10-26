import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('enforces Decision O-7 / DEC D-25: removes Acquire to Bag and blocks unapproved commerce links for Banarasi', () => {
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

    // Unsafe Acquire button is deleted per Stage 02 requirements
    const acquireBtn = screen.queryByTestId('archive-acquire-btn');
    expect(acquireBtn).not.toBeInTheDocument();

    // Banarasi is blocked pending DEC D-25 / F-52 resolution
    const commerceCard = screen.queryByTestId('exhibition-commerce-card');
    expect(commerceCard).not.toBeInTheDocument();

    // Curatorial notice is rendered instead
    const notice = screen.getByTestId('exhibition-curatorial-notice');
    expect(notice).toBeInTheDocument();
    expect(notice.textContent).toContain('Curatorial Archival Record');
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
