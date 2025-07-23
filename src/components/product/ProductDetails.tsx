// src/components/product/ProductDetails.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { Product } from "../../types/product";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Check if there are any details to show
  const hasDetails =
    product.sku ||
    product.country_of_origin ||
    product.storage_instructions ||
    (product.ingredients && product.ingredients.length > 0) ||
    (product.allergens && product.allergens.length > 0);

  if (!hasDetails) return null;

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          ข้อมูลเพิ่มเติม
        </span>
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-3 border-t pt-4">
          {product.sku && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">F/FG:</span>
              <span className="text-sm font-mono">{product.sku}</span>
            </div>
          )}

          {product.country_of_origin && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={12} />
                ประเทศต้นกำเนิด:
              </span>
              <span className="text-sm">{product.country_of_origin}</span>
            </div>
          )}

          {product.storage_instructions && (
            <div>
              <span className="text-sm text-gray-600 block mb-1">
                วิธีเก็บรักษา:
              </span>
              <p className="text-sm text-gray-800 bg-amber-50 p-2 rounded border border-amber-200">
                {product.storage_instructions}
              </p>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <span className="text-sm text-gray-600 block mb-1">
                ส่วนประกอบ:
              </span>
              <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}

          {product.allergens && product.allergens.length > 0 && (
            <div>
              <span className="text-sm text-gray-600 block mb-1">
                สารก่อภูมิแพ้:
              </span>
              <p className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                {product.allergens.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
