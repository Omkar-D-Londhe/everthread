import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProductDetailPage } from '../pages/ProductDetailPage.tsx';
import { CartProvider, useCart } from '../context/CartContext.tsx';
import { SavedProvider, useSaved } from '../context/SavedContext.tsx';

// Test wrapper providing Router, CartProvider, and SavedProvider
const renderProductDetail = (slug: string) => {
  return render(
    <MemoryRouter initialEntries={[`/product/${slug}`]}>
      <CartProvider>
        <SavedProvider>
          <Routes>
            <Route path="/product/:slug" element={<ProductDetailPage />} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

// Test harness to verify shared context values
const ContextInspector: React.FC = () => {
  const { bag, bagCount } = useCart();
  const { savedCount, isSaved } = useSaved();

  return (
    <div>
      <span data-testid="shared-bag-count">{bagCount}</span>
      <span data-testid="shared-bag-lines">{bag.length}</span>
      <span data-testid="shared-saved-count">{savedCount}</span>
      <span data-testid="is-et01-saved">{isSaved('et-01') ? 'yes' : 'no'}</span>
      <span data-testid="bag-first-qty">{bag[0]?.quantity || 0}</span>
    </div>
  );
};

const renderWithInspector = (slug: string) => {
  return render(
    <MemoryRouter initialEntries={[`/product/${slug}`]}>
      <CartProvider>
        <SavedProvider>
          <ContextInspector />
          <Routes>
            <Route path="/product/:slug" element={<ProductDetailPage />} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('Stage 3.3 Product Detail Implementation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Seven Product Routes & Accurate Catalogue Data', () => {
    const productsToVerify = [
      {
        slug: 'oxblood-wool-silk-signature-coat-dress',
        id: 'et-01',
        title: 'Oxblood Wool-Silk Signature Coat-Dress',
        expectedPrice: '₹68,500',
        category: 'Outerwear',
        isApparel: true
      },
      {
        slug: 'ivory-hand-spun-matka-silk-cocoon-trench',
        id: 'et-02',
        title: 'Ivory Hand-Spun Matka Silk Cocoon Trench',
        expectedPrice: '₹1,12,000',
        category: 'Outerwear',
        isApparel: true
      },
      {
        slug: 'architectonic-zari-waistcoat',
        id: 'et-03',
        title: 'Architectonic Zari Waistcoat',
        expectedPrice: '₹44,000',
        category: 'Waistcoats',
        isApparel: true
      },
      {
        slug: 'angrakha-asymmetric-sheer-tunic',
        id: 'et-04',
        title: 'Angrakha Asymmetric Sheer Tunic',
        expectedPrice: '₹32,000',
        category: 'Tunics & Drapes',
        isApparel: true
      },
      {
        slug: 'box-calf-structured-frame-bag',
        id: 'et-05',
        title: 'Box-Calf Structured Frame Bag',
        expectedPrice: '₹54,000',
        category: 'Accessories',
        isApparel: false
      },
      {
        slug: 'hand-rolled-mulberry-twill-scarf',
        id: 'et-06',
        title: 'Hand-Rolled Mulberry Twill Scarf',
        expectedPrice: '₹24,500',
        category: 'Accessories',
        isApparel: false
      },
      {
        slug: 'high-altitude-hand-spun-pashmina-stole',
        id: 'et-07',
        title: 'High-Altitude Hand-Spun Pashmina Stole',
        expectedPrice: '₹38,000',
        category: 'Accessories',
        isApparel: false
      }
    ];

    productsToVerify.forEach(prod => {
      it(`renders route for ${prod.id} (${prod.title}) with approved price ${prod.expectedPrice}`, () => {
        renderProductDetail(prod.slug);

        expect(screen.getByTestId('product-title').textContent).toBe(prod.title);
        expect(screen.getByTestId('product-price').textContent?.replace(/\s+/g, '')).toBe(prod.expectedPrice);
        expect(screen.getByTestId('gallery-main-image')).toBeInTheDocument();
      });
    });
  });

  describe('2. Slug Resolution & Not-Found Handling', () => {
    it('resolves product by direct ID (e.g. /product/et-01)', () => {
      renderProductDetail('et-01');
      expect(screen.getByTestId('product-title').textContent).toBe('Oxblood Wool-Silk Signature Coat-Dress');
    });

    it('resolves legacy alias slug (e.g. /product/the-sylvan-mulberry-silk-trench)', () => {
      renderProductDetail('the-sylvan-mulberry-silk-trench');
      expect(screen.getByTestId('product-title').textContent).toBe('Oxblood Wool-Silk Signature Coat-Dress');
      expect(screen.getByTestId('archival-identifier').textContent).toContain('the-sylvan-mulberry-silk-trench');
    });

    it('renders archival specimen not-found state for uncatalogued slug', () => {
      renderProductDetail('unknown-silhouette-specimen');

      expect(screen.getByTestId('product-not-found')).toBeInTheDocument();
      expect(screen.getByText('Archival Specimen Not Found')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /return to curated repertoire/i })).toHaveAttribute('href', '/collections');
    });
  });

  describe('3. Gallery Navigation & Asset Resolution', () => {
    it('renders thumbnails and updates main image upon selection', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const mainImg = screen.getByTestId('gallery-main-image') as HTMLImageElement;
      expect(mainImg.src).toContain('product-oxblood-signature-front-01.webp');

      // Click second thumbnail (back view)
      const thumb1 = screen.getByTestId('gallery-thumb-1');
      fireEvent.click(thumb1);

      expect(mainImg.src).toContain('product-oxblood-signature-back-01.webp');
      expect(screen.getByTestId('active-image-label').textContent).toBe('Back Construction');
    });

    it('does not reference the retired ET-01 belted image in any gallery view', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const allImgs = screen.getAllByRole('img');
      allImgs.forEach(img => {
        expect((img as HTMLImageElement).src).not.toContain('product-signature-coat-dress-editorial-03');
      });
    });
  });

  describe('4. Supported vs Unsupported Variant Behaviour', () => {
    it('displays apparel size selector for coats and tunics', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      expect(screen.getByTestId('size-selector')).toBeInTheDocument();
      expect(screen.getByTestId('size-option-I--XS-S-')).toBeInTheDocument();
      expect(screen.getByTestId('size-option-II--M-')).toBeInTheDocument();
      expect(screen.queryByTestId('accessory-dimension-spec')).not.toBeInTheDocument();
    });

    it('toggles anatomical size matrix table for apparel', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      expect(screen.queryByTestId('size-matrix-panel')).not.toBeInTheDocument();

      const sizeGuideToggle = screen.getByTestId('size-guide-toggle');
      fireEvent.click(sizeGuideToggle);

      expect(screen.getByTestId('size-matrix-panel')).toBeInTheDocument();
      expect(screen.getByText('Guild Anatomical Proportion Matrix')).toBeInTheDocument();
    });

    it('does NOT display apparel sizes for bags or scarves (accessories)', () => {
      // ET-05: Box-Calf Structured Frame Bag
      renderProductDetail('box-calf-structured-frame-bag');

      expect(screen.queryByTestId('size-selector')).not.toBeInTheDocument();
      expect(screen.getByTestId('accessory-dimension-spec')).toBeInTheDocument();
      expect(screen.getByText('One Size (Structured Mini Box)')).toBeInTheDocument();
    });

    it('allows selecting colourways and updates active state', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const colorOptionIvory = screen.getByTestId('color-option-c-02');
      fireEvent.click(colorOptionIvory);

      expect(colorOptionIvory).toHaveClass('active');
      expect(screen.getByTestId('selected-color-name').textContent).toBe('Warm Ivory');
    });
  });

  describe('5. Quantity Selector', () => {
    it('adjusts quantity within allowed bounds', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const qtyValue = screen.getByTestId('qty-value');
      const qtyMinus = screen.getByTestId('qty-minus');
      const qtyPlus = screen.getByTestId('qty-plus');

      expect(qtyValue.textContent).toBe('1');
      expect(qtyMinus).toBeDisabled();

      fireEvent.click(qtyPlus);
      expect(qtyValue.textContent).toBe('2');
      expect(qtyMinus).not.toBeDisabled();

      fireEvent.click(qtyMinus);
      expect(qtyValue.textContent).toBe('1');
      expect(qtyMinus).toBeDisabled();
    });
  });

  describe('6. Add to Bag & Save Piece Integration', () => {
    it('adds product to shared CartContext and shows success notification', () => {
      renderWithInspector('oxblood-wool-silk-signature-coat-dress');

      expect(screen.getByTestId('shared-bag-count').textContent).toBe('0');

      const addBtn = screen.getByTestId('add-to-bag-btn');
      fireEvent.click(addBtn);

      expect(screen.getByTestId('shared-bag-count').textContent).toBe('1');
      expect(screen.getByTestId('shared-bag-lines').textContent).toBe('1');
      expect(screen.getByTestId('added-to-bag-toast')).toBeInTheDocument();
    });

    it('merges identical product and variant additions into single line with incremented quantity', () => {
      renderWithInspector('oxblood-wool-silk-signature-coat-dress');

      const addBtn = screen.getByTestId('add-to-bag-btn');
      // Add first time (quantity 1)
      fireEvent.click(addBtn);
      expect(screen.getByTestId('shared-bag-count').textContent).toBe('1');
      expect(screen.getByTestId('shared-bag-lines').textContent).toBe('1');

      // Add second time with same variant
      fireEvent.click(addBtn);
      expect(screen.getByTestId('shared-bag-count').textContent).toBe('2');
      expect(screen.getByTestId('shared-bag-lines').textContent).toBe('1'); // Still 1 line
      expect(screen.getByTestId('bag-first-qty').textContent).toBe('2');
    });

    it('toggles Saved Pieces in shared SavedContext', () => {
      renderWithInspector('oxblood-wool-silk-signature-coat-dress');

      expect(screen.getByTestId('shared-saved-count').textContent).toBe('0');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');

      const saveBtn = screen.getByTestId('save-piece-btn');
      fireEvent.click(saveBtn);

      expect(screen.getByTestId('shared-saved-count').textContent).toBe('1');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('yes');
      expect(saveBtn.getAttribute('aria-pressed')).toBe('true');

      // Toggle off
      fireEvent.click(saveBtn);
      expect(screen.getByTestId('shared-saved-count').textContent).toBe('0');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');
      expect(saveBtn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('7. Accordion Expandable Sections', () => {
    it('displays specifications and toggles care and allocation sections', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      // Specs is open by default
      expect(screen.getByTestId('accordion-content-specs')).toBeInTheDocument();
      expect(screen.getByText('70% Fine Merino Wool, 30% Wild Mulberry Silk')).toBeInTheDocument();

      // Care is closed by default
      expect(screen.queryByTestId('accordion-content-care')).not.toBeInTheDocument();

      // Open care
      fireEvent.click(screen.getByTestId('accordion-toggle-care'));
      expect(screen.getByTestId('accordion-content-care')).toBeInTheDocument();

      // Open allocation
      fireEvent.click(screen.getByTestId('accordion-toggle-allocation'));
      expect(screen.getByTestId('accordion-content-allocation')).toBeInTheDocument();
      expect(within(screen.getByTestId('accordion-content-allocation')).getByText(/Edition of 30/)).toBeInTheDocument();

      // Open integrity disclosure
      fireEvent.click(screen.getByTestId('accordion-toggle-integrity'));
      expect(screen.getByTestId('accordion-content-integrity')).toBeInTheDocument();
    });
  });

  describe('8. Related Cultural Archive Stories & Complementary Silhouettes', () => {
    it('renders related cultural archive folios for products with story links', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      expect(screen.getByTestId('related-stories-section')).toBeInTheDocument();
      expect(screen.getByTestId('related-story-the-architecture-of-a-garment')).toBeInTheDocument();
    });

    it('renders complementary heirloom product cards', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      expect(screen.getByTestId('related-products-section')).toBeInTheDocument();
      const compCards = screen.getAllByTestId(/^product-card-et-/);
      expect(compCards.length).toBeGreaterThan(0);
      // Complementary cards should not include the current product
      compCards.forEach(card => {
        expect(card.getAttribute('data-product-id')).not.toBe('et-01');
      });
    });
  });

  describe('9. Phase 6.4: Motion Transitions & SVG Icon Hardening', () => {
    it('renders previous image layer during gallery thumbnail cross-dissolve', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const mainContainer = screen.getByTestId('gallery-main-container');
      // Initially only 1 image
      expect(mainContainer.querySelectorAll('img').length).toBe(1);

      // Select thumbnail 1
      fireEvent.click(screen.getByTestId('gallery-thumb-1'));

      // Now prev image layer exists alongside active image layer
      const prevImg = mainContainer.querySelector('.gallery-main-img--prev') as HTMLImageElement;
      expect(prevImg).toBeInTheDocument();
      expect(prevImg).toHaveAttribute('aria-hidden', 'true');
      expect(prevImg.src).toContain('product-oxblood-signature-front-01.webp');

      const activeImg = screen.getByTestId('gallery-main-image');
      expect(activeImg).toHaveClass('gallery-cross-dissolve');
    });

    it('renders SVG chevron icon on accordions without raw font ligatures', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const specsToggle = screen.getByTestId('accordion-toggle-specs');
      const chevronSvg = specsToggle.querySelector('svg.accordion-chevron');
      expect(chevronSvg).toBeInTheDocument();
      expect(chevronSvg).toHaveAttribute('aria-hidden', 'true');
      expect(chevronSvg).toHaveClass('accordion-chevron--open');
      expect(specsToggle).not.toHaveTextContent('expand_less');
      expect(specsToggle).not.toHaveTextContent('expand_more');

      // Care accordion is closed initially
      const careToggle = screen.getByTestId('accordion-toggle-care');
      const careChevron = careToggle.querySelector('svg.accordion-chevron');
      expect(careChevron).not.toHaveClass('accordion-chevron--open');

      // Clicking toggles the open class on the chevron
      fireEvent.click(careToggle);
      expect(careChevron).toHaveClass('accordion-chevron--open');
    });

    it('renders robust SVG icons for bag, save, and quantity controls without text ligatures', () => {
      renderProductDetail('oxblood-wool-silk-signature-coat-dress');

      const addBtn = screen.getByTestId('add-to-bag-btn');
      expect(addBtn.querySelector('svg')).toBeInTheDocument();
      expect(addBtn).not.toHaveTextContent('shopping_bag');

      const saveBtn = screen.getByTestId('save-piece-btn');
      expect(saveBtn.querySelector('svg')).toBeInTheDocument();
      expect(saveBtn).not.toHaveTextContent('bookmark');
      expect(saveBtn).not.toHaveTextContent('bookmark_border');

      const minusBtn = screen.getByTestId('qty-minus');
      expect(minusBtn.querySelector('svg')).toBeInTheDocument();
      expect(minusBtn).not.toHaveTextContent('remove');

      const plusBtn = screen.getByTestId('qty-plus');
      expect(plusBtn.querySelector('svg')).toBeInTheDocument();
      expect(plusBtn).not.toHaveTextContent('add');
    });
  });
});
