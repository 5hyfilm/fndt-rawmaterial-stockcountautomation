// src/hooks/types.ts

// =========================================
// 📚 Hook Type Re-exports
// =========================================

export * from "../types/detection";
export * from "../types/canvas";
export * from "../types/barcode";

// ⭐ Product types now re-exported from central location
export type {
  Product,
  NutritionInfo,
  ProductSearchParams,
  ProductResponse,
  ProductListResponse,
  DebugInfo,
  BarcodeValidationResult,
  ProductInfoConfig,
  FetchProductOptions,
  ProductCacheEntry,
  ProductCacheStats,
  UseProductInfoReturn,
  UseProductCacheProps,
  UseProductFetcherProps,
  UseProductCacheReturn,
  UseProductFetcherReturn,
  UseProductValidatorReturn,
  ProductInfoError,
  ProductUnitType,
} from "../types/product";

export {
  BarcodeType,
  ProductCategory,
  ProductStatus,
  PRODUCT_UNIT_TYPES,
} from "../types/product";

// =========================================
// 🎯 Central Type Imports for Combined Types
// =========================================

import type { VideoConstraints } from "../types/camera";
import type { Detection, Stats } from "../types/detection";
import type { Product, ProductUnitType } from "../types/product";

// =========================================
// 🔗 Combined Hook Return Types
// =========================================

/**
 * Combined return type for useBarcodeDetection hook
 * ✅ UPDATED: Complete interface matching actual implementation
 */
export interface UseBarcodeDetectionReturn {
  // =========================================
  // 📚 Refs
  // =========================================
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;

  // =========================================
  // 🎥 Camera State & Actions
  // =========================================
  isStreaming: boolean;
  videoConstraints: VideoConstraints;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  setVideoConstraints: (constraints: VideoConstraints) => void;

  // =========================================
  // 🔦 Torch Control
  // =========================================
  torchOn: boolean;
  toggleTorch: () => void;

  // =========================================
  // 🔍 Detection State & Actions
  // =========================================
  detections: Detection[];
  processingQueue: number;
  stats: Stats;
  captureAndProcess: () => Promise<void>;
  resetDetections: () => void;
  lastDetectedCode: string;

  // =========================================
  // 🛒 Product Lookup State
  // =========================================
  product: Product | null;
  detectedBarcodeType: ProductUnitType | null;
  isLoadingProduct: boolean;
  productError: string | null;
  clearProduct: () => void;

  // =========================================
  // 🎨 Canvas Actions
  // =========================================
  drawDetections: () => void;
  updateCanvasSize: () => void;

  // =========================================
  // 🎛️ Enhanced Actions
  // =========================================
  manualScan: () => Promise<void>;
  rescanCurrentView: () => Promise<void>;
  restartForNextScan: () => void;

  // =========================================
  // 🚨 Error Handling
  // =========================================
  errors: string | null;
  clearError: () => void;
}

// =========================================
// ⚙️ Configuration Types
// =========================================

export interface BarcodeDetectionConfig {
  // Detection settings
  confidenceThreshold: number;
  maxDetections: number;
  processInterval: number;

  // Camera settings
  defaultVideoConstraints: VideoConstraints;

  // Product lookup settings
  enableProductLookup: boolean;
  cacheProducts: boolean;

  // Canvas settings
  enableCanvas: boolean;
  canvasSettings: {
    strokeColor: string;
    fillColor: string;
    lineWidth: number;
  };
}

// =========================================
// 🔄 Additional Hook Types (if needed)
// =========================================

export interface UseProductLookupReturn {
  product: Product | null;
  detectedBarcodeType: ProductUnitType | null;
  isLoadingProduct: boolean;
  productError: string | null;
  lastDetectedCode: string;
  updateBarcode: (barcode: string) => Promise<void>;
  clearProduct: () => void;
  clearCurrentDetection: () => void;
}
