// ./src/components/product/ProductBasicInfo.tsx
"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { Product } from "../../types/product";
import { formatPrice } from "./utils";

// interface ExtendedProduct extends Product {
//   packSizeInfo?: {
//     displayText: string;
//     count?: number;
//   };
//   packSize?: number;
// }

interface ProductBasicInfoProps {
  product: Product;
  currentInventoryQuantity: number;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  product,
  // currentInventoryQuantity,
}) => {
  // const extendedProduct = product as ExtendedProduct;

  // const getSizeDisplay = (): string | null => {
  //   if (extendedProduct.packSizeInfo?.displayText) {
  //     return extendedProduct.packSizeInfo.displayText;
  //   }

  //   if (extendedProduct.packSize && extendedProduct.packSize > 1) {
  //     return `${extendedProduct.packSize} ชิ้น/แพ็ค`;
  //   }

  //   if (product.size && product.unit) {
  //     return `${product.size} ${product.unit}`;
  //   }

  //   if (product.size) {
  //     return product.size;
  //   }

  //   return null;
  // };

  // const sizeDisplay = getSizeDisplay();

  return (
    <div className="space-y-4">
      {/* Size and Stock Info - COMMENTED OUT (ไม่ใช้แล้วแต่เก็บไว้)
      <div className="grid grid-cols-2 gap-4">
        {sizeDisplay && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Weight size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">ขนาดสินค้า</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {sizeDisplay}
            </p>
          </div>
        )}

        <div
          className={`bg-gray-50 rounded-lg p-3 ${
            !sizeDisplay ? "col-span-2" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Archive size={16} className="text-purple-500" />
            <span className="text-sm text-gray-600">ใน Stock</span>
          </div>
          <p
            className={`font-semibold ${
              currentInventoryQuantity > 0 ? "text-green-600" : "text-gray-500"
            }`}
          >
            {formatQuantity(currentInventoryQuantity, "units")}
          </p>
        </div>
      </div>
      */}

      {/* Price Info */}
      {product.price && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-green-500" />
            <span className="text-sm text-green-700">ราคา</span>
          </div>
          <p className="font-semibold text-green-600 text-lg">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      )}
    </div>
  );
};
