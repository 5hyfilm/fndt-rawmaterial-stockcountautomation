// src/data/utils/csvUtils.ts
import { ProductCategory, ProductStatus } from "../../types/product";
import {
  CSVProductRow,
  ProductWithMultipleBarcodes,
  PRODUCT_GROUP_MAPPING,
  PackSizeInfo, // Import PackSizeInfo from csvTypes.ts
} from "../types/csvTypes";

// Brand extraction from description
export const extractBrand = (description: string, thaiDesc: string): string => {
  // Extract brand from English description
  if (description.includes("BEAR BRAND") || description.includes("BRBR"))
    return "Bear Brand";
  if (description.includes("CARNATION")) return "Carnation";
  if (description.includes("TEAPOT")) return "Teapot";
  if (description.includes("MAGNOLIA")) return "Magnolia";
  if (description.includes("NUTRIWELL")) return "Nutriwell";
  if (description.includes("HAYOCO")) return "Hayoco";

  // Extract from Thai description
  if (thaiDesc.includes("หมี")) return "Bear Brand";
  if (thaiDesc.includes("คาร์เนชัน")) return "Carnation";
  if (thaiDesc.includes("ทีพอท")) return "Teapot";
  if (thaiDesc.includes("แมกโนเลีย")) return "Magnolia";
  if (thaiDesc.includes("นิวทริเวล")) return "Nutriwell";
  if (thaiDesc.includes("ฮาโยโก้")) return "Hayoco";

  return "F&N";
};

// Clean and format product name
export const formatProductName = (
  thaiDesc: string,
  description: string
): string => {
  const name = thaiDesc || description;
  return (
    name
      // .replace(/^\d+[xX]\(.*?\)\s*/, "")
      // .replace(/\s+\d+[xX].*$/, "")
      // .replace(/\s*TH\s*$/, "")
      // .replace(/\s*FS\s*$/, "")
      // .replace(/\s*P12\s*$/, "")
      // .replace(/\s*10B\.\s*$/, "")
      // .replace(/\s*\(.*?\)\s*$/, "")
      .trim()
  );
};

// Enhanced pack size parsing
export const parsePackSizeInfo = (packSize: string): PackSizeInfo => {
  const raw = packSize.trim();

  // Handle different patterns
  // Pattern 1: 8X(12X140ml) -> 8 packs of (12 x 140ml)
  const pattern1 = raw.match(/^(\d+)[xX]\((\d+)[xX](\d+)(ml|g|kg|l)\)$/i);
  if (pattern1) {
    const [, outerPack, innerPack, size, unit] = pattern1;
    return {
      rawPackSize: raw,
      displayText: `${outerPack} แพ็ค (${innerPack} x ${size}${unit})`,
      totalQuantity: parseInt(outerPack) * parseInt(innerPack),
      unit: unit.toLowerCase(),
    };
  }

  // Pattern 2: 16X(6X140ml) -> 16 packs of (6 x 140ml)
  const pattern2 = raw.match(/^(\d+)[xX]\((\d+)[xX](\d+)(ml|g|kg|l)\)$/i);
  if (pattern2) {
    const [, outerPack, innerPack, size, unit] = pattern2;
    return {
      rawPackSize: raw,
      displayText: `${outerPack} แพ็ค (${innerPack} x ${size}${unit})`,
      totalQuantity: parseInt(outerPack) * parseInt(innerPack),
      unit: unit.toLowerCase(),
    };
  }

  // Pattern 3: 30x150ml -> 30 x 150ml
  const pattern3 = raw.match(/^(\d+)[xX](\d+)(ml|g|kg|l)$/i);
  if (pattern3) {
    const [, quantity, size, unit] = pattern3;
    return {
      rawPackSize: raw,
      displayText: `${quantity} x ${size}${unit}`,
      totalQuantity: parseInt(quantity),
      unit: unit.toLowerCase(),
    };
  }

  // Pattern 4: 12(4x150ml) -> 12 packs of (4 x 150ml)
  const pattern4 = raw.match(/^(\d+)\((\d+)[xX](\d+)(ml|g|kg|l)\)$/i);
  if (pattern4) {
    const [, outerPack, innerPack, size, unit] = pattern4;
    return {
      rawPackSize: raw,
      displayText: `${outerPack} แพ็ค (${innerPack} x ${size}${unit})`,
      totalQuantity: parseInt(outerPack) * parseInt(innerPack),
      unit: unit.toLowerCase(),
    };
  }

  // Pattern 5: Just numbers
  const pattern5 = raw.match(/^(\d+)$/);
  if (pattern5) {
    const [, quantity] = pattern5;
    return {
      rawPackSize: raw,
      displayText: `${quantity} ชิ้น`,
      totalQuantity: parseInt(quantity),
      unit: null,
    };
  }

  // Fallback: return as-is
  return {
    rawPackSize: raw,
    displayText: raw,
    totalQuantity: 1,
    unit: null,
  };
};

// Parse pack size (keep backward compatibility)
export const parsePackSize = (packSize: string): number => {
  const packInfo = parsePackSizeInfo(packSize);
  return packInfo.totalQuantity;
};

// Normalize barcode for comparison
export const normalizeBarcode = (barcode: string): string => {
  return barcode.replace(/[^0-9]/g, "").trim();
};

// Convert CSV row to product
export const csvRowToProduct = (
  row: CSVProductRow,
  index: number
): ProductWithMultipleBarcodes | null => {
  try {
    // Skip if no material code
    if (!row.Material || row.Material.trim() === "") {
      return null;
    }

    // Clean up barcodes
    const eaBarcode = row["Bar Code EA"]?.trim();
    const dspBarcode = row["Bar Code DSP"]?.trim();
    const csBarcode = row["Bar Code CS"]?.trim();

    // Must have at least one barcode
    if (!eaBarcode && !dspBarcode && !csBarcode) {
      console.warn(`Row ${index}: No barcodes found for ${row.Material}`);
      return null;
    }

    // Determine primary barcode (prefer EA, then DSP, then CS)
    const primaryBarcode = eaBarcode || dspBarcode || csBarcode || "";

    const brand = extractBrand(row.Description || "", row["Thai Desc."] || "");
    const name = formatProductName(
      row["Thai Desc."] || "",
      row.Description || ""
    );
    const category =
      PRODUCT_GROUP_MAPPING[row["Product Group"]] || ProductCategory.OTHER;

    // Parse pack size info
    const packSizeInfo = parsePackSizeInfo(row["Pack Size"] || "1");
    const packSize = packSizeInfo.totalQuantity;

    return {
      id: row.Material,
      barcode: primaryBarcode,
      name,
      brand,
      category,
      packSize,
      packSizeInfo, // เพิ่ม field ใหม่
      status: ProductStatus.ACTIVE,
      sku: row.Material,
      barcodes: {
        ea: eaBarcode || undefined,
        dsp: dspBarcode || undefined,
        cs: csBarcode || undefined,
        primary: primaryBarcode,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error converting row ${index}:`, error);
    return null;
  }
};
