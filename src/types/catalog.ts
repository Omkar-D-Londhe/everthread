/**
 * EverThread Typed Data Models
 * Strict TypeScript models for Products, Variants, Cultural Archive Folios, Weave Library, and Journal Articles.
 * Includes Content Integrity flags to identify illustrative personas, estimated figures, and unverified claims.
 */

import { ResponsiveImage } from '../data/assetMap.ts';

export interface ProductColorVariant {
  id: string;
  name: string;
  hex: string;
}

export type ProductCategory =
  | 'Outerwear'
  | 'Waistcoats'
  | 'Tunics & Drapes'
  | 'Accessories'
  | 'Gowns & Drapes'
  | 'Sets & Co-ords';

export interface ContentIntegrityFlags {
  isEditionFictional: boolean;
  isHoursEstimate: boolean;
  isAtelierConcept: boolean;
  isPersonaIllustrative?: boolean;
  unsupportedClaims: string[];
}

export interface ProductBase {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: ProductCategory;
  price: number; // Integer in INR (₹)
  currency: string;
  description: string;
  colors: ProductColorVariant[];
  curatorTags?: string[];
  image: string;
  macroImage?: string;
  imageAlt: string;
  macroImageAlt?: string;
  imageCredit?: string;
  gallery?: ResponsiveImage[];
  relatedStorySlugs?: string[];
  careInstructions?: string[];
  contentFlags?: ContentIntegrityFlags;
  provenance?: string;
  creditText?: string;
}

export interface Product extends ProductBase {
  collection?: 'contemporary';
  status: 'Made to Order' | 'Atelier Masterwork' | 'Limited Reserve';
  statusDisclaimer: string;
  leadTime: string;
  edition: string;
  fiberPurity: string;
  weaveType: string;
  origin: string;
  warpDensity: string;
  artisanHours: string;
  sizes: string[];
  curatorTags: string[];
  macroImage: string;
  macroImageAlt: string;
  careInstructions: string[];
  contentFlags: ContentIntegrityFlags;
}

export interface TraditionalPiece {
  key: string;
  label: string;
  sizes: string[];
}

export interface TraditionalMaterial {
  part: string;
  composition: string;
}

export interface TraditionalInspiration {
  traditionKey: string;
  label: string;
}

export interface TraditionalProduct extends ProductBase {
  collection: 'traditional';
  pieces: TraditionalPiece[];
  includes: string[];
  materials: TraditionalMaterial[];
  story: string;
  inspiration: TraditionalInspiration;
  statusText: string;
  conceptNotice: string;
  isListed: boolean;
  isPurchasable?: boolean;
}

export type CatalogueProduct = Product | TraditionalProduct;

export function isTraditional(p: CatalogueProduct): p is TraditionalProduct {
  return (p as TraditionalProduct).collection === 'traditional';
}

export interface ArchiveDraftingSpec {
  label: string;
  value: string;
}

export interface ArchiveStory {
  id: string;
  slug: string;
  chapter: string;
  folio: string;
  title: string;
  subtitle: string;
  focus: string;
  image: string;
  imageAlt: string;
  imageCredit?: string;
  artisan: string;
  location: string;
  summary: string;
  exhibitionText: string;
  draftingSpecs: ArchiveDraftingSpec[];
  relatedProductSlugs?: string[];
  relatedTraditionKey?: string;
  relatedTraditionTitle?: string;
  sources?: string[];
  contentFlags: {
    isPersonaIllustrative: boolean;
    isLocationDemonstration: boolean;
    unsupportedClaims: string[];
  };
}

export type TraditionImageRole =
  | 'model-01'
  | 'model-02'
  | 'drape-03'
  | 'stilllife-04'
  | 'macro-05'
  | 'process-06';

export interface TraditionRoleItem extends ResponsiveImage {
  role: TraditionImageRole;
  label: string;
  purpose: string;
  caption?: string;
  isLandscape?: boolean;
}

export interface TraditionAssetRecord {
  traditionKey: string;
  slug: string;
  title: string;
  region: string;
  distinction: string;
  technique: string;
  fiber: string;
  warpDensity: string;
  structuralProfile: string;
  roles: Record<TraditionImageRole, TraditionRoleItem>;
  diagramId?: string;
}

export interface WeaveLibraryItem {
  id: string;
  slug: string;
  title: string;
  technique: string;
  region: string;
  fiber: string;
  warpDensity: string;
  description: string;
  distinction: 'weaving' | 'embroidery' | 'printing' | 'dyeing' | 'draping';
  structuralProfile: string;
  image?: string;
  imageAlt?: string;
  traditionKey?: string;
  diagramId?: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: 'Atelier Philosophy' | 'Field Journal' | 'Natural Dyes';
  date: string;
  readTime: string;
  author: string;
  authorRole?: string;
  bodyParagraphs: string[];
  sources?: string[];
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  relatedArticleSlugs?: string[];
  contentFlags: {
    isEditorialPersona: boolean;
    unsupportedClaims: string[];
  };
}
