// src/components/product/ProductHeader.tsx
"use client";

import React from "react";
import { Package } from "lucide-react";
import { Product } from "../../types/product";
import { getCategoryIcon, getCategoryColor } from "./utils";

interface ProductHeaderProps {
  product: Product;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  return (
    <div className="bg-gradient-to-r from-fn-green to-fn-red/80 text-white p-4 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
          <Package size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg lg:text-xl font-bold mb-1 leading-tight">
            {product.name}
          </h3>
          {product.name_en && (
            <p className="text-white/80 text-sm">{product.name_en}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(
                product.category
              )}`}
            >
              {getCategoryIcon(product.category)}
              {product.category}
            </span>
            <span className="text-white/90 text-sm font-medium">
              {product.brand}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
