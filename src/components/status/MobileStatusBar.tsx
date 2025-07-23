// src/components/status/MobileStatusBar.tsx
"use client";

import React from "react";
import { Package, BarChart3 } from "lucide-react";

interface MobileStatusBarProps {
  isStreaming: boolean;
  lastDetectedCode?: string;
  totalItems: number;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  isStreaming,
  lastDetectedCode,
  totalItems,
}) => {
  return (
    <div className="px-3 pb-2 flex items-center justify-center gap-3 text-xs text-gray-600">
      <div className="flex items-center gap-1">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isStreaming ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span>{isStreaming ? "ON" : "OFF"}</span>
      </div>

      {lastDetectedCode && (
        <div className="flex items-center gap-1">
          <Package size={10} className="fn-green" />
          <span>...{lastDetectedCode.slice(-6)}</span>
        </div>
      )}

      {totalItems > 0 && (
        <div className="flex items-center gap-1">
          <BarChart3 size={10} className="text-purple-500" />
          <span className="text-purple-600 font-medium">{totalItems}</span>
        </div>
      )}
    </div>
  );
};
