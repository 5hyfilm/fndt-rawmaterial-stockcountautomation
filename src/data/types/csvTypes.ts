// Path: /src/data/types/csvTypes.ts
import { Product, ProductCategory } from "../../types/product";

// CSV Row interface based on the actual CSV structure
export interface CSVProductRow {
  Material: string;
  Description: string;
  "Thai Desc.": string;
  "Pack Size": string;
  "Product Group": string;
  "Shelflife (Months)": string;
  "Bar Code EA": string;
  "Bar Code DSP": string;
  "Bar Code CS": string;
}

// Pack size information interface
export interface PackSizeInfo {
  rawPackSize: string;
  displayText: string;
  totalQuantity: number;
  unit: string | null;
}

// Enhanced Product interface with multiple barcodes and pack size info
export interface ProductWithMultipleBarcodes
  extends Omit<Product, "createdAt" | "updatedAt"> {
  barcodes: {
    ea?: string; // Each unit
    dsp?: string; // Display pack
    cs?: string; // Case/Carton
    primary: string; // Primary barcode for display
    scannedType?: "ea" | "dsp" | "cs"; // Which barcode was scanned
  };
  packSize: number; // Add packSize property
  packSizeInfo: PackSizeInfo; // เพิ่ม field ใหม่สำหรับข้อมูลรายละเอียดของ pack size
  createdAt?: Date; // Make optional
  updatedAt?: Date; // Make optional
}

// ✅ Product Group Options for dropdown (สำหรับใช้ใน AddNewProductForm)
export const PRODUCT_GROUP_OPTIONS = [
  "STM", // Sterilized Milk
  "BB Gold", // Bear Brand Gold
  "EVAP", // Evaporated
  "SBC", // Sweetened Beverage Creamer
  "SCM", // Sweetened Condensed Milk
  "Magnolia UHT", // Magnolia UHT
  "NUTRISOY", // Nutriwell
  "Gummy", // Gummy candy
] as const;

// ✅ Type for Product Group (เพื่อ type safety)
export type ProductGroupCode = (typeof PRODUCT_GROUP_OPTIONS)[number];

// ✅ อัพเดต Product group to category mapping (1:1 mapping)
export const PRODUCT_GROUP_MAPPING: Record<string, ProductCategory> = {
  STM: ProductCategory.STM, // STM → STM
  "BB Gold": ProductCategory.BB_GOLD, // BB Gold → BB_GOLD
  EVAP: ProductCategory.EVAP, // EVAP → EVAP
  SBC: ProductCategory.SBC, // SBC → SBC
  SCM: ProductCategory.SCM, // SCM → SCM
  "Magnolia UHT": ProductCategory.MAGNOLIA_UHT, // Magnolia UHT → MAGNOLIA_UHT
  NUTRISOY: ProductCategory.NUTRISOY, // NUTRISOY → NUTRISOY
  Gummy: ProductCategory.GUMMY, // Gummy → GUMMY
};

// ✅ อัพเดต Reverse mapping (แต่ละ category มี 1 product group)
export const CATEGORY_TO_PRODUCT_GROUPS: Record<ProductCategory, string[]> = {
  // ใหม่: Product Group Categories (1:1)
  [ProductCategory.STM]: ["STM"],
  [ProductCategory.BB_GOLD]: ["BB Gold"],
  [ProductCategory.EVAP]: ["EVAP"],
  [ProductCategory.SBC]: ["SBC"],
  [ProductCategory.SCM]: ["SCM"],
  [ProductCategory.MAGNOLIA_UHT]: ["Magnolia UHT"],
  [ProductCategory.NUTRISOY]: ["NUTRISOY"],
  [ProductCategory.GUMMY]: ["Gummy"],

  // เดิม: Generic Categories (สำหรับสินค้าอื่นๆ)
  [ProductCategory.BEVERAGES]: [],
  [ProductCategory.DAIRY]: [],
  [ProductCategory.SNACKS]: [],
  [ProductCategory.CANNED_FOOD]: [],
  [ProductCategory.INSTANT_NOODLES]: [],
  [ProductCategory.SAUCES]: [],
  [ProductCategory.SEASONING]: [],
  [ProductCategory.FROZEN]: [],
  [ProductCategory.BAKERY]: [],
  [ProductCategory.CONFECTIONERY]: [],
  [ProductCategory.OTHER]: [],
};

// Unit type descriptions
export const UNIT_TYPES = {
  ea: "ชิ้น (Each)",
  dsp: "แพ็ค (Display Pack)",
  cs: "ลัง (Case/Carton)",
};

// ✅ Utility functions

/**
 * ตรวจสอบว่า Product Group Code ที่ใส่มาถูกต้องหรือไม่
 */
export const isValidProductGroup = (
  productGroup: string
): productGroup is ProductGroupCode => {
  return PRODUCT_GROUP_OPTIONS.includes(productGroup as ProductGroupCode);
};

/**
 * แปลง Product Group Code เป็น ProductCategory
 */
export const getProductCategoryFromGroup = (
  productGroup: string
): ProductCategory => {
  return PRODUCT_GROUP_MAPPING[productGroup] || ProductCategory.OTHER;
};

/**
 * หา Product Group Codes ทั้งหมดที่อยู่ใน category เดียวกัน
 */
export const getProductGroupsByCategory = (
  category: ProductCategory
): string[] => {
  return CATEGORY_TO_PRODUCT_GROUPS[category] || [];
};

/**
 * สร้าง dropdown options พร้อมกับ category info (สำหรับการแสดงผลที่ละเอียดกว่า)
 */
export const getProductGroupOptionsWithCategory = () => {
  return PRODUCT_GROUP_OPTIONS.map((group) => ({
    value: group,
    label: group,
    category: getProductCategoryFromGroup(group),
    categoryLabel: getCategoryDisplayName(getProductCategoryFromGroup(group)),
  }));
};

// ✅ อัพเดต ชื่อภาษาไทย - ให้เป็นตัวพิมพ์ใหญ่
export const getCategoryDisplayName = (category: ProductCategory): string => {
  const categoryNames: Record<ProductCategory, string> = {
    // ใหม่: Product Group Names (ตัวพิมพ์ใหญ่ทั้งหมด)
    [ProductCategory.STM]: "STM",
    [ProductCategory.BB_GOLD]: "BB GOLD",
    [ProductCategory.EVAP]: "EVAP",
    [ProductCategory.SBC]: "SBC",
    [ProductCategory.SCM]: "SCM",
    [ProductCategory.MAGNOLIA_UHT]: "MAGNOLIA UHT",
    [ProductCategory.NUTRISOY]: "NUTRISOY",
    [ProductCategory.GUMMY]: "GUMMY",

    // เดิม: Generic Categories
    [ProductCategory.BEVERAGES]: "BEVERAGES",
    [ProductCategory.DAIRY]: "DAIRY",
    [ProductCategory.SNACKS]: "SNACKS",
    [ProductCategory.CANNED_FOOD]: "CANNED FOOD",
    [ProductCategory.INSTANT_NOODLES]: "INSTANT NOODLES",
    [ProductCategory.SAUCES]: "SAUCES",
    [ProductCategory.SEASONING]: "SEASONING",
    [ProductCategory.FROZEN]: "FROZEN",
    [ProductCategory.BAKERY]: "BAKERY",
    [ProductCategory.CONFECTIONERY]: "CONFECTIONERY",
    [ProductCategory.OTHER]: "OTHER",
  };

  return categoryNames[category] || "OTHER";
};
