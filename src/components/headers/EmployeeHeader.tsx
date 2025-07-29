// src/components/headers/EmployeeHeader.tsx
"use client";

import React from "react";
import { User, LogOut, Clock } from "lucide-react";
import Image from "next/image";

interface EmployeeHeaderProps {
  employeeName: string;
  branchCode?: string;
  branchName?: string;
  formatTimeRemaining?: () => string;
  onLogout: () => void;
  compact?: boolean; // For mobile mode
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employeeName,
  branchCode,
  branchName,
  formatTimeRemaining,
  onLogout,
  compact = false,
}) => {
  if (compact) {
    // Mobile version - compact header
    return (
      <div
        className="bg-gradient-to-r from-fn-green to-fn-red text-white"
        style={{
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "12px",
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
  }

  // Desktop version - full detailed header
  return (
    <div className="bg-gradient-to-r from-fn-green/10 to-fn-red/10 border border-fn-green/30 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Employee info */}
        <div className="flex items-center gap-3">
          {/* F&N Logo */}
          <Image
            src="/fn-logo.png"
            alt="F&N Logo"
            width={30}
            height={30}
            className="w-10 h-10 object-contain"
            priority
          />

          <div className="bg-fn-green/20 p-2 rounded-lg">
            <User className="fn-green" size={16} />
          </div>

          <div>
            <div className="font-semibold text-gray-900">{employeeName}</div>
            {branchCode && branchName && (
              <div className="text-sm text-gray-600">
                {branchCode} - {branchName}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Time and Logout */}
        <div className="flex items-center gap-3">
          {formatTimeRemaining && (
            <div className="text-right text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                เหลือเวลา: {formatTimeRemaining()}
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
