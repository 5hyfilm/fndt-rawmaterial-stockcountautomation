// Path: src/hooks/product/useProductInfo.tsx
// 🔧 Fixed Import - Types now from central location

"use client";

import { useState, useCallback } from "react";
import {
  Product,
  ProductInfoConfig,
  UseProductInfoReturn,
} from "../../types/product"; // ✅ FIXED: Import from central location
import { useProductCache } from "./useProductCache";
import { useProductFetcher } from "./useProductFetcher";
import { useProductValidator } from "./useProductValidator";

const DEFAULT_CONFIG: ProductInfoConfig = {
  enableCaching: true,
  cacheExpiryMs: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelayMs: 1000,
  enableDebouncing: true,
  debounceDelayMs: 300,
};

// Define proper error type instead of using any
interface ProductInfoError {
  message: string;
  name?: string;
  code?: string;
  cause?: unknown;
}

// Type guard to check if error has message property
const isErrorWithMessage = (error: unknown): error is ProductInfoError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
};

export const useProductInfo = (
  config: ProductInfoConfig = DEFAULT_CONFIG
): UseProductInfoReturn => {
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedBarcode, setLastSearchedBarcode] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

  // Sub-hooks
  const cache = useProductCache({
    enabled: config.enableCaching,
    expiryMs: config.cacheExpiryMs,
  });

  const fetcher = useProductFetcher({
    retryAttempts: config.retryAttempts,
    retryDelayMs: config.retryDelayMs,
    setRetryCount,
  });

  const validator = useProductValidator();

  // Clear product info
  const clearProduct = useCallback(() => {
    setProduct(null);
    setError(null);
    setLastSearchedBarcode("");
    setRetryCount(0);
  }, []);

  // Clear error only
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch product by barcode
  const fetchProductByBarcode = useCallback(
    async (barcode: string) => {
      if (!barcode) return;

      try {
        setIsLoading(true);
        setError(null);
        setLastSearchedBarcode(barcode);

        // Validate barcode first
        const validation = validator.validateBarcode(barcode);
        if (!validation.isValid) {
          throw new Error(`Invalid barcode: ${validation.errors.join(", ")}`);
        }

        const normalizedBarcode = validator.normalizeBarcode(barcode);

        // Check cache first
        if (config.enableCaching) {
          const cachedProduct = cache.get(normalizedBarcode);
          if (cachedProduct) {
            setProduct(cachedProduct);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from API
        const response = await fetcher.fetchProduct(normalizedBarcode);

        if (response.success && response.data) {
          setProduct(response.data);

          // Cache the result
          if (config.enableCaching) {
            cache.set(normalizedBarcode, response.data);
          }
        } else {
          throw new Error(response.error || "Failed to fetch product");
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    },
    [validator, cache, fetcher, config.enableCaching]
  );

  // Update barcode (used by detection)
  const updateBarcode = useCallback(
    (barcode: string) => {
      if (barcode !== lastSearchedBarcode) {
        fetchProductByBarcode(barcode);
      }
    },
    [fetchProductByBarcode, lastSearchedBarcode]
  );

  // Retry fetch
  const retryFetch = useCallback(() => {
    if (lastSearchedBarcode) {
      fetchProductByBarcode(lastSearchedBarcode);
    }
  }, [fetchProductByBarcode, lastSearchedBarcode]);

  // Cache utilities
  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  const getCacheStats = useCallback(() => {
    return cache.getStats();
  }, [cache]);

  return {
    // State
    product,
    isLoading,
    error,
    lastSearchedBarcode,
    retryCount,

    // Actions
    fetchProductByBarcode,
    updateBarcode,
    clearProduct,
    clearError,
    retryFetch,

    // Cache utilities
    clearCache,
    getCacheStats,
  };
};
