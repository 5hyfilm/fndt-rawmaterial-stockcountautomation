// Path: src/components/headers/MobileEmployeeHeader.tsx
"use client";

import React from "react";
import { User, LogOut } from "lucide-react";
import Image from "next/image";

interface MobileEmployeeHeaderProps {
  employeeName: string;
  branchCode?: string;
  branchName?: string;
  onLogout: () => void;
}

export const MobileEmployeeHeader: React.FC<MobileEmployeeHeaderProps> = ({
  employeeName,
  onLogout,
}) => {
  return (
    <div
      className="bg-gradient-to-r from-fn-green to-fn-red text-white"
      style={{
        // ✅ ลบ safe-area-top class และใช้ inline style แทน
        // เพราะ parent (MobileAppHeader) จัดการ safe area แล้ว
        paddingTop: "8px", // py-2 equivalent
        paddingBottom: "8px",
        paddingLeft: "12px", // px-3 equivalent
        paddingRight: "12px",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - F&N Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/fn-logo.png"
            alt="F&N Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
            priority
          />
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-2 text-sm">
          <User size={14} />
          <span className="max-w-24 truncate">{employeeName}</span>
          <button
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 p-1 rounded transition-colors touch-button"
            title="ออกจากระบบ"
            style={{
              // ✅ เพิ่ม touch-friendly size สำหรับมือถือ
              minHeight: "32px",
              minWidth: "32px",
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
