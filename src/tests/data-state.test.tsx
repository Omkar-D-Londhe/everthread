import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PRODUCTS, getProductById, getProductBySlug } from '../data/products.ts';
import { STORIES, WEAVE_LIBRARY, getStoryBySlug } from '../data/stories.ts';
import { JOURNAL_ARTICLES, getArticleBySlug } from '../data/journal.ts';
import { CartProvider, useCart } from '../context/CartContext.tsx';
import { SavedProvider, useSaved } from '../context/SavedContext.tsx';

// Test component to interact with CartContext and SavedContext
const StateTester: React.FC = () => {
  const { 
    bag, 
    bagCount, 
    subtotal, 
    formatPrice, 
    addToBag, 
    updateQuantity, 
    removeFromBag, 
    clearBag 
  } = useCart();

  const { savedCount, isSaved, toggleSaved } = useSaved();

  return (
    <div>
      <span data-testid="bag-count">{bagCount}</span>
      <span data-testid="bag-lines">{bag.length}</span>
      <span data-testid="subtotal">{subtotal}</span>
      <span data-testid="formatted-subtotal">{formatPrice(subtotal)}</span>

      <span data-testid="saved-count">{savedCount}</span>
      <span data-testid="is-et01-saved">{isSaved('et-01') ? 'yes' : 'no'}</span>
      <span data-testid="is-et02-saved">{isSaved('et-02') ? 'yes' : 'no'}</span>

      <button 
        data-testid="add-et01" 
        onClick={() => addToBag({ productId: 'et-01', size: 'II (M)', color: 'Warm Ivory', quantity: 1 })}
      >
        Add et-01
      </button>

      <button 
        data-testid="add-et02-x2" 
        onClick={() => addToBag({ productId: 'et-02', size: 'I (XS–S)', color: 'Natural Oatmeal', quantity: 2 })}
      >
        Add et-02 x2
      </button>

      <button 
        data-testid="add-et01-dup" 
        onClick={() => addToBag({ productId: 'et-01', size: 'II (M)', color: 'Warm Ivory', quantity: 1 })}
      >
        Add et-01 duplicate
      </button>

      <button 
        data-testid="add-invalid-prod" 
        onClick={() => addToBag({ productId: 'non-existent-product', size: 'M', color: 'Black', quantity: 1 })}
      >
        Add Invalid
      </button>

      <button data-testid="qty-minus-line0" onClick={() => updateQuantity(0, -1)}>Minus line 0</button>
      <button data-testid="qty-plus-line0" onClick={() => updateQuantity(0, 1)}>Plus line 0</button>
      <button data-testid="remove-line0" onClick={() => removeFromBag(0)}>Remove line 0</button>
      <button data-testid="clear-all" onClick={clearBag}>Clear</button>

      <button data-testid="toggle-et01" onClick={() => toggleSaved('et-01')}>Toggle et-01</button>
      <button data-testid="toggle-invalid" onClick={() => toggleSaved('invalid-prod-id')}>Toggle Invalid</button>
    </div>
  );
};

describe('EverThread Stage 2 & 3.1: Data Models & Integrity', () => {
  it('Product catalogue contains exactly 7 heirlooms with complete required attributes', () => {
    expect(PRODUCTS).toHaveLength(7);
    const expectedIds = ['et-01', 'et-02', 'et-03', 'et-04', 'et-05', 'et-06', 'et-07'];

    PRODUCTS.forEach((prod, idx) => {
      expect(prod.id).toBe(expectedIds[idx]);
      expect(typeof prod.slug).toBe('string');
      expect(prod.slug.length).toBeGreaterThan(0);
      expect(typeof prod.title).toBe('string');
      expect(['Outerwear', 'Waistcoats', 'Tunics & Drapes', 'Accessories']).toContain(prod.category);
      expect(prod.price).toBeGreaterThan(0);
      expect(prod.currency).toBe('₹');
      expect(prod.colors.length).toBeGreaterThanOrEqual(1);
      expect(prod.sizes.length).toBeGreaterThanOrEqual(1);
      expect(typeof prod.warpDensity).toBe('string');
      expect(prod.contentFlags).toBeDefined();
      expect(Array.isArray(prod.contentFlags.unsupportedClaims)).toBe(true);

      // Verify local asset bindings (no remote hotlinking)
      expect(prod.image.startsWith('/images/products/')).toBe(true);
      expect(prod.image).not.toContain('googleusercontent');
      expect(prod.macroImage.startsWith('/images/products/')).toBe(true);
      expect(prod.gallery).toBeDefined();
      expect(prod.gallery?.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('Product lookup utilities (by ID and by slug) return correct items', () => {
    const p1 = getProductById('et-01');
    expect(p1?.title).toBe('Oxblood Wool-Silk Signature Coat-Dress');

    const p1Slug = getProductBySlug('oxblood-wool-silk-signature-coat-dress');
    expect(p1Slug?.id).toBe('et-01');

    // Legacy slug backward-compatibility
    const p1Legacy = getProductBySlug('the-sylvan-mulberry-silk-trench');
    expect(p1Legacy?.id).toBe('et-01');

    expect(getProductById('invalid-id')).toBeUndefined();
    expect(getProductBySlug('invalid-slug')).toBeUndefined();
  });

  it('Cultural Archive contains 4 folios with drafting specs and integrity flags', () => {
    expect(STORIES).toHaveLength(4);
    STORIES.forEach(story => {
      expect(story.id).toMatch(/^story-\d{2}$/);
      expect(story.slug.length).toBeGreaterThan(0);
      expect(story.chapter).toContain('CHAPTER');
      expect(story.folio).toContain('FOLIO');
      expect(story.draftingSpecs.length).toBeGreaterThanOrEqual(3);
      expect(story.contentFlags).toBeDefined();
      expect(typeof story.contentFlags.isPersonaIllustrative).toBe('boolean');
    });

    const s1 = getStoryBySlug('the-living-loom');
    expect(s1?.folio).toBe('FOLIO 1.1');
  });

  it('Weave Library contains curated distinct craft classifications', () => {
    expect(WEAVE_LIBRARY.length).toBeGreaterThanOrEqual(6);
    const distinctions = WEAVE_LIBRARY.map(item => item.distinction);
    expect(distinctions).toContain('weaving');
    expect(distinctions).toContain('embroidery');
    expect(distinctions).toContain('dyeing');
    expect(distinctions).toContain('draping');
  });

  it('Journal articles contain structured monographs with reading times and sources', () => {
    expect(JOURNAL_ARTICLES).toHaveLength(3);
    JOURNAL_ARTICLES.forEach(art => {
      expect(art.slug.length).toBeGreaterThan(0);
      expect(art.bodyParagraphs.length).toBeGreaterThanOrEqual(2);
      expect(art.readTime).toContain('min read');
      expect(Array.isArray(art.sources)).toBe(true);
    });

    const art1 = getArticleBySlug('on-unbroken-heirlooms');
    expect(art1?.category).toBe('Atelier Philosophy');
  });
});

describe('EverThread Stage 2: Shared State & Cart Calculations', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Requirement 3 & 6: Clean initial state — zero bag items and zero saved pieces', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    expect(screen.getByTestId('bag-lines').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0');
    expect(screen.getByTestId('formatted-subtotal').textContent).toBe('₹0');
    expect(screen.getByTestId('saved-count').textContent).toBe('0');
  });

  it('Calculates subtotal strictly from catalogue data and formats as Indian Rupees', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    // Add et-01: price 68,500 x 1 = 68,500
    act(() => {
      screen.getByTestId('add-et01').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('1');
    expect(screen.getByTestId('subtotal').textContent).toBe('68500');
    expect(screen.getByTestId('formatted-subtotal').textContent).toBe('₹68,500');

    // Add et-02: price 112,000 x 2 = 224,000. Total = 68,500 + 224,000 = 292,500
    act(() => {
      screen.getByTestId('add-et02-x2').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('3');
    expect(screen.getByTestId('bag-lines').textContent).toBe('2');
    expect(screen.getByTestId('subtotal').textContent).toBe('292500');
    expect(screen.getByTestId('formatted-subtotal').textContent).toBe('₹2,92,500');
  });

  it('Merges identical product and variant lines', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    // Add et-01 (Warm Ivory, II (M)) x 1
    act(() => {
      screen.getByTestId('add-et01').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('1');
    expect(screen.getByTestId('bag-lines').textContent).toBe('1');

    // Add same et-01 variant again -> lines remains 1, quantity increases to 2
    act(() => {
      screen.getByTestId('add-et01-dup').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('2');
    expect(screen.getByTestId('bag-lines').textContent).toBe('1');
    expect(screen.getByTestId('subtotal').textContent).toBe(String(68500 * 2));
  });

  it('Quantity adjustments update count, subtotal, and auto-remove when reduced to 0', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-et01').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('1');

    // Decrement from 1 to 0 -> line item removed
    act(() => {
      screen.getByTestId('qty-minus-line0').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    expect(screen.getByTestId('bag-lines').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0');
  });

  it('Ignores additions of non-existent products', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-invalid-prod').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    expect(screen.getByTestId('bag-lines').textContent).toBe('0');
  });

  it('Persists to localStorage and recovers cleanly from corrupt or invalid data', () => {
    // 1. Valid persistence check
    const { unmount } = render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-et01').click();
      screen.getByTestId('toggle-et01').click();
    });

    const storedBag = JSON.parse(localStorage.getItem('everthread_bag_v2') || '[]');
    expect(storedBag).toHaveLength(1);
    expect(storedBag[0].productId).toBe('et-01');

    const storedSaved = JSON.parse(localStorage.getItem('everthread_saved_v2') || '[]');
    expect(storedSaved).toEqual(['et-01']);

    unmount();

    // 2. Corrupt storage test: inject invalid JSON and invalid product IDs
    localStorage.setItem('everthread_bag_v2', '{{malformed json');
    localStorage.setItem('everthread_saved_v2', JSON.stringify(['ghost-product-id-999']));

    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    // Corrupt bag recovers to empty
    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    // Ghost product filtered out by catalogue validator
    expect(screen.getByTestId('saved-count').textContent).toBe('0');
  });

  it('Saved items toggle on and off, ignoring non-existent product IDs', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StateTester />
        </SavedProvider>
      </CartProvider>
    );

    expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');

    // Toggle on
    act(() => {
      screen.getByTestId('toggle-et01').click();
    });
    expect(screen.getByTestId('is-et01-saved').textContent).toBe('yes');
    expect(screen.getByTestId('saved-count').textContent).toBe('1');

    // Toggle off
    act(() => {
      screen.getByTestId('toggle-et01').click();
    });
    expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');
    expect(screen.getByTestId('saved-count').textContent).toBe('0');

    // Toggle invalid product -> ignored
    act(() => {
      screen.getByTestId('toggle-invalid').click();
    });
    expect(screen.getByTestId('saved-count').textContent).toBe('0');
  });
});
