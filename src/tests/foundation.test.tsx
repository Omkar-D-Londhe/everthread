import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext.tsx';
import { SavedProvider, useSaved } from '../context/SavedContext.tsx';
import { App } from '../App.tsx';

// Test harness for store manipulation
const StoreHarness: React.FC = () => {
  const { bag, bagCount, addToBag, updateQuantity, removeFromBag, clearBag } = useCart();
  const { saved, savedCount, isSaved, toggleSaved } = useSaved();

  return (
    <div>
      <span data-testid="bag-count">{bagCount}</span>
      <span data-testid="bag-items">{bag.length}</span>
      <span data-testid="saved-count">{savedCount}</span>
      <span data-testid="saved-items">{saved.length}</span>
      <span data-testid="is-et01-saved">{isSaved('et-01') ? 'yes' : 'no'}</span>

      <button data-testid="btn-add" onClick={() => addToBag({ productId: 'et-01', size: 'II (M)', color: 'Warm Ivory', quantity: 1 })}>Add</button>
      <button data-testid="btn-add-dup" onClick={() => addToBag({ productId: 'et-01', size: 'II (M)', color: 'Warm Ivory', quantity: 2 })}>Add More</button>
      <button data-testid="btn-qty-minus" onClick={() => updateQuantity(0, -1)}>Minus</button>
      <button data-testid="btn-remove" onClick={() => removeFromBag(0)}>Remove</button>
      <button data-testid="btn-clear" onClick={() => clearBag()}>Clear</button>
      <button data-testid="btn-toggle-saved" onClick={() => toggleSaved('et-01')}>Toggle Saved</button>
    </div>
  );
};

describe('Stage 1 Foundation & Shell Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('Requirement 6: New visitors must see an empty Bag and empty Saved Pieces (0 counts)', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StoreHarness />
        </SavedProvider>
      </CartProvider>
    );

    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    expect(screen.getByTestId('bag-items').textContent).toBe('0');
    expect(screen.getByTestId('saved-count').textContent).toBe('0');
    expect(screen.getByTestId('saved-items').textContent).toBe('0');
  });

  it('Requirement 6: Recovers gracefully when localStorage contains corrupted JSON', () => {
    localStorage.setItem('everthread_bag_v2', 'invalid-json{{{');
    localStorage.setItem('everthread_saved_v2', 'not-an-array');

    render(
      <CartProvider>
        <SavedProvider>
          <StoreHarness />
        </SavedProvider>
      </CartProvider>
    );

    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    expect(screen.getByTestId('saved-count').textContent).toBe('0');
  });

  it('Cart operations: adding, merging variants, quantity adjustment, and removal', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StoreHarness />
        </SavedProvider>
      </CartProvider>
    );

    // 1. Add item
    act(() => {
      screen.getByTestId('btn-add').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('1');
    expect(screen.getByTestId('bag-items').textContent).toBe('1');

    // 2. Add same variant -> merge
    act(() => {
      screen.getByTestId('btn-add-dup').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('3');
    expect(screen.getByTestId('bag-items').textContent).toBe('1');

    // 3. Decrement quantity
    act(() => {
      screen.getByTestId('btn-qty-minus').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('2');

    // 4. Remove item
    act(() => {
      screen.getByTestId('btn-remove').click();
    });
    expect(screen.getByTestId('bag-count').textContent).toBe('0');
    expect(screen.getByTestId('bag-items').textContent).toBe('0');
  });

  it('Saved pieces operations: toggle on and off', () => {
    render(
      <CartProvider>
        <SavedProvider>
          <StoreHarness />
        </SavedProvider>
      </CartProvider>
    );

    expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');
    expect(screen.getByTestId('saved-count').textContent).toBe('0');

    // Toggle on
    act(() => {
      screen.getByTestId('btn-toggle-saved').click();
    });
    expect(screen.getByTestId('is-et01-saved').textContent).toBe('yes');
    expect(screen.getByTestId('saved-count').textContent).toBe('1');

    // Toggle off
    act(() => {
      screen.getByTestId('btn-toggle-saved').click();
    });
    expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');
    expect(screen.getByTestId('saved-count').textContent).toBe('0');
  });

  const routesToTest = [
    { path: '/', expectedText: 'An heirloom, not a trend.' },
    { path: '/collections', expectedText: 'Curated Repertoire' },
    { path: '/product/the-sylvan-mulberry-silk-trench', expectedText: 'Identifier: the-sylvan-mulberry-silk-trench' },
    { path: '/compass', expectedText: 'The Thread Compass' },
    { path: '/archive', expectedText: 'The Cultural Archive' },
    { path: '/archive/the-living-loom', expectedText: 'the living loom' },
    { path: '/the-house', expectedText: 'The House of EverThread' },
    { path: '/journal', expectedText: 'Monographs & Essays' },
    { path: '/journal/on-unbroken-heirlooms', expectedText: 'on unbroken heirlooms' },
    { path: '/saved', expectedText: 'Your Saved Curation is Empty' },
    { path: '/bag', expectedText: 'Your Bespoke Bag Is Empty' },
    { path: '/checkout', expectedText: 'Concierge Allocation Demo' },
    { path: '/unknown-route-sample', expectedText: 'This thread has not yet been woven into the archive.' }
  ];

  routesToTest.forEach(({ path, expectedText }) => {
    it(`Requirement 4: Successfully resolves route "${path}"`, () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <CartProvider>
            <SavedProvider>
              <App />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(document.body.textContent).toContain(expectedText);
    });
  });
});
