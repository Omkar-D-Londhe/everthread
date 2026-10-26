import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SavedPiecesPage } from '../pages/SavedPiecesPage.tsx';
import { BagPage } from '../pages/BagPage.tsx';
import { CollectionsPage } from '../pages/CollectionsPage.tsx';
import { ProductDetailPage } from '../pages/ProductDetailPage.tsx';
import { Header } from '../components/Header.tsx';
import { CartProvider, useCart } from '../context/CartContext.tsx';
import { SavedProvider, useSaved } from '../context/SavedContext.tsx';

// Test harness wrapping router, providers, and optional header
const renderWithAppShell = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <CartProvider>
        <SavedProvider>
          <Header onOpenSearch={() => {}} />
          <Routes>
            <Route path="/saved" element={<SavedPiecesPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

// Inspection component to check both contexts directly in tests
const ContextInspector: React.FC = () => {
  const { bag, bagCount, subtotal, formatPrice, addToBag, clearBag } = useCart();
  const { saved, savedCount, toggleSaved, clearSaved } = useSaved();

  return (
    <div>
      <span data-testid="test-saved-count">{savedCount}</span>
      <span data-testid="test-saved-ids">{saved.join(',')}</span>
      <span data-testid="test-bag-count">{bagCount}</span>
      <span data-testid="test-bag-lines">{bag.length}</span>
      <span data-testid="test-subtotal">{subtotal}</span>
      <span data-testid="test-formatted-subtotal">{formatPrice(subtotal)}</span>

      <button data-testid="seed-saved-et01" onClick={() => toggleSaved('et-01')}>Save et-01</button>
      <button data-testid="seed-saved-et05" onClick={() => toggleSaved('et-05')}>Save et-05</button>
      <button data-testid="seed-clear-saved" onClick={clearSaved}>Clear Saved</button>
      <button 
        data-testid="seed-bag-et01-m" 
        onClick={() => addToBag({ productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 })}
      >
        Add et-01 M
      </button>
      <button 
        data-testid="seed-bag-et01-s" 
        onClick={() => addToBag({ productId: 'et-01', size: 'I (XS–S)', color: 'Madder Oxblood', quantity: 1 })}
      >
        Add et-01 S
      </button>
      <button 
        data-testid="seed-bag-et05" 
        onClick={() => addToBag({ productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Madder Oxblood', quantity: 1 })}
      >
        Add et-05
      </button>
      <button data-testid="seed-clear-bag" onClick={clearBag}>Clear Bag</button>
    </div>
  );
};

const renderWithInspector = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <CartProvider>
        <SavedProvider>
          <Header onOpenSearch={() => {}} />
          <ContextInspector />
          <Routes>
            <Route path="/saved" element={<SavedPiecesPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('EverThread Stage 3.5: Saved Pieces & Shopping Bag Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /* -------------------------------------------------------------------------
   * Requirement 1: Empty Saved Pieces and Bag states
   * ------------------------------------------------------------------------- */
  describe('1. Empty Saved Pieces and Bag States', () => {
    it('renders editorial empty state on /saved with links to collections', () => {
      renderWithAppShell('/saved');

      expect(screen.getByTestId('empty-saved-state')).toBeInTheDocument();
      expect(screen.getByText('Your Saved Curation is Empty')).toBeInTheDocument();
      expect(screen.getByTestId('empty-saved-explore-btn')).toHaveAttribute('href', '/collections');
      expect(screen.queryByTestId('saved-products-grid')).not.toBeInTheDocument();
    });

    it('renders editorial empty state on /bag with link to collections', () => {
      renderWithAppShell('/bag');

      expect(screen.getByTestId('empty-bag-state')).toBeInTheDocument();
      expect(screen.getByText('Your Bespoke Bag Is Empty')).toBeInTheDocument();
      expect(screen.getByTestId('empty-bag-explore-btn')).toHaveAttribute('href', '/collections');
      expect(screen.queryByTestId('bag-items-list')).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 2: Save, unsave, remove, and move-to-Bag behaviour
   * ------------------------------------------------------------------------- */
  describe('2. Saved Pieces Curation & Move-to-Bag Integration', () => {
    it('renders saved product card with approved local image, canonical price, and edition', () => {
      // Seed saved piece et-01
      localStorage.setItem('everthread_saved_v2', JSON.stringify(['et-01']));
      renderWithAppShell('/saved');

      const card = screen.getByTestId('saved-card-et-01');
      expect(card).toBeInTheDocument();
      expect(screen.getByTestId('saved-title-et-01')).toHaveTextContent('Oxblood Wool-Silk Signature Coat-Dress');
      expect(screen.getByTestId('saved-price-et-01')).toHaveTextContent('₹68,500');
      expect(within(card).getByText('Edition of 30')).toBeInTheDocument();

      // Responsive WebP local image
      const img = within(card).getByRole('img');
      expect(img.getAttribute('src')).toBe('/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp');
    });

    it('removes piece when clicking the Remove action on /saved', () => {
      localStorage.setItem('everthread_saved_v2', JSON.stringify(['et-01']));
      renderWithAppShell('/saved');

      expect(screen.getByTestId('saved-card-et-01')).toBeInTheDocument();
      const removeBtn = screen.getByTestId('remove-saved-et-01');
      fireEvent.click(removeBtn);

      // Card is removed and empty state appears
      expect(screen.queryByTestId('saved-card-et-01')).not.toBeInTheDocument();
      expect(screen.getByTestId('empty-saved-state')).toBeInTheDocument();
    });

    it('moves an apparel piece to Bag with selected size and removes from Saved Pieces', () => {
      localStorage.setItem('everthread_saved_v2', JSON.stringify(['et-01']));
      renderWithInspector('/saved');

      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('1');
      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('0');

      // Select size 'III (L–XL)'
      const sizeOpt = screen.getByTestId('saved-size-opt-et-01-III--L-XL-');
      fireEvent.click(sizeOpt);

      // Click "Move to Bespoke Bag"
      const moveBtn = screen.getByTestId('move-to-bag-et-01');
      fireEvent.click(moveBtn);

      // Product is added to Bag and removed from Saved
      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('0');
      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('1');
    });

    it('accessories display specification badge without apparel size selectors in Saved Pieces', () => {
      localStorage.setItem('everthread_saved_v2', JSON.stringify(['et-05'])); // Box Calf Bag
      renderWithAppShell('/saved');

      const card = screen.getByTestId('saved-card-et-05');
      expect(card).toBeInTheDocument();
      // Verifies presence of dimension specification badge
      expect(screen.getByTestId('saved-dim-spec-et-05')).toHaveTextContent('One Size (Structured Mini Box)');
      // Verifies NO apparel size selector exists for accessories
      expect(screen.queryByTestId('saved-size-select-et-05')).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 3: Persistence across reloads
   * ------------------------------------------------------------------------- */
  describe('3. Persistence Across Reloads', () => {
    it('persists saved pieces and bag items to localStorage and restores them on remount', () => {
      const { unmount } = renderWithInspector('/saved');

      act(() => {
        screen.getByTestId('seed-saved-et01').click();
        screen.getByTestId('seed-bag-et01-m').click();
      });

      // Verify localStorage was updated
      expect(JSON.parse(localStorage.getItem('everthread_saved_v2') || '[]')).toEqual(['et-01']);
      const storedBag = JSON.parse(localStorage.getItem('everthread_bag_v2') || '[]');
      expect(storedBag).toHaveLength(1);
      expect(storedBag[0].productId).toBe('et-01');

      unmount();

      // Remount and check hydration
      renderWithInspector('/bag');
      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('1');
      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('1');
      expect(screen.getByTestId('bag-item-0')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 4: Adding the same product/variant twice merges quantity
   * ------------------------------------------------------------------------- */
  describe('4. Merging Repeated Additions of Same Product & Variant', () => {
    it('merges identical product and variant additions into single line item with increased quantity', () => {
      renderWithInspector('/bag');

      // Add ET-01 M twice
      act(() => {
        screen.getByTestId('seed-bag-et01-m').click();
      });
      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('1');
      expect(screen.getByTestId('test-bag-lines')).toHaveTextContent('1');

      act(() => {
        screen.getByTestId('seed-bag-et01-m').click();
      });
      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('2');
      expect(screen.getByTestId('test-bag-lines')).toHaveTextContent('1');

      // In Bag UI
      expect(screen.getByTestId('item-qty-0')).toHaveTextContent('2');
      // Subtotal: 68,500 * 2 = 137,000
      expect(screen.getByTestId('bag-subtotal')).toHaveTextContent('₹1,37,000');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 5: Keeping distinct variants separate
   * ------------------------------------------------------------------------- */
  describe('5. Keeping Distinct Variants Separate', () => {
    it('maintains distinct line items when the same product has different sizes', () => {
      renderWithInspector('/bag');

      // Add ET-01 in Size M, then in Size S
      act(() => {
        screen.getByTestId('seed-bag-et01-m').click();
        screen.getByTestId('seed-bag-et01-s').click();
      });

      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('2');
      expect(screen.getByTestId('test-bag-lines')).toHaveTextContent('2');
      expect(screen.getByTestId('bag-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('bag-item-1')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 6: Quantity updates and item removal
   * ------------------------------------------------------------------------- */
  describe('6. Quantity Updates & Item Removal in Shopping Bag', () => {
    it('increments quantity and updates line total when clicking plus button', () => {
      localStorage.setItem('everthread_bag_v2', JSON.stringify([
        { productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Madder Oxblood', quantity: 1 }
      ]));
      renderWithAppShell('/bag');

      expect(screen.getByTestId('item-qty-0')).toHaveTextContent('1');
      expect(screen.getByTestId('bag-item-total-0')).toHaveTextContent('₹54,000');

      // Increment
      fireEvent.click(screen.getByTestId('qty-plus-0'));
      expect(screen.getByTestId('item-qty-0')).toHaveTextContent('2');
      expect(screen.getByTestId('bag-item-total-0')).toHaveTextContent('₹1,08,000');
      expect(screen.getByTestId('bag-subtotal')).toHaveTextContent('₹1,08,000');
    });

    it('preserves line item and keeps quantity at 1 when attempting to decrement at quantity 1', () => {
      localStorage.setItem('everthread_bag_v2', JSON.stringify([
        { productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Madder Oxblood', quantity: 1 }
      ]));
      renderWithAppShell('/bag');

      expect(screen.getByTestId('item-qty-0')).toHaveTextContent('1');
      const minusBtn = screen.getByTestId('qty-minus-0');
      expect(minusBtn).toHaveAttribute('aria-disabled', 'true');

      // Decrement attempt at 1 does NOT delete the item
      fireEvent.click(minusBtn);

      // Line item remains, quantity stays at 1
      expect(screen.getByTestId('item-qty-0')).toHaveTextContent('1');
      expect(screen.queryByTestId('empty-bag-state')).not.toBeInTheDocument();
    });

    it('removes item directly when clicking the line item Remove action', () => {
      localStorage.setItem('everthread_bag_v2', JSON.stringify([
        { productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Madder Oxblood', quantity: 2 }
      ]));
      renderWithAppShell('/bag');

      expect(screen.getByTestId('bag-item-0')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('remove-item-0'));

      expect(screen.queryByTestId('bag-item-0')).not.toBeInTheDocument();
      expect(screen.getByTestId('empty-bag-state')).toBeInTheDocument();
    });

    it('moves item from Bag to Saved Pieces when clicking Save for Later', () => {
      localStorage.setItem('everthread_bag_v2', JSON.stringify([
        { productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Madder Oxblood', quantity: 1 }
      ]));
      renderWithInspector('/bag');

      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('1');
      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('0');

      fireEvent.click(screen.getByTestId('move-to-saved-0'));

      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('0');
      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('1');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 7: Accurate Subtotal Calculation from Canonical Prices
   * ------------------------------------------------------------------------- */
  describe('7. Subtotal Calculation from Canonical Catalogue Prices', () => {
    it('calculates subtotal strictly from verified catalogue prices and ignores price tampering', () => {
      // ET-01 (68,500) x 1 + ET-06 (24,500) x 2 + ET-07 (38,000) x 1
      // Expected total: 68,500 + 49,000 + 38,000 = 155,500
      localStorage.setItem('everthread_bag_v2', JSON.stringify([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1, price: 1 }, // Tampered stored price
        { productId: 'et-06', size: 'Classic Stole (200cm × 70cm)', color: 'Burgundy Wine', quantity: 2 },
        { productId: 'et-07', size: 'Reversible Shawl (220cm × 80cm)', color: 'Natural Warm Ivory', quantity: 1 }
      ]));
      renderWithAppShell('/bag');

      expect(screen.getByTestId('bag-total-count')).toHaveTextContent('4 Pieces Allocated');
      expect(screen.getByTestId('bag-subtotal')).toHaveTextContent('₹1,55,500');
      expect(screen.getByTestId('bag-total')).toHaveTextContent('₹1,55,500');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 8: Invalid or Obsolete localStorage Data
   * ------------------------------------------------------------------------- */
  describe('8. Resilient Recovery from Malformed or Obsolete Data', () => {
    it('gracefully recovers from corrupt JSON in localStorage without throwing errors', () => {
      localStorage.setItem('everthread_bag_v2', '{corrupted::malformed');
      localStorage.setItem('everthread_saved_v2', '["unclosed');

      renderWithAppShell('/saved');
      expect(screen.getByTestId('empty-saved-state')).toBeInTheDocument();
    });

    it('filters out obsolete or nonexistent product IDs from storage', () => {
      localStorage.setItem('everthread_saved_v2', JSON.stringify(['ghost-product-99', 'et-01', 12345, null]));
      localStorage.setItem('everthread_bag_v2', JSON.stringify([
        { productId: 'non-existent', size: 'M', color: 'Black', quantity: 1 },
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]));

      renderWithInspector('/saved');
      // Only the genuine et-01 is preserved
      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('1');
      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('1');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 9: Header Counts Synchronizing with State Changes
   * ------------------------------------------------------------------------- */
  describe('9. Header Badge Synchronization', () => {
    it('immediately updates header bookmark and bag badges when state changes', () => {
      renderWithInspector('/collections');

      // Initially zero -> badges not rendered
      expect(screen.queryByText(/js-saved-count/)).not.toBeInTheDocument();

      // Save et-01 via inspector
      act(() => {
        screen.getByTestId('seed-saved-et01').click();
      });

      const savedLink = screen.getByRole('link', { name: /view saved pieces \(1 items\)/i });
      expect(savedLink).toBeInTheDocument();
      expect(within(savedLink).getByText('1')).toBeInTheDocument();

      // Add to bag
      act(() => {
        screen.getByTestId('seed-bag-et01-m').click();
      });

      const bagLink = screen.getByRole('link', { name: /view bespoke shopping bag \(1 items\)/i });
      expect(bagLink).toBeInTheDocument();
      expect(within(bagLink).getByText('1')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 10: Existing Compass, Collections, and Product Detail Regressions
   * ------------------------------------------------------------------------- */
  describe('10. Regression Safety across Collections and Product Detail', () => {
    it('Collections page bookmark action synchronizes directly with SavedContext', () => {
      renderWithInspector('/collections');

      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('0');

      // Click save button on ET-01 product card in Collections
      const saveBtn = screen.getByTestId('save-btn-et-01');
      fireEvent.click(saveBtn);

      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('1');
      expect(saveBtn).toHaveAttribute('aria-pressed', 'true');

      // Unsave via click
      fireEvent.click(saveBtn);
      expect(screen.getByTestId('test-saved-count')).toHaveTextContent('0');
      expect(saveBtn).toHaveAttribute('aria-pressed', 'false');
    });

    it('Product detail page adds item to Bag with selected size and updates Bag count', () => {
      renderWithInspector('/product/oxblood-wool-silk-signature-coat-dress');

      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('0');

      // Select Size II (M)
      const sizeBtn = screen.getByTestId('size-option-II--M-');
      fireEvent.click(sizeBtn);

      // Click Add to Bag
      const addToBagBtn = screen.getByTestId('add-to-bag-btn');
      fireEvent.click(addToBagBtn);

      expect(screen.getByTestId('test-bag-count')).toHaveTextContent('1');
    });
  });
});
