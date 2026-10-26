import { CatalogueProduct } from './catalog.ts';

export interface BagItem {
  productId: string;
  variantId?: string;
  size: string;
  sizes?: Record<string, string>;
  color: string;
  quantity: number;
}

export type AddToBagResult =
  | { ok: true }
  | { ok: false; reason: 'unknown-product' | 'not-listed' | 'missing-size' };

export interface CartContextType {
  bag: BagItem[];
  bagCount: number;
  subtotal: number;
  formatPrice: (amount: number) => string;
  addToBag: (item: Omit<BagItem, 'quantity'> & { quantity?: number }) => AddToBagResult;
  removeFromBag: (indexOrVariantId: number | string) => void;
  updateQuantity: (indexOrVariantId: number | string, delta: number) => void;
  clearBag: () => void;
  getItemProduct: (productId: string) => CatalogueProduct | undefined;
}

export interface SavedContextType {
  saved: string[];
  savedCount: number;
  isSaved: (productId: string) => boolean;
  toggleSaved: (productId: string) => boolean;
  removeSaved: (productId: string) => void;
  clearSaved: () => void;
}
