// src/components/headers/DesktopAppTitle.tsx
"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export const DesktopAppTitle: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center gap-3">
        {/* F&N Logo */}
        {/* <div className="bg-gray-100 backdrop-blur-sm rounded-xl p-2 border border-gray-300 shadow-sm"> */}
        <Image
          src="/fn-barcode-scanner.png"
          alt="F&N Logo"
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
          priority
        />
        {/* </div> */}

        {/* Title Section - Removed Stock check text */}
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
