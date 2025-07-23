// src/components/navigation/DesktopTabNavigation.tsx
"use client";

import React from "react";
import { Camera, Archive } from "lucide-react";

interface DesktopTabNavigationProps {
  activeTab: "scanner" | "inventory";
  totalSKUs: number; // ✅ เปลี่ยนจาก totalProducts เป็น totalSKUs
  onTabChange: (tab: "scanner" | "inventory") => void;
}

export const DesktopTabNavigation: React.FC<DesktopTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 rounded-lg p-1 flex">
        <button
          onClick={() => onTabChange("scanner")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "scanner"
              ? "bg-white text-fn-green shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Camera size={16} />
          สแกนสินค้า
        </button>
        <button
          onClick={() => onTabChange("inventory")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "inventory"
              ? "bg-white text-fn-green shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Archive size={16} />
          จัดการ Inventory
        </button>
      </div>
    </div>
  );
};
