/**
 * EverThread Typed Asset Map
 * Generated from verified, optimized local WebP assets in public/images/.
 * Strict typed interfaces for responsive delivery (srcset), primary display, and galleries.
 */

import { TraditionImageRole, TraditionRoleItem, TraditionAssetRecord } from '../types/catalog.ts';
import assetCatalog from './assetCatalog.json';

export type ImageProvenance =
  | 'ai-concept-fashion'
  | 'ai-interpretive-textile'
  | 'technical-diagram'
  | 'archive-photography'
  | 'contemporary-editorial'
  | 'concept-render'
  | 'unknown';

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  label?: string;
  provenance?: ImageProvenance;
  creditText?: string;
}

export interface ProductAssetRecord {
  id: string;
  slug: string;
  title: string;
  primary: ResponsiveImage;
  macro?: ResponsiveImage;
  gallery: ResponsiveImage[];
}

export interface DiagramAsset {
  id: string;
  title: string;
  svg: string;
  fallbackPng: string;
  description?: string;
  provenance?: ImageProvenance;
  creditText?: string;
}

export const PRODUCT_ASSET_MAP: Record<string, ProductAssetRecord> = {
  "et-01": {
    "id": "et-01",
    "slug": "oxblood-wool-silk-signature-coat-dress",
    "title": "Oxblood Wool-Silk Signature Coat-Dress",
    "primary": {
      "src": "/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp",
      "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-front-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-front-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1024,
      "height": 1536,
      "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Primary View",
      "label": "Primary View"
    },
    "macro": {
      "src": "/images/products/signature-coat-dress/product-oxblood-signature-detail-01.webp",
      "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-detail-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-detail-01-1200w.webp 1200w, /images/products/signature-coat-dress/product-oxblood-signature-detail-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1536,
      "height": 1024,
      "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp",
        "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-front-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-front-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Primary View",
        "label": "Primary View"
      },
      {
        "src": "/images/products/signature-coat-dress/product-oxblood-signature-back-01.webp",
        "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-back-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-back-01-1200w.webp 1200w, /images/products/signature-coat-dress/product-oxblood-signature-back-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/signature-coat-dress/product-oxblood-signature-side-01.webp",
        "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-side-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-side-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-side-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Profile Drape (Left)",
        "label": "Profile Drape (Left)"
      },
      {
        "src": "/images/products/signature-coat-dress/product-oxblood-signature-side-02.webp",
        "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-side-02.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-side-02-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-side-02-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Profile Drape (Right)",
        "label": "Profile Drape (Right)"
      },
      {
        "src": "/images/products/signature-coat-dress/product-oxblood-signature-detail-01.webp",
        "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-detail-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-detail-01-1200w.webp 1200w, /images/products/signature-coat-dress/product-oxblood-signature-detail-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      },
      {
        "src": "/images/products/signature-coat-dress/product-oxblood-signature-detail-clean-01.webp",
        "srcSet": "/images/products/signature-coat-dress/product-oxblood-signature-detail-clean-01.webp 1536w, /images/products/signature-coat-dress/product-oxblood-signature-detail-clean-01-1200w.webp 1200w, /images/products/signature-coat-dress/product-oxblood-signature-detail-clean-01-800w.webp 800w, /images/products/signature-coat-dress/product-oxblood-signature-detail-clean-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Oxblood Wool-Silk Signature Coat-Dress \u2014 Woven Brocade Facing",
        "label": "Woven Brocade Facing"
      }
    ]
  },
  "et-02": {
    "id": "et-02",
    "slug": "ivory-hand-spun-matka-silk-cocoon-trench",
    "title": "Ivory Hand-Spun Matka Silk Cocoon Trench",
    "primary": {
      "src": "/images/products/ivory-tailored-coat/product-ivory-tailored-front-01.webp",
      "srcSet": "/images/products/ivory-tailored-coat/product-ivory-tailored-front-01.webp 1536w, /images/products/ivory-tailored-coat/product-ivory-tailored-front-01-800w.webp 800w, /images/products/ivory-tailored-coat/product-ivory-tailored-front-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1024,
      "height": 1536,
      "alt": "Ivory Structured Raw Silk Coat \u2014 Primary View",
      "label": "Primary View"
    },
    "macro": {
      "src": "/images/products/ivory-tailored-coat/product-ivory-tailored-detail-01.webp",
      "srcSet": "/images/products/ivory-tailored-coat/product-ivory-tailored-detail-01.webp 1536w, /images/products/ivory-tailored-coat/product-ivory-tailored-detail-01-1200w.webp 1200w, /images/products/ivory-tailored-coat/product-ivory-tailored-detail-01-800w.webp 800w, /images/products/ivory-tailored-coat/product-ivory-tailored-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1536,
      "height": 1024,
      "alt": "Ivory Structured Raw Silk Coat \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/ivory-tailored-coat/product-ivory-tailored-front-01.webp",
        "srcSet": "/images/products/ivory-tailored-coat/product-ivory-tailored-front-01.webp 1536w, /images/products/ivory-tailored-coat/product-ivory-tailored-front-01-800w.webp 800w, /images/products/ivory-tailored-coat/product-ivory-tailored-front-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Ivory Structured Raw Silk Coat \u2014 Primary View",
        "label": "Primary View"
      },
      {
        "src": "/images/products/ivory-tailored-coat/product-ivory-tailored-styled-01.webp",
        "srcSet": "/images/products/ivory-tailored-coat/product-ivory-tailored-styled-01.webp 1536w, /images/products/ivory-tailored-coat/product-ivory-tailored-styled-01-800w.webp 800w, /images/products/ivory-tailored-coat/product-ivory-tailored-styled-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Ivory Structured Raw Silk Coat \u2014 Editorial Silhouette",
        "label": "Editorial Silhouette"
      },
      {
        "src": "/images/products/ivory-tailored-coat/product-ivory-tailored-back-01.webp",
        "srcSet": "/images/products/ivory-tailored-coat/product-ivory-tailored-back-01.webp 1536w, /images/products/ivory-tailored-coat/product-ivory-tailored-back-01-800w.webp 800w, /images/products/ivory-tailored-coat/product-ivory-tailored-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Ivory Structured Raw Silk Coat \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/ivory-tailored-coat/product-ivory-tailored-detail-01.webp",
        "srcSet": "/images/products/ivory-tailored-coat/product-ivory-tailored-detail-01.webp 1536w, /images/products/ivory-tailored-coat/product-ivory-tailored-detail-01-1200w.webp 1200w, /images/products/ivory-tailored-coat/product-ivory-tailored-detail-01-800w.webp 800w, /images/products/ivory-tailored-coat/product-ivory-tailored-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Ivory Structured Raw Silk Coat \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      }
    ]
  },
  "et-03": {
    "id": "et-03",
    "slug": "architectonic-zari-waistcoat",
    "title": "Architectonic Zari Waistcoat",
    "primary": {
      "src": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01.webp",
      "srcSet": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01.webp 1536w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01-800w.webp 800w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1024,
      "height": 1536,
      "alt": "Architectonic Zari Waistcoat \u2014 Editorial Silhouette",
      "label": "Editorial Silhouette"
    },
    "macro": {
      "src": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01.webp",
      "srcSet": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01.webp 1536w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01-1200w.webp 1200w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01-800w.webp 800w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1452,
      "height": 1083,
      "alt": "Architectonic Zari Waistcoat \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01.webp",
        "srcSet": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01.webp 1536w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01-800w.webp 800w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-model-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Architectonic Zari Waistcoat \u2014 Editorial Silhouette",
        "label": "Editorial Silhouette"
      },
      {
        "src": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01.webp",
        "srcSet": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01.webp 1536w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01-1200w.webp 1200w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01-800w.webp 800w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1453,
        "height": 1083,
        "alt": "Architectonic Zari Waistcoat \u2014 Front Architecture",
        "label": "Front Architecture"
      },
      {
        "src": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-back-01.webp",
        "srcSet": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-back-01.webp 1536w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-back-01-1200w.webp 1200w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-back-01-800w.webp 800w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1453,
        "height": 1083,
        "alt": "Architectonic Zari Waistcoat \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01.webp",
        "srcSet": "/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01.webp 1536w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01-1200w.webp 1200w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01-800w.webp 800w, /images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1452,
        "height": 1083,
        "alt": "Architectonic Zari Waistcoat \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      }
    ]
  },
  "et-04": {
    "id": "et-04",
    "slug": "angrakha-asymmetric-sheer-tunic",
    "title": "Angrakha Asymmetric Sheer Tunic",
    "primary": {
      "src": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01.webp",
      "srcSet": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01.webp 1536w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01-800w.webp 800w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1024,
      "height": 1536,
      "alt": "Angrakha Asymmetric Sheer Tunic \u2014 Editorial Silhouette",
      "label": "Editorial Silhouette"
    },
    "macro": {
      "src": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01.webp",
      "srcSet": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01.webp 1536w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01-1200w.webp 1200w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01-800w.webp 800w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1452,
      "height": 1083,
      "alt": "Angrakha Asymmetric Sheer Tunic \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01.webp",
        "srcSet": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01.webp 1536w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01-800w.webp 800w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-model-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Angrakha Asymmetric Sheer Tunic \u2014 Editorial Silhouette",
        "label": "Editorial Silhouette"
      },
      {
        "src": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01.webp",
        "srcSet": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01.webp 1536w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01-1200w.webp 1200w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01-800w.webp 800w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1452,
        "height": 1083,
        "alt": "Angrakha Asymmetric Sheer Tunic \u2014 Front Drape Architecture",
        "label": "Front Drape Architecture"
      },
      {
        "src": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-back-01.webp",
        "srcSet": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-back-01.webp 1536w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-back-01-1200w.webp 1200w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-back-01-800w.webp 800w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1452,
        "height": 1083,
        "alt": "Angrakha Asymmetric Sheer Tunic \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01.webp",
        "srcSet": "/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01.webp 1536w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01-1200w.webp 1200w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01-800w.webp 800w, /images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1452,
        "height": 1083,
        "alt": "Angrakha Asymmetric Sheer Tunic \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      }
    ]
  },
  "et-05": {
    "id": "et-05",
    "slug": "box-calf-structured-frame-bag",
    "title": "Box-Calf Structured Frame Bag",
    "primary": {
      "src": "/images/products/oxblood-handbag/product-oxblood-handbag-01.webp",
      "srcSet": "/images/products/oxblood-handbag/product-oxblood-handbag-01.webp 1536w, /images/products/oxblood-handbag/product-oxblood-handbag-01-1200w.webp 1200w, /images/products/oxblood-handbag/product-oxblood-handbag-01-800w.webp 800w, /images/products/oxblood-handbag/product-oxblood-handbag-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1312,
      "height": 1199,
      "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Primary View",
      "label": "Primary View"
    },
    "macro": {
      "src": "/images/products/oxblood-handbag/product-leather-accessory-detail-01.webp",
      "srcSet": "/images/products/oxblood-handbag/product-leather-accessory-detail-01.webp 1536w, /images/products/oxblood-handbag/product-leather-accessory-detail-01-1200w.webp 1200w, /images/products/oxblood-handbag/product-leather-accessory-detail-01-800w.webp 800w, /images/products/oxblood-handbag/product-leather-accessory-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1536,
      "height": 1024,
      "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/oxblood-handbag/product-oxblood-handbag-01.webp",
        "srcSet": "/images/products/oxblood-handbag/product-oxblood-handbag-01.webp 1536w, /images/products/oxblood-handbag/product-oxblood-handbag-01-1200w.webp 1200w, /images/products/oxblood-handbag/product-oxblood-handbag-01-800w.webp 800w, /images/products/oxblood-handbag/product-oxblood-handbag-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1312,
        "height": 1199,
        "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Primary View",
        "label": "Primary View"
      },
      {
        "src": "/images/products/oxblood-handbag/product-oxblood-handbag-back-01.webp",
        "srcSet": "/images/products/oxblood-handbag/product-oxblood-handbag-back-01.webp 1536w, /images/products/oxblood-handbag/product-oxblood-handbag-back-01-1200w.webp 1200w, /images/products/oxblood-handbag/product-oxblood-handbag-back-01-800w.webp 800w, /images/products/oxblood-handbag/product-oxblood-handbag-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/oxblood-handbag/product-leather-accessory-detail-01.webp",
        "srcSet": "/images/products/oxblood-handbag/product-leather-accessory-detail-01.webp 1536w, /images/products/oxblood-handbag/product-leather-accessory-detail-01-1200w.webp 1200w, /images/products/oxblood-handbag/product-leather-accessory-detail-01-800w.webp 800w, /images/products/oxblood-handbag/product-leather-accessory-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      },
      {
        "src": "/images/products/oxblood-handbag/product-oxblood-handbag-detail-02.webp",
        "srcSet": "/images/products/oxblood-handbag/product-oxblood-handbag-detail-02.webp 1536w, /images/products/oxblood-handbag/product-oxblood-handbag-detail-02-1200w.webp 1200w, /images/products/oxblood-handbag/product-oxblood-handbag-detail-02-800w.webp 800w, /images/products/oxblood-handbag/product-oxblood-handbag-detail-02-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      },
      {
        "src": "/images/products/oxblood-handbag/product-oxblood-handbag-editorial-03.webp",
        "srcSet": "/images/products/oxblood-handbag/product-oxblood-handbag-editorial-03.webp 1536w, /images/products/oxblood-handbag/product-oxblood-handbag-editorial-03-1200w.webp 1200w, /images/products/oxblood-handbag/product-oxblood-handbag-editorial-03-800w.webp 800w, /images/products/oxblood-handbag/product-oxblood-handbag-editorial-03-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1374,
        "height": 1145,
        "alt": "Oxblood Structured Box Calf Leather Bag \u2014 Garment Study",
        "label": "Garment Study"
      }
    ]
  },
  "et-06": {
    "id": "et-06",
    "slug": "hand-rolled-mulberry-twill-scarf",
    "title": "Hand-Rolled Mulberry Twill Scarf",
    "primary": {
      "src": "/images/products/burgundy-scarf/product-burgundy-scarf-01.webp",
      "srcSet": "/images/products/burgundy-scarf/product-burgundy-scarf-01.webp 1536w, /images/products/burgundy-scarf/product-burgundy-scarf-01-800w.webp 800w, /images/products/burgundy-scarf/product-burgundy-scarf-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1144,
      "height": 1375,
      "alt": "Handspun Mulberry Silk Scarf in Burgundy \u2014 Primary View",
      "label": "Primary View"
    },
    "macro": {
      "src": "/images/products/burgundy-scarf/product-burgundy-scarf-detail-01.webp",
      "srcSet": "/images/products/burgundy-scarf/product-burgundy-scarf-detail-01.webp 1536w, /images/products/burgundy-scarf/product-burgundy-scarf-detail-01-1200w.webp 1200w, /images/products/burgundy-scarf/product-burgundy-scarf-detail-01-800w.webp 800w, /images/products/burgundy-scarf/product-burgundy-scarf-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1448,
      "height": 1086,
      "alt": "Handspun Mulberry Silk Scarf in Burgundy \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/burgundy-scarf/product-burgundy-scarf-01.webp",
        "srcSet": "/images/products/burgundy-scarf/product-burgundy-scarf-01.webp 1536w, /images/products/burgundy-scarf/product-burgundy-scarf-01-800w.webp 800w, /images/products/burgundy-scarf/product-burgundy-scarf-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1144,
        "height": 1375,
        "alt": "Handspun Mulberry Silk Scarf in Burgundy \u2014 Primary View",
        "label": "Primary View"
      },
      {
        "src": "/images/products/burgundy-scarf/product-burgundy-scarf-styled-01.webp",
        "srcSet": "/images/products/burgundy-scarf/product-burgundy-scarf-styled-01.webp 1536w, /images/products/burgundy-scarf/product-burgundy-scarf-styled-01-800w.webp 800w, /images/products/burgundy-scarf/product-burgundy-scarf-styled-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1024,
        "height": 1536,
        "alt": "Handspun Mulberry Silk Scarf in Burgundy \u2014 Editorial Silhouette",
        "label": "Editorial Silhouette"
      },
      {
        "src": "/images/products/burgundy-scarf/product-burgundy-scarf-back-01.webp",
        "srcSet": "/images/products/burgundy-scarf/product-burgundy-scarf-back-01.webp 1536w, /images/products/burgundy-scarf/product-burgundy-scarf-back-01-1200w.webp 1200w, /images/products/burgundy-scarf/product-burgundy-scarf-back-01-800w.webp 800w, /images/products/burgundy-scarf/product-burgundy-scarf-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Handspun Mulberry Silk Scarf in Burgundy \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/burgundy-scarf/product-burgundy-scarf-detail-01.webp",
        "srcSet": "/images/products/burgundy-scarf/product-burgundy-scarf-detail-01.webp 1536w, /images/products/burgundy-scarf/product-burgundy-scarf-detail-01-1200w.webp 1200w, /images/products/burgundy-scarf/product-burgundy-scarf-detail-01-800w.webp 800w, /images/products/burgundy-scarf/product-burgundy-scarf-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1448,
        "height": 1086,
        "alt": "Handspun Mulberry Silk Scarf in Burgundy \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      }
    ]
  },
  "et-07": {
    "id": "et-07",
    "slug": "high-altitude-hand-spun-pashmina-stole",
    "title": "High-Altitude Hand-Spun Pashmina Stole",
    "primary": {
      "src": "/images/products/ivory-scarf/product-ivory-scarf-01.webp",
      "srcSet": "/images/products/ivory-scarf/product-ivory-scarf-01.webp 1536w, /images/products/ivory-scarf/product-ivory-scarf-01-800w.webp 800w, /images/products/ivory-scarf/product-ivory-scarf-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1145,
      "height": 1374,
      "alt": "Fine Pashmina & Zari Reversible Stole in Ivory \u2014 Primary View",
      "label": "Primary View"
    },
    "macro": {
      "src": "/images/products/ivory-scarf/product-ivory-scarf-detail-01.webp",
      "srcSet": "/images/products/ivory-scarf/product-ivory-scarf-detail-01.webp 1536w, /images/products/ivory-scarf/product-ivory-scarf-detail-01-1200w.webp 1200w, /images/products/ivory-scarf/product-ivory-scarf-detail-01-800w.webp 800w, /images/products/ivory-scarf/product-ivory-scarf-detail-01-400w.webp 400w",
      "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      "width": 1536,
      "height": 1024,
      "alt": "Fine Pashmina & Zari Reversible Stole in Ivory \u2014 Atelier Craft Detail",
      "label": "Atelier Craft Detail"
    },
    "gallery": [
      {
        "src": "/images/products/ivory-scarf/product-ivory-scarf-01.webp",
        "srcSet": "/images/products/ivory-scarf/product-ivory-scarf-01.webp 1536w, /images/products/ivory-scarf/product-ivory-scarf-01-800w.webp 800w, /images/products/ivory-scarf/product-ivory-scarf-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1145,
        "height": 1374,
        "alt": "Fine Pashmina & Zari Reversible Stole in Ivory \u2014 Primary View",
        "label": "Primary View"
      },
      {
        "src": "/images/products/ivory-scarf/product-ivory-scarf-styled-01.webp",
        "srcSet": "/images/products/ivory-scarf/product-ivory-scarf-styled-01.webp 1536w, /images/products/ivory-scarf/product-ivory-scarf-styled-01-1200w.webp 1200w, /images/products/ivory-scarf/product-ivory-scarf-styled-01-800w.webp 800w, /images/products/ivory-scarf/product-ivory-scarf-styled-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Fine Pashmina & Zari Reversible Stole in Ivory \u2014 Editorial Silhouette",
        "label": "Editorial Silhouette"
      },
      {
        "src": "/images/products/ivory-scarf/product-ivory-scarf-back-01.webp",
        "srcSet": "/images/products/ivory-scarf/product-ivory-scarf-back-01.webp 1536w, /images/products/ivory-scarf/product-ivory-scarf-back-01-1200w.webp 1200w, /images/products/ivory-scarf/product-ivory-scarf-back-01-800w.webp 800w, /images/products/ivory-scarf/product-ivory-scarf-back-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1374,
        "height": 1145,
        "alt": "Fine Pashmina & Zari Reversible Stole in Ivory \u2014 Back Construction",
        "label": "Back Construction"
      },
      {
        "src": "/images/products/ivory-scarf/product-ivory-scarf-detail-01.webp",
        "srcSet": "/images/products/ivory-scarf/product-ivory-scarf-detail-01.webp 1536w, /images/products/ivory-scarf/product-ivory-scarf-detail-01-1200w.webp 1200w, /images/products/ivory-scarf/product-ivory-scarf-detail-01-800w.webp 800w, /images/products/ivory-scarf/product-ivory-scarf-detail-01-400w.webp 400w",
        "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        "width": 1536,
        "height": 1024,
        "alt": "Fine Pashmina & Zari Reversible Stole in Ivory \u2014 Atelier Craft Detail",
        "label": "Atelier Craft Detail"
      }
    ]
  }

};

export const TRADITIONAL_PRODUCT_ASSET_MAP: Record<string, ProductAssetRecord> = {
"tr-01": {
    id: "tr-01",
    slug: "banaras-afterlight-sculpted-brocade-mantle-coat",
    title: "Banaras Afterlight — Sculpted Brocade Mantle Coat",
    primary: {
      src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary.webp",
      srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Banaras Afterlight — Sculpted Brocade Mantle Coat — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail.webp",
      srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Banaras Afterlight — Sculpted Brocade Mantle Coat — Kadwa Brocade Detail",
      label: "Kadwa Brocade Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary.webp",
        srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Banaras Afterlight — Sculpted Brocade Mantle Coat — Primary Front View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail.webp",
        srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Banaras Afterlight — Classical Kadwa Floral Brocade Close-Up",
        label: "Brocade Weave Detail"
      },
      {
        src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-three-quarter.webp",
        srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-three-quarter.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-three-quarter-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Banaras Afterlight — Three-Quarter Profile View",
        label: "Profile Drape"
      },
      {
        src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-editorial-seated.webp",
        srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-editorial-seated.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-editorial-seated-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Banaras Afterlight — Seated Architectural Composition",
        label: "Curatorial Seated Still"
      },
      {
        src: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-back.webp",
        srcSet: "/images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-back.webp 1122w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-back-800w.webp 800w, /images/products/tr-01-banaras-afterlight/tr-01-banaras-afterlight-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Banaras Afterlight — Tailored Mantle Coat Rear View",
        label: "Back View"
      }
    ]
  },
  "tr-02": {
    id: "tr-02",
    slug: "mayura-axis-sculpted-drape-gown",
    title: "Mayura Axis — Sculpted Drape Gown",
    primary: {
      src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary.webp",
      srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Mayura Axis — Sculpted Drape Gown — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail.webp",
      srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Mayura Axis — Sculpted Drape Gown — Paithani Tapestry Border Detail",
      label: "Paithani Tapestry Border Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary.webp",
        srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Mayura Axis — Sculpted Drape Gown — Primary View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail.webp",
        srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Mayura Axis — Paithani Interlocking Tapestry Peacock Weave",
        label: "Peacock Border Detail"
      },
      {
        src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-three-quarter.webp",
        srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-three-quarter.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-three-quarter-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Mayura Axis — Asymmetric Drape Three-Quarter View",
        label: "Drape Profile"
      },
      {
        src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-editorial-seated.webp",
        srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-editorial-seated.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-editorial-seated-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Mayura Axis — Seated Studio Composition",
        label: "Editorial Silhouette"
      },
      {
        src: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-back.webp",
        srcSet: "/images/products/tr-02-mayura-axis/tr-02-mayura-axis-back.webp 1122w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-back-800w.webp 800w, /images/products/tr-02-mayura-axis/tr-02-mayura-axis-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Mayura Axis — Rear Gown Line with Gold Border",
        label: "Back View"
      }
    ]
  },
  "tr-03": {
    id: "tr-03",
    slug: "patola-geometry-reversible-jacket-and-trouser-set",
    title: "Patola Geometry — Reversible Jacket & Trouser Set",
    primary: {
      src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary.webp",
      srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary.webp 1122w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Patola Geometry — Reversible Jacket & Trouser Set — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail.webp",
      srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail.webp 1374w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1374,
      height: 1145,
      alt: "Patola Geometry — Reversible Jacket & Trouser Set — Double-Ikat Grid Detail",
      label: "Double-Ikat Grid Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary.webp",
        srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary.webp 1122w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Patola Geometry — Reversible Jacket & Trouser Set — Primary View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail.webp",
        srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail.webp 1374w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1374,
        height: 1145,
        alt: "Patola Geometry — Patan Double-Ikat Silk Weave Close-Up",
        label: "Double-Ikat Geometric Detail"
      },
      {
        src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-three-quarter.webp",
        srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-three-quarter.webp 1122w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-three-quarter-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Patola Geometry — Three-Quarter Angle",
        label: "Profile View"
      },
      {
        src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-reversible.webp",
        srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-reversible.webp 1122w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-reversible-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-reversible-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Patola Geometry — Geometric Double-Ikat Study",
        label: "Reversible Study — Geometric Weave Detail"
      },
      {
        src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-editorial-seated.webp",
        srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-editorial-seated.webp 1122w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-editorial-seated-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Patola Geometry — Seated Architectural Composition",
        label: "Editorial Seated"
      },
      {
        src: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-back.webp",
        srcSet: "/images/products/tr-03-patola-geometry/tr-03-patola-geometry-back.webp 1122w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-back-800w.webp 800w, /images/products/tr-03-patola-geometry/tr-03-patola-geometry-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Patola Geometry — Tailored Jacket Rear View",
        label: "Back View"
      }
    ]
  },
  "tr-04": {
    id: "tr-04",
    slug: "temple-grid-longline-tunic-and-trouser-set",
    title: "Temple Grid — Longline Tunic & Trouser Set",
    primary: {
      src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-primary.webp",
      srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-primary.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-primary-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Temple Grid — Longline Tunic & Trouser Set — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-detail.webp",
      srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-detail.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-detail-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Temple Grid — Longline Tunic & Trouser Set — Korvai Temple Border Detail",
      label: "Korvai Temple Border Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-primary.webp",
        srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-primary.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-primary-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Temple Grid — Longline Tunic & Trouser Set — Primary View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-detail.webp",
        srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-detail.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-detail-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Temple Grid — Kanchipuram Interlocking Korvai Temple Border",
        label: "Korvai Border Detail"
      },
      {
        src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-three-quarter.webp",
        srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-three-quarter.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-three-quarter-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Temple Grid — Three-Quarter View",
        label: "Profile View"
      },
      {
        src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-editorial-seated.webp",
        srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-editorial-seated.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-editorial-seated-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Temple Grid — Seated Composition",
        label: "Curatorial Seated Still"
      },
      {
        src: "/images/products/tr-04-temple-grid/tr-04-temple-grid-back.webp",
        srcSet: "/images/products/tr-04-temple-grid/tr-04-temple-grid-back.webp 1122w, /images/products/tr-04-temple-grid/tr-04-temple-grid-back-800w.webp 800w, /images/products/tr-04-temple-grid/tr-04-temple-grid-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Temple Grid — Longline Tunic Rear View",
        label: "Back View"
      }
    ]
  },
  "tr-05": {
    id: "tr-05",
    slug: "moonveil-sheer-embroidered-overlay",
    title: "Moonveil — Sheer Embroidered Overlay",
    primary: {
      src: "/images/products/tr-05-moonveil/tr-05-moonveil-primary.webp",
      srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-primary.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-primary-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Moonveil — Sheer Embroidered Overlay — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-05-moonveil/tr-05-moonveil-detail.webp",
      srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-detail.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-detail-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Moonveil — Sheer Embroidered Overlay — Chikankari Shadow-Work Detail",
      label: "Chikankari Shadow-Work Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-05-moonveil/tr-05-moonveil-primary.webp",
        srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-primary.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-primary-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Moonveil — Sheer Embroidered Overlay — Primary View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-05-moonveil/tr-05-moonveil-detail.webp",
        srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-detail.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-detail-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Moonveil — Delicate Bakhiya Shadow-Work on Sheer Mulmul",
        label: "Chikankari Embroidery Detail"
      },
      {
        src: "/images/products/tr-05-moonveil/tr-05-moonveil-overlay-slip-detail.webp",
        srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-overlay-slip-detail.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-overlay-slip-detail-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-overlay-slip-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Moonveil — Sheer Overlay with Silk Slip Layering",
        label: "Overlay & Slip Layering"
      },
      {
        src: "/images/products/tr-05-moonveil/tr-05-moonveil-three-quarter.webp",
        srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-three-quarter.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-three-quarter-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Moonveil — Three-Quarter Angle",
        label: "Profile View"
      },
      {
        src: "/images/products/tr-05-moonveil/tr-05-moonveil-editorial-seated.webp",
        srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-editorial-seated.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-editorial-seated-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Moonveil — Seated Architectural Composition",
        label: "Editorial Seated"
      },
      {
        src: "/images/products/tr-05-moonveil/tr-05-moonveil-back.webp",
        srcSet: "/images/products/tr-05-moonveil/tr-05-moonveil-back.webp 1122w, /images/products/tr-05-moonveil/tr-05-moonveil-back-800w.webp 800w, /images/products/tr-05-moonveil/tr-05-moonveil-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Moonveil — Embroidered Back View",
        label: "Back View"
      }
    ]
  },
  "tr-06": {
    id: "tr-06",
    slug: "indigo-orbit-geometric-overshirt-and-trouser-co-ord",
    title: "Indigo Orbit — Geometric Overshirt & Trouser Co-ord",
    primary: {
      src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary.webp",
      srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1127,
      height: 1396,
      alt: "Indigo Orbit — Geometric Overshirt & Trouser Co-ord — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail.webp",
      srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1127,
      height: 1396,
      alt: "Indigo Orbit — Geometric Overshirt & Trouser Co-ord — Ajrakh Resist-Block Detail",
      label: "Ajrakh Resist-Block Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary.webp",
        srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1127,
        height: 1396,
        alt: "Indigo Orbit — Overshirt & Trouser Co-ord — Primary View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail.webp",
        srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1127,
        height: 1396,
        alt: "Indigo Orbit — Natural Indigo Resist Block-Print Motif",
        label: "Ajrakh Star-Grid Detail"
      },
      {
        src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-signature-detail.webp",
        srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-signature-detail.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-signature-detail-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-signature-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1127,
        height: 1396,
        alt: "Indigo Orbit — Hand-Carved Teak Block Print Alignment",
        label: "Teak Block Print Craft"
      },
      {
        src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-three-quarter.webp",
        srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-three-quarter.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-three-quarter-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1127,
        height: 1396,
        alt: "Indigo Orbit — Three-Quarter Angle",
        label: "Profile View"
      },
      {
        src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-editorial-seated.webp",
        srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-editorial-seated.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-editorial-seated-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1127,
        height: 1396,
        alt: "Indigo Orbit — Relaxed Trouser Drape",
        label: "Editorial Seated"
      },
      {
        src: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-back.webp",
        srcSet: "/images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-back.webp 1127w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-back-800w.webp 800w, /images/products/tr-06-indigo-orbit/tr-06-indigo-orbit-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1127,
        height: 1396,
        alt: "Indigo Orbit — Back Panel Line",
        label: "Back View"
      }
    ]
  },
  "tr-07": {
    id: "tr-07",
    slug: "tidal-bind-sculpted-cape-dress",
    title: "Tidal Bind — Sculpted Cape Dress",
    primary: {
      src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary.webp",
      srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Tidal Bind — Sculpted Cape Dress — Primary View",
      label: "Primary View"
    },
    macro: {
      src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail.webp",
      srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail-400w.webp 400w",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      width: 1122,
      height: 1402,
      alt: "Tidal Bind — Sculpted Cape Dress — Bandhani Micro-Resist Detail",
      label: "Bandhani Micro-Resist Detail"
    },
    gallery: [
      {
        src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary.webp",
        srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-primary-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Tidal Bind — Sculpted Cape Dress — Primary View",
        label: "Primary View"
      },
      {
        src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail.webp",
        srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-detail-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Tidal Bind — Fine Bandhani Micro-Resist Dyeing on Silk",
        label: "Bandhani Knot Detail"
      },
      {
        src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-three-quarter.webp",
        srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-three-quarter.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-three-quarter-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-three-quarter-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Tidal Bind — Sculpted Cape Silhouette Profile",
        label: "Cape Profile"
      },
      {
        src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-editorial-seated.webp",
        srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-editorial-seated.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-editorial-seated-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-editorial-seated-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Tidal Bind — Seated Architectural Composition",
        label: "Editorial Seated"
      },
      {
        src: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-back.webp",
        srcSet: "/images/products/tr-07-tidal-bind/tr-07-tidal-bind-back.webp 1122w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-back-800w.webp 800w, /images/products/tr-07-tidal-bind/tr-07-tidal-bind-back-400w.webp 400w",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        width: 1122,
        height: 1402,
        alt: "Tidal Bind — Cape Dress Rear Line",
        label: "Back View"
      }
    ]
  }
};

export const DIAGRAM_ASSETS: Record<string, DiagramAsset> = {
  "library-block-printing-process-01": {
    "id": "library-block-printing-process-01",
    "title": "Block Printing Process",
    "svg": "/images/weave-library/diagrams/library-block-printing-process-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-block-printing-process-01.png",
    "description": "Technical drafting sequence of traditional relief block printing: hand-carved teakwood blocks, mineral and harda mordant application, fermented mud resist (dabu) immersion, and natural alizarin and indigo vat fixing."
  },
  "library-double-ikat-process-01": {
    "id": "library-double-ikat-process-01",
    "title": "Double Ikat Process",
    "svg": "/images/weave-library/diagrams/library-double-ikat-process-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-double-ikat-process-01.png",
    "description": "Mathematical calculation schematic for double-ikat resist: independent tie-dye binding of warp and weft yarns prior to loom dressing, intersecting with microscopic geometric accuracy on the loom frame."
  },
  "library-embroidery-weaving-comparison-01": {
    "id": "library-embroidery-weaving-comparison-01",
    "title": "Embroidery Weaving Comparison",
    "svg": "/images/weave-library/diagrams/library-embroidery-weaving-comparison-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-embroidery-weaving-comparison-01.png",
    "description": "Comparative structural cross-section contrasting loom-integrated yarn interlacings with needlework surface relief (such as single-strand sozni and shadow-work chikankari) anchored to woven grounds."
  },
  "library-garment-construction-01": {
    "id": "library-garment-construction-01",
    "title": "Garment Construction",
    "svg": "/images/weave-library/diagrams/library-garment-construction-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-garment-construction-01.png",
    "description": "Architectural tailoring draft demonstrating floating horsehair canvas interfacing, silk organza edge taping, double-rhombus diamond underarm gussets, and generous 1.5-inch concealed expansion inlays."
  },
  "library-resist-dyeing-process-01": {
    "id": "library-resist-dyeing-process-01",
    "title": "Resist Dyeing Process",
    "svg": "/images/weave-library/diagrams/library-resist-dyeing-process-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-resist-dyeing-process-01.png",
    "description": "Artisanal tie-dye mechanics illustrating micro-point cloth pinching with fingernail plectrums (nakhla), continuous waxed filament binding, and high-contrast vat resist dye penetration."
  },
  "library-technique-comparison-01": {
    "id": "library-technique-comparison-01",
    "title": "Technique Comparison",
    "svg": "/images/weave-library/diagrams/library-technique-comparison-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-technique-comparison-01.png",
    "description": "Comparative analysis of discontinuous interlocking tapestry weft (dhada) methods versus continuous shuttle brocading, highlighting reverse-face finishing and multi-tone dhoop-chhaon luster."
  },
  "library-textile-to-garment-sequence-01": {
    "id": "library-textile-to-garment-sequence-01",
    "title": "Textile To Garment Sequence",
    "svg": "/images/weave-library/diagrams/library-textile-to-garment-sequence-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-textile-to-garment-sequence-01.png",
    "description": "Comprehensive lineage flow tracing raw sericulture and botanical harvesting through hand-spinning, warp dressing, loom weaving, and anatomical zero-waste pattern drafting."
  },
  "library-textile-vocabulary-01": {
    "id": "library-textile-vocabulary-01",
    "title": "Textile Vocabulary",
    "svg": "/images/weave-library/diagrams/library-textile-vocabulary-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-textile-vocabulary-01.png",
    "description": "Foundational anatomical glossary identifying warp tension, weft insertion, reinforced selvedge boundaries, 45-degree true bias lines, and structural grain orientation."
  },
  "library-warp-weft-diagram-01": {
    "id": "library-warp-weft-diagram-01",
    "title": "Warp Weft Diagram",
    "svg": "/images/weave-library/diagrams/library-warp-weft-diagram-01.svg",
    "fallbackPng": "/images/weave-library/diagrams/fallback/library-warp-weft-diagram-01.png",
    "description": "Archival educational schematic illustrating foundational weave geometry and thread interlacing taxonomy: demonstrating the perpendicular interlacing of longitudinal warp tension threads and transverse weft shuttles across reed and heddle sheds."
  }
};

export const getProductAssetRecord = (productIdOrSlug: string): ProductAssetRecord | undefined => {
  if (PRODUCT_ASSET_MAP[productIdOrSlug]) {
    return PRODUCT_ASSET_MAP[productIdOrSlug];
  }
  return Object.values(PRODUCT_ASSET_MAP).find(
    p => p.slug === productIdOrSlug || (productIdOrSlug === 'the-sylvan-mulberry-silk-trench' && p.id === 'et-01')
  );
};

export const getProductPrimaryImage = (productIdOrSlug: string): ResponsiveImage => {
  const rec = getProductAssetRecord(productIdOrSlug);
  if (rec) return rec.primary;
  return {
    src: '/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp',
    srcSet: '',
    sizes: '100vw',
    width: 1374,
    height: 1145,
    alt: 'EverThread Heirloom'
  };
};

export const getProductGallery = (productIdOrSlug: string): ResponsiveImage[] => {
  const rec = getProductAssetRecord(productIdOrSlug);
  return rec ? rec.gallery : [];
};

/* ==========================================================================
   Phase 6.3.2.2: Immersive Textile Exhibition — 13-Tradition Archive Asset Map
   ========================================================================== */

export const TRADITION_ROLE_CONFIG: Record<TraditionImageRole, { label: string; purpose: string }> = {
  'model-01': { label: 'Model / Garment', purpose: 'Primary silhouette or garment view' },
  'model-02': { label: 'Alternate View', purpose: 'Secondary model or garment view' },
  'drape-03': { label: 'Drape & Movement', purpose: 'Shape, fall, or movement' },
  'stilllife-04': { label: 'Textile Still Life', purpose: 'Material arranged as an object' },
  'macro-05': { label: 'Weave Detail', purpose: 'Weave, surface, embroidery, or fine detail' },
  'process-06': { label: 'Process & Making', purpose: 'Tools, process, or making context' }
};

export const TRADITION_METADATA: Record<string, {
  slug: string;
  title: string;
  region: string;
  distinction: 'weaving' | 'embroidery' | 'printing' | 'dyeing';
  technique: string;
  fiber: string;
  warpDensity: string;
  structuralProfile: string;
  diagramId?: string;
}> = {
  'ajrakh': {
    slug: 'kutch-ajrakh-resist',
    title: 'Kutch Ajrakh Double-Sided Resist',
    region: 'Ajrakhpur & Dhamadka, Kutch, Gujarat',
    distinction: 'dyeing',
    technique: '16-stage mud resist, indigo and harda mordant block printing',
    fiber: 'Natural Indigo and Mineral Mordants on Fine Cotton',
    warpDensity: 'Double-Sided Block Resist on Cotton Ground',
    structuralProfile: 'Double-face penetration, nocturnal geometric symmetry',
    diagramId: 'library-block-printing-process-01'
  },
  'bagru': {
    slug: 'bagru-madder-dyeing',
    title: 'Bagru Natural Madder & Dabu Resist',
    region: 'Bagru, Rajasthan',
    distinction: 'dyeing',
    technique: 'Mud resist (dabu) and fermented botanical root vat infusion',
    fiber: 'Natural Madder Root Dye on Unbleached Cotton',
    warpDensity: 'Hand-Block Dabu Resist on Cotton Ground',
    structuralProfile: 'Natural color penetration, earthy aroma, graceful patina aging',
    diagramId: 'library-block-printing-process-01'
  },
  'banarasi-brocade': {
    slug: 'varanasi-kadwa',
    title: 'Varanasi Kadwa Jacquard',
    region: 'Varanasi, Uttar Pradesh',
    distinction: 'weaving',
    technique: 'Interlocking discontinuous weft brocade',
    fiber: 'Traditional Handloom Silk with Brocade Zari',
    warpDensity: 'Traditional Handloom Sett',
    structuralProfile: 'Heavier weight, ceremonial durability, zero snag reverse',
    diagramId: 'library-warp-weft-diagram-01'
  },
  'bandhani': {
    slug: 'gujarat-bandhani-tie-dye',
    title: 'Kutch & Jamnagar Bandhani',
    region: 'Jamnagar & Bhuj, Gujarat',
    distinction: 'dyeing',
    technique: 'Micro-point knotting with waxed fingernail point (nakhla)',
    fiber: 'Traditional Gaji Silk with Natural Botanical Dyes',
    warpDensity: 'High-Density Hand-Plucked Micro-Resist',
    structuralProfile: 'Three-dimensional crinkled surface, dotted celestial clusters',
    diagramId: 'library-resist-dyeing-process-01'
  },
  'chikankari': {
    slug: 'kutch-ari-embroidery',
    title: 'Lucknow Chikankari Needlework',
    region: 'Lucknow, Uttar Pradesh',
    distinction: 'embroidery',
    technique: 'Hand-stitched shadow-work (bakhiya) and pulled-thread fretwork (jali)',
    fiber: 'Fine untwisted cotton threads on gossamer muslin',
    warpDensity: 'Surface needlework',
    structuralProfile: 'Diaphanous relief, opaque shadow play on translucent ground',
    diagramId: 'library-embroidery-weaving-comparison-01'
  },
  'kanchipuram-silk': {
    slug: 'kanchipuram-korvai-temple',
    title: 'Kanchipuram Korvai Temple Silk',
    region: 'Kanchipuram, Tamil Nadu',
    distinction: 'weaving',
    technique: 'Three-shuttle interlocking joint with traditional zari',
    fiber: 'Double-Warp Handloom Silk with Metallic Zari',
    warpDensity: 'Heavyweight Triple-Ply Handloom Sett',
    structuralProfile: 'Sculptural stiffness, high weight, ceremonial grandeur',
    diagramId: 'library-warp-weft-diagram-01'
  },
  'kashmiri-sozni': {
    slug: 'changthangi-pashmina',
    title: 'Kashmiri Sozni on Changthangi Pashmina',
    region: 'Changthang Plateau & Kashmir Valley',
    distinction: 'embroidery',
    technique: 'Single-strand fine needle sozni needlework on hand-spun twill',
    fiber: 'Hand-Spun Cashmere Ground with Silk Needlework',
    warpDensity: 'Hand-Spun Fine Twill Sett',
    structuralProfile: 'Plush loft, cloud softness, thermal insulation',
    diagramId: 'library-embroidery-weaving-comparison-01'
  },
  'kota-doria': {
    slug: 'chanderi-handloom',
    title: 'Chanderi & Kota Doria Sheer Weave',
    region: 'Chanderi (MP) & Kota (Rajasthan)',
    distinction: 'weaving',
    technique: 'Extra-weft sheer plain weave with square khat grids',
    fiber: 'Handloom Silk Warp with Fine Cotton Weft',
    warpDensity: 'Traditional Khat Square Open Sett',
    structuralProfile: 'Sheer, lightweight, micro-pleat memory',
    diagramId: 'library-warp-weft-diagram-01'
  },
  'muga-silk': {
    slug: 'assam-wild-silk-twill',
    title: 'Assam Muga Wild Silk Twill',
    region: 'Brahmaputra Valley, Assam',
    distinction: 'weaving',
    technique: 'Continuous diagonal ridge twill weave on bamboo looms',
    fiber: 'Wild Assam Muga Silk (Antheraea assamensis)',
    warpDensity: 'Traditional Diagonal Ridge Twill Sett',
    structuralProfile: 'Natural golden luster, high tensile stamina, shape retention',
    diagramId: 'library-warp-weft-diagram-01'
  },
  'paithani-silk': {
    slug: 'maharashtra-paithani-tapestry',
    title: 'Paithani Tapestry Silk',
    region: 'Paithan & Yeola, Maharashtra',
    distinction: 'weaving',
    technique: 'Discontinuous interlocking weft tapestry weave (dhada)',
    fiber: 'Fine Filature Silk Warp with Traditional Brocade Zari',
    warpDensity: 'Interlocking Tapestry Weft Handloom Sett',
    structuralProfile: 'Luminous dual-tone dhoop-chhaon luster, seamless reverse',
    diagramId: 'library-technique-comparison-01'
  },
  'patan-patola': {
    slug: 'gujarat-patan-patola-double-ikat',
    title: 'Patan Patola Double-Ikat',
    region: 'Patan, Gujarat',
    distinction: 'weaving',
    technique: 'Exact mathematical double-ikat tie-dye resist on warp and weft',
    fiber: 'Multi-Ply Handloom Silk with Natural Botanical Dyes',
    warpDensity: 'Balanced Double-Ikat Plain-Weave Sett',
    structuralProfile: 'Identical dual-face clarity, indestructible dye bond',
    diagramId: 'library-double-ikat-process-01'
  },
  'pochampally-ikat': {
    slug: 'telangana-pochampally-ikat',
    title: 'Pochampally Tie-Dye Ikat',
    region: 'Bhoodan Pochampally, Telangana',
    distinction: 'weaving',
    technique: 'Transfer-frame warp and weft ikat resisted in natural vats',
    fiber: 'Fine Cotton Warp with Wild Tussar Silk Weft',
    warpDensity: 'Traditional Ikat Handloom Sett',
    structuralProfile: 'Feathery geometric edge, tactile cotton-silk breathability',
    diagramId: 'library-double-ikat-process-01'
  },
  'sambalpuri-ikat': {
    slug: 'odisha-sambalpuri-bandha',
    title: 'Sambalpuri Bandha Curvilinear Ikat',
    region: 'Sambalpur & Bargarh, Odisha',
    distinction: 'weaving',
    technique: 'Curvilinear tie-dye bandha weaving on pit looms',
    fiber: 'Wild Tussar Silk and Hand-Spun Cotton',
    warpDensity: 'Pit-Loom Bandha Handloom Sett',
    structuralProfile: 'Organic curvilinear lines, rustic earth luster',
    diagramId: 'library-warp-weft-diagram-01'
  }
};

const buildArchiveAssetMap = (): Record<string, TraditionAssetRecord> => {
  const map: Record<string, TraditionAssetRecord> = {};
  const archiveCatalog = (assetCatalog as { archive?: Record<string, Array<{
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
    alt: string;
  }>> }).archive || {};

  const roleOrder: TraditionImageRole[] = [
    'model-01',
    'model-02',
    'drape-03',
    'stilllife-04',
    'macro-05',
    'process-06'
  ];

  for (const [folderKey, meta] of Object.entries(TRADITION_METADATA)) {
    const rawItems = archiveCatalog[folderKey] || [];
    const rolesRecord = {} as Record<TraditionImageRole, TraditionRoleItem>;

    for (const roleKey of roleOrder) {
      const match = rawItems.find(it => it.src.includes(roleKey));
      if (match) {
        const isLandscape = match.width > match.height;
        const config = TRADITION_ROLE_CONFIG[roleKey];
        rolesRecord[roleKey] = {
          ...match,
          role: roleKey,
          label: config.label,
          purpose: config.purpose,
          isLandscape,
          caption: `${meta.title} — ${config.label} (${match.width}×${match.height})`
        };
      }
    }

    const record: TraditionAssetRecord = {
      traditionKey: folderKey,
      slug: meta.slug,
      title: meta.title,
      region: meta.region,
      distinction: meta.distinction,
      technique: meta.technique,
      fiber: meta.fiber,
      warpDensity: meta.warpDensity,
      structuralProfile: meta.structuralProfile,
      diagramId: meta.diagramId,
      roles: rolesRecord
    };

    map[folderKey] = record;
    map[meta.slug] = record;
  }

  // Cultural and search aliases for direct accession
  if (map['kota-doria']) {
    map['chanderi'] = map['kota-doria'];
  }
  if (map['kashmiri-sozni']) {
    map['pashmina'] = map['kashmiri-sozni'];
  }

  return map;
};

export const ARCHIVE_ASSET_MAP: Record<string, TraditionAssetRecord> = buildArchiveAssetMap();

export const getTraditionAssets = (keyOrSlug: string): TraditionAssetRecord | undefined => {
  return ARCHIVE_ASSET_MAP[keyOrSlug];
};

export const getAllTraditionAssets = (): TraditionAssetRecord[] => {
  const seen = new Set<string>();
  const list: TraditionAssetRecord[] = [];
  for (const record of Object.values(ARCHIVE_ASSET_MAP)) {
    if (!seen.has(record.traditionKey)) {
      seen.add(record.traditionKey);
      list.push(record);
    }
  }
  return list;
};


export const TECHNIQUE_STRIP_DIAGRAM_IDS = [
  'library-warp-weft-diagram-01',
  'library-textile-vocabulary-01',
  'library-technique-comparison-01',
  'library-embroidery-weaving-comparison-01',
  'library-resist-dyeing-process-01',
  'library-double-ikat-process-01',
  'library-block-printing-process-01',
  'library-garment-construction-01',
  'library-textile-to-garment-sequence-01',
] as const;

export function getPlateCaption(record: TraditionAssetRecord, role: TraditionImageRole): string {
  const roleItem = record.roles[role];
  const roleLabel = roleItem?.label || role;
  return `${record.title} — ${roleLabel}`;
}
