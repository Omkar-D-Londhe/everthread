import { TraditionalProduct } from '../types/catalog.ts';
import { TRADITIONAL_PRODUCTS } from './traditionalProducts.ts';

export type MomentLayout = 'feature-offset' | 'staggered-pair' | 'triptych-lead-last';

export interface WallMomentDefinition {
  id: string;
  title: string;
  caption: string;
  layout: MomentLayout;
  productIds: string[];
}

export const WALL_MOMENTS_CONFIG: WallMomentDefinition[] = [
  {
    id: 'mantle-drape',
    title: 'The Mantle and the Drape',
    caption: 'Sculpted outerwear and fluid drape.',
    layout: 'feature-offset',
    productIds: ['tr-01', 'tr-02']
  },
  {
    id: 'geometry',
    title: 'Geometry',
    caption: 'Tailored sets.',
    layout: 'staggered-pair',
    productIds: ['tr-03', 'tr-04']
  },
  {
    id: 'veil-print',
    title: 'Veil and Print',
    caption: 'Sheer layers, printed pieces and a draped dress.',
    layout: 'triptych-lead-last',
    productIds: ['tr-05', 'tr-06', 'tr-07']
  }
];

export interface PopulatedWallMoment {
  id: string;
  title: string;
  caption: string;
  layout: MomentLayout;
  products: TraditionalProduct[];
}

/**
 * Returns populated wall moments containing ONLY listed products.
 * Moments with zero listed products are omitted entirely per Stage 05 rules.
 */
export function getListedWallMoments(
  allProducts: TraditionalProduct[] = TRADITIONAL_PRODUCTS
): PopulatedWallMoment[] {
  const listedProductsMap = new Map<string, TraditionalProduct>();
  for (const prod of allProducts) {
    if (prod.isListed) {
      listedProductsMap.set(prod.id.toLowerCase(), prod);
    }
  }

  const result: PopulatedWallMoment[] = [];
  for (const conf of WALL_MOMENTS_CONFIG) {
    const products: TraditionalProduct[] = [];
    for (const pid of conf.productIds) {
      const p = listedProductsMap.get(pid.toLowerCase());
      if (p) {
        products.push(p);
      }
    }

    if (products.length > 0) {
      result.push({
        id: conf.id,
        title: conf.title,
        caption: conf.caption,
        layout: conf.layout,
        products
      });
    }
  }

  return result;
}
