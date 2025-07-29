// Path: src/components/navigation/TabNavigation.tsx
"use client";

import React from "react";
import { Camera, Archive } from "lucide-react";

// ✅ Cleaned interface - ลบ totalSKUs ที่ไม่ได้ใช้
interface TabNavigationProps {
  activeTab: "scanner" | "inventory";
  onTabChange: (tab: "scanner" | "inventory") => void;
  isMobile?: boolean; // ✅ รับ prop สำหรับควบคุม layout

  // ✅ Optional badge/counter props (สำหรับอนาคต)
  scannerBadge?: number;
  inventoryBadge?: number;
  showBadges?: boolean;
}

// ✅ Mobile Tab Button Component - แยกออกมาเพื่อความชัดเจน
const MobileTabButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  showBadge?: boolean;
}> = ({ isActive, onClick, icon, label, badge, showBadge }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
      isActive
        ? "bg-white text-fn-green shadow-sm"
        : "text-gray-600 hover:text-gray-700"
    }`}
  >
    {icon}
    <span>{label}</span>
    {showBadge && badge && badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </button>
);

// ✅ Desktop Tab Button Component - แยกออกมาเพื่อความชัดเจน
const DesktopTabButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  showBadge?: boolean;
}> = ({ isActive, onClick, icon, label, badge, showBadge }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
      isActive
        ? "bg-white text-fn-green shadow-sm"
        : "text-gray-600 hover:text-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
    {showBadge && badge && badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-5 flex items-center justify-center px-1">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </button>
);

// ✅ Main TabNavigation Component - Cleaned และ Enhanced
export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  isMobile = false,
  scannerBadge,
  inventoryBadge,
  showBadges = false,
}) => {
  // ✅ Handle tab change with analytics/logging potential
  const handleTabChange = (tab: "scanner" | "inventory") => {
    // ✅ เพิ่ม analytics tracking ได้ในอนาคต
    console.log(`📱 Tab switched to: ${tab}`);
    onTabChange(tab);
  };

  if (isMobile) {
    // Mobile version - compact layout
    return (
      <div className="px-3 pb-2">
        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
          <MobileTabButton
            isActive={activeTab === "scanner"}
            onClick={() => handleTabChange("scanner")}
            icon={<Camera size={14} />}
            label="สแกน"
            badge={scannerBadge}
            showBadge={showBadges}
          />
          <MobileTabButton
            isActive={activeTab === "inventory"}
            onClick={() => handleTabChange("inventory")}
            icon={<Archive size={14} />}
            label="Inventory"
            badge={inventoryBadge}
            showBadge={showBadges}
          />
        </div>
      </div>
    );
  }

  // Desktop version - centered layout with full text
  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
        <DesktopTabButton
          isActive={activeTab === "scanner"}
          onClick={() => handleTabChange("scanner")}
          icon={<Camera size={16} />}
          label="สแกนสินค้า"
          badge={scannerBadge}
          showBadge={showBadges}
        />
        <DesktopTabButton
          isActive={activeTab === "inventory"}
          onClick={() => handleTabChange("inventory")}
          icon={<Archive size={16} />}
          label="จัดการ Inventory"
          badge={inventoryBadge}
          showBadge={showBadges}
        />
      </div>
    </div>
  );
};

// ✅ Export types สำหรับใช้ใน components อื่น
export type { TabNavigationProps };
