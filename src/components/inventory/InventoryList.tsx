// Path: src/components/inventory/InventoryList.tsx - Fixed materialCode Support
"use client";

import React from "react";
import { InventoryItem, QuantityDetail } from "../../hooks/inventory/types";
import { InventoryListItem } from "./InventoryListItem";
import { Package } from "lucide-react";

interface InventoryListProps {
  items: InventoryItem[];
  totalCount: number;
  editingItem: string | null;
  editQuantity: number;
  onEditStart: (item: InventoryItem) => void;
  onEditSave: () => void;
  onEditQuantityDetailSave?: (
    materialCode: string, // ✅ FIXED: Change from itemId to materialCode
    quantityDetail: QuantityDetail
  ) => boolean;
  onEditCancel: () => void;
  onEditQuantityChange: (quantity: number) => void;
  onEditQuantityDetailChange?: (quantityDetail: QuantityDetail) => void;
  onQuickAdjust: (
    itemId: string,
    currentQuantity: number,
    delta: number
  ) => void;
  onRemoveItem: (itemId: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  items,
  totalCount,
  editingItem,
  editQuantity,
  onEditStart,
  onEditSave,
  onEditQuantityDetailSave,
  onEditCancel,
  onEditQuantityChange,
  onEditQuantityDetailChange,
  onQuickAdjust,
  onRemoveItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ไม่มีรายการสินค้า
        </h3>
        <p className="text-gray-500">
          เริ่มต้นการนับสต็อกด้วยการสแกนบาร์โค้ดสินค้า
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          รายการสินค้า ({items.length} จาก {totalCount} รายการ)
        </h2>
      </div>

      {/* Items List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <InventoryListItem
            key={item.id}
            item={item}
            isEditing={editingItem === item.id}
            editQuantity={editQuantity}
            onEditStart={() => onEditStart(item)}
            onEditSave={onEditSave}
            onEditQuantityDetailSave={onEditQuantityDetailSave} // ✅ Pass through correctly
            onEditCancel={onEditCancel}
            onEditQuantityChange={onEditQuantityChange}
            onEditQuantityDetailChange={onEditQuantityDetailChange}
            onQuickAdjust={(delta) =>
              onQuickAdjust(item.id, item.quantity, delta)
            }
            onRemove={() => onRemoveItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
