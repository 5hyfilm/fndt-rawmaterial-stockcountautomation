// Path: ./src/hooks/useInventoryManager.tsx
"use client";

// ✅ FIXED: Import and re-export types from the correct location (types.ts)
// ให้ import type จาก types.ts แทนที่จะ import จาก useInventoryManager ที่อาจจะไม่ได้ export
export {
  // ✅ Import types from types.ts (where they should be defined)
  type InventoryItem,
  type InventorySummary,
  type EmployeeContext,
  type UseInventoryManagerReturn,
  type QuantityDetail,
  type MultiUnitQuantities,
  type QuantityInput,
  type LegacyInventoryItem,
  type StorageConfig,
  type ExportOptions,
} from "./inventory/types";

// ✅ Import the main hook from useInventoryManager.tsx
export { useInventoryManager } from "./inventory/useInventoryManager";

// ✅ Import additional utility hooks
export {
  useInventoryStorage,
  useInventoryOperations,
  useInventorySummary,
  useInventoryExport, // ✅ เปิดใช้งานอีกครั้งหลังจากแก้ conflict แล้ว
} from "./inventory";
