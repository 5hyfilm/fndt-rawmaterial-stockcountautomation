// src/components/layout/MobileLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { AppHeader } from "../AppHeader";

interface EmployeeInfo {
  employeeName: string;
  branchCode: string;
  branchName: string;
  timestamp: string;
}

interface MobileLayoutProps {
  employee: EmployeeInfo;
  onLogout: () => void;
  children: React.ReactNode;
  fullScreenMode?: boolean; // New prop for full screen camera mode
  hideHeaderInFullScreen?: boolean; // Option to hide header in full screen
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  employee,
  onLogout,
  children,
  fullScreenMode = false,
  hideHeaderInFullScreen = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add/remove body class for full screen mode
  useEffect(() => {
    if (fullScreenMode && isMobile) {
      document.body.classList.add("fullscreen-active");
      // ไม่บล็อก scroll - ให้แถบสถานะแสดงปกติ
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    } else {
      document.body.classList.remove("fullscreen-active");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("fullscreen-active");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [fullScreenMode, isMobile]);

  // Full screen mode layout - แต่ยังเหลือพื้นที่สำหรับ status bar
  if (fullScreenMode && isMobile) {
    return (
      <div
        className="min-h-screen w-full bg-black"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Optional floating header */}
        {!hideHeaderInFullScreen && (
          <div
            className="absolute top-0 left-0 right-0 z-50"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <AppHeader
              employee={employee}
              onLogout={onLogout}
              compact={true}
              transparent={true}
              floating={true}
            />
          </div>
        )}

        {/* Full screen content */}
        {children}
      </div>
    );
  }

  // Regular layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mobile-viewport">
      {/* Header */}
      <AppHeader employee={employee} onLogout={onLogout} compact={isMobile} />

      {/* Main Content */}
      <main
        className={`flex-1 ${
          isMobile
            ? "px-2 py-3" // Minimal padding on mobile
            : "container mx-auto px-6 py-6" // More spacious on desktop
        }`}
      >
        {children}
      </main>
    </div>
  );
};
