// Path: src/hooks/inventory/types.ts - Phase 2: Fixed Interface Definition
import { Product } from "../../types/product";

// ✅ NEW: Multi-unit quantities interface (ไม่มี remainder แล้ว)
export interface MultiUnitQuantities {
  cs?: number; // ลัง
  dsp?: number; // แพ็ค
  ea?: number; // ชิ้น
}

// ✅ NEW: QuantityDetail interface for detailed quantity tracking
export interface QuantityDetail {
  cs: number; // ลัง
  dsp: number; // แพ็ค
  ea: number; // ชิ้น
  scannedType?: "cs" | "dsp" | "ea"; // ประเภทบาร์โค้ดที่สแกน
  isManualEdit?: boolean; // แก้ไขด้วยมือหรือไม่
  lastModified?: string; // เวลาที่แก้ไขล่าสุด
}

// ✅ NEW: Simplified quantity input (รองรับทั้งแบบเก่าและใหม่)
export type QuantityInput =
  | number
  | {
      quantity: number;
      unit: "cs" | "dsp" | "ea";
    }
  | QuantityDetail;

// ✅ Type guards for quantity input validation
export const isQuantityDetail = (
  input: QuantityInput
): input is QuantityDetail => {
  return (
    typeof input === "object" &&
    input !== null &&
    "cs" in input &&
    "dsp" in input &&
    "ea" in input
  );
};

export const isSimpleQuantity = (input: QuantityInput): input is number => {
  return typeof input === "number";
};

export const isUnitQuantity = (
  input: QuantityInput
): input is { quantity: number; unit: "cs" | "dsp" | "ea" } => {
  return (
    typeof input === "object" &&
    input !== null &&
    "quantity" in input &&
    "unit" in input &&
    !("cs" in input)
  );
};

// ✅ UPDATED: InventoryItem with multi-unit support
export interface InventoryItem {
  id: string;

  // ✅ Product identification (ใช้ materialCode เป็นหลัก)
  materialCode: string; // รหัสสินค้า (สำคัญ - ใช้รวม SKU)
  productName: string;
  brand: string;
  category: string;
  size: string;
  unit: string;

  // ✅ OLD: Keep for backward compatibility
  barcode: string; // บาร์โค้ดหลัก (primary)
  quantity: number; // จำนวนรวม (สำหรับ compatibility)

  // ✅ NEW: Multi-unit quantities (ไม่มี remainder)
  quantities: MultiUnitQuantities;

  // ✅ NEW: Optional detailed quantity tracking
  quantityDetail?: QuantityDetail;

  // ✅ Metadata
  lastUpdated: string;
  productData?: Product;
  addedBy?: string;
  branchCode?: string;
  branchName?: string;
  productGroup?: string;
  thaiDescription?: string;

  // ✅ Barcode tracking (เก็บประเภทบาร์โค้ดที่เคยสแกน)
  scannedBarcodes?: {
    cs?: string;
    dsp?: string;
    ea?: string;
  };

  // ✅ Legacy support
  barcodeType?: "cs" | "dsp" | "ea";
}

// ✅ NEW: Legacy inventory item interface for migration purposes
export interface LegacyInventoryItem {
  id: string;
  materialCode?: string;
  productName: string;
  brand: string;
  category: string;
  size: string;
  unit: string;
  barcode: string;
  quantity: number;
  lastUpdated?: string;
  productData?: Product;
  addedBy?: string;
  branchCode?: string;
  branchName?: string;
  productGroup?: string;
  thaiDescription?: string;
  barcodeType?: "cs" | "dsp" | "ea";
  // Note: quantities field will be missing in legacy items
}

// ✅ Inventory summary interface
export interface InventorySummary {
  totalItems: number;
  totalProducts: number;
  lastUpdate: string;
  categories: Record<string, number>;
  brands: Record<string, number>;
  quantityBreakdown?: {
    totalCS: number;
    totalDSP: number;
    totalEA: number;
    itemsWithMultipleUnits: number;
  };
}

// ✅ Employee context interface
export interface EmployeeContext {
  id: string;
  name: string;
  branchCode: string;
  branchName: string;
}

// ✅ Storage configuration
export interface StorageConfig {
  storageKey: string;
  versionKey: string;
  currentVersion: string;
}

// ✅ Export options
export interface ExportOptions {
  format: "csv" | "excel";
  includeMetadata: boolean;
  includeSummary: boolean;
  showUnitBreakdown?: boolean; // แสดงรายละเอียดหน่วยแยก columns
  exportFormat?: "wide" | "long"; // รูปแบบการ export (default: "wide")
  includeBrandInfo?: boolean; // รวมข้อมูล brand/category
  includeTotalColumn?: boolean; // รวม column จำนวนรวม
}

// ✅ Helper function: Get total quantity across all units
export const getTotalQuantityAllUnits = (item: InventoryItem): number => {
  if (!item.quantities) {
    return item.quantity || 0;
  }

  const { cs = 0, dsp = 0, ea = 0 } = item.quantities;
  return cs + dsp + ea;
};

// ✅ FIXED: Helper function with proper typing - no more 'any'
export const migrateOldInventoryItem = (
  oldItem: LegacyInventoryItem | InventoryItem,
  barcodeType: "cs" | "dsp" | "ea" = "ea"
): InventoryItem => {
  // Type guard: If already migrated (has quantities), return as is
  if ("quantities" in oldItem && oldItem.quantities) {
    return oldItem as InventoryItem;
  }

  // Cast to legacy item for migration
  const legacyItem = oldItem as LegacyInventoryItem;

  // Create new quantities structure
  const quantities: MultiUnitQuantities = {
    cs: 0,
    dsp: 0,
    ea: 0,
  };

  // Migrate based on barcode type
  const quantity = legacyItem.quantity || 0;
  quantities[barcodeType] = quantity;

  return {
    ...legacyItem,
    materialCode:
      legacyItem.materialCode || legacyItem.id || legacyItem.barcode,
    quantities,
    barcodeType, // Keep for reference
    lastUpdated: legacyItem.lastUpdated || new Date().toISOString(),
  };
};

// ✅ Type guard to check if item is legacy format
export const isLegacyInventoryItem = (
  item: unknown
): item is LegacyInventoryItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "barcode" in item &&
    "quantity" in item &&
    !("quantities" in item)
  );
};

// ✅ Type guard to check if item is modern format
export const isModernInventoryItem = (item: unknown): item is InventoryItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "barcode" in item &&
    "quantities" in item
  );
};

// ✅ FIXED: Complete UseInventoryManagerReturn interface with all required methods
export interface UseInventoryManagerReturn {
  // State
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  summary: InventorySummary;

  // ✅ NEW: Multi-unit operations (หลัก)
  addOrUpdateMultiUnitItem: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType: "cs" | "dsp" | "ea",
    directProductGroup?: string
  ) => boolean;

  // ✅ NEW: Update specific unit quantity
  updateUnitQuantity: (
    materialCode: string,
    unit: "cs" | "dsp" | "ea",
    newQuantity: number
  ) => boolean;

  // ✅ FIXED: Update quantity detail method (ชื่อใหม่ที่ถูกต้อง)
  updateItemQuantityDetail: (
    materialCode: string,
    quantityDetail: QuantityDetail
  ) => boolean;

  // ✅ FIXED: Add findItemByMaterialCode method
  findItemByMaterialCode: (materialCode: string) => InventoryItem | undefined;

  // ✅ FIXED: Add findItemByBarcode method
  findItemByBarcode: (barcode: string) => InventoryItem | undefined;

  // ✅ Legacy support (อาจจะเอาออกในอนาคต)
  addOrUpdateItem: (
    product: Product,
    quantityInput: number,
    barcodeType?: "cs" | "dsp" | "ea",
    directProductGroup?: string
  ) => boolean;

  updateItemQuantity: (itemId: string, newQuantity: number) => boolean;
  removeItem: (itemId: string) => boolean;
  clearInventory: () => boolean;
  searchItems: (searchTerm: string) => InventoryItem[];

  // ✅ FIXED: exportInventory method (return boolean, not Promise<void>)
  exportInventory: () => boolean;

  // ✅ FIXED: Add resetInventoryState method
  resetInventoryState: () => boolean;

  // Utilities
  clearError: () => void;
  loadInventory: () => void;
}
