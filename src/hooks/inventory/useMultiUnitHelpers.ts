// Path: src/hooks/inventory/useMultiUnitHelpers.ts - Helper functions for Multi-Unit Management
import {
  InventoryItem,
  MultiUnitQuantities,
  LegacyInventoryItem,
} from "./types";

export type UnitType = "ea" | "dsp" | "cs";

// ✅ Unit configuration for consistent UI display
export const UNIT_CONFIG = {
  ea: {
    label: "ชิ้น",
    shortLabel: "EA",
    description: "Each - ขายเป็นชิ้นเดียว",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    activeColor: "bg-blue-600 text-white border-blue-600",
    iconClass: "text-blue-500",
    priority: 1, // Lower number = higher priority for display
  },
  dsp: {
    label: "แพ็ค",
    shortLabel: "DSP",
    description: "Display Pack - ขายเป็นแพ็ค",
    color: "bg-green-100 text-green-700 border-green-200",
    activeColor: "bg-green-600 text-white border-green-600",
    iconClass: "text-green-500",
    priority: 2,
  },
  cs: {
    label: "ลัง",
    shortLabel: "CS",
    description: "Case/Carton - ขายเป็นลัง",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    activeColor: "bg-purple-600 text-white border-purple-600",
    iconClass: "text-purple-500",
    priority: 3,
  },
} as const;

// ✅ Get active units for an inventory item
export const getActiveUnits = (item: InventoryItem): UnitType[] => {
  if (!item.quantities) {
    // Fallback for legacy items
    return ["ea"];
  }

  return (["cs", "dsp", "ea"] as const).filter(
    (unit) => (item.quantities?.[unit] || 0) > 0
  );
};

// ✅ Get primary unit (highest priority unit with quantity > 0)
export const getPrimaryUnit = (item: InventoryItem): UnitType => {
  const activeUnits = getActiveUnits(item);

  if (activeUnits.length === 0) return "ea";

  // Sort by priority (lower number = higher priority)
  return activeUnits.sort(
    (a, b) => UNIT_CONFIG[a].priority - UNIT_CONFIG[b].priority
  )[0];
};

// ✅ Get total quantity across all units
export const getTotalQuantity = (item: InventoryItem): number => {
  if (!item.quantities) {
    return item.quantity || 0;
  }

  const { cs = 0, dsp = 0, ea = 0 } = item.quantities;
  return cs + dsp + ea;
};

// ✅ Get quantity for specific unit
export const getUnitQuantity = (
  item: InventoryItem,
  unit: UnitType
): number => {
  if (!item.quantities) {
    // For legacy items, assume EA if no specific unit info
    return unit === "ea" ? item.quantity || 0 : 0;
  }

  return item.quantities[unit] || 0;
};

// ✅ Check if item has multiple units
export const isMultiUnit = (item: InventoryItem): boolean => {
  return getActiveUnits(item).length > 1;
};

// ✅ Format quantity display for UI
export const formatQuantityDisplay = (
  item: InventoryItem
): {
  primary: {
    unit: UnitType;
    quantity: number;
    config: (typeof UNIT_CONFIG)[UnitType];
  };
  secondary?: Array<{
    unit: UnitType;
    quantity: number;
    config: (typeof UNIT_CONFIG)[UnitType];
  }>;
  total: number;
  isMultiUnit: boolean;
} => {
  const activeUnits = getActiveUnits(item);
  const primaryUnit = getPrimaryUnit(item);
  const primaryQuantity = getUnitQuantity(item, primaryUnit);
  const primaryConfig = UNIT_CONFIG[primaryUnit];

  const secondaryUnits = activeUnits
    .filter((unit) => unit !== primaryUnit)
    .map((unit) => ({
      unit,
      quantity: getUnitQuantity(item, unit),
      config: UNIT_CONFIG[unit],
    }))
    .filter(({ quantity }) => quantity > 0);

  return {
    primary: {
      unit: primaryUnit,
      quantity: primaryQuantity,
      config: primaryConfig,
    },
    secondary: secondaryUnits.length > 0 ? secondaryUnits : undefined,
    total: getTotalQuantity(item),
    isMultiUnit: isMultiUnit(item),
  };
};

// ✅ Create empty quantities object
export const createEmptyQuantities = (): MultiUnitQuantities => ({
  cs: 0,
  dsp: 0,
  ea: 0,
});

// ✅ Update specific unit quantity in quantities object
export const updateUnitInQuantities = (
  quantities: MultiUnitQuantities,
  unit: UnitType,
  newQuantity: number
): MultiUnitQuantities => {
  return {
    ...quantities,
    [unit]: Math.max(0, newQuantity),
  };
};

// ✅ Add quantity to specific unit
export const addToUnitQuantity = (
  quantities: MultiUnitQuantities,
  unit: UnitType,
  addQuantity: number
): MultiUnitQuantities => {
  const currentQuantity = quantities[unit] || 0;
  return updateUnitInQuantities(
    quantities,
    unit,
    currentQuantity + addQuantity
  );
};

// ✅ Merge two quantities objects
export const mergeQuantities = (
  quantities1: MultiUnitQuantities,
  quantities2: MultiUnitQuantities
): MultiUnitQuantities => {
  return {
    cs: (quantities1.cs || 0) + (quantities2.cs || 0),
    dsp: (quantities1.dsp || 0) + (quantities2.dsp || 0),
    ea: (quantities1.ea || 0) + (quantities2.ea || 0),
  };
};

// ✅ FIXED: Convert legacy item to multi-unit format with proper typing
export const convertLegacyToMultiUnit = (
  legacyItem: LegacyInventoryItem,
  barcodeType: UnitType = "ea"
): InventoryItem => {
  const quantities = createEmptyQuantities();
  quantities[barcodeType] = legacyItem.quantity || 0;

  return {
    id: legacyItem.id,
    materialCode: legacyItem.materialCode || legacyItem.barcode,
    productName: legacyItem.productName || "ไม่ระบุชื่อ",
    brand: legacyItem.brand || "ไม่ระบุ",
    category: legacyItem.category || "ไม่ระบุ",
    size: legacyItem.size || "",
    unit: legacyItem.unit || "",
    barcode: legacyItem.barcode,
    quantity: legacyItem.quantity || 0, // Keep for backward compatibility
    quantities,
    lastUpdated: legacyItem.lastUpdated || new Date().toISOString(),
    productData: legacyItem.productData,
    addedBy: legacyItem.addedBy,
    branchCode: legacyItem.branchCode,
    branchName: legacyItem.branchName,
    productGroup: legacyItem.productGroup,
    thaiDescription: legacyItem.thaiDescription,
    scannedBarcodes: {
      [barcodeType]: legacyItem.barcode,
    },
  };
};

// ✅ Get scanned barcode for specific unit type
export const getScannedBarcodeForUnit = (
  item: InventoryItem,
  unit: UnitType
): string | undefined => {
  return item.scannedBarcodes?.[unit];
};

// ✅ Update scanned barcode for unit
export const updateScannedBarcode = (
  item: InventoryItem,
  unit: UnitType,
  barcode: string
): InventoryItem => {
  return {
    ...item,
    scannedBarcodes: {
      ...item.scannedBarcodes,
      [unit]: barcode,
    },
  };
};

// ✅ Validate quantities object
export const validateQuantities = (
  quantities: MultiUnitQuantities
): boolean => {
  const { cs = 0, dsp = 0, ea = 0 } = quantities;

  // At least one unit should have quantity > 0
  if (cs + dsp + ea <= 0) {
    console.warn("Invalid quantities: all units are zero");
    return false;
  }

  // All quantities should be non-negative
  if (cs < 0 || dsp < 0 || ea < 0) {
    console.warn("Invalid quantities: negative values found");
    return false;
  }

  return true;
};

// ✅ Get unit type from barcode (if product has multiple barcodes)
export const getUnitTypeFromBarcode = (
  item: InventoryItem,
  scannedBarcode: string
): UnitType | undefined => {
  if (!item.scannedBarcodes) return undefined;

  for (const [unit, barcode] of Object.entries(item.scannedBarcodes)) {
    if (barcode === scannedBarcode) {
      return unit as UnitType;
    }
  }

  return undefined;
};

// ✅ Create quantity summary for reporting
export interface QuantitySummary {
  totalItems: number;
  totalCS: number;
  totalDSP: number;
  totalEA: number;
  itemsWithCS: number;
  itemsWithDSP: number;
  itemsWithEA: number;
  multiUnitItems: number;
}

export const createQuantitySummary = (
  inventory: InventoryItem[]
): QuantitySummary => {
  const summary: QuantitySummary = {
    totalItems: inventory.length,
    totalCS: 0,
    totalDSP: 0,
    totalEA: 0,
    itemsWithCS: 0,
    itemsWithDSP: 0,
    itemsWithEA: 0,
    multiUnitItems: 0,
  };

  inventory.forEach((item) => {
    const quantities = item.quantities || createEmptyQuantities();

    summary.totalCS += quantities.cs || 0;
    summary.totalDSP += quantities.dsp || 0;
    summary.totalEA += quantities.ea || 0;

    if ((quantities.cs || 0) > 0) summary.itemsWithCS++;
    if ((quantities.dsp || 0) > 0) summary.itemsWithDSP++;
    if ((quantities.ea || 0) > 0) summary.itemsWithEA++;

    if (isMultiUnit(item)) summary.multiUnitItems++;
  });

  return summary;
};

// ✅ Sort units by priority for consistent display
export const sortUnitsByPriority = (units: UnitType[]): UnitType[] => {
  return units.sort(
    (a, b) => UNIT_CONFIG[a].priority - UNIT_CONFIG[b].priority
  );
};

// ✅ Get unit display text with quantity
export const getUnitDisplayText = (
  unit: UnitType,
  quantity: number
): string => {
  const config = UNIT_CONFIG[unit];
  return `${quantity} ${config.label}`;
};

// ✅ Export for use in components
export const MultiUnitHelpers = {
  UNIT_CONFIG,
  getActiveUnits,
  getPrimaryUnit,
  getTotalQuantity,
  getUnitQuantity,
  isMultiUnit,
  formatQuantityDisplay,
  createEmptyQuantities,
  updateUnitInQuantities,
  addToUnitQuantity,
  mergeQuantities,
  convertLegacyToMultiUnit,
  getScannedBarcodeForUnit,
  updateScannedBarcode,
  validateQuantities,
  getUnitTypeFromBarcode,
  createQuantitySummary,
  sortUnitsByPriority,
  getUnitDisplayText,
};
