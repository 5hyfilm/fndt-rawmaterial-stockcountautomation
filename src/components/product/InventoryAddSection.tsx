// src/components/product/InventoryAddSection.tsx - Phase 2: Integrated with Multi-Unit API
"use client";

import React, { useState, useEffect } from "react";
import { Archive, Plus, Minus, Check, Package2 } from "lucide-react";
import { Product } from "../../types/product";
import { QuantityInput } from "../../hooks/inventory/types";

interface InventoryAddSectionProps {
  product: Product;
  currentInventoryQuantity: number;
  onAddToInventory: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType: "cs" | "dsp" | "ea"
  ) => boolean;
  isVisible: boolean;
  barcodeType?: "cs" | "dsp" | "ea";
}

// ✅ Unit configuration for different barcode types
const UNIT_CONFIG = {
  ea: {
    label: "ชิ้น",
    shortLabel: "EA",
    icon: Package2,
    color: "bg-blue-100 text-blue-700",
  },
  dsp: {
    label: "แพ็ค",
    shortLabel: "DSP",
    icon: Package2,
    color: "bg-green-100 text-green-700",
  },
  cs: {
    label: "ลัง",
    shortLabel: "CS",
    icon: Archive,
    color: "bg-orange-100 text-orange-700",
  },
};

export const InventoryAddSection: React.FC<InventoryAddSectionProps> = ({
  product,
  onAddToInventory,
  isVisible,
  barcodeType = "ea",
}) => {
  // ✅ Single quantity state for simplified input
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const unitConfig = UNIT_CONFIG[barcodeType];

  // Reset states when visibility or barcode type changes
  useEffect(() => {
    if (isVisible) {
      setQuantity(1);
      setInputValue("1");
      setAddSuccess(false);
    }
  }, [isVisible, barcodeType]);

  // ✅ Handle quantity input change
  const handleQuantityChange = (value: string) => {
    setInputValue(value);
    if (value === "" || value === "0") return;

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(numValue);
    }
  };

  // ✅ Handle input blur (validation)
  const handleInputBlur = () => {
    if (inputValue === "" || parseInt(inputValue) < 1) {
      setInputValue("1");
      setQuantity(1);
    } else {
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue) && numValue >= 1) {
        const validValue = Math.max(1, numValue);
        setQuantity(validValue);
        setInputValue(validValue.toString());
      } else {
        setInputValue("1");
        setQuantity(1);
      }
    }
  };

  // ✅ Increase quantity
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  };

  // ✅ Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  // ✅ Handle adding to inventory with new API
  const handleAddToInventory = async () => {
    setIsAdding(true);
    try {
      // ✅ Use new multi-unit API format
      const quantityInput: QuantityInput = {
        quantity: quantity,
        unit: barcodeType,
      };

      console.log("🔘 Adding with multi-unit API:", {
        product: product.name,
        quantity: quantity,
        unit: barcodeType,
        materialCode: product.id || product.barcode,
      });

      const success = onAddToInventory(product, quantityInput, barcodeType);

      if (success) {
        setAddSuccess(true);

        // Reset to default
        setQuantity(1);
        setInputValue("1");

        setTimeout(() => {
          setAddSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Failed to add to inventory:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Validation for add button
  const canAdd = inputValue !== "" && quantity >= 1;

  if (!isVisible) return null;

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {addSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="bg-green-100 rounded-full p-1">
            <Check className="text-green-600" size={16} />
          </div>
          <div>
            <p className="text-green-800 font-medium">
              เพิ่มใน Inventory สำเร็จ!
            </p>
            <p className="text-green-600 text-sm">
              รายการจะถูกรวมตาม SKU เดียวกัน
            </p>
          </div>
        </div>
      )}

      {/* Product Info Summary */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="text-sm">
          <div className="font-medium text-blue-900">{product.name}</div>
          <div className="text-blue-700 text-xs mt-1">
            Material Code: {product.id || product.barcode}
          </div>
        </div>
      </div>

      {/* Quantity Input Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Archive className="text-fn-green" size={20} />
          <span className="font-medium text-gray-900">เพิ่มใน Inventory</span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${unitConfig.color}`}
          >
            {unitConfig.shortLabel}
          </span>
        </div>

        {/* ✅ Single simplified quantity input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <unitConfig.icon size={16} />
              จำนวน ({unitConfig.label})
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={handleInputBlur}
                onKeyPress={(e) => e.key === "Enter" && handleInputBlur()}
                className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-fn-green focus:border-transparent text-lg font-medium"
                min="1"
                placeholder="1"
              />

              <button
                onClick={increaseQuantity}
                className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>

              <div className="ml-2 text-sm text-gray-600">
                {unitConfig.label}
              </div>
            </div>

            {/* ✅ Show scanned type indicator */}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <div
                className={`w-2 h-2 rounded-full ${
                  barcodeType === "cs"
                    ? "bg-orange-400"
                    : barcodeType === "dsp"
                    ? "bg-green-400"
                    : "bg-blue-400"
                }`}
              ></div>
              สแกนจากบาร์โค้ด {barcodeType.toUpperCase()}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToInventory}
            disabled={!canAdd || isAdding}
            className="w-full bg-fn-green text-white py-3 px-4 rounded-lg hover:bg-fn-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังเพิ่ม...
              </>
            ) : (
              <>
                <Plus size={18} />
                เพิ่มใน Inventory
              </>
            )}
          </button>
        </div>
      </div>

      {/* ✅ Summary display with multi-unit info */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <div>
          จะเพิ่ม:{" "}
          <span className="font-medium text-gray-700">
            {quantity} {unitConfig.label}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span>📦</span>
          <span>รายการจะรวมตาม Material Code</span>
        </div>
      </div>
    </div>
  );
};
