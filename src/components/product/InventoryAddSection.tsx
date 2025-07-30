// src/components/product/InventoryAddSection.tsx - Updated to show EA only in UI
"use client";

import React, { useState, useEffect } from "react";
import { Archive, Plus, Minus, Check, Package2 } from "lucide-react";
import { Product } from "../../types/product";
import { QuantityInput } from "../../types/inventory";

interface InventoryAddSectionProps {
  product: Product;
  currentInventoryQuantity: number;
  onAddToInventory: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType?: "ea" // 🔴 ลบ "cs" | "dsp" ออก - แสดงแค่ EA ใน UI
  ) => boolean;
  isVisible: boolean;
  barcodeType?: "ea"; // 🔴 ลบ "cs" | "dsp" ออก - แสดงแค่ EA ใน UI
}

// ✅ Unit configuration - เหลือแค่ EA ใน UI
const UNIT_CONFIG = {
  ea: {
    label: "kg",
    shortLabel: "kg",
    icon: Package2,
    color: "bg-blue-100 text-blue-700",
  },
  // 🔴 ลบ dsp และ cs ออกจาก UI config
};

export const InventoryAddSection: React.FC<InventoryAddSectionProps> = ({
  product,
  onAddToInventory,
  isVisible,
  // barcodeType = "ea", // 🔴 Default เป็น EA เท่านั้น
}) => {
  // ✅ Single quantity state for simplified input
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const unitConfig = UNIT_CONFIG.ea; // 🔴 บังคับใช้ EA เท่านั้น

  // Reset states when visibility changes
  useEffect(() => {
    if (isVisible) {
      setQuantity(1);
      setInputValue("1");
      setAddSuccess(false);
    }
  }, [isVisible]); // 🔴 ลบ barcodeType dependency ออก

  // ✅ Handle quantity input change
  const handleQuantityChange = (value: string) => {
    setInputValue(value);
    if (value === "" || isNaN(Number(value))) {
      setQuantity(1);
      return;
    }
    const numValue = Math.max(1, parseInt(value) || 1);
    setQuantity(numValue);
  };

  // ✅ Handle input blur to format value
  const handleInputBlur = () => {
    setInputValue(quantity.toString());
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

  // ✅ Handle add to inventory
  const handleAddToInventory = async () => {
    if (quantity <= 0) return;

    setIsAdding(true);
    try {
      // ✅ ส่งข้อมูลเป็น simple number สำหรับ EA
      const success = onAddToInventory(product, quantity, "ea"); // 🔴 บังคับเป็น EA เท่านั้น

      if (success) {
        setAddSuccess(true);
        setQuantity(1);
        setInputValue("1");
        setTimeout(() => setAddSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to inventory:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Validation
  const canAdd = quantity > 0 && !isAdding;

  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
      {/* ✅ Success message */}
      {addSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Check className="text-green-600" size={16} />
            <p className="text-green-800 font-medium text-sm">
              เพิ่มในคลังสำเร็จ!
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

        {/* ✅ Single simplified quantity input for EA only */}
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

            {/* ✅ Show scanned type indicator - แสดงแค่ EA */}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              หน่วยนับ: kg
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

      {/* ✅ Summary display */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <span>📦</span>
          <span>รายการจะรวมตาม Material Code</span>
        </div>
      </div>
    </div>
  );
};
