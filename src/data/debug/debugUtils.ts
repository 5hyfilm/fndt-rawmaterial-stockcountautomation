// src/data/debug/debugUtils.ts
import { normalizeBarcode } from "../utils/csvUtils";
import { findBarcodeMatch } from "../matchers/barcodeMatcher";
import { loadCSVProducts } from "../loaders/csvLoader";

// Enhanced debug function
export const debugBarcodeMatching = async (testBarcode?: string) => {
  try {
    const products = await loadCSVProducts();
    console.log("📊 Enhanced Barcode Debug Info:");

    const sampleProducts = products.slice(0, 10);
    sampleProducts.forEach((product, index) => {
      const barcodes = product.barcodes;
      console.log(`${index + 1}. ${product.name} (${product.brand})`);
      console.log(`   EA: ${barcodes.ea || "N/A"}`);
      console.log(`   DSP: ${barcodes.dsp || "N/A"}`);
      console.log(`   CS: ${barcodes.cs || "N/A"}`);
      console.log(`   Primary: ${barcodes.primary}`);
      console.log("---");
    });

    // Test barcode matching if provided
    if (testBarcode) {
      console.log(`🔍 Testing barcode: ${testBarcode}`);
      const normalized = normalizeBarcode(testBarcode);
      console.log(`📝 Normalized: ${normalized}`);

      let found = false;
      for (const product of products.slice(0, 20)) {
        const match = findBarcodeMatch(testBarcode, product);
        if (match.matched) {
          console.log(`✅ Match found: ${product.name}`);
          console.log(`   Type: ${match.type}`);
          console.log(`   Barcode: ${match.barcode}`);
          found = true;
          break;
        }
      }

      if (!found) {
        console.log("❌ No matches found in first 20 products");
      }
    }

    // Stats
    const stats = {
      totalProducts: products.length,
      withEA: products.filter((p) => p.barcodes.ea).length,
      withDSP: products.filter((p) => p.barcodes.dsp).length,
      withCS: products.filter((p) => p.barcodes.cs).length,
    };

    console.log("📈 Barcode Statistics:", stats);

    return stats;
  } catch (error) {
    console.error("Debug error:", error);
    return null;
  }
};
