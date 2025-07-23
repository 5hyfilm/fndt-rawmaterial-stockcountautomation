// ./src/components/stats/QuickStats.tsx
"use client";

import React from "react";
import { Product } from "../../types/product";

interface QuickStatsProps {
  totalProducts: number;
  totalItems: number;
  categories: Record<string, number>;
  product?: Product | null;
  currentInventoryQuantity: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  totalProducts,
  totalItems,
  categories,
  product,
  currentInventoryQuantity,
}) => {
  return (
    <div className="hidden xl:block mt-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold fn-green">{totalProducts}</div>
            <div className="text-xs text-gray-600">รายการใน Stock</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
            <div className="text-xs text-gray-600">จำนวนรวม</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(categories).length}
            </div>
            <div className="text-xs text-gray-600">หมวดหมู่</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {product && currentInventoryQuantity > 0 ? "📦" : "⏳"}
            </div>
            <div className="text-xs text-gray-600">
              {product && currentInventoryQuantity > 0
                ? "มีใน Stock"
                : product
                ? "ไม่มีใน Stock"
                : "รอสแกน"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
