import { describe, it, expect } from 'vitest';
import {
  PRODUCTS,
  CONTEMPORARY_PRODUCTS,
  ALL_PRODUCTS,
  getProductById,
  getProductBySlug,
  getCatalogueProductById,
  getCatalogueProductBySlug,
  getListedProductBySlug
} from '../data/products.ts';
import {
  TRADITIONAL_PRODUCTS,
  TR_STATUS_TEXT,
  CONCEPT_NOTICE_TEXT
} from '../data/traditionalProducts.ts';
import { isTraditional } from '../types/catalog.ts';
import { LEGACY_ARCHIVE_ROUTES } from '../data/legacyRoutes.ts';
import {
  ARCHIVE_RELATED_PIECES,
  TRADITION_INSPIRED_DESIGNS,
  PROVISIONAL_RELATED_TEXTS
} from '../data/archiveRelations.ts';
import { WEAVE_STORY_ROUTES } from '../components/SearchModal.tsx';
import { matchProductsToPreferences, CompassPreferences } from '../utils/compassMatcher.ts';
import { getTraditionAssets } from '../data/assetMap.ts';

describe('Stage 02 Unit Test Suite', () => {
  describe('UT-DATA-01: Canonical Contemporary & Traditional Data Boundaries', () => {
    it('preserves contemporary ET-01..ET-07 IDs, prices, and names except ET-02 title and fiber', () => {
      expect(PRODUCTS).toHaveLength(7);
      expect(CONTEMPORARY_PRODUCTS).toBe(PRODUCTS);

      const p1 = getProductById('et-01');
      expect(p1?.title).toBe('Oxblood Wool-Silk Signature Coat-Dress');
      expect(p1?.price).toBe(68500);

      const p2 = getProductById('et-02');
      expect(p2?.title).toBe('Ivory Hand-Spun Matka Silk Cocoon Trench');
      expect(p2?.price).toBe(112000);
      expect(p2?.fiberPurity).toBe('100% Hand-Spun Matka Raw Silk');
      expect(p2?.slug).toBe('ivory-hand-spun-matka-silk-cocoon-trench');

      const p3 = getProductById('et-03');
      expect(p3?.title).toBe('Architectonic Zari Waistcoat');
      expect(p3?.price).toBe(44000);

      const p4 = getProductById('et-04');
      expect(p4?.title).toBe('Angrakha Asymmetric Sheer Tunic');
      expect(p4?.price).toBe(32000);

      const p5 = getProductById('et-05');
      expect(p5?.title).toBe('Box-Calf Structured Frame Bag');
      expect(p5?.price).toBe(54000);

      const p6 = getProductById('et-06');
      expect(p6?.title).toBe('Hand-Rolled Mulberry Twill Scarf');
      expect(p6?.price).toBe(24500);

      const p7 = getProductById('et-07');
      expect(p7?.title).toBe('High-Altitude Hand-Spun Pashmina Stole');
      expect(p7?.price).toBe(38000);
    });

    it('exports ALL_PRODUCTS containing exactly 14 items (7 contemporary + 7 traditional)', () => {
      expect(ALL_PRODUCTS).toHaveLength(14);
      const etCount = ALL_PRODUCTS.filter(p => !isTraditional(p)).length;
      const trCount = ALL_PRODUCTS.filter(p => isTraditional(p)).length;
      expect(etCount).toBe(7);
      expect(trCount).toBe(7);
    });

    it('performs case-insensitive ID and slug lookups including legacy slugs', () => {
      // Case-insensitive ID lookup
      expect(getProductById('ET-01')?.id).toBe('et-01');
      expect(getProductById('Et-02')?.id).toBe('et-02');
      expect(getCatalogueProductById('TR-01')?.id).toBe('tr-01');

      // Canonical slug lookup
      expect(getProductBySlug('oxblood-wool-silk-signature-coat-dress')?.id).toBe('et-01');
      expect(getProductBySlug('ivory-hand-spun-matka-silk-cocoon-trench')?.id).toBe('et-02');

      // Legacy slug aliases
      expect(getProductBySlug('ivory-raw-tussar-cocoon-trench')?.id).toBe('et-02');
      expect(getProductBySlug('the-sylvan-mulberry-silk-trench')?.id).toBe('et-01');
      expect(getProductBySlug('the-pleated-indigo-chanderi-tunic')?.id).toBe('et-04');

      // Catalogue product lookups
      expect(getCatalogueProductBySlug('banaras-afterlight-sculpted-brocade-mantle-coat')?.id).toBe('tr-01');

      // Listed product lookup
      expect(getListedProductBySlug('ivory-hand-spun-matka-silk-cocoon-trench')?.id).toBe('et-02');
      expect(getListedProductBySlug('banaras-afterlight-sculpted-brocade-mantle-coat')?.id).toBe('tr-01');
      expect(getListedProductBySlug('nonexistent-archival-specimen')).toBeUndefined();
    });
  });

  describe('UT-DATA-02: Traditional Concept Specifications Validation', () => {
    it('validates all 7 TR products have valid IDs, prices, pieces, and colourways', () => {
      expect(TRADITIONAL_PRODUCTS).toHaveLength(7);

      const expectedTR = [
        { id: 'tr-01', price: 128000, cat: 'Outerwear' },
        { id: 'tr-02', price: 142000, cat: 'Gowns & Drapes' },
        { id: 'tr-03', price: 148000, cat: 'Sets & Co-ords' },
        { id: 'tr-04', price: 118000, cat: 'Sets & Co-ords' },
        { id: 'tr-05', price: 78000, cat: 'Outerwear' },
        { id: 'tr-06', price: 66000, cat: 'Sets & Co-ords' },
        { id: 'tr-07', price: 92000, cat: 'Gowns & Drapes' }
      ];

      expectedTR.forEach(exp => {
        const tr = TRADITIONAL_PRODUCTS.find(p => p.id === exp.id);
        expect(tr).toBeDefined();
        expect(tr?.price).toBe(exp.price);
        expect(tr?.category).toBe(exp.cat);
        expect(tr?.collection).toBe('traditional');
        expect(tr?.pieces.length).toBeGreaterThan(0);
        expect(tr?.colors.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('strictly omits fabricated fields: no edition, artisanHours, warpDensity, origin, leadTime', () => {
      TRADITIONAL_PRODUCTS.forEach(tr => {
        const raw = tr as unknown as Record<string, unknown>;
        expect(raw.edition).toBeUndefined();
        expect(raw.artisanHours).toBeUndefined();
        expect(raw.warpDensity).toBeUndefined();
        expect(raw.origin).toBeUndefined();
        expect(raw.leadTime).toBeUndefined();
        expect(raw.statusDisclaimer).toBeUndefined();
      });
    });

    it('enforces concept notices, listed commercial status, and honest description for TR-06', () => {
      TRADITIONAL_PRODUCTS.forEach(tr => {
        expect(tr.statusText).toBe(TR_STATUS_TEXT);
        expect(tr.conceptNotice).toBe(CONCEPT_NOTICE_TEXT);
        expect(tr.isListed).toBe(true);
        expect(tr.isPurchasable).toBe(true);
        expect(tr.contentFlags?.isAtelierConcept).toBe(true);
        expect(tr.provenance).toBe('ai-concept-fashion');
      });

      // TR-06 must be described as Ajrakh-inspired geometric print and never hand block-printed
      const tr06 = TRADITIONAL_PRODUCTS.find(p => p.id === 'tr-06');
      expect(tr06?.description).toContain('Ajrakh-inspired geometric print');
      expect(tr06?.description.toLowerCase()).not.toContain('hand block-printed');
      expect(tr06?.story.toLowerCase()).not.toContain('hand block-printed');
    });
  });

  describe('UT-COMP-01: Curator’s Compass Boundary & Invariance (Decision O-8)', () => {
    it('queries strictly contemporary products and never returns TR products', () => {
      const prefs: CompassPreferences = {
        fabric: 'wild-silk',
        movement: 'architectural',
        craft: 'kadwa-zari',
        story: 'ceremony'
      };

      const results = matchProductsToPreferences(prefs);
      expect(results.length).toBeGreaterThan(0);
      results.forEach(rec => {
        expect(rec.product.id).toMatch(/^et-0[1-7]$/);
        expect(isTraditional(rec.product)).toBe(false);
      });
    });
  });

  describe('UT-SEARCH-01: Multi-Token Search & Resolvable Destinations', () => {
    it('verifies token matching maps "Indigo Chanderi Tunic" to ET-04', () => {
      const query = 'Indigo Chanderi Tunic';
      const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

      const matchedProducts = ALL_PRODUCTS.filter(p => !('isListed' in p) || p.isListed !== false).filter(p => {
        const weaveStr = 'weaveType' in p ? p.weaveType : '';
        const fiberStr = 'fiberPurity' in p ? p.fiberPurity : '';
        const originStr = 'origin' in p ? p.origin : '';
        const tagsStr = (p.curatorTags || []).join(' ');
        const haystack = `${p.title} ${p.subtitle || ''} ${p.category} ${weaveStr} ${fiberStr} ${originStr} ${p.description} ${tagsStr}`.toLowerCase();
        return tokens.every(token => haystack.includes(token));
      });

      expect(matchedProducts).toHaveLength(1);
      expect(matchedProducts[0].id).toBe('et-04');
    });

    it('maps weave-14 to /archive/the-art-of-the-drape', () => {
      expect(WEAVE_STORY_ROUTES['weave-14']).toBe('/archive/the-art-of-the-drape');
    });
  });

  describe('UT-ROUTE-01: Legacy Archive Slugs Mapping Table', () => {
    it('maps all 9 legacy archive slugs to canonical tradition keys', () => {
      const expectedPairs: Record<string, string> = {
        'varanasi-kadwa': 'banarasi-brocade',
        'chanderi-handloom': 'kota-doria',
        'changthangi-pashmina': 'kashmiri-sozni',
        'assam-wild-silk-twill': 'muga-silk',
        'kanchipuram-korvai-temple': 'kanchipuram-silk',
        'maharashtra-paithani-tapestry': 'paithani-silk',
        'gujarat-patan-patola-double-ikat': 'patan-patola',
        'telangana-pochampally-ikat': 'pochampally-ikat',
        'odisha-sambalpuri-bandha': 'sambalpuri-ikat'
      };

      expect(LEGACY_ARCHIVE_ROUTES).toEqual(expectedPairs);

      // Verify that every canonical tradition key is resolvable
      Object.values(expectedPairs).forEach(canonicalKey => {
        const record = getTraditionAssets(canonicalKey);
        expect(record).toBeDefined();
        expect(record?.traditionKey).toBe(canonicalKey);
      });
    });
  });

  describe('UT-ARCH-01: Archive Lineage & Related-Piece Restrictions (Decision O-7 / DEC D-25)', () => {
    it('enforces Sozni info-only, Muga none, and Banarasi & Kota Doria blocked', () => {
      expect(ARCHIVE_RELATED_PIECES['kashmiri-sozni'].kind).toBe('info');
      expect(ARCHIVE_RELATED_PIECES['kashmiri-sozni'].text).toBe(PROVISIONAL_RELATED_TEXTS.et07Info);

      expect(ARCHIVE_RELATED_PIECES['muga-silk'].kind).toBe('none');

      expect(ARCHIVE_RELATED_PIECES['banarasi-brocade'].kind).toBe('blocked');
      expect(ARCHIVE_RELATED_PIECES['kota-doria'].kind).toBe('blocked');
    });

    it('maps 6 TR inspiration designs and omits Banarasi pending DEC D-25', () => {
      expect(TRADITION_INSPIRED_DESIGNS['banarasi-brocade']).toBeUndefined();
      expect(TRADITION_INSPIRED_DESIGNS['paithani-silk']).toBe('tr-02');
      expect(TRADITION_INSPIRED_DESIGNS['patan-patola']).toBe('tr-03');
      expect(TRADITION_INSPIRED_DESIGNS['kanchipuram-silk']).toBe('tr-04');
      expect(TRADITION_INSPIRED_DESIGNS['chikankari']).toBe('tr-05');
      expect(TRADITION_INSPIRED_DESIGNS['ajrakh']).toBe('tr-06');
      expect(TRADITION_INSPIRED_DESIGNS['bandhani']).toBe('tr-07');
    });
  });
});
