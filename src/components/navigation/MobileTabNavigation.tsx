// src/components/navigation/MobileTabNavigation.tsx
"use client";

import React from "react";
import { Camera, Archive } from "lucide-react";

interface MobileTabNavigationProps {
  activeTab: "scanner" | "inventory";
  totalSKUs: number; // ✅ เปลี่ยนจาก totalProducts เป็น totalSKUs
  onTabChange: (tab: "scanner" | "inventory") => void;
}

export const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="px-3 pb-2">
      <div className="bg-gray-100 rounded-lg p-1 flex">
        <button
          onClick={() => onTabChange("scanner")}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
            activeTab === "scanner"
              ? "bg-white text-fn-green shadow-sm"
              : "text-gray-600"
          }`}
        >
          <Camera size={14} />
          สแกน
        </button>
        <button
          onClick={() => onTabChange("inventory")}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
            activeTab === "inventory"
              ? "bg-white text-fn-green shadow-sm"
              : "text-gray-600"
          }`}
        >
          <Archive size={14} />
          Inventory
        </button>
      </div>
    </div>
  );
};
