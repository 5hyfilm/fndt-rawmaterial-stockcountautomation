// src/hooks/product/types.ts - Types for Product Info Hooks
import { Product } from "../../types/product";

// Barcode types enum
export enum BarcodeType {
  EAN13 = "EAN13",
  EAN8 = "EAN8",
  UPC_A = "UPC_A",
  UPC_E = "UPC_E",
  CODE128 = "CODE128",
  CODE39 = "CODE39",
  CODE93 = "CODE93",
  ITF = "ITF",
  GTIN = "GTIN",
  QR_CODE = "QR_CODE",
  UNKNOWN = "UNKNOWN",
}

// Configuration interfaces
export interface ProductInfoConfig {
  enableCaching: boolean;
  cacheExpiryMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  enableDebouncing: boolean;
  debounceDelayMs: number;
}

// Cache related types
export interface ProductCacheEntry {
  product: Product;
  timestamp: number;
  expiresAt: number;
}

export interface ProductCacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  cacheHitRate: number;
}

// Validation types
export interface BarcodeValidationResult {
  isValid: boolean;
  normalizedBarcode: string;
  detectedFormat?: BarcodeType;
  errors: string[];
  suggestions?: string[];
}

// Fetcher types
export interface FetchProductOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
}

// Main hook return type
export interface UseProductInfoReturn {
  // State
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  lastSearchedBarcode: string;
  retryCount: number;

  // Actions
  fetchProductByBarcode: (barcode: string) => Promise<void>;
  updateBarcode: (barcode: string) => void | (() => void);
  clearProduct: () => void;
  clearError: () => void;
  retryFetch: () => void;

  // Cache utilities
  clearCache: () => void;
  getCacheStats: () => ProductCacheStats;
}

// Hook props interfaces
export interface UseProductCacheProps {
  enabled: boolean;
  expiryMs: number;
}

export interface UseProductFetcherProps {
  retryAttempts: number;
  retryDelayMs: number;
  setRetryCount: (count: number) => void;
}

// Return type interfaces for sub-hooks
export interface UseProductCacheReturn {
  get: (barcode: string) => Product | null;
  set: (barcode: string, product: Product) => void;
  clear: () => void;
  remove: (barcode: string) => boolean;
  getStats: () => ProductCacheStats;
}

export interface UseProductFetcherReturn {
  fetchProduct: (
    barcode: string
  ) => Promise<import("../../types/product").ProductResponse>;
}

export interface UseProductValidatorReturn {
  normalizeBarcode: (barcode: string) => string;
  validateBarcode: (barcode: string) => BarcodeValidationResult;
  isValidBarcodeFormat: (barcode: string) => boolean;
  suggestBarcodeCorreections: (barcode: string) => string[];
  detectBarcodeType: (barcode: string) => BarcodeType;
}

// Error types
export interface ProductInfoError extends Error {
  code: "VALIDATION_ERROR" | "FETCH_ERROR" | "CACHE_ERROR" | "NETWORK_ERROR";
  retryable: boolean;
  barcode?: string;
}
