import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';
import { ProductDetailPage } from '../pages/ProductDetailPage.tsx';
import { TRADITIONAL_PRODUCTS } from '../data/traditionalProducts.ts';

const PDPTestHarness: React.FC<{ slug: string }> = ({ slug }) => {
  return (
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

describe('Traditional Products TR-01–TR-07 PDP Commercial Flow Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  TRADITIONAL_PRODUCTS.forEach(product => {
    it(`renders full PDP and allows adding to bag for ${product.id.toUpperCase()} (${product.title})`, () => {
      render(<PDPTestHarness slug={product.slug} />);

      // Should NOT render unlisted or not-found guard
      expect(screen.queryByTestId('product-not-available')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-not-found')).not.toBeInTheDocument();

      // Product Title & Valuation
      expect(screen.getByTestId('product-title')).toHaveTextContent(product.title);
      expect(screen.getByTestId('product-price')).toHaveTextContent(`₹${product.price.toLocaleString('en-IN')}`);

      // Traditional pieces selector is present
      expect(screen.getByTestId('traditional-pieces-selector')).toBeInTheDocument();

      // Each piece selector is present
      product.pieces.forEach(piece => {
        expect(screen.getByTestId(`piece-selector-${piece.key}`)).toBeInTheDocument();
      });

      // Specifications accordion contains traditional inspiration & materials
      expect(screen.getByTestId('accordion-content-specs')).toBeInTheDocument();
      expect(screen.getByText(product.inspiration.label)).toBeInTheDocument();

      // Add to Bag action succeeds
      const addToBagBtn = screen.getByTestId('add-to-bag-btn');
      fireEvent.click(addToBagBtn);

      // No validation error
      expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument();

      // Feedback message appears
      expect(screen.getByText('Piece added to your demonstration bag.')).toBeInTheDocument();
    });
  });
});
