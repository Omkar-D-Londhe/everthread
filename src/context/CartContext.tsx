import React, { createContext, useContext, useState, useEffect } from 'react';
import { BagItem, CartContextType } from '../types/index.ts';
import { Product } from '../types/catalog.ts';
import { getProductById } from '../data/products.ts';

const STORAGE_KEY_BAG = 'everthread_bag_v2';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bag, setBag] = useState<BagItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BAG);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(item => {
            if (!item || typeof item !== 'object') return false;
            const hasValidId = typeof item.productId === 'string' && !!getProductById(item.productId);
            const hasValidQty = typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0;
            const hasValidSize = typeof item.size === 'string' && item.size.trim().length > 0;
            const hasValidColor = typeof item.color === 'string' && item.color.trim().length > 0;
            return hasValidId && hasValidQty && hasValidSize && hasValidColor;
          })
          .map(item => ({
            ...item,
            variantId: item.variantId || `${item.productId}-${item.color}-${item.size}`
          }));
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BAG, JSON.stringify(bag));
    } catch (e) {
      console.error('Failed to persist bag to localStorage', e);
    }
  }, [bag]);

  // Synchronize across browser tabs/storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BAG && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBag(
              parsed
                .filter(item => {
                  if (!item || typeof item !== 'object') return false;
                  const hasValidId = typeof item.productId === 'string' && !!getProductById(item.productId);
                  const hasValidQty = typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0;
                  const hasValidSize = typeof item.size === 'string' && item.size.trim().length > 0;
                  const hasValidColor = typeof item.color === 'string' && item.color.trim().length > 0;
                  return hasValidId && hasValidQty && hasValidSize && hasValidColor;
                })
                .map(item => ({
                  ...item,
                  variantId: item.variantId || `${item.productId}-${item.color}-${item.size}`
                }))
            );
          }
        } catch {
          // Ignore corrupt data from other storage events
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Derived count: sum of quantities
  const bagCount = bag.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Derived subtotal: strictly looked up from catalogue to prevent stale/tampered storage values
  const subtotal = bag.reduce((acc, item) => {
    const prod = getProductById(item.productId);
    return acc + (prod ? prod.price * (item.quantity || 1) : 0);
  }, 0);

  // Indian Rupee currency formatter
  const formatPrice = (amount: number): string => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const getItemProduct = (productId: string): Product | undefined => {
    return getProductById(productId);
  };

  const addToBag = (item: Omit<BagItem, 'quantity'> & { quantity?: number }) => {
    const prod = getProductById(item.productId);
    if (!prod) return; // Do not add unknown products

    const qtyToAdd = item.quantity && Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
    const selectedColor = item.color || (prod.colors[0] ? prod.colors[0].name : 'Signature');
    const selectedSize = item.size || (prod.sizes[0] ? prod.sizes[0] : 'Standard');
    const itemVariantId = item.variantId || `${item.productId}-${selectedColor}-${selectedSize}`;

    setBag(prev => {
      const existingIdx = prev.findIndex(
        p => p.productId === item.productId && p.size === selectedSize && p.color === selectedColor
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + qtyToAdd
        };
        return next;
      }
      return [
        ...prev,
        {
          productId: item.productId,
          variantId: itemVariantId,
          size: selectedSize,
          color: selectedColor,
          quantity: qtyToAdd
        }
      ];
    });
  };

  const removeFromBag = (target: number | string) => {
    setBag(prev => {
      if (typeof target === 'number') {
        return prev.filter((_, i) => i !== target);
      }
      return prev.filter(item => item.variantId !== target && `${item.productId}-${item.color}-${item.size}` !== target);
    });
  };

  const updateQuantity = (target: number | string, delta: number) => {
    setBag(prev => {
      const index = typeof target === 'number' 
        ? target 
        : prev.findIndex(item => item.variantId === target || `${item.productId}-${item.color}-${item.size}` === target);
      if (index < 0 || index >= prev.length) return prev;
      const current = prev[index];
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index] = { ...current, quantity: newQty };
      return next;
    });
  };

  const clearBag = () => {
    setBag([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        bag, 
        bagCount, 
        subtotal, 
        formatPrice, 
        addToBag, 
        removeFromBag, 
        updateQuantity, 
        clearBag, 
        getItemProduct 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
