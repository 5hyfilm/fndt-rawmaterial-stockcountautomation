// ./src/hooks/product/useProductInfo.tsx
"use client";

import { useState, useCallback } from "react";
import { Product } from "../../types/product";
import { useProductCache } from "./useProductCache";
import { useProductFetcher } from "./useProductFetcher";
import { useProductValidator } from "./useProductValidator";
import { ProductInfoConfig, UseProductInfoReturn } from "./types";

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

  // Main fetch function
  const fetchProductByBarcode = useCallback(
    async (barcode: string) => {
      if (!barcode.trim()) return;

      const normalizedBarcode = validator.normalizeBarcode(barcode);
      if (normalizedBarcode === lastSearchedBarcode) return;

      setIsLoading(true);
      setError(null);
      setLastSearchedBarcode(normalizedBarcode);

      try {
        // Check cache first
        if (config.enableCaching) {
          const cachedProduct = cache.get(normalizedBarcode);
          if (cachedProduct) {
            console.log("✅ Using cached product:", cachedProduct.name);
            setProduct(cachedProduct);
            setIsLoading(false);
            return;
          }
        }

        // Validate barcode
        const validation = validator.validateBarcode(normalizedBarcode);
        if (!validation.isValid) {
          setError(`รหัสสินค้าไม่ถูกต้อง: ${validation.errors.join(", ")}`);
          setProduct(null);
          setIsLoading(false);
          return;
        }

        // Fetch from API
        const result = await fetcher.fetchProduct(normalizedBarcode);

        if (result.success && result.data) {
          setProduct(result.data);

          // Cache the result
          if (config.enableCaching) {
            cache.set(normalizedBarcode, result.data);
          }
        } else {
          setProduct(null);
          setError(result.error || "ไม่พบข้อมูลสินค้า");
        }
      } catch (error: unknown) {
        setProduct(null);
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [lastSearchedBarcode, validator, cache, fetcher, config]
  );

  // Manual retry function
  const retryFetch = useCallback(() => {
    if (lastSearchedBarcode) {
      setLastSearchedBarcode("");
      fetchProductByBarcode(lastSearchedBarcode);
    }
  }, [lastSearchedBarcode, fetchProductByBarcode]);

  // Debounced update barcode
  const updateBarcode = useCallback(
    (barcode: string) => {
      const normalizedBarcode = validator.normalizeBarcode(barcode);
      const lastNormalized = validator.normalizeBarcode(lastSearchedBarcode);

      if (normalizedBarcode && normalizedBarcode !== lastNormalized) {
        setError(null);

        if (config.enableDebouncing) {
          const timeoutId = setTimeout(() => {
            fetchProductByBarcode(normalizedBarcode);
          }, config.debounceDelayMs);

          return () => clearTimeout(timeoutId);
        } else {
          fetchProductByBarcode(normalizedBarcode);
        }
      }
    },
    [fetchProductByBarcode, lastSearchedBarcode, validator, config]
  );

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
    clearCache: cache.clear,
    getCacheStats: cache.getStats,
  };
};
