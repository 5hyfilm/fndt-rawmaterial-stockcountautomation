// Path: src/components/headers/AppHeader.tsx
"use client";

import React from "react";
import { Product } from "../../types/product";
import { EmployeeHeader } from "./EmployeeHeader";
import { AppTitle } from "./AppTitle";
import { TabNavigation } from "../navigation/TabNavigation";
import { StatusBar } from "../status/StatusBar";

// ✅ Single, comprehensive interface - ลบ duplicates และ unused props แล้ว
interface AppHeaderProps {
  employeeName: string;
  branchCode?: string;
  branchName?: string;
  formatTimeRemaining?: () => string;
  activeTab: "scanner" | "inventory";
  isStreaming: boolean;
  lastDetectedCode?: string;
  product?: Product | null;
  totalItems: number;
  onLogout: () => void;
  onTabChange: (tab: "scanner" | "inventory") => void;
  isMobile?: boolean; // ✅ เพิ่ม prop สำหรับควบคุมจากภายนอก
}

// ✅ Custom hook สำหรับ mobile detection (แยกออกจาก component)
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// ✅ Mobile Header Component - แยกออกมาเพื่อความชัดเจน
const MobileAppHeader: React.FC<AppHeaderProps> = ({
  employeeName,
  branchCode,
  branchName,
  formatTimeRemaining,
  activeTab,
  isStreaming,
  lastDetectedCode,
  totalItems,
  onLogout,
  onTabChange,
}) => (
  <div
    className="bg-white border-b border-gray-200 sticky top-0 z-40"
    style={{
      paddingTop: "max(env(safe-area-inset-top), 0px)",
    }}
  >
    <EmployeeHeader
      employeeName={employeeName}
      branchCode={branchCode}
      branchName={branchName}
      formatTimeRemaining={formatTimeRemaining}
      onLogout={onLogout}
      compact={true}
    />

    <AppTitle compact={true} />

    <TabNavigation
      activeTab={activeTab}
      onTabChange={onTabChange}
      isMobile={true}
    />

    <StatusBar
      isStreaming={isStreaming}
      lastDetectedCode={lastDetectedCode}
      totalItems={totalItems}
      isMobile={true}
    />
  </div>
);

// ✅ Desktop Header Component - แยกออกมาเพื่อความชัดเจน
const DesktopAppHeader: React.FC<AppHeaderProps> = ({
  employeeName,
  branchCode,
  branchName,
  formatTimeRemaining,
  activeTab,
  isStreaming,
  lastDetectedCode,
  product,
  totalItems,
  onLogout,
  onTabChange,
}) => (
  <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div className="container mx-auto px-4 py-4">
      <EmployeeHeader
        employeeName={employeeName}
        branchCode={branchCode}
        branchName={branchName}
        formatTimeRemaining={formatTimeRemaining}
        onLogout={onLogout}
        compact={false}
      />

      <AppTitle compact={false} />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        isMobile={false}
      />

      <StatusBar
        isStreaming={isStreaming}
        lastDetectedCode={lastDetectedCode}
        product={product}
        totalItems={totalItems}
        isMobile={false}
      />
    </div>
  </div>
);

// ✅ Main AppHeader Component - เป็น smart component ที่ตัดสินใจ layout
export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const detectedMobile = useMobileDetection();

  // ✅ ใช้ prop isMobile ก่อน ถ้าไม่มีให้ fallback ไป detection
  const isMobile =
    props.isMobile !== undefined ? props.isMobile : detectedMobile;

  // ✅ Conditional rendering แบบชัดเจน
  return isMobile ? (
    <MobileAppHeader {...props} />
  ) : (
    <DesktopAppHeader {...props} />
  );
};

// ✅ Export types สำหรับใช้ใน components อื่น (AppHeader cleaned - no unused props)
export type { AppHeaderProps };
