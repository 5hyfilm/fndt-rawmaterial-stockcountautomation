// src/components/headers/AppTitle.tsx
"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface AppTitleProps {
  compact?: boolean; // For mobile or compact mode
}

export const AppTitle: React.FC<AppTitleProps> = ({ compact = false }) => {
  if (compact) {
    // Mobile version - minimal display
    return (
      <div className="px-3 py-2">
        {/* Minimal mobile header - can be empty or show compact title */}
        <div className="text-center">
          <h1 className="text-sm font-semibold text-gray-800">
            ระบบจัดการสินค้า F&N
          </h1>
        </div>
      </div>
    );
  }

  // Desktop version - full display
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center gap-3">
        {/* F&N Barcode Scanner Logo */}
        <Image
          src="/fn-barcode-scanner.png"
          alt="F&N Barcode Scanner"
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
          priority
        />

        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center gap-2 sm:gap-3">
            <span className="fn-gradient-text">ระบบจัดการสินค้า</span>
            <Sparkles className="fn-red" size={20} />
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            F&N Inventory Management System
          </p>
        </div>
      </div>
    </div>
  );
};
