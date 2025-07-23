// src/hooks/product/useProductCache.tsx
"use client";

import { useCallback, useRef } from "react";
import { Product } from "../../types/product";

interface ProductCacheEntry {
  product: Product;
  timestamp: number;
  expiresAt: number;
}

interface UseProductCacheProps {
  enabled: boolean;
  expiryMs: number;
}

interface UseProductCacheReturn {
  get: (barcode: string) => Product | null;
  set: (barcode: string, product: Product) => void;
  clear: () => void;
  remove: (barcode: string) => boolean;
  getStats: () => {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    cacheHitRate: number;
  };
}

export const useProductCache = ({
  enabled,
  expiryMs,
}: UseProductCacheProps): UseProductCacheReturn => {
  const cacheRef = useRef<Map<string, ProductCacheEntry>>(new Map());
  const statsRef = useRef({ hits: 0, misses: 0 });

  // Clean expired entries
  const cleanExpiredEntries = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    for (const [key, entry] of cacheRef.current.entries()) {
      if (now > entry.expiresAt) {
        cacheRef.current.delete(key);
      }
    }
  }, [enabled]);

  // Get product from cache
  const get = useCallback(
    (barcode: string): Product | null => {
      if (!enabled || !barcode) {
        statsRef.current.misses++;
        return null;
      }

      cleanExpiredEntries();

      const entry = cacheRef.current.get(barcode);
      const now = Date.now();

      if (entry && now <= entry.expiresAt) {
        statsRef.current.hits++;
        console.log("🎯 Cache hit for barcode:", barcode);
        return entry.product;
      }

      statsRef.current.misses++;
      if (entry) {
        // Remove expired entry
        cacheRef.current.delete(barcode);
        console.log("⏰ Cache expired for barcode:", barcode);
      }

      return null;
    },
    [enabled, cleanExpiredEntries]
  );

  // Set product in cache
  const set = useCallback(
    (barcode: string, product: Product) => {
      if (!enabled || !barcode || !product) return;

      const now = Date.now();
      const entry: ProductCacheEntry = {
        product,
        timestamp: now,
        expiresAt: now + expiryMs,
      };

      cacheRef.current.set(barcode, entry);
      console.log("💾 Cached product:", product.name, "for barcode:", barcode);

      // Clean up if cache gets too large
      if (cacheRef.current.size > 100) {
        cleanExpiredEntries();
      }
    },
    [enabled, expiryMs, cleanExpiredEntries]
  );

  // Clear entire cache
  const clear = useCallback(() => {
    cacheRef.current.clear();
    statsRef.current.hits = 0;
    statsRef.current.misses = 0;
    console.log("🗑️ Product cache cleared");
  }, []);

  // Remove specific entry
  const remove = useCallback((barcode: string): boolean => {
    return cacheRef.current.delete(barcode);
  }, []);

  // Get cache statistics
  const getStats = useCallback(() => {
    cleanExpiredEntries();

    const totalRequests = statsRef.current.hits + statsRef.current.misses;
    const cacheHitRate =
      totalRequests > 0 ? (statsRef.current.hits / totalRequests) * 100 : 0;

    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of cacheRef.current.values()) {
      if (now <= entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: cacheRef.current.size,
      validEntries,
      expiredEntries,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
    };
  }, [cleanExpiredEntries]);

  return {
    get,
    set,
    clear,
    remove,
    getStats,
  };
};
