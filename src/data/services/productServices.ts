// src/data/services/productServices.ts
import { ProductCategory, ProductStatus } from "../../types/product";
import { ProductWithMultipleBarcodes, UNIT_TYPES } from "../types/csvTypes";
import { normalizeBarcode } from "../utils/csvUtils";
import { findBarcodeMatch } from "../matchers/barcodeMatcher";
import { loadCSVProducts } from "../loaders/csvLoader";

// Enhanced barcode matching function with multi-barcode support
export const findProductByBarcode = async (
  inputBarcode: string
): Promise<
  | { product: ProductWithMultipleBarcodes; barcodeType: "ea" | "dsp" | "cs" }
  | undefined
> => {
  const products = await loadCSVProducts();
  const searchBarcode = normalizeBarcode(inputBarcode);

  console.log("🔍 Searching for barcode:", searchBarcode);
  console.log("📋 Total products available:", products.length);

  for (const product of products) {
    const match = findBarcodeMatch(searchBarcode, product);

    if (match.matched && match.type) {
      console.log(
        `✅ Product found: ${product.name} (${match.type?.toUpperCase()}: ${
          match.barcode
        })`
      );
      console.log(`📦 Unit type: ${UNIT_TYPES[match.type!]}`);

      // Add scanned type to the product for reference
      const resultProduct: ProductWithMultipleBarcodes = {
        ...product,
        barcodes: {
          ...product.barcodes,
          scannedType: match.type,
        },
      };

      // For compatibility, keep the matched barcode as the main barcode
      resultProduct.barcode = match.barcode!;

      return {
        product: resultProduct,
        barcodeType: match.type,
      };
    }
  }

  console.log("❌ No product found for barcode:", searchBarcode);
  return undefined;
};

// Search products with filters
export const searchProducts = async (params: {
  name?: string;
  category?: ProductCategory;
  brand?: string;
  status?: ProductStatus;
}): Promise<ProductWithMultipleBarcodes[]> => {
  const products = await loadCSVProducts();

  return products.filter((product) => {
    if (
      params.name &&
      !product.name.toLowerCase().includes(params.name.toLowerCase())
    ) {
      return false;
    }
    if (params.category && product.category !== params.category) {
      return false;
    }
    if (params.brand && product.brand !== params.brand) {
      return false;
    }
    if (params.status && product.status !== params.status) {
      return false;
    }
    return true;
  });
};

export const getProductsByCategory = async (
  category: ProductCategory
): Promise<ProductWithMultipleBarcodes[]> => {
  const products = await loadCSVProducts();
  return products.filter((product) => product.category === category);
};

export const getAllBrands = async (): Promise<string[]> => {
  const products = await loadCSVProducts();
  return [...new Set(products.map((product) => product.brand))];
};

export const getProductStats = async () => {
  const products = await loadCSVProducts();
  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.status === ProductStatus.ACTIVE
  ).length;
  const categories = [...new Set(products.map((p) => p.category))].length;
  const brands = [...new Set(products.map((p) => p.brand))].length;

  // Count products by barcode type
  const barcodeStats = {
    withEA: products.filter((p) => p.barcodes.ea).length,
    withDSP: products.filter((p) => p.barcodes.dsp).length,
    withCS: products.filter((p) => p.barcodes.cs).length,
  };

  console.log("📊 Barcode coverage:", barcodeStats);

  return {
    totalProducts,
    activeProducts,
    categories,
    brands,
    barcodeStats,
  };
};
