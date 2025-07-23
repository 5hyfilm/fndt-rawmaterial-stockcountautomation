// src/hooks/product/index.ts - Export all product hooks
export * from "./useProductInfo";
export * from "./useProductCache";
export * from "./useProductFetcher";
export * from "./useProductValidator";
export * from "./types";

// Convenience exports for backward compatibility
export { useProductInfo as useProductLookup } from "./useProductInfo";

// Default configurations
export const DEFAULT_PRODUCT_CONFIG = {
  enableCaching: true,
  cacheExpiryMs: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelayMs: 1000,
  enableDebouncing: true,
  debounceDelayMs: 300,
};
