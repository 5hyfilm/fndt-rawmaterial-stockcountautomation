// src/components/ProductInfo.tsx - Updated with QuantityInput Support
"use client";

import React, { useState } from "react";
import { Product } from "../types/product";
import { QuantityInput } from "../hooks/inventory/types"; // ✅ Import QuantityInput

// Import sub-components
import { ProductHeader } from "./product/ProductHeader";
import { ProductBasicInfo } from "./product/ProductBasicInfo";
import { InventoryAddSection } from "./product/InventoryAddSection";
import { ProductDescription } from "./product/ProductDescription";
import { BarcodeInfo } from "./product/BarcodeInfo";
import { ProductDetails } from "./product/ProductDetails";
import { NutritionInfo } from "./product/NutritionInfo";
import {
  LoadingState,
  ErrorState,
  WaitingScanState,
  ProductNotFoundState,
} from "./product/EmptyStates";

interface ProductInfoProps {
  product: Product | null;
  barcode?: string;
  barcodeType?: "ea" | "dsp" | "cs";
  isLoading?: boolean;
  error?: string;
  onAddToInventory?: (
    product: Product,
    quantityInput: QuantityInput, // ✅ Changed from quantity: number to quantityInput: QuantityInput
    barcodeType?: "ea" | "dsp" | "cs"
  ) => boolean;
  currentInventoryQuantity?: number;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  barcode,
  barcodeType,
  isLoading,
  error,
  onAddToInventory,
  currentInventoryQuantity = 0,
}) => {
  const [copied, setCopied] = useState(false);

  const copyBarcode = async () => {
    const codeToCopy = barcode || product?.barcode;
    if (!codeToCopy) return;

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy barcode:", err);
    }
  };

  // Determine if inventory add section should be visible
  const shouldShowInventorySection = product && !error && onAddToInventory;

  // Handle different states
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} barcode={barcode} />;
  }

  if (!product && !barcode) {
    return <WaitingScanState />;
  }

  if (!product && barcode) {
    return (
      <ProductNotFoundState
        barcode={barcode}
        onCopyBarcode={copyBarcode}
        copied={copied}
      />
    );
  }

  // Main product display
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Product Header */}
      <ProductHeader product={product!} />

      {/* Content */}
      <div className="p-4 lg:p-6 space-y-4">
        {/* Basic Product Information */}
        <ProductBasicInfo
          product={product!}
          currentInventoryQuantity={currentInventoryQuantity}
        />

        {/* Inventory Add Section */}
        {shouldShowInventorySection && (
          <InventoryAddSection
            product={product!}
            currentInventoryQuantity={currentInventoryQuantity}
            onAddToInventory={onAddToInventory!} // ✅ Passes through with new signature
            isVisible={true}
            barcodeType={barcodeType}
          />
        )}

        {/* Product Description */}
        <ProductDescription product={product!} />

        {/* Barcode Information */}
        <BarcodeInfo product={product!} scannedBarcode={barcode} />

        {/* Additional Product Details */}
        <ProductDetails product={product!} />

        {/* Nutrition Information */}
        <NutritionInfo product={product!} />
      </div>
    </div>
  );
};
