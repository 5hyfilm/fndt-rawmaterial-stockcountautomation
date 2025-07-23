// src/components/headers/DesktopAppHeader.tsx
"use client";

import React from "react";
import { Product } from "../../types/product";
import { DesktopEmployeeHeader } from "./DesktopEmployeeHeader";
import { DesktopAppTitle } from "./DesktopAppTitle";
import { DesktopTabNavigation } from "../navigation/DesktopTabNavigation";
import { DesktopStatusBar } from "../status/DesktopStatusBar";

interface DesktopAppHeaderProps {
  employeeName: string;
  branchCode: string;
  branchName: string;
  formatTimeRemaining: () => string;
  activeTab: "scanner" | "inventory";
  totalSKUs: number; // ✅ เปลี่ยนจาก totalProducts เป็น totalSKUs
  isStreaming: boolean;
  lastDetectedCode?: string;
  product?: Product | null;
  totalItems: number;
  onLogout: () => void;
  onTabChange: (tab: "scanner" | "inventory") => void;
}

export const DesktopAppHeader: React.FC<DesktopAppHeaderProps> = ({
  employeeName,
  branchCode,
  branchName,
  formatTimeRemaining,
  activeTab,
  totalSKUs, // ✅ เปลี่ยนจาก totalProducts เป็น totalSKUs
  isStreaming,
  lastDetectedCode,
  product,
  totalItems,
  onLogout,
  onTabChange,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <DesktopEmployeeHeader
          employeeName={employeeName}
          branchCode={branchCode}
          branchName={branchName}
          formatTimeRemaining={formatTimeRemaining}
          onLogout={onLogout}
        />

        <DesktopAppTitle />

        <DesktopTabNavigation
          activeTab={activeTab}
          totalSKUs={totalSKUs} // ✅ ส่ง totalSKUs แทน totalProducts
          onTabChange={onTabChange}
        />

        <DesktopStatusBar
          isStreaming={isStreaming}
          lastDetectedCode={lastDetectedCode}
          product={product}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};
