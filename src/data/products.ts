// src/data/products.ts - Updated to remove FALLBACK_PRODUCTS
export * from "./csvProducts";

// Re-export all functions from csvProducts for backward compatibility
import {
  loadCSVProducts,
  findProductByBarcode as csvFindProductByBarcode,
  searchProducts as csvSearchProducts,
  getProductsByCategory as csvGetProductsByCategory,
  getAllBrands as csvGetAllBrands,
  getProductStats as csvGetProductStats,
  debugBarcodeMatching as csvDebugBarcodeMatching,
} from "./csvProducts";

export const findProductByBarcode = csvFindProductByBarcode;
export const searchProducts = csvSearchProducts;
export const getProductsByCategory = csvGetProductsByCategory;
export const getAllBrands = csvGetAllBrands;
export const getProductStats = csvGetProductStats;
export const debugBarcodeMatching = csvDebugBarcodeMatching;

// For compatibility with components that expect sync functions

// Load products on module initialization (for server-side)
if (typeof window === "undefined") {
  loadCSVProducts()
    .then((products) => {
      console.log("🔄 CSV products preloaded for server:", products.length);
    })
    .catch((error) => {
      console.error("❌ Failed to preload CSV products:", error);
    });
}
