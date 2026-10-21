import { Product } from './catalog.ts';

export interface BagItem {
  productId: string;
  variantId?: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CartContextType {
  bag: BagItem[];
  bagCount: number;
  subtotal: number;
  formatPrice: (amount: number) => string;
  addToBag: (item: Omit<BagItem, 'quantity'> & { quantity?: number }) => void;
  removeFromBag: (indexOrVariantId: number | string) => void;
  updateQuantity: (indexOrVariantId: number | string, delta: number) => void;
  clearBag: () => void;
  getItemProduct: (productId: string) => Product | undefined;
}

export interface SavedContextType {
  saved: string[];
  savedCount: number;
  isSaved: (productId: string) => boolean;
  toggleSaved: (productId: string) => boolean;
  removeSaved: (productId: string) => void;
  clearSaved: () => void;
}
