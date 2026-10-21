import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ArchivePage } from '../pages/ArchivePage.tsx';
import { ArchiveStoryPage } from '../pages/ArchiveStoryPage.tsx';
import { HousePage } from '../pages/HousePage.tsx';
import { JournalPage } from '../pages/JournalPage.tsx';
import { JournalArticlePage } from '../pages/JournalArticlePage.tsx';
import { Header } from '../components/Header.tsx';
import { CartProvider } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';
import { STORIES } from '../data/stories.ts';
import { JOURNAL_ARTICLES } from '../data/journal.ts';
import { DIAGRAM_ASSETS } from '../data/assetMap.ts';

const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <CartProvider>
        <SavedProvider>
          <Header onOpenSearch={() => {}} />
          <Routes>
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/archive/:storySlug" element={<ArchiveStoryPage />} />
            <Route path="/the-house" element={<HousePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:articleSlug" element={<JournalArticlePage />} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('EverThread Stage 4: Editorial & Cultural Archive Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  /* -------------------------------------------------------------------------
   * A. Cultural Archive & Folio Stories
   * ------------------------------------------------------------------------- */
  describe('1. Cultural Archive (/archive) Exhibition Display', () => {
    it('renders all four foundational exhibition folios with structured metadata and links', () => {
      renderWithRouter('/archive');

      expect(screen.getByTestId('cultural-archive-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: /the cultural archive/i })).toBeInTheDocument();

      STORIES.forEach(story => {
        const card = screen.getByTestId(`archive-folio-card-${story.slug}`);
        expect(card).toBeInTheDocument();
        expect(within(card).getByText(story.title)).toBeInTheDocument();
        expect(within(card).getByText(story.subtitle)).toBeInTheDocument();
        expect(screen.getByTestId(`archive-story-link-${story.slug}`)).toHaveAttribute('href', `/archive/${story.slug}`);
      });
    });

    it('displays illustrative persona badge for illustrative guild personas', () => {
      renderWithRouter('/archive');

      const livingLoomCard = screen.getByTestId('archive-folio-card-the-living-loom');
      expect(within(livingLoomCard).getByText(/illustrative guild persona/i)).toBeInTheDocument();
    });
  });

  describe('2. Archive Story Route (/archive/:storySlug)', () => {
    it('renders deep monograph for valid story slug with drafting specs and citations', () => {
      renderWithRouter('/archive/the-living-loom');

      expect(screen.getByTestId('story-title')).toHaveTextContent('The Living Loom');
      expect(screen.getByTestId('story-subtitle')).toHaveTextContent(/Varanasi Kadwa Brocade/i);
      expect(screen.getByTestId('story-primary-image')).toBeInTheDocument();
      expect(screen.getByTestId('story-drafting-specs')).toBeInTheDocument();
      expect(screen.getByTestId('story-sources-section')).toBeInTheDocument();

      // Technical drafting specs values
      expect(screen.getByText('Subterranean Clay Pit (Regulated Ambient Humidity)')).toBeInTheDocument();
    });

    it('renders graceful not-found state when story slug is invalid', () => {
      renderWithRouter('/archive/non-existent-craft-story');

      expect(screen.getByTestId('story-not-found')).toBeInTheDocument();
      expect(screen.getByText(/exhibition folio not found/i)).toBeInTheDocument();
      expect(screen.getByTestId('return-archive-btn')).toHaveAttribute('href', '/archive');

      // Phase 6.5 Work A: Hardened inline SVG icon instead of raw font ligatures
      const icon = screen.getByTestId('story-not-found-icon');
      expect(icon).toBeInTheDocument();
      expect(icon.tagName.toLowerCase()).toBe('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders exhibition companion CTA linking to tradition 6-plate suite when mapped', () => {
      renderWithRouter('/archive/the-living-loom');

      // Phase 6.5 Work E: Monograph-to-exhibition companion plinth
      const ctaSection = screen.getByTestId('story-tradition-cta');
      expect(ctaSection).toBeInTheDocument();
      expect(within(ctaSection).getByText(/Varanasi Kadwa Brocade/i)).toBeInTheDocument();

      const enterBtn = screen.getByTestId('enter-tradition-exhibition-btn');
      expect(enterBtn).toHaveAttribute('href', '/archive?tradition=banarasi-brocade');
    });

    it('renders related products only when an explicit valid match exists in catalogue', () => {
      renderWithRouter('/archive/the-living-loom');

      // The Living Loom relates to 'the-architectonic-zari-waistcoat' (ET-03)
      const relatedSection = screen.getByTestId('related-products-section');
      expect(relatedSection).toBeInTheDocument();
      expect(within(relatedSection).getByText('Architectonic Zari Waistcoat')).toBeInTheDocument();
      expect(within(relatedSection).getByText('₹44,000')).toBeInTheDocument();

      // Ensure fictitious product slugs (like 'the-kadwa-brocade-ceremony-cape') are NOT rendered
      expect(within(relatedSection).queryByText(/the-kadwa-brocade-ceremony-cape/i)).not.toBeInTheDocument();
    });

    it('provides continuous navigation between folios', () => {
      renderWithRouter('/archive/the-living-loom');

      // First folio should have Next Folio link to Folio 1.2
      const nextLink = screen.getByTestId('next-story-link');
      expect(nextLink).toHaveAttribute('href', '/archive/the-art-of-the-drape');
    });
  });

  /* -------------------------------------------------------------------------
   * B. Weave Library Embedded in Archive
   * ------------------------------------------------------------------------- */
  describe('3. Embedded Weave Library & Technical Diagrams', () => {
    it('renders embedded Weave Library section on /archive without navigating away', () => {
      renderWithRouter('/archive');

      const librarySection = screen.getByTestId('weave-library-section');
      expect(librarySection).toBeInTheDocument();
      expect(within(librarySection).getByRole('heading', { name: /the weave library/i })).toBeInTheDocument();
    });

    it('correctly filters items by craft distinction (weaving, embroidery, dyeing, draping)', () => {
      renderWithRouter('/archive');

      // Initially shows all items
      expect(screen.getByTestId('weave-card-varanasi-kadwa')).toBeInTheDocument();
      expect(screen.getByTestId('weave-card-kutch-ari-embroidery')).toBeInTheDocument();

      // Click "Embroidery" filter tab
      fireEvent.click(screen.getByTestId('weave-filter-embroidery'));

      // Embroidery card visible, Weaving card hidden
      expect(screen.getByTestId('weave-card-kutch-ari-embroidery')).toBeInTheDocument();
      expect(screen.queryByTestId('weave-card-varanasi-kadwa')).not.toBeInTheDocument();

      // Click "Dyeing" filter tab
      fireEvent.click(screen.getByTestId('weave-filter-dyeing'));
      expect(screen.getByTestId('weave-card-bagru-madder-dyeing')).toBeInTheDocument();
      expect(screen.queryByTestId('weave-card-kutch-ari-embroidery')).not.toBeInTheDocument();

      // Return to All
      fireEvent.click(screen.getByTestId('weave-filter-all'));
      expect(screen.getByTestId('weave-card-varanasi-kadwa')).toBeInTheDocument();
    });

    it('renders technical diagram visualizer with selectable diagrams from asset map', () => {
      renderWithRouter('/archive');

      const viewer = screen.getByTestId('diagram-viewer');
      expect(viewer).toBeInTheDocument();

      const dropdown = screen.getByTestId('diagram-selector-dropdown');
      expect(dropdown).toBeInTheDocument();

      // Switch to block printing diagram
      fireEvent.change(dropdown, { target: { value: 'library-block-printing-process-01' } });

      expect(screen.getByTestId('active-diagram-title')).toHaveTextContent('Block Printing Process');
      const img = screen.getByTestId('active-diagram-img');
      expect(img.getAttribute('src')).toBe(DIAGRAM_ASSETS['library-block-printing-process-01'].svg);

      // Phase 6.5 Work D: Synchronized curatorial description
      const desc = screen.getByTestId('active-diagram-description');
      expect(desc).toBeInTheDocument();
      expect(desc.textContent).toContain('relief block printing');
    });

    it('makes weave-14 actionable with working links to Folio 1.2 on badge and card footer', () => {
      renderWithRouter('/archive');

      // Phase 6.5 Work C: Actionable weave-14 card
      const weave14Card = screen.getByTestId('weave-card-radial-bias-draping');
      expect(weave14Card).toBeInTheDocument();

      // Cover image badge link
      const badgeLink = screen.getByTestId('weave-14-badge-link');
      expect(badgeLink).toHaveAttribute('href', '/archive/the-art-of-the-drape');

      // Card footer action CTA link
      const ctaLink = screen.getByTestId('read-monograph-radial-bias-draping');
      expect(ctaLink).toHaveAttribute('href', '/archive/the-art-of-the-drape');
      expect(ctaLink).toHaveTextContent(/Read Foundational Folio 1.2/i);
    });
  });

  /* -------------------------------------------------------------------------
   * C. The House (/the-house)
   * ------------------------------------------------------------------------- */
  describe('4. The House of EverThread (/the-house)', () => {
    it('renders brand philosophy, zero-glue creed, and noble natural fibers', () => {
      renderWithRouter('/the-house');

      expect(screen.getByTestId('house-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: /an heirloom, not a trend/i })).toBeInTheDocument();
      expect(screen.getByText(/patience as an architectural principle/i)).toBeInTheDocument();
      expect(screen.getByText(/grade-a changthangi pashmina/i)).toBeInTheDocument();
      expect(screen.getByText(/ahimsa wild mulberry silk/i)).toBeInTheDocument();
    });

    it('supports simulated salon appointment booking with validation and confirmation', () => {
      renderWithRouter('/the-house');

      // Attempt submit without required fields
      fireEvent.click(screen.getByTestId('submit-appointment-btn'));
      expect(screen.getByText(/please provide your name and email/i)).toBeInTheDocument();

      // Fill in appointment details
      fireEvent.change(screen.getByTestId('apt-name-input'), { target: { value: 'Arch Duchess Vivienne' } });
      fireEvent.change(screen.getByTestId('apt-email-input'), { target: { value: 'vivienne@couture.at' } });

      fireEvent.click(screen.getByTestId('submit-appointment-btn'));

      // Confirmation plinth appears
      expect(screen.getByTestId('appointment-success-plinth')).toBeInTheDocument();
      expect(screen.getByText(/appointment request registered/i)).toBeInTheDocument();
      expect(screen.getByText(/Arch Duchess Vivienne/i)).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * D. The Journal (/journal & /journal/:articleSlug)
   * ------------------------------------------------------------------------- */
  describe('5. Journal Index & Article Details', () => {
    it('renders Gazette index with featured lead monograph and archive grid', () => {
      renderWithRouter('/journal');

      expect(screen.getByTestId('journal-page')).toBeInTheDocument();
      expect(screen.getByTestId('featured-article-section')).toBeInTheDocument();
      expect(screen.getByText(JOURNAL_ARTICLES[0].title)).toBeInTheDocument();

      const grid = screen.getByTestId('journal-grid');
      expect(within(grid).getByText(JOURNAL_ARTICLES[1].title)).toBeInTheDocument();
      expect(within(grid).getByText(JOURNAL_ARTICLES[2].title)).toBeInTheDocument();
    });

    it('renders complete monograph article with body paragraphs, sources, and citations', () => {
      renderWithRouter('/journal/on-unbroken-heirlooms');

      expect(screen.getByTestId('article-title')).toHaveTextContent('On Unbroken Heirlooms: Why Fast Fashion Is an Architectural Failure');
      expect(screen.getByTestId('article-body-content')).toBeInTheDocument();
      expect(screen.getByTestId('article-sources-box')).toBeInTheDocument();
      expect(screen.getByText(/Thorstein Veblen/i)).toBeInTheDocument();
    });

    it('renders graceful not-found state when article slug is invalid', () => {
      renderWithRouter('/journal/unknown-fictional-essay');

      expect(screen.getByTestId('article-not-found')).toBeInTheDocument();
      expect(screen.getByText(/monograph not found/i)).toBeInTheDocument();
      expect(screen.getByTestId('return-journal-btn')).toHaveAttribute('href', '/journal');
    });

    it('provides working simulated newsletter dispatch registration', () => {
      renderWithRouter('/journal');

      const emailInput = screen.getByTestId('gazette-email-input');
      fireEvent.change(emailInput, { target: { value: 'reader@curator.org' } });

      fireEvent.click(screen.getByTestId('gazette-subscribe-btn'));

      expect(screen.getByTestId('gazette-subscribed-plinth')).toBeInTheDocument();
      expect(screen.getByText(/correspondence registered/i)).toBeInTheDocument();
    });
  });
});
