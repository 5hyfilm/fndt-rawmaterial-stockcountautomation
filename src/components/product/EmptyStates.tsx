// ./src/components/product/EmptyStates.tsx
"use client";

import React from "react";
import { Scan, Package, AlertTriangle, Copy, CheckCircle } from "lucide-react";

// แก้ไข: ใช้ object แทน empty interface หรือ remove interface ถ้าไม่จำเป็น
interface ErrorStateProps {
  error: string;
  barcode?: string;
}

interface ProductNotFoundStateProps {
  barcode: string;
  onCopyBarcode: () => void;
  copied: boolean;
}

// Loading State - ไม่ต้องใช้ interface สำหรับ component ที่ไม่มี props
export const LoadingState: React.FC = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
    <div className="text-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-fn-green border-t-transparent rounded-full mx-auto mb-3"></div>
      <p className="text-gray-600">กำลังค้นหาข้อมูลสินค้า...</p>
    </div>
  </div>
);

// Error State
export const ErrorState: React.FC<ErrorStateProps> = ({ error, barcode }) => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
    <div className="text-center py-8">
      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="text-red-500" size={32} />
      </div>
      <p className="text-red-600 font-medium mb-2">ไม่พบข้อมูลสินค้า</p>
      <p className="text-gray-600 text-sm">{error}</p>
      {barcode && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Barcode ที่สแกน:</p>
          <code className="text-sm font-mono text-gray-800">{barcode}</code>
        </div>
      )}
    </div>
  </div>
);

// Waiting for Scan State - ไม่ต้องใช้ interface สำหรับ component ที่ไม่มี props
export const WaitingScanState: React.FC = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
    <div className="text-center py-8">
      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
        <Scan className="text-gray-500" size={32} />
      </div>
      <p className="text-gray-700 font-medium mb-2">รอการสแกน</p>
      <p className="text-gray-500 text-sm">
        วางบาร์โค้ดในกรอบกล้องเพื่อดูข้อมูลสินค้า
      </p>
    </div>
  </div>
);

// Product Not Found State
export const ProductNotFoundState: React.FC<ProductNotFoundStateProps> = ({
  barcode,
  onCopyBarcode,
  copied,
}) => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
    <div className="text-center py-8">
      <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
        <Package className="text-yellow-600" size={32} />
      </div>
      <p className="text-yellow-600 font-medium mb-2">ไม่พบข้อมูลสินค้า</p>
      <p className="text-gray-600 text-sm mb-4">สินค้านี้ยังไม่มีในฐานข้อมูล</p>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Barcode:</p>
            <code className="text-sm font-mono text-gray-800">{barcode}</code>
          </div>
          <button
            onClick={onCopyBarcode}
            className="text-gray-500 hover:text-gray-700 p-1"
            title={copied ? "คัดลอกแล้ว" : "คัดลอกบาร์โค้ด"}
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  </div>
);
