// Path: src/types/product.ts
// 🎯 Consolidated Product Type Definitions - Single Source of Truth
// All product-related types unified in one location

import React from "react";

// =========================================
// 🏷️ Core Product Types
// =========================================

export interface Product {
  id: string;
  barcode: string;
  name: string;
  name_en?: string;
  category: ProductCategory;
  brand: string;
  description?: string;
  size?: string;
  unit?: string;
  price?: number;
  currency?: string;
  sku?: string;
  batch_number?: string;
  expiry_date?: string;
  manufacturing_date?: string;
  nutrition_info?: NutritionInfo;
  ingredients?: string[];
  allergens?: string[];
  storage_instructions?: string;
  country_of_origin?: string;
  barcode_type?: string;
  image_url?: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface NutritionInfo {
  serving_size?: string;
  calories_per_serving?: number;
  protein?: number;
  carbohydrates?: number;
  sugar?: number;
  fat?: number;
  saturated_fat?: number;
  sodium?: number;
  fiber?: number;
  vitamin_c?: number;
  calcium?: number;
}

export enum ProductCategory {
  // ✅ Product Groups
  STM = "STM", // Sterilized Milk
  BB_GOLD = "BB_GOLD", // Bear Brand Gold
  EVAP = "EVAP", // Evaporated
  SBC = "SBC", // Sweetened Beverage Creamer
  SCM = "SCM", // Sweetened Condensed Milk
  MAGNOLIA_UHT = "MAGNOLIA_UHT", // Magnolia UHT
  NUTRISOY = "NUTRISOY", // Nutriwell
  GUMMY = "GUMMY", // Gummy candy

  // ✅ General Categories
  BEVERAGES = "beverages",
  DAIRY = "dairy",
  SNACKS = "snacks",
  CANNED_FOOD = "canned_food",
  INSTANT_NOODLES = "instant_noodles",
  SAUCES = "sauces",
  SEASONING = "seasoning",
  FROZEN = "frozen",
  BAKERY = "bakery",
  CONFECTIONERY = "confectionery",
  OTHER = "other",
}

export enum ProductStatus {
  ACTIVE = "active",
  DISCONTINUED = "discontinued",
  OUT_OF_STOCK = "out_of_stock",
  PENDING = "pending",
}

// =========================================
// 📊 API Response Types
// =========================================

export interface ProductSearchParams {
  barcode?: string;
  name?: string;
  category?: ProductCategory;
  brand?: string;
  status?: ProductStatus;
  limit?: number;
  offset?: number;
}

export interface DebugInfo {
  searchedBarcode?: string;
  cleanBarcode?: string;
  availableBarcodes?: string[];
  timestamp?: number;
  processingTime?: number;
  source?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
  debug?: DebugInfo;
}

export interface ProductListResponse {
  success: boolean;
  data?: Product[];
  total?: number;
  error?: string;
  stats?: {
    totalProducts: number;
    activeProducts: number;
    categories: number;
    brands: number;
  };
}

// =========================================
// 🏷️ Barcode Types (moved from hooks)
// =========================================

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

export interface BarcodeValidationResult {
  isValid: boolean;
  normalizedBarcode: string;
  detectedFormat?: BarcodeType;
  errors: string[];
  suggestions?: string[];
}

// =========================================
// ⚙️ Product Configuration Types
// =========================================

export interface ProductInfoConfig {
  enableCaching: boolean;
  cacheExpiryMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  enableDebouncing: boolean;
  debounceDelayMs: number;
}

export interface FetchProductOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
}

// =========================================
// 💾 Cache Types
// =========================================

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

// =========================================
// 🎯 Hook Types
// =========================================

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

export interface UseProductCacheProps {
  enabled: boolean;
  expiryMs: number;
}

export interface UseProductFetcherProps {
  retryAttempts: number;
  retryDelayMs: number;
  setRetryCount: (count: number) => void;
}

export interface UseProductCacheReturn {
  get: (barcode: string) => Product | null;
  set: (barcode: string, product: Product) => void;
  clear: () => void;
  remove: (barcode: string) => boolean;
  getStats: () => ProductCacheStats;
}

export interface UseProductFetcherReturn {
  fetchProduct: (barcode: string) => Promise<ProductResponse>;
}

export interface UseProductValidatorReturn {
  normalizeBarcode: (barcode: string) => string;
  validateBarcode: (barcode: string) => BarcodeValidationResult;
  isValidBarcodeFormat: (barcode: string) => boolean;
  suggestBarcodeCorreections: (barcode: string) => string[];
  detectBarcodeType: (barcode: string) => BarcodeType;
}

// =========================================
// 🚫 Error Types
// =========================================

export interface ProductInfoError extends Error {
  code: "VALIDATION_ERROR" | "FETCH_ERROR" | "CACHE_ERROR" | "NETWORK_ERROR";
  retryable: boolean;
  barcode?: string;
}

// =========================================
// 🧩 Component Props Types
// =========================================

export interface BaseProductComponentProps {
  product: Product;
}

export interface ProductInfoMainProps {
  product: Product | null;
  barcode?: string;
  isLoading?: boolean;
  error?: string;
  onAddToInventory?: (product: Product, quantity: number) => boolean;
  currentInventoryQuantity?: number;
}

export interface InventoryActionProps {
  product: Product;
  onAddToInventory: (product: Product, quantity: number) => boolean;
  currentInventoryQuantity: number;
}

export interface BarcodeDisplayProps {
  barcode: string;
  scannedBarcode?: string;
  onCopy?: () => void;
  copied?: boolean;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

// =========================================
// 🔢 Quantity & Controls Types
// =========================================

export interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  unit?: string;
}

// =========================================
// 🍎 Nutrition Types
// =========================================

export interface NutritionItem {
  label: string;
  value: number | undefined;
  unit: string;
}

export interface NutritionDisplayProps {
  nutritionData: NutritionItem[];
  servingSize?: string;
}

// =========================================
// 🎨 Display & Styling Types
// =========================================

export interface CategoryStyling {
  icon: React.ReactNode;
  colorClass: string;
}

export interface ProductDisplayOptions {
  showPrice?: boolean;
  showNutrition?: boolean;
  showDetails?: boolean;
  showInventoryActions?: boolean;
  compactMode?: boolean;
}

// =========================================
// ✅ All Types Exported Above
// =========================================

// All product types are now consolidated in this single file
// Types are exported individually throughout the file - no need for re-exports

export type ProductUnitType = "ea" | "dsp" | "cs";

export const PRODUCT_UNIT_TYPES = {
  EA: "ea" as const, // Each (ชิ้น)
  DSP: "dsp" as const, // Display Pack (แพ็ค)
  CS: "cs" as const, // Case/Carton (ลัง)
} as const;

export interface ProductUnitInfo {
  type: ProductUnitType;
  label: string;
  shortLabel: string;
  description: string;
}

export const PRODUCT_UNIT_CONFIG: Record<ProductUnitType, ProductUnitInfo> = {
  ea: {
    type: "ea",
    label: "ชิ้น",
    shortLabel: "EA",
    description: "หน่วยละชิ้น",
  },
  dsp: {
    type: "dsp",
    label: "แพ็ค",
    shortLabel: "DSP",
    description: "หน่วยแพ็ค/ห่อ",
  },
  cs: {
    type: "cs",
    label: "ลัง",
    shortLabel: "CS",
    description: "หน่วยลัง/กล่อง",
  },
};
