import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { TraditionExhibitionModal } from '../components/TraditionExhibitionModal.tsx';
import { AtelierLensModal } from '../components/AtelierLensModal.tsx';
import { CartProvider } from '../context/CartContext.tsx';
import { getTraditionAssets } from '../data/assetMap.ts';

describe('Cultural Archive Atelier Lens Comprehensive Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  /* --------------------------------------------------------------------------
     1. Inspection Activation & Plate Image Binding
     -------------------------------------------------------------------------- */
  it('1. Activating Atelier Lens opens the working magnification experience with active plate image', () => {
    const tradition = getTraditionAssets('banarasi-brocade')!;
    const plate01 = tradition.roles['model-01'];

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

    const inspectBtn = screen.getByTestId('inspect-tradition-lens-btn');
    expect(inspectBtn).toBeInTheDocument();

    // Open lens
    fireEvent.click(inspectBtn);

    // Verify lens dialog is open
    const lensDialog = screen.getByTestId('atelier-lens-dialog');
    expect(lensDialog).toBeInTheDocument();

    // Verify active plate image is passed to lens image
    const lensImg = screen.getByTestId('atelier-lens-image');
    expect(lensImg).toHaveAttribute('src', plate01.src);
    expect(lensImg).toHaveAttribute('alt', expect.stringContaining('magnified view'));

    // Verify title and subtitle reflect the active tradition and plate
    expect(screen.getByTestId('atelier-lens-title')).toHaveTextContent(/Varanasi Kadwa Jacquard/);
    expect(screen.getByTestId('atelier-lens-title')).toHaveTextContent(/Model \/ Garment/);

    // Verify magnification badge is visible
    expect(screen.getByTestId('lens-zoom-badge')).toHaveTextContent(/Atelier Magnification/);
  });

  /* --------------------------------------------------------------------------
     2. Switching Plates Updates the Lens Image
     -------------------------------------------------------------------------- */
  it('2. Switching plates and opening the lens displays the newly selected plate', () => {
    const tradition = getTraditionAssets('banarasi-brocade')!;
    const plate05Macro = tradition.roles['macro-05'];

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

    // Select Plate 05: Weave Detail
    const thumb05 = screen.getByTestId('exhibition-thumb-macro-05');
    fireEvent.click(thumb05);

    // Open lens
    const inspectBtn = screen.getByTestId('inspect-tradition-lens-btn');
    fireEvent.click(inspectBtn);

    // Verify lens image is Plate 05 (macro)
    const lensImg = screen.getByTestId('atelier-lens-image');
    expect(lensImg).toHaveAttribute('src', plate05Macro.src);
    expect(screen.getByTestId('atelier-lens-title')).toHaveTextContent(/Weave Detail/);

    // Close lens
    const closeBtn = screen.getByTestId('atelier-lens-close-btn');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();

    // Switch to Plate 03: Drape & Movement
    const plate03Drape = tradition.roles['drape-03'];
    const thumb03 = screen.getByTestId('exhibition-thumb-drape-03');
    fireEvent.click(thumb03);

    // Reopen lens
    fireEvent.click(inspectBtn);
    const updatedLensImg = screen.getByTestId('atelier-lens-image');
    expect(updatedLensImg).toHaveAttribute('src', plate03Drape.src);
    expect(screen.getByTestId('atelier-lens-title')).toHaveTextContent(/Drape & Movement/);
  });

  /* --------------------------------------------------------------------------
     3. Canonical Discipline Groups Verification
     -------------------------------------------------------------------------- */
  it('3. Supports plate magnification across all three canonical discipline groups', () => {
    const disciplinesToTest = [
      { key: 'kota-doria', discipline: 'Pure Loom Weaving', title: 'Chanderi & Kota Doria' },
      { key: 'kashmiri-sozni', discipline: 'Surface Needlework', title: 'Kashmiri Sozni' },
      { key: 'ajrakh', discipline: 'Resist & Vat Dyeing', title: 'Kutch Ajrakh' }
    ];

    disciplinesToTest.forEach(({ key, title }) => {
      const { unmount } = render(
        <MemoryRouter>
          <CartProvider>
            <TraditionExhibitionModal
              isOpen={true}
              traditionKeyOrSlug={key}
              onClose={vi.fn()}
            />
          </CartProvider>
        </MemoryRouter>
      );

      const tradition = getTraditionAssets(key)!;
      const inspectBtn = screen.getByTestId('inspect-tradition-lens-btn');
      fireEvent.click(inspectBtn);

      const lensImg = screen.getByTestId('atelier-lens-image');
      expect(lensImg).toHaveAttribute('src', tradition.roles['model-01'].src);
      expect(screen.getByTestId('atelier-lens-title')).toHaveTextContent(new RegExp(title, 'i'));

      unmount();
    });
  });

  /* --------------------------------------------------------------------------
     4. Closing Lens Preserves Viewer State & Opener Focus
     -------------------------------------------------------------------------- */
  it('4. Closing lens returns to the exact active plate without state loss', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <TraditionExhibitionModal
            isOpen={true}
            traditionKeyOrSlug="paithani-silk"
            onClose={vi.fn()}
          />
        </CartProvider>
      </MemoryRouter>
    );

    // Switch to Plate 04
    const thumb04 = screen.getByTestId('exhibition-thumb-stilllife-04');
    fireEvent.click(thumb04);
    expect(thumb04).toHaveClass('is-active');

    // Open lens
    fireEvent.click(screen.getByTestId('inspect-tradition-lens-btn'));
    expect(screen.getByTestId('atelier-lens-dialog')).toBeInTheDocument();

    // Close lens
    fireEvent.click(screen.getByTestId('atelier-lens-close-btn'));
    expect(screen.queryByTestId('atelier-lens-dialog')).not.toBeInTheDocument();

    // Verify exhibition viewer still shows Plate 04 active
    expect(screen.getByTestId('exhibition-thumb-stilllife-04')).toHaveClass('is-active');
    expect(screen.getByTestId('active-role-label')).toHaveTextContent(/Textile Still Life/);
  });

  /* --------------------------------------------------------------------------
     5. Arrow Keys While Lens Is Open Do Not Switch Background Plates
     -------------------------------------------------------------------------- */
  it('5. Keyboard arrow navigation while lens is open does not trigger accidental plate navigation', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <TraditionExhibitionModal
            isOpen={true}
            traditionKeyOrSlug="bagru"
            onClose={vi.fn()}
          />
        </CartProvider>
      </MemoryRouter>
    );

    // Initial state is model-01
    expect(screen.getByTestId('exhibition-thumb-model-01')).toHaveClass('is-active');

    // Open lens
    fireEvent.click(screen.getByTestId('inspect-tradition-lens-btn'));
    expect(screen.getByTestId('atelier-lens-dialog')).toBeInTheDocument();

    // Press ArrowRight to pan loupe
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Close lens
    fireEvent.click(screen.getByTestId('atelier-lens-close-btn'));

    // Verify plate did NOT navigate to model-02
    expect(screen.getByTestId('exhibition-thumb-model-01')).toHaveClass('is-active');
    expect(screen.getByTestId('active-role-label')).toHaveTextContent(/Model \/ Garment/);
  });

  /* --------------------------------------------------------------------------
     6. Visual Loupe Refinement Inside AtelierLensModal
     -------------------------------------------------------------------------- */
  it('6. AtelierLensModal renders circular loupe with oxblood zoom badge and reticle', () => {
    render(
      <AtelierLensModal
        isOpen={true}
        onClose={vi.fn()}
        imageSrc="/images/archive/banarasi-brocade/archive-banarasi-brocade-model-01.webp"
        naturalWidth={1536}
        naturalHeight={1024}
        title="Varanasi Kadwa Jacquard"
        zoom={3.5}
      />
    );

    expect(screen.getByTestId('atelier-lens-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('atelier-lens-viewport')).toBeInTheDocument();
    expect(screen.getByTestId('modal-loupe-zoom-badge')).toBeInTheDocument();
  });
});
