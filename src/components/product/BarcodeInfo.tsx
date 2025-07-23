// src/components/product/BarcodeInfo.tsx
"use client";

import React, { useState } from "react";
import { Scan, Copy, CheckCircle } from "lucide-react";
import { Product } from "../../types/product";

interface BarcodeInfoProps {
  product: Product;
  scannedBarcode?: string;
}

export const BarcodeInfo: React.FC<BarcodeInfoProps> = ({
  product,
  scannedBarcode,
}) => {
  const [copied, setCopied] = useState(false);

  const copyBarcode = async () => {
    const codeToCopy = scannedBarcode || product.barcode;
    if (!codeToCopy) return;

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy barcode:", err);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">Barcode</span>
        </div>
        <button
          onClick={copyBarcode}
          className="text-gray-500 hover:text-gray-700 p-1 rounded"
        >
          {copied ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      <code className="text-sm font-mono text-gray-800 block mt-1">
        {product.barcode}
      </code>
      {product.barcode_type && (
        <span className="text-xs text-gray-500">({product.barcode_type})</span>
      )}

      {/* Show scanned barcode info if different */}
      {scannedBarcode && scannedBarcode !== product.barcode && (
        <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
          📦 บาร์โค้ดที่สแกน: {scannedBarcode}
        </div>
      )}
    </div>
  );
};
