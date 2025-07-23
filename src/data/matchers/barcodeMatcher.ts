// src/data/matchers/barcodeMatcher.ts
import { ProductWithMultipleBarcodes } from "../types/csvTypes";
import { normalizeBarcode } from "../utils/csvUtils";

// Enhanced barcode matching function
export const findBarcodeMatch = (
  searchBarcode: string,
  product: ProductWithMultipleBarcodes
): { matched: boolean; type?: "ea" | "dsp" | "cs"; barcode?: string } => {
  const normalized = normalizeBarcode(searchBarcode);

  // Check each barcode type
  const barcodes = [
    { type: "ea" as const, code: product.barcodes.ea },
    { type: "dsp" as const, code: product.barcodes.dsp },
    { type: "cs" as const, code: product.barcodes.cs },
  ];

  for (const { type, code } of barcodes) {
    if (!code) continue;

    const normalizedCode = normalizeBarcode(code);

    // Exact match
    if (normalizedCode === normalized) {
      return { matched: true, type, barcode: code };
    }

    // Partial matches for different barcode formats
    if (normalized.length >= 12 && normalizedCode.length >= 12) {
      // Last 12 digits match
      if (normalizedCode.slice(-12) === normalized.slice(-12)) {
        return { matched: true, type, barcode: code };
      }

      // First 12 digits match
      if (normalizedCode.slice(0, 12) === normalized.slice(0, 12)) {
        return { matched: true, type, barcode: code };
      }
    }

    // Without leading zeros
    const codeWithoutZeros = normalizedCode.replace(/^0+/, "");
    const searchWithoutZeros = normalized.replace(/^0+/, "");
    if (
      codeWithoutZeros === searchWithoutZeros &&
      codeWithoutZeros.length > 0
    ) {
      return { matched: true, type, barcode: code };
    }
  }

  return { matched: false };
};
