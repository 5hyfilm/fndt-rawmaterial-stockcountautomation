// Path: src/types/inventory.ts - Moved from hooks/inventory/types.ts
import { Product } from "./product";
import { Employee } from "./auth";

// ✅ Multi-unit quantities interface
export interface MultiUnitQuantities {
  cs?: number; // ลัง
  dsp?: number; // แพ็ค
  ea?: number; // ชิ้น
}

// ✅ QuantityDetail interface for detailed quantity tracking
export interface QuantityDetail {
  cs: number; // ลัง
  dsp: number; // แพ็ค
  ea: number; // ชิ้น
  scannedType?: "cs" | "dsp" | "ea"; // ประเภทบาร์โค้ดที่สแกน
  isManualEdit?: boolean; // แก้ไขด้วยมือหรือไม่
  lastModified?: string; // เวลาที่แก้ไขล่าสุด
}

// ✅ Simplified quantity input
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

// ✅ Modern InventoryItem interface (ไม่มี legacy fields)
export interface InventoryItem {
  id: string;

  // ✅ Product identification
  materialCode: string; // รหัสสินค้า (หลัก - ใช้รวม SKU)
  productName: string;
  brand: string;
  category: string;
  size: string;
  unit: string;

  // ✅ Barcode information
  barcode: string; // บาร์โค้ดหลัก (primary)

  // ✅ Quantity management
  quantity: number; // จำนวนรวมทั้งหมด (calculated field)
  quantities: MultiUnitQuantities; // จำนวนแยกตามหน่วย (required)

  // ✅ Optional detailed quantity tracking
  quantityDetail?: QuantityDetail;

  // ✅ Metadata
  lastUpdated: string;
  productData?: Product;
  addedBy?: string;
  branchCode?: string;
  branchName?: string;
  productGroup?: string;
  thaiDescription?: string;

  // ✅ Barcode tracking (เก็บบาร์โค้ดที่สแกนแต่ละประเภท)
  scannedBarcodes?: {
    cs?: string;
    dsp?: string;
    ea?: string;
  };
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
export type EmployeeContext = Employee;

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

// ✅ Helper function: Get total quantity across all units (ลบ legacy check)
export const getTotalQuantityAllUnits = (item: InventoryItem): number => {
  const { cs = 0, dsp = 0, ea = 0 } = item.quantities;
  return cs + dsp + ea;
};

// ✅ Clean UseInventoryManagerReturn interface (ไม่มี legacy methods)
export interface UseInventoryManagerReturn {
  // ✅ State
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  summary: InventorySummary;

  // ✅ Core multi-unit operations
  addOrUpdateMultiUnitItem: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType: "cs" | "dsp" | "ea",
    directProductGroup?: string
  ) => boolean;

  updateUnitQuantity: (
    materialCode: string,
    unit: "cs" | "dsp" | "ea",
    newQuantity: number
  ) => boolean;

  updateItemQuantityDetail: (
    materialCode: string,
    quantityDetail: QuantityDetail
  ) => boolean;

  // ✅ Search and find operations
  findItemByMaterialCode: (materialCode: string) => InventoryItem | undefined;
  findItemByBarcode: (barcode: string) => InventoryItem | undefined;
  searchItems: (searchTerm: string) => InventoryItem[];

  // ✅ Core operations
  removeItem: (itemId: string) => boolean;
  clearInventory: () => boolean;
  exportInventory: () => boolean;
  resetInventoryState: () => boolean;

  // ✅ Utilities
  clearError: () => void;
  loadInventory: () => void;
}
