// Path: src/hooks/product/useProductLookup.tsx
"use client";

import { useState, useCallback } from "react";
import { Product } from "../../types/product";
import { findProductByBarcode } from "../../data/services/productServices";
import { normalizeBarcode } from "../../data/utils/csvUtils";

interface UseProductLookupProps {
  onProductFound?: () => void;
}

// Helper function to safely extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
};

export const useProductLookup = (props?: UseProductLookupProps) => {
  const { onProductFound } = props || {};

  // State - แก้ไข syntax error
  const [product, setProduct] = useState<Product | null>(null);
  const [detectedBarcodeType, setDetectedBarcodeType] = useState<
    "ea" | "dsp" | "cs" | null
  >(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [lastDetectedCode, setLastDetectedCode] = useState<string>("");

  // Update barcode and fetch product info
  const updateBarcode = useCallback(
    async (barcode: string) => {
      const normalizedBarcode = normalizeBarcode(barcode);
      if (
        !normalizedBarcode ||
        normalizedBarcode === normalizeBarcode(lastDetectedCode)
      ) {
        return;
      }

      console.log("🔄 Barcode changed:", {
        old: normalizeBarcode(lastDetectedCode),
        new: normalizedBarcode,
      });

      setIsLoadingProduct(true);
      setProductError(null);

      // ✅ Set lastDetectedCode ทันทีเมื่อมี barcode detection
      setLastDetectedCode(normalizedBarcode);

      try {
        // ใช้ findProductByBarcode ที่ return barcode type
        const result = await findProductByBarcode(normalizedBarcode);
        if (result) {
          setProduct(result.product);
          setDetectedBarcodeType(result.barcodeType);
          console.log(
            `✅ Product found: ${
              result.product.name
            } (${result.barcodeType.toUpperCase()})`
          );

          // 🔥 เรียก callback เพื่อปิดกล้องเมื่อเจอสินค้า
          if (onProductFound) {
            console.log("📷 Stopping camera after product found");
            onProductFound();
          }
        } else {
          // ✅ ไม่เจอสินค้า - แต่ยัง keep lastDetectedCode เพื่อแสดงใน error state
          setProduct(null);
          setDetectedBarcodeType(null);
          setProductError("ไม่พบข้อมูลสินค้าในระบบ");
          console.log("❌ Product not found for barcode:", normalizedBarcode);

          // 🔥 เรียก callback เพื่อปิดกล้องแม้ไม่เจอสินค้า (เพื่อแสดง slide)
          if (onProductFound) {
            console.log(
              "📷 Stopping camera after barcode detection (not found)"
            );
            onProductFound();
          }
        }
      } catch (error: unknown) {
        // ✅ Fixed: Changed from 'any' to 'unknown'
        const errorMessage = getErrorMessage(error);
        console.error("❌ Error fetching product:", error);
        setProduct(null);
        setDetectedBarcodeType(null);
        setProductError(errorMessage);

        // 🔥 เรียก callback แม้เกิด error
        if (onProductFound) {
          console.log("📷 Stopping camera after error");
          onProductFound();
        }
      } finally {
        setIsLoadingProduct(false);
      }
    },
    [lastDetectedCode, onProductFound] // เพิ่ม onProductFound ใน dependency
  );

  // Clear product
  const clearProduct = useCallback(() => {
    setProduct(null);
    setDetectedBarcodeType(null);
    setProductError(null);
  }, []);

  // Clear current detection
  const clearCurrentDetection = useCallback(() => {
    console.log("🔄 Clearing current detection");
    setLastDetectedCode("");
    clearProduct();
  }, [clearProduct]);

  return {
    // State
    product,
    detectedBarcodeType,
    isLoadingProduct,
    productError,
    lastDetectedCode,
    // Actions
    updateBarcode,
    clearProduct,
    clearCurrentDetection,
  };
};
