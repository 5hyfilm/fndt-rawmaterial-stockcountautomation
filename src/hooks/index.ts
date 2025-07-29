// Path: src/hooks/index.ts

// =========================================
// 🪝 Main Hooks
// =========================================
export * from "./useBarcodeDetection";
export { useEmployeeAuth } from "./useEmployeeAuth";
export { useInventoryManager } from "./useInventoryManager";
export { useLogoutConfirmation } from "./useLogoutConfirmation";

// =========================================
// 📚 Sub-module Hooks & Types
// =========================================
export * from "./camera/useCameraControl";
export { useDetectionProcessor } from "./detection/useDetectionProcessor";

// ✅ แทนที่ export * from "./product" ด้วย individual exports
export {
  useProductInfo,
  useProductInfo as useProductLookup,
} from "./product/useProductInfo";
export { useProductCache } from "./product/useProductCache";
export { useProductFetcher } from "./product/useProductFetcher";
export { useProductValidator } from "./product/useProductValidator";

export { useCanvasRenderer } from "./canvas/useCanvasRenderer";

// ✅ Individual inventory exports (แทน barrel export)
export { useInventoryStorage } from "./inventory/useInventoryStorage";
export { useInventoryOperations } from "./inventory/useInventoryOperations";
export { useInventorySummary } from "./inventory/useInventorySummary";
export { useInventoryExport } from "./inventory/useInventoryExport";

// =========================================
// 🎯 Explicit Exports from types.ts (No Conflicts)
// =========================================
export type {
  UseBarcodeDetectionReturn,
  BarcodeDetectionConfig,
} from "./types";
