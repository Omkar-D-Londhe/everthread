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
        data-testid="add-tr01-piece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-01',
            size: 'M',
            sizes: { coat: 'M' },
            color: 'Oxblood / Antique Gold',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-01 Coat
      </button>

      <button
        data-testid="add-tr02-piece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-02',
            size: 'S',
            sizes: { gown: 'S' },
            color: 'Peacock Emerald / Antique Gold',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-02 Gown
      </button>

      <button
        data-testid="add-tr03-multipiece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-03',
            size: '',
            sizes: {
              jacket: 'M',
              trousers: 'M',
            },
            color: 'Midnight Ink / Vermilion',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-03 Multi-piece
      </button>

      <button
        data-testid="add-tr03-missing-piece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-03',
            size: '',
            sizes: {
              jacket: 'M',
            },
            color: 'Midnight Ink / Vermilion',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-03 Missing Piece
      </button>

      <button
        data-testid="add-tr04-multipiece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-04',
            size: '',
            sizes: {
              tunic: 'M',
              trousers: 'M',
            },
            color: 'Deep Oxblood / Warm Ivory',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-04 Multi-piece
      </button>

      <button
        data-testid="add-tr05-piece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-05',
            size: 'L',
            sizes: { 'overlay-slip-pair': 'L' },
            color: 'Warm Ivory / Pearl',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-05 Piece
      </button>

      <button
        data-testid="add-tr06-multipiece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-06',
            size: '',
            sizes: {
              overshirt: 'XL',
              trousers: 'L',
            },
            color: 'Indigo / Terracotta',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-06 Multi-piece
      </button>

      <button
        data-testid="add-tr07-piece"
        onClick={() => {
          const res = addToBag({
            productId: 'tr-07',
            size: 'M',
            sizes: { dress: 'M' },
            color: 'Oxblood / Champagne',
            quantity: 1,
          });
          const el = document.getElementById('last-result');
          if (el) el.textContent = JSON.stringify(res);
        }}
      >
        Add TR-07 Piece
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
    it('confirms all seven concept records (TR-01 through TR-07) are listed and purchasable in the canonical catalogue', () => {
      expect(TRADITIONAL_PRODUCTS).toHaveLength(7);

      for (const prod of TRADITIONAL_PRODUCTS) {
        expect(prod.isListed).toBe(true);
        expect(prod.isPurchasable).toBe(true);

        // Validation against empty approved set confirms listing gate fails safely for unapproved sets
        const gate = validateTraditionalProduct(prod, new Set());
        expect(gate.isListed).toBe(false);
        expect(gate.reasons.length).toBeGreaterThan(0);
        expect(gate.reasons.some(r => r.includes('not approved in asset registry'))).toBe(true);
      }
    });

    it('validates authentic established product identity and craft inspiration for each TR product', () => {
      const tr01 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-01');
      expect(tr01?.title).toBe('Banaras Afterlight — Sculpted Brocade Mantle Coat');
      expect(tr01?.inspiration.label).toBe('Banarasi Brocade');
      expect(tr01?.pieces[0].label).toBe('Sculpted Brocade Mantle Coat');

      const tr02 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-02');
      expect(tr02?.title).toBe('Mayura Axis — Sculpted Drape Gown');
      expect(tr02?.inspiration.label).toBe('Paithani Silk');
      expect(tr02?.pieces[0].label).toBe('Sculpted Drape Gown');

      const tr03 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-03');
      expect(tr03?.title).toBe('Patola Geometry — Reversible Jacket and Trouser Set');
      expect(tr03?.inspiration.label).toBe('Patan Patola');
      expect(tr03?.pieces).toHaveLength(2);

      const tr04 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-04');
      expect(tr04?.title).toBe('Temple Grid — Longline Tunic and Trouser Set');
      expect(tr04?.inspiration.label).toBe('Kanchipuram Silk');
      expect(tr04?.pieces).toHaveLength(2);

      const tr05 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-05');
      expect(tr05?.title).toBe('Moonveil — Sheer Embroidered Overlay');
      expect(tr05?.inspiration.label).toBe('Chikankari');
      expect(tr05?.pieces[0].label).toBe('Overlay with Inner Slip');

      const tr06 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-06');
      expect(tr06?.title).toBe('Indigo Orbit — Geometric Overshirt and Trouser Co-ord');
      expect(tr06?.inspiration.label).toBe('Ajrakh');
      expect(tr06?.pieces).toHaveLength(2);

      const tr07 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-07');
      expect(tr07?.title).toBe('Tidal Bind — Sculpted Cape Dress');
      expect(tr07?.inspiration.label).toBe('Bandhani');
      expect(tr07?.pieces[0].label).toBe('Sculpted Cape Dress');
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

    it('successfully adds TR-01 (Banaras Afterlight Mantle Coat) with deterministic variantId', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr01-piece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-01-Oxblood / Antique Gold-coat_M');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Sculpted Brocade Mantle Coat M');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('successfully adds TR-02 (Mayura Axis Drape Gown / Paithani Silk) with deterministic variantId', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr02-piece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-02-Peacock Emerald / Antique Gold-gown_S');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Sculpted Drape Gown S');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('successfully adds TR-03 (Patola Geometry Reversible Set) with independent piece sizes', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr03-multipiece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-03-Midnight Ink / Vermilion-jacket_M_trousers_M');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Reversible Jacket M · Tailored Trouser M');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('successfully adds TR-04 (Temple Grid Tunic Set / Kanchipuram Silk) with independent piece sizes', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr04-multipiece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-04-Deep Oxblood / Warm Ivory-tunic_M_trousers_M');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Longline Tunic M · Narrow Trouser M');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('successfully adds TR-05 (Moonveil Overlay / Chikankari) with deterministic variantId', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr05-piece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-05-Warm Ivory / Pearl-overlay-slip-pair_L');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Overlay with Inner Slip L');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('successfully adds TR-06 (Indigo Orbit Overshirt Set / Ajrakh) with independent piece sizes', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr06-multipiece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-06-Indigo / Terracotta-overshirt_XL_trousers_L');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Geometric Overshirt XL · Relaxed Trouser L');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('successfully adds TR-07 (Tidal Bind Cape Dress / Bandhani) with deterministic variantId', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr07-piece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('1');
      expect(screen.getByTestId('variant-id-0').textContent).toContain('tr-07-Oxblood / Champagne-dress_M');
      expect(screen.getByTestId('variant-size-0').textContent).toBe('Sculpted Cape Dress M');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(true);
    });

    it('refuses addition of multi-piece traditional product when required piece size is missing', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <CartTestHarness />
          </CartProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('add-tr03-missing-piece'));

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-lines')).toHaveTextContent('0');

      const result = JSON.parse(screen.getByTestId('last-result').textContent || '{}');
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('missing-size');
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
