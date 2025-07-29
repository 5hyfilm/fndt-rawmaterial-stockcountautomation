// Path: src/components/inventory/InventoryListItem.tsx - Cleaned Version (No Legacy Code)
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  Edit3,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  X,
  Archive,
  Package2,
  Clock,
} from "lucide-react";
import { InventoryItem, QuantityDetail } from "../../types/inventory";

interface InventoryListItemProps {
  item: InventoryItem;
  isEditing: boolean;
  editQuantity: number;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditQuantityDetailSave?: (
    materialCode: string,
    quantityDetail: QuantityDetail
  ) => boolean;
  onEditCancel: () => void;
  onEditQuantityChange: (quantity: number) => void;
  onEditQuantityDetailChange?: (quantityDetail: QuantityDetail) => void;
  onQuickAdjust: (delta: number) => void;
  onRemove: () => void;
  onUpdateUnitQuantity?: (
    unit: "cs" | "dsp" | "ea",
    newQuantity: number
  ) => void;
}

// ✅ Enhanced edit state for multi-unit support
interface EditState {
  csQuantity: number;
  dspQuantity: number;
  eaQuantity: number;
}

// ✅ Unit configuration with proper styling
const UNIT_CONFIG = {
  ea: {
    label: "ชิ้น",
    shortLabel: "EA",
    icon: Package2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconClass: "text-blue-500",
    priority: 1,
  },
  dsp: {
    label: "แพ็ค",
    shortLabel: "DSP",
    icon: Package,
    color: "bg-green-100 text-green-700 border-green-200",
    iconClass: "text-green-500",
    priority: 2,
  },
  cs: {
    label: "ลัง",
    shortLabel: "CS",
    icon: Archive,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    iconClass: "text-purple-500",
    priority: 3,
  },
};

// ✅ Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  try {
    const time = new Date(timestamp);
    if (isNaN(time.getTime())) {
      return "เวลาไม่ถูกต้อง";
    }

    return time.toLocaleString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "เวลาไม่ถูกต้อง";
  }
};

// ✅ Helper function to get correct product code
const getProductCode = (item: InventoryItem): string => {
  // ✅ ตรวจสอบว่าเป็นสินค้าใหม่หรือไม่
  const isNewProduct =
    item.productData?.id?.startsWith("NEW_") ||
    item.materialCode?.startsWith("NEW_") ||
    item.brand === "สินค้าใหม่";

  if (isNewProduct) {
    // สำหรับสินค้าใหม่: ใช้รหัสที่ผู้ใช้กรอก (เก็บใน productData.name)
    if (item.productData?.name) {
      return item.productData.name;
    }
    // Fallback สำหรับสินค้าใหม่: ใช้ barcode
    if (item.barcode) {
      return item.barcode;
    }
  } else {
    // สำหรับสินค้าในฐานข้อมูล: ใช้รหัสจาก productData.id
    if (item.productData?.id && !item.productData.id.startsWith("NEW_")) {
      return item.productData.id;
    }
  }

  // สำหรับสินค้าทั่วไป: ใช้ barcode เป็นหลัก
  if (item.barcode) {
    return item.barcode;
  }

  // Fallback: ใช้ materialCode เฉพาะกรณีที่ไม่ใช่ชื่อสินค้า
  if (
    item.materialCode &&
    !item.materialCode.includes("หมื่น") &&
    !item.materialCode.includes("นิว")
  ) {
    return item.materialCode;
  }

  // สุดท้าย: ใช้ id
  return item.id;
};

export const InventoryListItem: React.FC<InventoryListItemProps> = ({
  item,
  isEditing,
  onEditStart,
  onEditSave,
  onEditQuantityDetailSave,
  onEditCancel,
  onEditQuantityDetailChange,
  onRemove,
  onUpdateUnitQuantity,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Initialize edit state (ไม่มี optional chaining - quantities เป็น required)
  const [editState, setEditState] = useState<EditState>(() => {
    return {
      csQuantity: item.quantities.cs || 0,
      dspQuantity: item.quantities.dsp || 0,
      eaQuantity: item.quantities.ea || 0,
    };
  });

  // ✅ Show all 3 units always
  const getAllUnits = (): Array<"cs" | "dsp" | "ea"> => {
    return ["cs", "dsp", "ea"];
  };

  // ✅ Check units with quantity > 0 (ไม่มี optional chaining)
  const getActiveUnits = (): Array<"cs" | "dsp" | "ea"> => {
    return (["cs", "dsp", "ea"] as const).filter(
      (unit) => (item.quantities[unit] || 0) > 0
    );
  };

  const allUnits = getAllUnits();
  const activeUnits = getActiveUnits();

  // ✅ Get primary unit for header display
  const getPrimaryUnit = (): "cs" | "dsp" | "ea" => {
    if (activeUnits.length === 0) return "ea"; // Default
    return activeUnits.sort(
      (a, b) => UNIT_CONFIG[a].priority - UNIT_CONFIG[b].priority
    )[0];
  };

  const primaryUnit = getPrimaryUnit();
  const primaryUnitConfig = UNIT_CONFIG[primaryUnit];

  // ✅ Update edit state when item changes (ไม่มี optional chaining)
  useEffect(() => {
    setEditState({
      csQuantity: item.quantities.cs || 0,
      dspQuantity: item.quantities.dsp || 0,
      eaQuantity: item.quantities.ea || 0,
    });
  }, [item.quantities]);

  // ✅ Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // ✅ Handle unit quantity change
  const handleUnitQuantityChange = (
    unit: "cs" | "dsp" | "ea",
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;

    const updatedState = {
      ...editState,
      [unit + "Quantity"]: newQuantity,
    };
    setEditState(updatedState);

    // Call the parent handler if available
    if (onUpdateUnitQuantity) {
      onUpdateUnitQuantity(unit, newQuantity);
    }

    // Update quantity detail for all items
    if (onEditQuantityDetailChange) {
      const quantityDetail: QuantityDetail = {
        cs: updatedState.csQuantity,
        dsp: updatedState.dspQuantity,
        ea: updatedState.eaQuantity,
        isManualEdit: true,
        lastModified: new Date().toISOString(),
      };
      onEditQuantityDetailChange(quantityDetail);
    }
  };

  // ✅ Handle save action
  const handleSave = () => {
    if (onEditQuantityDetailSave) {
      const quantityDetail: QuantityDetail = {
        cs: editState.csQuantity,
        dsp: editState.dspQuantity,
        ea: editState.eaQuantity,
        isManualEdit: true,
        lastModified: new Date().toISOString(),
      };
      onEditQuantityDetailSave(item.materialCode || item.id, quantityDetail);
    } else {
      onEditSave();
    }
  };

  // ✅ Render timestamp display
  const renderTimestamp = () => {
    const lastUpdated = item.quantityDetail?.lastModified || item.lastUpdated;

    if (!lastUpdated) {
      return null;
    }

    const formattedTime = formatTimestamp(lastUpdated);

    return (
      <div className="flex items-center gap-1 text-xs mt-1 text-gray-500">
        <Clock size={10} className="text-gray-400" />
        <span className="truncate">{formattedTime}</span>
      </div>
    );
  };

  // ✅ Mobile responsive quantity display (ไม่มี optional chaining)
  const renderQuantityDisplay = () => {
    return (
      <div className="text-right min-w-0">
        {/* Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-end">
          {allUnits.map((unit, index) => {
            const config = UNIT_CONFIG[unit];
            const quantity = item.quantities[unit] || 0; // ไม่มี optional chaining
            const hasQuantity = quantity > 0;

            return (
              <div key={unit} className="flex items-center justify-end gap-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    hasQuantity
                      ? config.color
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {config.shortLabel}
                </span>
                <span
                  className={`text-sm font-bold ${
                    hasQuantity ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {quantity}
                </span>
                {/* Remove separators on mobile */}
                {index !== allUnits.length - 1 && (
                  <span className="text-gray-300 text-sm hidden sm:inline">
                    |
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ✅ Mobile-friendly editing interface
  const renderEditingInterface = () => {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-2">
          แก้ไขจำนวนสินค้า
        </div>

        {/* Mobile: Stack units vertically, Desktop: Can be side by side */}
        <div className="grid grid-cols-1 gap-3">
          {allUnits.map((unit) => {
            const config = UNIT_CONFIG[unit];
            const quantity = editState[
              (unit + "Quantity") as keyof EditState
            ] as number;
            const Icon = config.icon;

            return (
              <div
                key={unit}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Unit Badge with Icon - Responsive sizing */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${config.color}`}>
                    <Icon size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${config.color}`}
                  >
                    {config.shortLabel}
                  </span>
                </div>

                {/* Quantity Controls - Touch-friendly */}
                <div className="flex items-center gap-2 flex-1">
                  {/* Touch-friendly buttons */}
                  <button
                    type="button"
                    onClick={() => handleUnitQuantityChange(unit, quantity - 1)}
                    className="min-w-[44px] min-h-[44px] sm:w-8 sm:h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={quantity <= 0}
                  >
                    <Minus size={16} className="sm:w-3.5 sm:h-3.5" />
                  </button>

                  {/* Touch-friendly input */}
                  <input
                    ref={unit === "cs" ? inputRef : undefined}
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleUnitQuantityChange(
                        unit,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-base sm:text-sm"
                    min="0"
                    inputMode="numeric"
                  />

                  <button
                    type="button"
                    onClick={() => handleUnitQuantityChange(unit, quantity + 1)}
                    className="min-w-[44px] min-h-[44px] sm:w-8 sm:h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} className="sm:w-3.5 sm:h-3.5" />
                  </button>

                  <span className="text-sm text-gray-600 ml-1 sm:ml-2 hidden sm:inline">
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons - Touch-friendly */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 min-h-[44px] px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle size={16} />
            <span>บันทึก</span>
          </button>
          <button
            type="button"
            onClick={onEditCancel}
            className="flex-1 min-h-[44px] px-4 py-3 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
          >
            <X size={16} />
            <span>ยกเลิก</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* Product Header - Mobile optimized */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3">
        {/* Product Icon - Responsive sizing */}
        <div
          className={`p-2 sm:p-3 rounded-lg ${primaryUnitConfig.color} flex-shrink-0`}
        >
          <primaryUnitConfig.icon size={20} className="sm:w-6 sm:h-6" />
        </div>

        {/* Product Info - Flexible layout */}
        <div className="flex-1 min-w-0">
          {/* Product description/name */}
          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base leading-tight">
            {item.productData?.description || item.productName}
          </h3>

          {/* Brand and Size - Responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 mt-1">
            <span className="text-sm text-gray-600 font-medium truncate">
              {item.brand}
            </span>
            {item.size && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs text-gray-400 hidden sm:inline">
                  •
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {item.size}
                </span>
              </div>
            )}
          </div>

          {/* Material Code */}
          <div className="text-xs text-gray-500 mt-1 font-mono truncate">
            รหัส F/FG: {getProductCode(item)}
          </div>

          {/* Timestamp Display - Mobile optimized */}
          <div className="sm:hidden">{renderTimestamp()}</div>
        </div>

        {/* Quantity Display - Responsive positioning */}
        <div className="text-right flex-shrink-0">
          {!isEditing && renderQuantityDisplay()}

          {/* Desktop timestamp */}
          <div className="hidden sm:block">{renderTimestamp()}</div>
        </div>
      </div>

      {/* Actions */}
      {isEditing ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {renderEditingInterface()}
        </div>
      ) : (
        <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            {/* Touch-friendly action buttons */}
            <button
              type="button"
              onClick={onEditStart}
              className="flex items-center gap-2 px-3 py-2 min-h-[44px] sm:min-h-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="แก้ไขจำนวน"
            >
              <Edit3 size={16} />
              <span className="text-sm font-medium">แก้ไข</span>
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-2 px-3 py-2 min-h-[44px] sm:min-h-0 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="ลบรายการ"
            >
              <Trash2 size={16} />
              <span className="text-sm font-medium">ลบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
