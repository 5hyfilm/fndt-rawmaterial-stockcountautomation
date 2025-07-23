// src/data/csvProducts.ts - Main entry point for CSV products
// Fixed version for client/server compatibility

// Export types
export * from "./types/csvTypes";

// Export utilities
export * from "./utils/csvUtils";

// Export core services
export * from "./services/productServices";

// Export loader functions
export * from "./loaders/csvLoader";

// Export debug utilities
export * from "./debug/debugUtils";

// Re-export commonly used functions for backward compatibility
export { loadCSVProducts } from "./loaders/csvLoader";
export {
  findProductByBarcode,
  searchProducts,
  getProductsByCategory,
  getAllBrands,
  getProductStats,
} from "./services/productServices";
export { debugBarcodeMatching } from "./debug/debugUtils";
export { normalizeBarcode } from "./utils/csvUtils";
