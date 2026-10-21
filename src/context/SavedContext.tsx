import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavedContextType } from '../types/index.ts';
import { getProductById } from '../data/products.ts';

const STORAGE_KEY_SAVED = 'everthread_saved_v2';

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Validate each item is a string AND corresponds to an existing product in the catalog
        return parsed.filter(item => typeof item === 'string' && !!getProductById(item));
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(saved));
    } catch (e) {
      console.error('Failed to persist saved pieces to localStorage', e);
    }
  }, [saved]);

  // Synchronize across browser tabs/storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_SAVED && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSaved(parsed.filter(item => typeof item === 'string' && !!getProductById(item)));
          }
        } catch {
          // Ignore corrupt data from other storage events
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const savedCount = saved.length;

  const isSaved = (productId: string) => saved.includes(productId);

  const toggleSaved = (productId: string): boolean => {
    // Only toggle valid products
    if (!getProductById(productId)) return false;

    let nowSaved = false;
    setSaved(prev => {
      if (prev.includes(productId)) {
        nowSaved = false;
        return prev.filter(id => id !== productId);
      } else {
        nowSaved = true;
        return [...prev, productId];
      }
    });
    return nowSaved;
  };

  const removeSaved = (productId: string) => {
    setSaved(prev => prev.filter(id => id !== productId));
  };

  const clearSaved = () => {
    setSaved([]);
  };

  return (
    <SavedContext.Provider value={{ saved, savedCount, isSaved, toggleSaved, removeSaved, clearSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = (): SavedContextType => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
