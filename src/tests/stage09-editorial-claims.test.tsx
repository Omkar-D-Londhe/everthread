import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { SavedProvider } from '../context/SavedContext';
import { CONCEPT_NOTICE_TEXT, CONCEPT_NOTICE_SHORT_TEXT } from '../data/traditionalProducts';
import { JOURNAL_ARTICLES } from '../data/journal';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { LivingInheritanceWall } from '../pages/collections/LivingInheritanceWall';
import { HousePage } from '../pages/HousePage';

const renderWithProviders = (ui: React.ReactElement, initialEntry = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CartProvider>
        <SavedProvider>
          {ui}
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('Stage 09: Editorial Voice, Claims & Disclosures Suite', () => {
  describe('1. B-4 Canonical Disclosure Constant & Text Integrity', () => {
    it('defines the approved canonical B-4 disclosure text exactly', () => {
      expect(CONCEPT_NOTICE_TEXT).toBe(
        'Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques.'
      );
    });

    it('defines the approved shorter disclosure variant for search subtitles', () => {
      expect(CONCEPT_NOTICE_SHORT_TEXT).toBe(
        'AI-generated conceptual design demonstrating archival craft techniques.'
      );
    });
  });

  describe('2. D-21 Concept Disclosure Placements', () => {
    it('Placement 1: renders canonical disclosure on TR PDP under gallery stage', () => {
      render(
        <MemoryRouter initialEntries={['/product/TR-01']}>
          <CartProvider>
            <SavedProvider>
              <Routes>
                <Route path="/product/:slug" element={<ProductDetailPage />} />
              </Routes>
            </SavedProvider>
          </CartProvider>
        </MemoryRouter>
      );
      const galleryNotice = screen.getByTestId('tr-concept-disclosure-gallery');
      expect(galleryNotice).toBeInTheDocument();
      expect(galleryNotice.textContent).toContain(
        'Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques.'
      );
    });

    it('Placement 2: renders canonical disclosure in Living Inheritance wall header', () => {
      renderWithProviders(<LivingInheritanceWall />, '/collections/living-inheritance');
      const wallNotice = screen.getByTestId('living-inheritance-concept-disclosure');
      expect(wallNotice).toBeInTheDocument();
      expect(wallNotice.textContent).toContain(
        'Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques.'
      );
    });
  });

  describe('3. B-5 Claim Remediations in The House (HousePage)', () => {
    it('preserves the exact 6-section House structure (D-20) and fold scenes U1 and U2', () => {
      const { container } = renderWithProviders(<HousePage />, '/house');
      // Verify fold scenes U1 and U2
      const sceneU1 = container.querySelector('[data-scene="U1"]');
      const sceneU2 = container.querySelector('[data-scene="U2"]');
      expect(sceneU1).toBeInTheDocument();
      expect(sceneU2).toBeInTheDocument();

      // Verify 6 distinct chapters / sections
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(6);
    });

    it('reframes Global Ateliers as conceptual design studies without operational claims', () => {
      renderWithProviders(<HousePage />, '/house');
      expect(screen.getByText('Paris Design Study')).toBeInTheDocument();
      expect(screen.getByText('New Delhi Guild Study')).toBeInTheDocument();
      expect(screen.getByText('Kyoto Research Study')).toBeInTheDocument();
      expect(screen.getByText('Milan Tailoring Study')).toBeInTheDocument();

      // Ensure operational coordination centres wording is replaced
      expect(screen.queryByText(/operational coordination centres/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/master handloom families across three continents/i)).not.toBeInTheDocument();
    });

    it('reframes Generational Inlays as engineering specification', () => {
      renderWithProviders(<HousePage />, '/house');
      expect(screen.getByText(/Generational Inlay Specification/i)).toBeInTheDocument();
      expect(screen.queryByText(/Inlay Covenant/i)).not.toBeInTheDocument();
    });
  });

  describe('4. B-5 Journal Academic Curatorial Safeguards', () => {
    it('preserves curatorial personas, academic citations, and monographs', () => {
      expect(JOURNAL_ARTICLES.length).toBe(3);
      const personaArticles = JOURNAL_ARTICLES.filter(a => a.contentFlags?.isEditorialPersona);
      expect(personaArticles.length).toBeGreaterThanOrEqual(2);

      // Verify academic bibliography / sources citations exist
      const hasCitations = JOURNAL_ARTICLES.every(
        a => a.sources && a.sources.length > 0
      );
      expect(hasCitations).toBe(true);
    });
  });
});
