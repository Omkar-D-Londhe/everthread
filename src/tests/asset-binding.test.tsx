import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PRODUCTS, getProductById, getProductBySlug } from '../data/products.ts';
import { PRODUCT_ASSET_MAP, DIAGRAM_ASSETS } from '../data/assetMap.ts';

const PUBLIC_DIR = path.resolve(__dirname, '../../public');

describe('Stage 3.1: Asset Deployment & Product Image Binding', () => {
  const expectedProductIds = ['et-01', 'et-02', 'et-03', 'et-04', 'et-05', 'et-06', 'et-07'];

  it('Requirement 2: All 7 catalogue products exist with confirmed IDs, titles, and reconciled prices', () => {
    expect(PRODUCTS).toHaveLength(7);
    expect(Object.keys(PRODUCT_ASSET_MAP)).toHaveLength(7);
    const ids = PRODUCTS.map(p => p.id);
    expect(ids).toEqual(expectedProductIds);

    expect(getProductById('et-01')?.title).toBe('Oxblood Wool-Silk Signature Coat-Dress');
    expect(getProductById('et-01')?.price).toBe(68500);

    expect(getProductById('et-02')?.title).toBe('Ivory Hand-Spun Matka Silk Cocoon Trench');
    expect(getProductById('et-02')?.price).toBe(112000);

    expect(getProductById('et-03')?.title).toBe('Architectonic Zari Waistcoat');
    expect(getProductById('et-03')?.price).toBe(44000);

    expect(getProductById('et-04')?.title).toBe('Angrakha Asymmetric Sheer Tunic');
    expect(getProductById('et-04')?.price).toBe(32000);

    expect(getProductById('et-05')?.title).toBe('Box-Calf Structured Frame Bag');
    expect(getProductById('et-05')?.price).toBe(54000);

    expect(getProductById('et-06')?.title).toBe('Hand-Rolled Mulberry Twill Scarf');
    expect(getProductById('et-06')?.price).toBe(24500);

    expect(getProductById('et-07')?.title).toBe('High-Altitude Hand-Spun Pashmina Stole');
    expect(getProductById('et-07')?.price).toBe(38000);
  });

  it('Requirement 3: Every product binds exclusively to local optimized WebP assets', () => {
    PRODUCTS.forEach(product => {
      // Must not use remote placeholder URLs
      expect(product.image).not.toContain('googleusercontent');
      expect(product.macroImage).not.toContain('googleusercontent');
      expect(product.image.startsWith('/images/products/')).toBe(true);
      expect(product.macroImage.startsWith('/images/products/')).toBe(true);

      // Primary file must physically exist in public directory
      const primaryDiskPath = path.join(PUBLIC_DIR, product.image);
      expect(fs.existsSync(primaryDiskPath), `File missing: ${primaryDiskPath}`).toBe(true);

      // Macro file must physically exist in public directory
      const macroDiskPath = path.join(PUBLIC_DIR, product.macroImage);
      expect(fs.existsSync(macroDiskPath), `File missing: ${macroDiskPath}`).toBe(true);
    });
  });

  it('Requirement 2: ET-01 strictly excludes the retired belted editorial image', () => {
    const et01 = getProductById('et-01');
    expect(et01).toBeDefined();

    const allEt01Urls = [
      et01!.image,
      et01!.macroImage,
      ...(et01!.gallery?.map(g => g.src) || [])
    ];

    allEt01Urls.forEach(url => {
      expect(url).not.toContain('product-signature-coat-dress-editorial-03');
      expect(url).not.toContain('belted');
    });

    // Verify ET-01 contains all 6 approved clean views
    expect(et01?.gallery).toHaveLength(6);
    const galleryFilenames = et01?.gallery?.map(g => path.basename(g.src));
    expect(galleryFilenames).toContain('product-oxblood-signature-front-01.webp');
    expect(galleryFilenames).toContain('product-oxblood-signature-back-01.webp');
    expect(galleryFilenames).toContain('product-oxblood-signature-side-01.webp');
    expect(galleryFilenames).toContain('product-oxblood-signature-side-02.webp');
    expect(galleryFilenames).toContain('product-oxblood-signature-detail-01.webp');
    expect(galleryFilenames).toContain('product-oxblood-signature-detail-clean-01.webp');
  });

  it('Requirement 2: ET-03 (Architectonic Zari Waistcoat) maps all 4 verified views', () => {
    const et03 = getProductById('et-03');
    expect(et03).toBeDefined();
    expect(et03?.gallery).toHaveLength(4);

    const filenames = et03?.gallery?.map(g => path.basename(g.src));
    expect(filenames).toContain('et-03-zari-waistcoat-front-01.webp');
    expect(filenames).toContain('et-03-zari-waistcoat-back-01.webp');
    expect(filenames).toContain('et-03-zari-waistcoat-detail-01.webp');
    expect(filenames).toContain('et-03-zari-waistcoat-model-01.webp');

    et03?.gallery?.forEach(img => {
      const diskPath = path.join(PUBLIC_DIR, img.src);
      expect(fs.existsSync(diskPath), `ET-03 file missing: ${diskPath}`).toBe(true);
    });
  });

  it('Requirement 2: ET-04 (Angrakha Asymmetric Sheer Tunic) maps all 4 verified views', () => {
    const et04 = getProductById('et-04');
    expect(et04).toBeDefined();
    expect(et04?.gallery).toHaveLength(4);

    const filenames = et04?.gallery?.map(g => path.basename(g.src));
    expect(filenames).toContain('et-04-chanderi-tunic-front-01.webp');
    expect(filenames).toContain('et-04-chanderi-tunic-back-01.webp');
    expect(filenames).toContain('et-04-chanderi-tunic-detail-01.webp');
    expect(filenames).toContain('et-04-chanderi-tunic-model-01.webp');

    et04?.gallery?.forEach(img => {
      const diskPath = path.join(PUBLIC_DIR, img.src);
      expect(fs.existsSync(diskPath), `ET-04 file missing: ${diskPath}`).toBe(true);
    });
  });

  it('Requirement 2: ET-02, ET-05, ET-06, ET-07 have complete verified galleries with physical disk files', () => {
    ['et-02', 'et-05', 'et-06', 'et-07'].forEach(id => {
      const prod = getProductById(id);
      expect(prod).toBeDefined();
      expect(prod?.gallery?.length).toBeGreaterThanOrEqual(4);

      prod?.gallery?.forEach(img => {
        const diskPath = path.join(PUBLIC_DIR, img.src);
        expect(fs.existsSync(diskPath), `File missing on disk for ${id}: ${diskPath}`).toBe(true);
      });
    });
  });

  it('Requirement 3: Weave Library diagrams are available as direct SVGs with PNG fallbacks', () => {
    const diagramKeys = Object.keys(DIAGRAM_ASSETS);
    expect(diagramKeys).toHaveLength(9);

    diagramKeys.forEach(key => {
      const diag = DIAGRAM_ASSETS[key];
      expect(diag.svg.endsWith('.svg')).toBe(true);
      expect(diag.fallbackPng.endsWith('.png')).toBe(true);

      const svgPath = path.join(PUBLIC_DIR, diag.svg);
      const pngPath = path.join(PUBLIC_DIR, diag.fallbackPng);
      expect(fs.existsSync(svgPath), `SVG missing: ${svgPath}`).toBe(true);
      expect(fs.existsSync(pngPath), `PNG fallback missing: ${pngPath}`).toBe(true);
    });
  });

  it('Lookup utilities support slug lookups for all 7 products', () => {
    expectedProductIds.forEach(id => {
      const prod = getProductById(id);
      expect(prod).toBeDefined();
      const bySlug = getProductBySlug(prod!.slug);
      expect(bySlug?.id).toBe(id);
    });
  });
});
