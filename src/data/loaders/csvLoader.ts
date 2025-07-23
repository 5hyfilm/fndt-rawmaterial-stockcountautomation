// ./src/data/loaders/csvLoader.ts
import Papa from "papaparse";
import { ProductWithMultipleBarcodes, CSVProductRow } from "../types/csvTypes";
import { csvRowToProduct } from "../utils/csvUtils";
import { readCSVFile } from "../readers/csvReader";

// Cache variables
let csvProducts: ProductWithMultipleBarcodes[] = [];
let csvLoaded = false;
let csvLoading = false;

// Define proper error type instead of using any
interface CSVLoaderError {
  message: string;
  name?: string;
  code?: string;
  cause?: unknown;
}

// Type guard to check if error has message property
const isErrorWithMessage = (error: unknown): error is CSVLoaderError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "เกิดข้อผิดพลาดในการโหลดข้อมูล CSV";
};

export const loadCSVProducts = async (): Promise<
  ProductWithMultipleBarcodes[]
> => {
  if (csvLoaded && csvProducts.length > 0) {
    console.log("📋 Using cached CSV products:", csvProducts.length);
    return csvProducts;
  }

  if (csvLoading) {
    console.log("⏳ CSV already loading...");
    const startTime = Date.now();
    while (csvLoading && Date.now() - startTime < 15000) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (csvLoading) {
      csvLoading = false;
      throw new Error("CSV loading timeout - took too long to load");
    }

    return csvProducts;
  }

  csvLoading = true;

  try {
    console.log("🔄 Loading CSV product data...");

    const csvText = await readCSVFile();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error("CSV file is empty or invalid");
    }

    console.log("📄 CSV file loaded, size:", csvText.length, "characters");

    let parseResult: Papa.ParseResult<CSVProductRow>;
    try {
      parseResult = Papa.parse<CSVProductRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        dynamicTyping: false,
      });
    } catch (parseError) {
      const errorMessage = getErrorMessage(parseError);
      throw new Error(`Failed to parse CSV: ${errorMessage}`);
    }

    if (parseResult.errors && parseResult.errors.length > 0) {
      const criticalErrors = parseResult.errors.filter(
        (error) => error.type === "Delimiter" || error.type === "Quotes"
      );

      if (criticalErrors.length > 0) {
        console.error("💥 Critical CSV parsing errors:", criticalErrors);
        throw new Error(
          `Critical CSV parsing errors: ${criticalErrors[0].message}`
        );
      }

      console.warn("⚠️ Non-critical CSV parsing warnings:", parseResult.errors);
    }

    if (!parseResult.data || parseResult.data.length === 0) {
      throw new Error(
        "No data returned from CSV parsing - file may be empty or invalid format"
      );
    }

    console.log("📊 CSV parsed successfully:", parseResult.data.length, "rows");

    const products: ProductWithMultipleBarcodes[] = [];
    let successCount = 0;
    let errorCount = 0;

    parseResult.data.forEach((row, index) => {
      try {
        const product = csvRowToProduct(row, index);
        if (product) {
          products.push(product);
          successCount++;
        } else {
          errorCount++;
        }
      } catch (rowError) {
        console.warn(`Error processing row ${index}:`, rowError);
        errorCount++;
      }
    });

    if (products.length === 0) {
      throw new Error("No valid products could be created from CSV data");
    }

    csvProducts = products;
    csvLoaded = true;
    csvLoading = false;

    console.log(
      `✅ CSV products loaded successfully: ${products.length} products (${successCount} success, ${errorCount} errors)`
    );

    // Log sample of barcode types found
    const sampleWithBarcodes = products.slice(0, 3).map((p) => ({
      name: p.name,
      barcodes: p.barcodes,
      brand: p.brand,
    }));
    console.log("🏷️ Sample products with barcodes:", sampleWithBarcodes);

    return products;
  } catch (error: unknown) {
    // ✅ Fixed: Changed from 'any' to 'unknown'
    csvLoading = false;
    csvLoaded = false;
    csvProducts = [];

    const errorMessage = getErrorMessage(error);
    console.error("❌ Error loading CSV products:", error);

    if (errorMessage.includes("fetch")) {
      throw new Error(`Cannot load product data file: ${errorMessage}`);
    } else if (errorMessage.includes("parse")) {
      throw new Error(`Product data format error: ${errorMessage}`);
    } else {
      throw new Error(`Product data loading failed: ${errorMessage}`);
    }
  }
};
