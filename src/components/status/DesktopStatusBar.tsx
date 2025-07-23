// ./src/components/status/DesktopStatusBar.tsx
"use client";

import React from "react";
import { Package, Info, BarChart3 } from "lucide-react";
import { Product } from "../../types/product";

interface DesktopStatusBarProps {
  isStreaming: boolean;
  lastDetectedCode?: string;
  product?: Product | null; // แก้ไขจาก any เป็น Product | null
  totalItems: number;
}

export const DesktopStatusBar: React.FC<DesktopStatusBarProps> = ({
  isStreaming,
  lastDetectedCode,
  product,
  totalItems,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-3">
      <div className="flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isStreaming ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span>{isStreaming ? "กล้องทำงาน" : "กล้องหยุด"}</span>
      </div>

      {lastDetectedCode && (
        <div className="flex items-center gap-1">
          <Package size={12} className="fn-green" />
          <span>สแกนล่าสุด: {lastDetectedCode.substring(0, 8)}...</span>
        </div>
      )}

      {product && (
        <div className="flex items-center gap-1">
          <Info size={12} className="text-blue-500" />
          <span className="text-blue-600 font-medium">{product.name}</span>
        </div>
      )}

      {totalItems > 0 && (
        <div className="flex items-center gap-1">
          <BarChart3 size={12} className="text-purple-500" />
          <span className="text-purple-600 font-medium">
            Stock: {totalItems} ชิ้น
          </span>
        </div>
      )}
    </div>
  );
};
