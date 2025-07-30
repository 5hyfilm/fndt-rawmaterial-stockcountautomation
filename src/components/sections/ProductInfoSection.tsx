// src/components/sections/ProductInfoSection.tsx - Updated to show EA only in UI
"use client";

import React from "react";
import { Package } from "lucide-react";
import { ProductInfo } from "../product/ProductInfo";
import { Product } from "../../types/product";
import { QuantityInput } from "../../types/inventory"; // ✅ Import QuantityInput

interface ProductInfoSectionProps {
  product: Product | null;
  barcode?: string;
  barcodeType?: "ea"; // 🔴 ลบ "dsp" | "cs" ออก - แสดงแค่ EA ใน UI
  isLoading: boolean;
  error?: string;
  currentInventoryQuantity: number;
  isMobile: boolean;
  onAddToInventory: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType?: "ea" // 🔴 ลบ "dsp" | "cs" ออก - แสดงแค่ EA ใน UI
  ) => boolean;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  barcode,
  // barcodeType,
  isLoading,
  error,
  currentInventoryQuantity,
  isMobile,
  onAddToInventory,
}) => {
  return (
    <div>
      <div className={`${isMobile ? "mb-2" : "mb-3"} flex items-center gap-2`}>
        <Package className="fn-green" size={isMobile ? 16 : 20} />
        <h3
          className={`${
            isMobile ? "text-base" : "text-lg"
          } font-semibold text-gray-900`}
        >
          ข้อมูลสินค้า
        </h3>
        {isLoading && (
          <div className="animate-spin w-4 h-4 border-2 border-fn-green border-t-transparent rounded-full"></div>
        )}
      </div>

      <ProductInfo
        product={product}
        barcode={barcode}
        barcodeType="ea" // 🔴 บังคับเป็น "ea" เท่านั้น - ไม่แสดง CS/DSP ใน UI
        isLoading={isLoading}
        error={error}
        onAddToInventory={onAddToInventory} // ✅ Passes through with new signature
        currentInventoryQuantity={currentInventoryQuantity}
      />
    </div>
  );
};
