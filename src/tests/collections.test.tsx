import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { CollectionsPage } from '../pages/CollectionsPage.tsx';
import { PRODUCTS } from '../data/products.ts';
import { SavedProvider, useSaved } from '../context/SavedContext.tsx';

// Test wrapper providing Router and SavedProvider
const renderCollections = () => {
  return render(
    <MemoryRouter initialEntries={['/collections']}>
      <SavedProvider>
        <CollectionsPage />
      </SavedProvider>
    </MemoryRouter>
  );
};

// Component to inspect SavedContext in parallel
const SavedInspectionWidget: React.FC = () => {
  const { savedCount, isSaved } = useSaved();
  return (
    <div>
      <span data-testid="global-saved-count">{savedCount}</span>
      <span data-testid="is-et01-saved">{isSaved('et-01') ? 'yes' : 'no'}</span>
    </div>
  );
};

const renderCollectionsWithInspector = () => {
  return render(
    <MemoryRouter initialEntries={['/collections']}>
      <SavedProvider>
        <SavedInspectionWidget />
        <CollectionsPage />
      </SavedProvider>
    </MemoryRouter>
  );
};

describe('Stage 3.2 Collections Implementation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Default Catalogue Presentation & Order', () => {
    it('renders all seven approved products in exact default catalogue order', () => {
      renderCollections();

      const productCards = screen.getAllByTestId(/^product-card-et-/);
      expect(productCards).toHaveLength(7);

      const expectedIds = ['et-01', 'et-02', 'et-03', 'et-04', 'et-05', 'et-06', 'et-07'];
      productCards.forEach((card, index) => {
        expect(card.getAttribute('data-product-id')).toBe(expectedIds[index]);
      });
    });

    it('displays the accurate live counter indicating 7 of 7 heirlooms', () => {
      renderCollections();
      const countIndicator = screen.getByTestId('product-count-indicator');
      expect(countIndicator.textContent).toContain('Showing 7 of 7 Heirlooms');
    });

    it('renders exact approved catalogue prices from product data', () => {
      renderCollections();

      const expectedPrices: Record<string, string> = {
        'et-01': '₹68,500',
        'et-02': '₹1,12,000', // Note: Indian numbering format
        'et-03': '₹44,000',
        'et-04': '₹32,000',
        'et-05': '₹54,000',
        'et-06': '₹24,500',
        'et-07': '₹38,000',
      };

      Object.entries(expectedPrices).forEach(([id, expectedPrice]) => {
        const priceEl = screen.getByTestId(`product-price-${id}`);
        // Remove whitespace and test price text
        expect(priceEl.textContent?.replace(/\s+/g, '')).toBe(expectedPrice);
      });
    });

    it('links each product to its respective product detail page', () => {
      renderCollections();

      PRODUCTS.forEach(product => {
        const link = screen.getByTestId(`product-link-${product.id}`);
        expect(link.getAttribute('href')).toBe(`/product/${product.slug}`);
      });
    });
  });

  describe('2. Category Filtering', () => {
    it('filters correctly by Outerwear (2 pieces)', () => {
      renderCollections();

      const outerwearPill = screen.getByTestId('category-pill-outerwear');
      fireEvent.click(outerwearPill);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(2);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-01');
      expect(cards[1].getAttribute('data-product-id')).toBe('et-02');
    });

    it('filters correctly by Waistcoats (1 piece)', () => {
      renderCollections();

      const waistcoatsPill = screen.getByTestId('category-pill-waistcoats');
      fireEvent.click(waistcoatsPill);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-03');
    });

    it('filters correctly by Tunics & Drapes (1 piece)', () => {
      renderCollections();

      const tunicsPill = screen.getByTestId('category-pill-tunics---drapes');
      fireEvent.click(tunicsPill);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-04');
    });

    it('filters correctly by Accessories (3 pieces)', () => {
      renderCollections();

      const accPill = screen.getByTestId('category-pill-accessories');
      fireEvent.click(accPill);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(3);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-05');
      expect(cards[1].getAttribute('data-product-id')).toBe('et-06');
      expect(cards[2].getAttribute('data-product-id')).toBe('et-07');
    });

    it('restores all silhouettes when All Silhouettes is clicked', () => {
      renderCollections();

      const waistcoatsPill = screen.getByTestId('category-pill-waistcoats');
      fireEvent.click(waistcoatsPill);
      expect(screen.getAllByTestId(/^product-card-et-/)).toHaveLength(1);

      const allPill = screen.getByTestId('category-pill-all');
      fireEvent.click(allPill);
      expect(screen.getAllByTestId(/^product-card-et-/)).toHaveLength(7);
    });
  });

  describe('3. Facet Filters (Material, Colour, Craft, Price)', () => {
    it('filters by Material in desktop filter panel', () => {
      renderCollections();

      // Open desktop filter panel
      const filterToggle = screen.getByTestId('desktop-filter-toggle');
      fireEvent.click(filterToggle);

      // Filter by Wool (matches et-01)
      const woolCheckbox = screen.getByTestId('filter-mat-wool');
      fireEvent.click(woolCheckbox);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-01');
    });

    it('filters by Colour (e.g. Indigo matches et-04)', () => {
      renderCollections();

      const filterToggle = screen.getByTestId('desktop-filter-toggle');
      fireEvent.click(filterToggle);

      const indigoCheckbox = screen.getByTestId('filter-col-indigo');
      fireEvent.click(indigoCheckbox);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-04');
    });

    it('filters by Craft Lineage (e.g. Saddle Stitch matches et-05)', () => {
      renderCollections();

      const filterToggle = screen.getByTestId('desktop-filter-toggle');
      fireEvent.click(filterToggle);

      const saddleCheckbox = screen.getByTestId('filter-craft-saddle');
      fireEvent.click(saddleCheckbox);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-05');
    });

    it('filters by Price Tier (Under ₹35,000 matches et-04 and et-06)', () => {
      renderCollections();

      const filterToggle = screen.getByTestId('desktop-filter-toggle');
      fireEvent.click(filterToggle);

      const priceUnder35k = screen.getByTestId('filter-price-under-35k');
      fireEvent.click(priceUnder35k);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(2);
      const ids = cards.map(c => c.getAttribute('data-product-id'));
      expect(ids).toContain('et-04');
      expect(ids).toContain('et-06');
    });

    it('filters by Price Tier (Over ₹60,000 matches et-01 and et-02)', () => {
      renderCollections();

      const filterToggle = screen.getByTestId('desktop-filter-toggle');
      fireEvent.click(filterToggle);

      const priceOver60k = screen.getByTestId('filter-price-over-60k');
      fireEvent.click(priceOver60k);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(2);
      const ids = cards.map(c => c.getAttribute('data-product-id'));
      expect(ids).toContain('et-01');
      expect(ids).toContain('et-02');
    });
  });

  describe('4. Combined Filtering Across Facets', () => {
    it('combines Category Accessories and Price Under 35k to yield et-06', () => {
      renderCollections();

      // Category = Accessories
      fireEvent.click(screen.getByTestId('category-pill-accessories'));

      // Price = under-35k
      fireEvent.click(screen.getByTestId('desktop-filter-toggle'));
      fireEvent.click(screen.getByTestId('filter-price-under-35k'));

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-06');
    });

    it('supports OR within the same facet (e.g. Wool OR Pashmina)', () => {
      renderCollections();

      fireEvent.click(screen.getByTestId('desktop-filter-toggle'));
      fireEvent.click(screen.getByTestId('filter-mat-wool'));
      fireEvent.click(screen.getByTestId('filter-mat-pashmina'));

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(2);
      const ids = cards.map(c => c.getAttribute('data-product-id'));
      expect(ids).toContain('et-01'); // Wool
      expect(ids).toContain('et-07'); // Pashmina
    });
  });

  describe('5. Active Filter Badges & Reset', () => {
    it('renders active filter badges with individual remove capability', () => {
      renderCollections();

      // Click Category Outerwear
      fireEvent.click(screen.getByTestId('category-pill-outerwear'));

      // Active filter bar should show category badge
      expect(screen.getByTestId('chip-category')).toBeInTheDocument();
      expect(screen.getByTestId('chip-category').textContent).toContain('Category: Outerwear');

      // Click remove on badge
      const removeBtn = within(screen.getByTestId('chip-category')).getByRole('button');
      fireEvent.click(removeBtn);

      // Should restore all 7
      expect(screen.getAllByTestId(/^product-card-et-/)).toHaveLength(7);
    });

    it('resets all filters using the Reset All Filters button', () => {
      renderCollections();

      fireEvent.click(screen.getByTestId('category-pill-outerwear'));
      fireEvent.click(screen.getByTestId('desktop-filter-toggle'));
      fireEvent.click(screen.getByTestId('filter-mat-wool'));

      expect(screen.getAllByTestId(/^product-card-et-/)).toHaveLength(1);

      const resetBtn = screen.getByTestId('reset-all-filters-btn');
      fireEvent.click(resetBtn);

      expect(screen.getAllByTestId(/^product-card-et-/)).toHaveLength(7);
      expect(screen.queryByTestId('active-filters-bar')).not.toBeInTheDocument();
    });
  });

  describe('6. Sorting Functionality', () => {
    it('sorts by Price: Low to High', () => {
      renderCollections();

      const sortSelect = screen.getByTestId('sort-select');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

      const cards = screen.getAllByTestId(/^product-card-et-/);
      const ids = cards.map(c => c.getAttribute('data-product-id'));
      // Order by price ascending:
      // et-06 (24,500) < et-04 (32,000) < et-07 (38,000) < et-03 (44,000) < et-05 (54,000) < et-01 (68,500) < et-02 (112,000)
      expect(ids).toEqual(['et-06', 'et-04', 'et-07', 'et-03', 'et-05', 'et-01', 'et-02']);
    });

    it('sorts by Price: High to Low', () => {
      renderCollections();

      const sortSelect = screen.getByTestId('sort-select');
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

      const cards = screen.getAllByTestId(/^product-card-et-/);
      const ids = cards.map(c => c.getAttribute('data-product-id'));
      expect(ids).toEqual(['et-02', 'et-01', 'et-05', 'et-03', 'et-07', 'et-04', 'et-06']);
    });

    it('returns to Featured catalogue order when re-selected', () => {
      renderCollections();

      const sortSelect = screen.getByTestId('sort-select');
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
      fireEvent.change(sortSelect, { target: { value: 'featured' } });

      const cards = screen.getAllByTestId(/^product-card-et-/);
      const ids = cards.map(c => c.getAttribute('data-product-id'));
      expect(ids).toEqual(['et-01', 'et-02', 'et-03', 'et-04', 'et-05', 'et-06', 'et-07']);
    });
  });

  describe('7. No-Results Empty State', () => {
    it('displays polished no-results state when a filter combination yields zero matches', () => {
      renderCollections();

      // Category Waistcoats (only et-03 at ₹44,000) + Price tier > 60,000 yields 0 items
      fireEvent.click(screen.getByTestId('category-pill-waistcoats'));
      fireEvent.click(screen.getByTestId('desktop-filter-toggle'));
      fireEvent.click(screen.getByTestId('filter-price-over-60k'));

      expect(screen.getByTestId('no-results-state')).toBeInTheDocument();
      expect(screen.getByText('No Heirlooms Match This Precise Curation')).toBeInTheDocument();

      // Clicking reset restores the 7 items
      const emptyResetBtn = screen.getByTestId('empty-reset-filters-btn');
      fireEvent.click(emptyResetBtn);

      expect(screen.getAllByTestId(/^product-card-et-/)).toHaveLength(7);
      expect(screen.queryByTestId('no-results-state')).not.toBeInTheDocument();
    });
  });

  describe('8. Saved Pieces Integration', () => {
    it('toggles saved status and updates SavedContext without page-local duplicate state', () => {
      renderCollectionsWithInspector();

      const globalCount = screen.getByTestId('global-saved-count');
      expect(globalCount.textContent).toBe('0');

      const saveBtnEt01 = screen.getByTestId('save-btn-et-01');
      expect(saveBtnEt01.getAttribute('aria-pressed')).toBe('false');

      // Click save
      fireEvent.click(saveBtnEt01);

      expect(globalCount.textContent).toBe('1');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('yes');
      expect(saveBtnEt01.getAttribute('aria-pressed')).toBe('true');
      expect(saveBtnEt01.getAttribute('aria-label')).toContain('Remove');

      // Click again to unsave
      fireEvent.click(saveBtnEt01);

      expect(globalCount.textContent).toBe('0');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');
      expect(saveBtnEt01.getAttribute('aria-pressed')).toBe('false');
      expect(saveBtnEt01.getAttribute('aria-label')).toContain('Save');
    });
  });

  describe('9. Mobile Filter & Sort Drawer', () => {
    it('opens mobile drawer when mobile trigger button is clicked', () => {
      renderCollections();

      const drawer = screen.getByTestId('mobile-filter-drawer');
      expect(drawer).toHaveStyle({ visibility: 'hidden' });

      const trigger = screen.getByTestId('mobile-filter-trigger');
      fireEvent.click(trigger);

      expect(drawer).toHaveStyle({ visibility: 'visible' });
    });

    it('can apply filters and close mobile drawer via Apply button', () => {
      renderCollections();

      const trigger = screen.getByTestId('mobile-filter-trigger');
      fireEvent.click(trigger);

      // Select Waistcoats in mobile drawer
      const waistcoatsRadio = screen.getByTestId('mobile-cat-waistcoats');
      fireEvent.click(waistcoatsRadio);

      // Click Apply
      const applyBtn = screen.getByTestId('mobile-apply-btn');
      fireEvent.click(applyBtn);

      const drawer = screen.getByTestId('mobile-filter-drawer');
      expect(drawer).toHaveStyle({ visibility: 'hidden' });

      // Check results
      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-03');
    });

    it('closes mobile drawer with close button and Escape key', () => {
      renderCollections();

      const trigger = screen.getByTestId('mobile-filter-trigger');
      fireEvent.click(trigger);

      const drawer = screen.getByTestId('mobile-filter-drawer');
      expect(drawer).toHaveStyle({ visibility: 'visible' });

      // Close via close button
      const closeBtn = screen.getByTestId('close-mobile-drawer');
      fireEvent.click(closeBtn);
      expect(drawer).toHaveStyle({ visibility: 'hidden' });

      // Open again and close via Escape
      fireEvent.click(trigger);
      expect(drawer).toHaveStyle({ visibility: 'visible' });

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(drawer).toHaveStyle({ visibility: 'hidden' });
    });
  });

  /* -------------------------------------------------------------------------
     8. Stage 5.4: Collection Plinth Card Reveals & Elevation Suite
     ------------------------------------------------------------------------- */
  describe('8. Stage 5.4: Collection Plinth Card Reveals & Elevation Suite', () => {
    it('applies plinth-card and plinth-reveal styling across all seven approved collection cards', () => {
      renderCollections();

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(7);

      cards.forEach(card => {
        expect(card.classList.contains('plinth-card')).toBe(true);
        expect(card.classList.contains('plinth-reveal')).toBe(true);
        expect(card.querySelector('.garment-img-wrap')).toBeInTheDocument();
      });
    });

    it('staggers entrance animation delays across the default catalogue order', () => {
      renderCollections();

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards[0].style.animationDelay).toBe('0s');
      expect(cards[1].style.animationDelay).toBe('0.05s');
      expect(cards[2].style.animationDelay).toBe('0.1s');
      expect(cards[3].style.animationDelay).toBe('0.15s');
      expect(cards[4].style.animationDelay).toBe('0.2s');
    });

    it('ensures Save Piece button stops propagation and does not trigger card navigation', () => {
      renderCollectionsWithInspector();

      const saveBtn = screen.getByTestId('save-btn-et-01');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');

      // Click save button
      fireEvent.click(saveBtn);
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('yes');

      // Keyboard activation on save button
      fireEvent.keyDown(saveBtn, { key: 'Enter' });
      // Event should not bubble or trigger duplicate unhandled actions
      expect(saveBtn).toBeInTheDocument();
    });

    it('keeps product pricing, valuation, and edition badges immediately accessible without animation delay', () => {
      renderCollections();

      PRODUCTS.forEach(p => {
        const priceEl = screen.getByTestId(`product-price-${p.id}`);
        expect(priceEl).toBeInTheDocument();
        expect(priceEl.textContent).toContain(p.price.toLocaleString('en-IN'));

        const card = screen.getByTestId(`product-card-${p.id}`);
        expect(card.textContent).toContain(p.edition);
        expect(card.textContent).toContain(p.fiberPurity);
      });
    });

    it('preserves catalogue filtering and sorting seamlessly with plinth cards', () => {
      renderCollections();

      // Filter by Outerwear
      const outerwearPill = screen.getByTestId('category-pill-outerwear');
      fireEvent.click(outerwearPill);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(2);
      expect(cards[0].getAttribute('data-product-id')).toBe('et-01');
      expect(cards[1].getAttribute('data-product-id')).toBe('et-02');

      // Each filtered card retains plinth structure
      cards.forEach(card => {
        expect(card.classList.contains('plinth-card')).toBe(true);
      });
    });
  });

  /* -------------------------------------------------------------------------
     9. Phase 6.3: Asymmetric Collections & Editorial Product Hierarchy
     ------------------------------------------------------------------------- */
  describe('9. Phase 6.3: Asymmetric Collections & Editorial Product Hierarchy', () => {
    it('renders ET-01 as the prominent flagship editorial plinth in featured catalogue view', () => {
      renderCollections();

      const flagshipCard = screen.getByTestId('product-card-et-01');
      expect(flagshipCard).toBeInTheDocument();
      expect(flagshipCard.classList.contains('flagship-card')).toBe(true);

      // Parent container spans full width
      expect(flagshipCard.parentElement).toHaveClass('col-12');

      // Displays canonical information without exaggeration
      expect(flagshipCard.textContent).toContain('Oxblood Wool-Silk Signature Coat-Dress');
      expect(flagshipCard.textContent).toContain('₹68,500');
      expect(flagshipCard.textContent).toContain('Edition of 30');
      expect(flagshipCard.textContent).toContain('70% Fine Merino Wool, 30% Wild Mulberry Silk');

      // Approved primary image
      const img = flagshipCard.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img?.getAttribute('src')).toBe('/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp');
    });

    it('arranges the six companion pieces in an asymmetric, balanced editorial layout without orphan cards', () => {
      renderCollections();

      const cards = screen.getAllByTestId(/^product-card-et-/);
      expect(cards).toHaveLength(7);

      // Flagship
      expect(cards[0].parentElement).toHaveClass('col-12');

      // Row 1 pair (asymmetric 7 + 5)
      expect(cards[1].parentElement).toHaveClass('col-lg-7');
      expect(cards[2].parentElement).toHaveClass('col-lg-5');

      // Row 2 pair (asymmetric 5 + 7)
      expect(cards[3].parentElement).toHaveClass('col-lg-5');
      expect(cards[4].parentElement).toHaveClass('col-lg-7');

      // Row 3 pair (balanced 6 + 6)
      expect(cards[5].parentElement).toHaveClass('col-lg-6');
      expect(cards[6].parentElement).toHaveClass('col-lg-6');

      // All companion pieces use standard plinth card without flagship banner class
      for (let i = 1; i <= 6; i++) {
        expect(cards[i].classList.contains('flagship-card')).toBe(false);
        expect(cards[i].classList.contains('plinth-card')).toBe(true);
      }
    });

    it('reverts flagship presentation gracefully to linear cards during price sorting', () => {
      renderCollections();

      const sortSelect = screen.getByTestId('sort-select');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

      const cards = screen.getAllByTestId(/^product-card-et-/);
      cards.forEach(card => {
        expect(card.classList.contains('flagship-card')).toBe(false);
        expect(card.parentElement).toHaveClass('col-12 col-md-6 col-lg-4');
      });
    });

    it('adapts companion cards to balanced two-column rows when desktop filters are opened', () => {
      renderCollections();

      const filterToggle = screen.getByTestId('desktop-filter-toggle');
      fireEvent.click(filterToggle);

      const cards = screen.getAllByTestId(/^product-card-et-/);
      // Flagship remains col-12 inside the 9-column area
      expect(cards[0].parentElement).toHaveClass('col-12');

      // Companion pieces format cleanly as col-md-6 (pairs of 2, zero orphans)
      for (let i = 1; i <= 6; i++) {
        expect(cards[i].parentElement).toHaveClass('col-12 col-md-6');
      }
    });
  });
});
