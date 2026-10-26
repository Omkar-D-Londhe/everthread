import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { getListedWallMoments, WALL_MOMENTS_CONFIG } from '../data/wallMoments.ts';
import { TRADITIONAL_PRODUCTS } from '../data/traditionalProducts.ts';
import { TraditionalProduct } from '../types/catalog.ts';
import { LivingInheritanceWall } from '../pages/collections/LivingInheritanceWall.tsx';
import { ContemporaryWall } from '../pages/collections/ContemporaryWall.tsx';
import { CollectionWallsLayout } from '../pages/collections/CollectionWallsLayout.tsx';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';

describe('Stage 05: Collection Walls & WallStage Suite', () => {

  describe('1. Wall Moments Configuration & Listed Gating (wallMoments.ts)', () => {
    it('defines exactly three curated moments with distinct layouts and captions', () => {
      expect(WALL_MOMENTS_CONFIG).toHaveLength(3);
      expect(WALL_MOMENTS_CONFIG[0].id).toBe('mantle-drape');
      expect(WALL_MOMENTS_CONFIG[0].layout).toBe('feature-offset');
      expect(WALL_MOMENTS_CONFIG[1].id).toBe('geometry');
      expect(WALL_MOMENTS_CONFIG[1].layout).toBe('staggered-pair');
      expect(WALL_MOMENTS_CONFIG[2].id).toBe('veil-print');
      expect(WALL_MOMENTS_CONFIG[2].layout).toBe('triptych-lead-last');
    });

    it('returns empty array when all traditional products are unlisted', () => {
      const mockUnlisted: TraditionalProduct[] = TRADITIONAL_PRODUCTS.map(p => ({
        ...p,
        isListed: false
      }));
      const moments = getListedWallMoments(mockUnlisted);
      expect(moments).toEqual([]);
    });

    it('populates all 3 moments accurately when traditional products are listed', () => {
      const moments = getListedWallMoments(TRADITIONAL_PRODUCTS);
      expect(moments).toHaveLength(3);
      expect(moments[0].products).toHaveLength(2); // tr-01, tr-02
      expect(moments[1].products).toHaveLength(2); // tr-03, tr-04
      expect(moments[2].products).toHaveLength(3); // tr-05, tr-06, tr-07
    });

    it('omits moments that contain zero listed products', () => {
      // Only tr-01 and tr-02 listed -> only mantle-drape moment populated
      const partialListed: TraditionalProduct[] = TRADITIONAL_PRODUCTS.map(p => ({
        ...p,
        isListed: p.id === 'tr-01' || p.id === 'tr-02'
      }));

      const moments = getListedWallMoments(partialListed);
      expect(moments).toHaveLength(1);
      expect(moments[0].id).toBe('mantle-drape');
    });
  });

  describe('2. CollectionWallsLayout & Document Title Synchronization', () => {
    it('sets document title for Contemporary Collection on /collections', () => {
      render(
        <MemoryRouter initialEntries={['/collections']}>
          <Routes>
            <Route path="/collections" element={<CollectionWallsLayout />}>
              <Route index element={<div data-testid="contemporary-mock">Contemporary</div>} />
              <Route path="the-living-inheritance" element={<div>Living</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(document.title).toBe('Contemporary Collection · EverThread');
      expect(screen.getByTestId('wall-stage')).toBeInTheDocument();
      expect(screen.getByTestId('tab-contemporary')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('tab-living-inheritance')).toHaveAttribute('aria-selected', 'false');
    });

    it('sets document title for The Living Inheritance on /collections/the-living-inheritance', () => {
      render(
        <MemoryRouter initialEntries={['/collections/the-living-inheritance']}>
          <Routes>
            <Route path="/collections" element={<CollectionWallsLayout />}>
              <Route index element={<div>Contemporary</div>} />
              <Route path="the-living-inheritance" element={<div data-testid="living-mock">Living</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(document.title).toBe('The Living Inheritance · EverThread');
      expect(screen.getByTestId('tab-contemporary')).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByTestId('tab-living-inheritance')).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('3. LivingInheritanceWall Curatorial State & Listed Moments', () => {
    it('renders curatorial reserve notice when all traditional products are unlisted', () => {
      const mockUnlisted: TraditionalProduct[] = TRADITIONAL_PRODUCTS.map(p => ({
        ...p,
        isListed: false
      }));

      render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <LivingInheritanceWall productsOverride={mockUnlisted} />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('living-inheritance-curatorial-state')).toBeInTheDocument();
      expect(screen.getByTestId('tr-product-count-indicator')).toHaveTextContent('Showing 0 listed concept pieces');
    });

    it('renders populated moments when listed products are provided', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <LivingInheritanceWall />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('wall-moments-list')).toBeInTheDocument();
      expect(screen.getByTestId('moment-mantle-drape')).toBeInTheDocument();
      expect(screen.getByTestId('moment-geometry')).toBeInTheDocument();
      expect(screen.getByTestId('moment-veil-print')).toBeInTheDocument();
      expect(screen.getByTestId('tr-product-count-indicator')).toHaveTextContent('Showing 7 listed concept pieces');
    });

    it('switches to flat grid when sorting is applied', () => {
      const mockListed: TraditionalProduct[] = TRADITIONAL_PRODUCTS.map(p => ({
        ...p,
        isListed: true
      }));

      render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <LivingInheritanceWall productsOverride={mockListed} />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      const sortSelect = screen.getByTestId('tr-sort-select');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

      expect(screen.getByTestId('tr-products-flat-grid')).toBeInTheDocument();
    });
  });

  describe('4. ContemporaryWall Baseline Compatibility', () => {
    it('renders 7 permanent pieces in featured order', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <SavedProvider>
              <ContemporaryWall />
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('products-grid')).toBeInTheDocument();
      expect(screen.getByTestId('product-count-indicator')).toHaveTextContent('Showing 7 of 7 Heirlooms');
    });
  });

});
