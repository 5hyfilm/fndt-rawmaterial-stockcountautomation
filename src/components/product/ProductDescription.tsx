// src/components/product/ProductDescription.tsx
"use client";

import React from "react";
import { Info } from "lucide-react";
import { Product } from "../../types/product";

interface ProductDescriptionProps {
  product: Product;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product,
}) => {
  if (!product.description) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={16} className="text-blue-500" />
        <span className="text-sm font-medium text-blue-800">รายละเอียด</span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        {product.description}
      </p>
    </div>
  );
};
