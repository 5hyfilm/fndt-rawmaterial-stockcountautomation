// src/components/status/StatusBar.tsx
"use client";

import React from "react";
import { Package, Info, BarChart3 } from "lucide-react";
import { Product } from "../../types/product";

interface StatusBarProps {
  isStreaming: boolean;
  lastDetectedCode?: string;
  product?: Product | null; // Desktop only - mobile ignores this
  totalItems: number;
  isMobile?: boolean; // ✅ รับ prop สำหรับควบคุม layout
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isStreaming,
  lastDetectedCode,
  product,
  totalItems,
  isMobile = false,
}) => {
  if (isMobile) {
    // Mobile version - compact horizontal layout
    return (
      <div className="px-3 pb-2 flex items-center justify-center gap-3 text-xs text-gray-600">
        {/* Status indicator */}
        <div className="flex items-center gap-1">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isStreaming ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>{isStreaming ? "ON" : "OFF"}</span>
        </div>

        {/* Last detected barcode - abbreviated */}
        {lastDetectedCode && (
          <div className="flex items-center gap-1">
            <Package size={10} className="fn-green" />
            <span>...{lastDetectedCode.slice(-6)}</span>
          </div>
        )}

        {/* Total items - simple count */}
        {totalItems > 0 && (
          <div className="flex items-center gap-1">
            <BarChart3 size={10} className="text-purple-500" />
            <span className="text-purple-600 font-medium">{totalItems}</span>
          </div>
        )}
      </div>
    );
  }

  // Desktop version - detailed horizontal layout with more spacing
  return (
    <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-3">
      {/* Status indicator */}
      <div className="flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isStreaming ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span>{isStreaming ? "กล้องทำงาน" : "กล้องหยุด"}</span>
      </div>

      {/* Last detected barcode - full display */}
      {lastDetectedCode && (
        <div className="flex items-center gap-1">
          <Package size={12} className="fn-green" />
          <span>สแกนล่าสุด: {lastDetectedCode.substring(0, 8)}...</span>
        </div>
      )}

      {/* Product info - desktop only */}
      {product && (
        <div className="flex items-center gap-1">
          <Info size={12} className="text-blue-500" />
          <span className="text-blue-600 font-medium">{product.name}</span>
        </div>
      )}

      {/* Total items - with label */}
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
