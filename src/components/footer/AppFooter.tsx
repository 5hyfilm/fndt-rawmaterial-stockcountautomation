// src/components/footer/AppFooter.tsx
"use client";

import React from "react";
import { Product } from "../../types/product";

interface AppFooterProps {
  employeeName: string;
  branchName: string;
  product?: Product | null;
  totalItems: number;
  lastUpdate?: string;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  employeeName,
  branchName,
  product,
  totalItems,
  lastUpdate,
}) => {
  return (
    <div className="bg-white/80 border-t border-gray-200 mt-8 shadow-sm">
      <div className="container mx-auto px-4 py-4 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          F&N Stock Management System | ระบบเช็ค Stock และจัดการสินค้า |
          {/* <span className="fn-green font-medium"> พัฒนาด้วย Next.js</span> */}
        </p>
        <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-500">
          <span>👤 {employeeName}</span>
          <span>🏢 {branchName}</span>
          {product && (
            <span>
              🎯 สินค้าล่าสุด: {product.name} ({product.brand})
            </span>
          )}
          {totalItems > 0 && <span>📦 รวม Stock: {totalItems} ชิ้น</span>}
          {lastUpdate && (
            <span>
              🕒 อัพเดต: {new Date(lastUpdate).toLocaleDateString("th-TH")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
