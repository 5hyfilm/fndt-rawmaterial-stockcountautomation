// Path: src/hooks/useInventoryManager.tsx - Fixed Import Exports (No Legacy Types)
"use client";

// ✅ FIXED: Export only existing types (ลบ LegacyInventoryItem ออกแล้ว)
export {
  // ✅ Core types (ไม่มี LegacyInventoryItem แล้ว)
  type InventoryItem,
  type InventorySummary,
  type EmployeeContext,
  type UseInventoryManagerReturn,
  type QuantityDetail,
  type MultiUnitQuantities,
  type QuantityInput,
  type StorageConfig,
  type ExportOptions,
} from "../types/inventory";

// ✅ Import the main hook from useInventoryManager.tsx
export { useInventoryManager } from "./inventory/useInventoryManager";

// ✅ Import additional utility hooks
export { useInventoryStorage } from "./inventory/useInventoryStorage";
export { useInventoryOperations } from "./inventory/useInventoryOperations";
export { useInventorySummary } from "./inventory/useInventorySummary";
export { useInventoryExport } from "./inventory/useInventoryExport";
