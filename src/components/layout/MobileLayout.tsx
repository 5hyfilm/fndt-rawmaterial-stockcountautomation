// Path: src/components/layout/MobileLayout.tsx
"use client";

import React, { useEffect } from "react";
import { AppHeader, AppHeaderProps } from "../headers/AppHeader";
import { Product } from "../../types/product";
// ✅ FIXED: Import Employee from central types instead of duplicate interface
import { Employee } from "../../types/auth";

// ✅ Simplified props - ลบ duplicate EmployeeInfo interface
interface MobileLayoutProps {
  employee: Employee; // ✅ Use central Employee type
  onLogout: () => void;
  children: React.ReactNode;

  // Layout control
  fullScreenMode?: boolean;
  hideHeaderInFullScreen?: boolean;
  isMobile?: boolean;

  // AppHeader props - pass through to header
  activeTab?: "scanner" | "inventory";
  isStreaming?: boolean;
  lastDetectedCode?: string;
  product?: Product | null;
  totalItems?: number;
  onTabChange?: (tab: "scanner" | "inventory") => void;
  formatTimeRemaining?: () => string;

  // Optional styling
  className?: string;
  contentClassName?: string;
}

// ✅ Full Screen Layout Component
const FullScreenLayout: React.FC<{
  children: React.ReactNode;
  hideHeader: boolean;
  headerProps?: AppHeaderProps;
}> = ({ children, hideHeader, headerProps }) => (
  <div
    className="min-h-screen w-full bg-black flex flex-col"
    style={{
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
    }}
  >
    {/* Optional floating header */}
    {!hideHeader && headerProps && (
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <AppHeader {...headerProps} isMobile={true} />
      </div>
    )}

    {/* Full screen content */}
    <div className={`flex-1 ${!hideHeader ? "pt-16" : ""}`}>{children}</div>
  </div>
);

// ✅ Regular Layout Component
const RegularLayout: React.FC<{
  children: React.ReactNode;
  headerProps: AppHeaderProps;
  isMobile: boolean;
  className?: string;
  contentClassName?: string;
}> = ({ children, headerProps, isMobile, className, contentClassName }) => (
  <div className={`min-h-screen bg-gray-50 flex flex-col ${className || ""}`}>
    {/* Header */}
    <AppHeader {...headerProps} isMobile={isMobile} />

    {/* Main Content */}
    <main
      className={`flex-1 ${
        isMobile
          ? "px-2 py-3" // Minimal padding on mobile
          : "container mx-auto px-6 py-6" // More spacious on desktop
      } ${contentClassName || ""}`}
    >
      {children}
    </main>
  </div>
);

// ✅ Main MobileLayout Component - Fixed Employee Types
export const MobileLayout: React.FC<MobileLayoutProps> = ({
  employee,
  onLogout,
  children,
  fullScreenMode = false,
  hideHeaderInFullScreen = true,
  isMobile = true,

  // AppHeader props
  activeTab = "scanner",
  isStreaming = false,
  lastDetectedCode,
  product,
  totalItems = 0,
  onTabChange = () => {},
  formatTimeRemaining,

  // Styling props
  className,
  contentClassName,
}) => {
  // ✅ Handle full screen mode body styles
  useEffect(() => {
    if (fullScreenMode) {
      document.body.classList.add("fullscreen-mode");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.classList.remove("fullscreen-mode");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.classList.remove("fullscreen-mode");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [fullScreenMode]);

  // ✅ FIXED: Create header props with proper Employee interface mapping
  const headerProps: AppHeaderProps = {
    employeeName: employee.name, // ✅ Map Employee.name to employeeName for header
    branchCode: employee.branchCode,
    branchName: employee.branchName,
    formatTimeRemaining,
    activeTab,
    isStreaming,
    lastDetectedCode,
    product,
    totalItems,
    onLogout,
    onTabChange,
  };

  // ✅ Conditional rendering based on full screen mode
  if (fullScreenMode) {
    return (
      <FullScreenLayout
        hideHeader={hideHeaderInFullScreen}
        headerProps={hideHeaderInFullScreen ? undefined : headerProps}
      >
        {children}
      </FullScreenLayout>
    );
  }

  // ✅ Regular layout
  return (
    <RegularLayout
      headerProps={headerProps}
      isMobile={isMobile}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </RegularLayout>
  );
};

// ✅ REMOVED: Duplicate EmployeeInfo interface export
export type { MobileLayoutProps };
