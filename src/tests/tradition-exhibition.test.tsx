import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ArchivePage } from '../pages/ArchivePage.tsx';
import { TraditionExhibitionModal, TRADITION_ROLES } from '../components/TraditionExhibitionModal.tsx';
import {
  ARCHIVE_ASSET_MAP,
  getTraditionAssets,
  getAllTraditionAssets,
  DIAGRAM_ASSETS
} from '../data/assetMap.ts';
import { WEAVE_LIBRARY } from '../data/stories.ts';

const CANONICAL_13_TRADITIONS = [
  'ajrakh',
  'bagru',
  'banarasi-brocade',
  'bandhani',
  'chikankari',
  'kanchipuram-silk',
  'kashmiri-sozni',
  'kota-doria',
  'muga-silk',
  'paithani-silk',
  'patan-patola',
  'pochampally-ikat',
  'sambalpuri-ikat'
];

describe('Phase 6.3.2.2: Immersive Textile Exhibition Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  /* -------------------------------------------------------------------------
   * A. Data Layer & 6-Role Integrity
   * ------------------------------------------------------------------------- */
  describe('1. Six-Role Catalogue Data Architecture', () => {
    it('provides complete 6-image catalogue for all 13 canonical traditions', () => {
      const allAssets = getAllTraditionAssets();
      expect(allAssets).toHaveLength(13);

      CANONICAL_13_TRADITIONS.forEach(key => {
        expect(ARCHIVE_ASSET_MAP[key]).toBeDefined();
        const record = getTraditionAssets(key);
        expect(record, `Missing record for tradition key: ${key}`).toBeDefined();
        expect(record!.traditionKey).toBe(key);
        expect(record!.title).toBeTruthy();
        expect(record!.region).toBeTruthy();
        expect(record!.distinction).toMatch(/^(weaving|embroidery|dyeing)$/);

        // Verify all 6 roles exist
        TRADITION_ROLES.forEach(role => {
          const item = record!.roles[role];
          expect(item, `Missing role ${role} for ${key}`).toBeDefined();
          expect(item.src).toMatch(new RegExp(`^/images/archive/${key}/`));
          expect(item.srcSet).toContain(item.src);
          expect(item.width).toBeGreaterThan(0);
          expect(item.height).toBeGreaterThan(0);
          expect(item.alt).toBeTruthy();
          expect(item.label).toBeTruthy();
        });
      });
    });

    it('accurately identifies landscape-oriented models without forced portrait crops', () => {
      const banarasi = getTraditionAssets('banarasi-brocade')!;
      expect(banarasi.roles['model-01'].width).toBe(1536);
      expect(banarasi.roles['model-01'].height).toBe(1024);
      expect(banarasi.roles['model-01'].width / banarasi.roles['model-01'].height).toBeCloseTo(1.5, 2);

      const bandhani = getTraditionAssets('bandhani')!;
      expect(bandhani.roles['model-01'].width).toBe(1374);
      expect(bandhani.roles['model-01'].height).toBe(1145);
      expect(bandhani.roles['model-01'].width / bandhani.roles['model-01'].height).toBeCloseTo(1.2, 2);
    });

    it('preserves legacy slug and separates general monograph weave-14', () => {
      // Chikankari maintains legacy test invariant slug: 'kutch-ari-embroidery'
      const chikankariBySlug = getTraditionAssets('kutch-ari-embroidery');
      expect(chikankariBySlug).toBeDefined();
      expect(chikankariBySlug!.traditionKey).toBe('chikankari');

      // weave-14 is general monograph and has NO 6-image tradition key
      const weave14 = WEAVE_LIBRARY.find(w => w.id === 'weave-14');
      expect(weave14).toBeDefined();
      expect(weave14!.traditionKey).toBeUndefined();
      expect(weave14!.image).toBe('/images/archive/general/archive-art-of-drape-01.webp');
    });

    it('correctly maps verified educational technical diagrams to traditions', () => {
      const bagru = getTraditionAssets('bagru')!;
      expect(bagru.diagramId).toBe('library-block-printing-process-01');
      expect(DIAGRAM_ASSETS[bagru.diagramId!].svg).toBe('/images/weave-library/diagrams/library-block-printing-process-01.svg');

      const patan = getTraditionAssets('patan-patola')!;
      expect(patan.diagramId).toBe('library-double-ikat-process-01');
      expect(DIAGRAM_ASSETS[patan.diagramId!].svg).toBe('/images/weave-library/diagrams/library-double-ikat-process-01.svg');
    });
  });

  /* -------------------------------------------------------------------------
   * B. Exhibition Modal Interactions & Accessibility
   * ------------------------------------------------------------------------- */
  describe('2. Exhibition Gallery Component Interactions', () => {
    it('renders modal with dominant stage and 5 supporting views when open', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
        />
      );

      expect(screen.getByTestId('tradition-exhibition-modal')).toBeInTheDocument();
      expect(screen.getByTestId('exhibition-stage')).toBeInTheDocument();
      expect(screen.getByTestId('exhibition-active-image')).toHaveAttribute(
        'src',
        '/images/archive/banarasi-brocade/archive-banarasi-brocade-model-01.webp'
      );
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Model / Garment');

      // Check all 6 thumbnail buttons exist
      TRADITION_ROLES.forEach(role => {
        expect(screen.getByTestId(`exhibition-thumb-${role}`)).toBeInTheDocument();
      });
    });

    it('promotes supporting view to active stage on selection', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
        />
      );

      // Select Macro 05
      fireEvent.click(screen.getByTestId('exhibition-thumb-macro-05'));

      expect(screen.getByTestId('exhibition-active-image')).toHaveAttribute(
        'src',
        '/images/archive/banarasi-brocade/archive-banarasi-brocade-macro-05.webp'
      );
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Weave Detail');
    });

    it('navigates sequentially through plates using chevron buttons', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
        />
      );

      // Next plate
      fireEvent.click(screen.getByTestId('next-plate-btn'));
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Alternate View');

      // Next plate
      fireEvent.click(screen.getByTestId('next-plate-btn'));
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Drape & Movement');

      // Previous plate
      fireEvent.click(screen.getByTestId('prev-plate-btn'));
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Alternate View');
    });

    it('supports keyboard navigation via ArrowLeft and ArrowRight', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="bagru"
          onClose={vi.fn()}
        />
      );

      const modal = screen.getByTestId('tradition-exhibition-modal');

      fireEvent.keyDown(modal, { key: 'ArrowRight' });
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Alternate View');

      fireEvent.keyDown(modal, { key: 'ArrowLeft' });
      expect(screen.getByTestId('active-role-label')).toHaveTextContent('Model / Garment');
    });

    it('closes on Escape key press and invokes onClose callback', () => {
      const handleClose = vi.fn();
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="bagru"
          onClose={handleClose}
        />
      );

      const modal = screen.getByTestId('tradition-exhibition-modal');
      fireEvent.keyDown(modal, { key: 'Escape' });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('switches traditions and resets active role to model-01', () => {
      const handleSelectTradition = vi.fn();
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="ajrakh"
          onClose={vi.fn()}
          onSelectTradition={handleSelectTradition}
        />
      );

      // Click Next Tradition (in canonical discipline sequence: bagru -> ajrakh -> bandhani)
      fireEvent.click(screen.getByTestId('next-tradition-btn'));
      expect(handleSelectTradition).toHaveBeenCalledWith('bandhani');
    });

    it('toggles contextual technical diagram drawer when available', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="bagru"
          onClose={vi.fn()}
        />
      );

      // Toggle diagram
      const toggleBtn = screen.getByTestId('toggle-diagram-btn');
      fireEvent.click(toggleBtn);

      expect(screen.getByTestId('exhibition-diagram-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('exhibition-diagram-img')).toHaveAttribute(
        'src',
        '/images/weave-library/diagrams/library-block-printing-process-01.svg'
      );

      // Close diagram drawer
      fireEvent.click(screen.getByTestId('close-diagram-btn'));
      expect(screen.queryByTestId('exhibition-diagram-drawer')).not.toBeInTheDocument();
    });

    it('renders accessible fallback if image fails to load without crashing', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="ajrakh"
          onClose={vi.fn()}
        />
      );

      const activeImg = screen.getByTestId('exhibition-active-image');
      fireEvent.error(activeImg);

      expect(screen.getByTestId('exhibition-image-fallback')).toBeInTheDocument();
      expect(screen.getByText(/textile plate unavailable/i)).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * C. Archive Page Integration
   * ------------------------------------------------------------------------- */
  describe('3. Archive Page Integration with Weave Cards', () => {
    it('opens exhibition modal from Weave Library card on /archive', () => {
      render(
        <MemoryRouter initialEntries={['/archive']}>
          <ArchivePage />
        </MemoryRouter>
      );

      // Modal should initially not be in the document
      expect(screen.queryByTestId('tradition-exhibition-modal')).not.toBeInTheDocument();

      // Click "Examine 6-Plate Folio" on Varanasi Kadwa card
      const openBtn = screen.getByTestId('open-exhibition-varanasi-kadwa');
      expect(openBtn).toBeInTheDocument();
      fireEvent.click(openBtn);

      // Modal opens displaying Varanasi Kadwa
      expect(screen.getByTestId('tradition-exhibition-modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Varanasi Kadwa Jacquard/i })).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByTestId('close-exhibition-btn'));
      expect(screen.queryByTestId('tradition-exhibition-modal')).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * D. Phase 6.3.2.2.1: Visual Polish, Neutralized Content & Integrity
   * ------------------------------------------------------------------------- */
  describe('4. Visual Polish and Integrity Verification', () => {
    it('renders non-intrusive lower sweep thread and high-res stage sizes', () => {
      const { container } = render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          onClose={vi.fn()}
        />
      );

      const threadPath = container.querySelector('.exhibition-thread-svg path');
      expect(threadPath).toBeInTheDocument();
      expect(threadPath).toHaveAttribute('stroke-width', '1.05');
      // Starts near bottom framing the plinth
      expect(threadPath?.getAttribute('d')).toContain('M 40,510');

      // Stage source has high-res responsive sizes
      const source = container.querySelector('.exhibition-stage-picture source');
      expect(source).toHaveAttribute('sizes', '(max-width: 768px) 95vw, (max-width: 1200px) 75vw, 75vw');
    });

    it('displays neutralized educational text in diagram drawer and metadata footer', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          initialDiagramOpen={true}
          onClose={vi.fn()}
        />
      );

      // Educational diagram description is academic craft taxonomy, not falsely tradition-specific
      expect(screen.getByText(/Archival educational schematic illustrating foundational weave geometry/i)).toBeInTheDocument();

      // Footer labels: Loom Sett / Structure instead of unverified Warp Density
      expect(screen.getByText(/Loom Sett \/ Structure:/i)).toBeInTheDocument();
      expect(screen.getByText('Traditional Handloom Sett')).toBeInTheDocument();
      expect(screen.getByText('Traditional Handloom Silk with Brocade Zari')).toBeInTheDocument();
    });

    it('renders descriptive visible captions across all six image roles and updates immediately on role switch', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="banarasi-brocade"
          initialRole="model-01"
          onClose={vi.fn()}
        />
      );

      // Role 1 (model-01) caption
      expect(screen.getByTestId('active-role-label')).toHaveTextContent(/Model \/ Garment/i);
      const desc1 = screen.getByTestId('active-plate-description');
      expect(desc1).toBeInTheDocument();
      expect(desc1.textContent).toBeTruthy();

      // Switch to drape-03
      fireEvent.click(screen.getByTestId('exhibition-thumb-drape-03'));
      expect(screen.getByTestId('active-role-label')).toHaveTextContent(/Drape & Movement/i);
      const desc2 = screen.getByTestId('active-plate-description');
      expect(desc2.textContent).toMatch(/drape/i);

      // Switch to macro-05
      fireEvent.click(screen.getByTestId('exhibition-thumb-macro-05'));
      expect(screen.getByTestId('active-role-label')).toHaveTextContent(/Weave Detail/i);
      const desc3 = screen.getByTestId('active-plate-description');
      expect(desc3.textContent).toMatch(/detail|weave|kadwa/i);
    });

    it('renders diagram-specific curatorial descriptions in technical drafting drawer', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="patan-patola"
          initialDiagramOpen={true}
          onClose={vi.fn()}
        />
      );

      // Patan Patola maps to library-double-ikat-process-01
      const drawerDesc = screen.getByTestId('exhibition-diagram-description');
      expect(drawerDesc).toBeInTheDocument();
      expect(drawerDesc.textContent).toContain('double-ikat resist');
    });

    it('verifies that no tradition across all 13 traditions contains unsupported TPI, knot counts, or unverified precious metal claims', () => {
      const allAssets = getAllTraditionAssets();
      expect(allAssets).toHaveLength(13);

      allAssets.forEach(record => {
        // Must not contain arbitrary TPI laboratory claims
        expect(record.warpDensity).not.toMatch(/\d+\s*TPI/i);
        // Must not contain unsupported knot count metrics
        expect(record.warpDensity).not.toMatch(/knots per square inch/i);
        // Must not contain unsupported purity percentages
        expect(record.fiber).not.toMatch(/\d+%/);
        // Must not contain unsupported precious metal claims without assay
        expect(record.fiber).not.toMatch(/24k|real gold|pure silver/i);
      });

      // Verify Patan Patola specifically displays its substantiated craft sett, not 190 TPI
      const patan = getTraditionAssets('patan-patola')!;
      expect(patan.warpDensity).toBe('Balanced Double-Ikat Plain-Weave Sett');
      expect(patan.warpDensity).not.toContain('190 TPI');
      expect(patan.fiber).toBe('Multi-Ply Handloom Silk with Natural Botanical Dyes');
    });

    it('renders Patan Patola exhibition modal with substantiated craft sett and fiber in footer', () => {
      render(
        <TraditionExhibitionModal
          isOpen={true}
          traditionKeyOrSlug="patan-patola"
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Balanced Double-Ikat Plain-Weave Sett')).toBeInTheDocument();
      expect(screen.getByText('Multi-Ply Handloom Silk with Natural Botanical Dyes')).toBeInTheDocument();
      expect(screen.queryByText(/190 TPI/i)).not.toBeInTheDocument();
    });
  });
});
