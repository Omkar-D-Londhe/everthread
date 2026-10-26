import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext.tsx';
import { 
  TRADITIONAL_PRODUCTS, 
  validateTraditionalProduct 
} from '../data/traditionalProducts.ts';
import { TraditionalProduct } from '../types/catalog.ts';

const CartTestHarness: React.FC = () => {
  const { bag, bagCount, subtotal, addToBag, updateQuantity, removeFromBag } = useCart();

  return (
    <div>
      <span data-testid="cart-count">{bagCount}</span>
      <span data-testid="cart-lines">{bag.length}</span>
      <span data-testid="cart-subtotal">{subtotal}</span>

      <div data-testid="cart-items">
        {bag.map((item, idx) => (
          <div key={item.variantId || idx} data-testid={`bag-line-${idx}`}>
            <span data-testid={`variant-id-${idx}`}>{item.variantId}</span>
            <span data-testid={`variant-size-${idx}`}>{item.size}</span>
            <span data-testid={`variant-qty-${idx}`}>{item.quantity}</span>
            <button 
              data-testid={`qty-minus-${idx}`} 
              onClick={() => updateQuantity(item.variantId || idx, -1)}
            >
              Minus
            </button>
            <button 
              data-testid={`remove-${idx}`} 
              onClick={() => removeFromBag(item.variantId || idx)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        data-testid="add-et01-m"
        onClick={() => {
          const res = addToBag({
            productId: 'et-01',
            size: 'II (M)',
            color: 'Madder Oxblood',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add ET-01 M
      </button>

      <button
        data-testid="add-et01-l"
        onClick={() => {
          const res = addToBag({
            productId: 'et-01',
            size: 'III (L)',
            color: 'Madder Oxblood',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add ET-01 L
      </button>

      <button
        data-testid="add-unlisted-tr"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-01',
            size: 'M',
            color: 'Oxblood / Antique Gold',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add Unlisted TR-01
      </button>

      <button
        data-testid="add-unknown"
        onClick={() => {
          const res = addToBag({
            productId: 'unknown-99',
            size: 'M',
            color: 'Black',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add Unknown
      </button>

      <div id="last-result" data-testid="last-result" />
    </div>
  );
};

describe('Stage 04: Traditional Products Gate & Commerce Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Traditional Product Listing Gate (UT-DATA-02)', () => {
    it('confirms all seven concept records (TR-01 through TR-07) are unlisted against the current unapproved asset registry', () => {
      expect(TRADITIONAL_PRODUCTS).toHaveLength(7);

      for (const prod of TRADITIONAL_PRODUCTS) {
        expect(prod.isListed).toBe(false);
        expect(prod.isPurchasable).toBe(false);

        // Validation against empty approved set confirms listing gate fails safely
        const gate = validateTraditionalProduct(prod, new Set());
        expect(gate.isListed).toBe(false);
        expect(gate.reasons.length).toBeGreaterThan(0);
        expect(gate.reasons.some(r => r.includes('not approved in asset registry'))).toBe(true);
      }
    });

    it('rejects forbidden fields on traditional products to protect curatorial truth', () => {
      const mockProductWithForbidden: TraditionalProduct = {
        ...TRADITIONAL_PRODUCTS[0],
        edition: 'Numbered 01–64',
        origin: 'Varanasi',
        artisanHours: '140 hours',
      } as unknown as TraditionalProduct;

      const gate = validateTraditionalProduct(mockProductWithForbidden, new Set());
      expect(gate.isListed).toBe(false);
      expect(gate.reasons.some(r => r.includes("Forbidden field 'edition'"))).toBe(true);
      expect(gate.reasons.some(r => r.includes("Forbidden field 'origin'"))).toBe(true);
      expect(gate.reasons.some(r => r.includes("Forbidden field 'artisanHours'"))).toBe(true);
    });

    it('passes the gate when all required views are approved and data constraints are satisfied', () => {
      const approvedIds = new Set([
        'TR-02-PRIMARY',
        'TR-02-THREE-QUARTER',
        'TR-02-BACK',
        'TR-02-SEATED',
        'TR-02-DETAIL',
      ]);

      const gate = validateTraditionalProduct(TRADITIONAL_PRODUCTS[1], approvedIds);
      expect(gate.isListed).toBe(true);
      expect(gate.reasons).toHaveLength(0);
    });
  });

  describe('2. Cart Model & Commerce Integrity (UT-CART-01)', () => {
    it('successfully adds listed piece and generates deterministic variantId', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-et01-m'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('et-01-Madder Oxblood-II (M)');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('refuses addition of unlisted traditional products with reason: not-listed', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-unlisted-tr'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('0');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('not-listed');
    });

    it('refuses addition of unknown product IDs with reason: unknown-product', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-unknown'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('0');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('unknown-product');
    });

    it('merges identical variants and separates distinct sizes', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      // Add ET-01 M twice
      fireEvent.click(screen.getByTestId('add-et01-m'));
      fireEvent.click(screen.getByTestId('add-et01-m'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-qty-0')).toHaveTextContent('2');

      // Add ET-01 L -> creates second line
      fireEvent.click(screen.getByTestId('add-et01-l'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('2');
    });

    it('enforces decrement-at-1 protection: decrementing at quantity 1 never deletes line', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-et01-m'));
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-qty-0')).toHaveTextContent('1');

      // Decrement at quantity 1
      fireEvent.click(screen.getByTestId('qty-minus-0'));
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-qty-0')).toHaveTextContent('1');

      // Only explicit remove deletes the line
      fireEvent.click(screen.getByTestId('remove-0'));
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('0');
    });

    it('migrates legacy everthread_bag_v2 storage payload cleanly without corrupting bag', () => {
      const legacyPayload = [
        {
          productId: 'et-01',
          size: 'II (M)',
          color: 'Oxblood',
          quantity: 2
        }
      ];
      localStorage.setItem('everthread_bag_v2', JSON.stringify(legacyPayload));

      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0')).toHaveTextContent('et-01-Oxblood-II (M)');
    });
  });
});
