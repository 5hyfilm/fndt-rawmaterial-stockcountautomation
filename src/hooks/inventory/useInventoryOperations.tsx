// Path: src/hooks/inventory/useInventoryOperations.tsx - Cleaned Version (No Legacy Code)
"use client";

import { useCallback } from "react";
import { Product } from "../../types/product";
import {
  InventoryItem,
  QuantityInput,
  QuantityDetail,
  MultiUnitQuantities,
  getTotalQuantityAllUnits,
  isQuantityDetail,
} from "../../types/inventory";

interface UseInventoryOperationsProps {
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
  saveInventory: (inventory: InventoryItem[]) => boolean;
  setError: (error: string | null) => void;
}

export const useInventoryOperations = ({
  inventory,
  setInventory,
  saveInventory,
  setError,
}: UseInventoryOperationsProps) => {
  // ✅ Generate unique material code for new products
  const generateMaterialCode = useCallback((product: Product): string => {
    return product.name || product.barcode || `MAT_${Date.now()}`;
  }, []);

  // ✅ Find item by material code (หลัก)
  const findItemByMaterialCode = useCallback(
    (materialCode: string): InventoryItem | undefined => {
      return inventory.find((item) => item.materialCode === materialCode);
    },
    [inventory]
  );

  // ✅ Find item by barcode (รองรับ multi-barcode)
  const findItemByBarcode = useCallback(
    (barcode: string): InventoryItem | undefined => {
      return inventory.find(
        (item) =>
          item.barcode === barcode ||
          item.scannedBarcodes?.cs === barcode ||
          item.scannedBarcodes?.dsp === barcode ||
          item.scannedBarcodes?.ea === barcode
      );
    },
    [inventory]
  );

  // ✅ Add or update multi-unit item with QuantityDetail support
  const addOrUpdateMultiUnitItem = useCallback(
    (
      product: Product,
      quantityInput: QuantityInput,
      barcodeType: "cs" | "dsp" | "ea",
      directProductGroup?: string
    ): boolean => {
      try {
        setError(null);

        // ✅ Parse quantity input with QuantityDetail support
        let quantities: MultiUnitQuantities = {};

        if (typeof quantityInput === "number") {
          // Simple number input
          quantities[barcodeType] = quantityInput;
          console.log(
            "📝 Simple quantity input:",
            quantityInput,
            "for",
            barcodeType
          );
        } else if ("quantity" in quantityInput && "unit" in quantityInput) {
          // Unit-specific input: { quantity: number, unit: string }
          const unitInput = quantityInput as {
            quantity: number;
            unit: "cs" | "dsp" | "ea";
          };
          quantities[unitInput.unit] = unitInput.quantity;
          console.log("📝 Unit-specific input:", unitInput);

          // ตรวจสอบว่า unit ตรงกับ barcodeType หรือไม่
          if (unitInput.unit !== barcodeType) {
            console.warn(
              `Unit mismatch: input=${unitInput.unit}, barcode=${barcodeType}`
            );
          }
        } else if (isQuantityDetail(quantityInput)) {
          // ✅ QuantityDetail input - รองรับครบ 3 หน่วย
          const quantityDetail = quantityInput as QuantityDetail;
          quantities = {
            cs: quantityDetail.cs,
            dsp: quantityDetail.dsp,
            ea: quantityDetail.ea,
          };
          // ลบหน่วยที่เป็น 0 ออก
          if (quantities.cs === 0) delete quantities.cs;
          if (quantities.dsp === 0) delete quantities.dsp;
          if (quantities.ea === 0) delete quantities.ea;

          console.log("📝 QuantityDetail input (3-unit):", quantities);
        } else {
          console.error("❌ Invalid quantityInput format:", quantityInput);
          setError("รูปแบบข้อมูลจำนวนไม่ถูกต้อง");
          return false;
        }

        // ✅ Validate quantities
        const totalQuantity = Object.values(quantities).reduce(
          (sum, qty) => sum + (qty || 0),
          0
        );
        if (totalQuantity <= 0) {
          setError("จำนวนสินค้าต้องมากกว่า 0");
          return false;
        }

        // Generate or get material code
        const materialCode = generateMaterialCode(product);

        console.log(
          "🔍 Looking for existing item with materialCode:",
          materialCode
        );
        console.log("📦 New quantities to add:", quantities);

        // ✅ Check if item already exists
        const existingItemIndex = inventory.findIndex(
          (item) => item.materialCode === materialCode
        );

        if (existingItemIndex !== -1) {
          // ✅ Update existing item
          const existingItem = inventory[existingItemIndex];
          console.log("📝 Updating existing item:", existingItem.productName);

          const updatedQuantities: MultiUnitQuantities = {
            cs: (existingItem.quantities.cs || 0) + (quantities.cs || 0),
            dsp: (existingItem.quantities.dsp || 0) + (quantities.dsp || 0),
            ea: (existingItem.quantities.ea || 0) + (quantities.ea || 0),
          };

          // Remove zero quantities
          if (updatedQuantities.cs === 0) delete updatedQuantities.cs;
          if (updatedQuantities.dsp === 0) delete updatedQuantities.dsp;
          if (updatedQuantities.ea === 0) delete updatedQuantities.ea;

          const updatedItem: InventoryItem = {
            ...existingItem,
            quantities: updatedQuantities,
            quantity: getTotalQuantityAllUnits({
              ...existingItem,
              quantities: updatedQuantities,
            }),
            lastUpdated: new Date().toISOString(),
            scannedBarcodes: {
              ...existingItem.scannedBarcodes,
              [barcodeType]: product.barcode,
            },
          };

          const newInventory = [...inventory];
          newInventory[existingItemIndex] = updatedItem;
          setInventory(newInventory);
          saveInventory(newInventory);

          console.log("✅ Updated item:", updatedItem.productName);
          return true;
        } else {
          // ✅ Add new item
          const newItem: InventoryItem = {
            id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            materialCode,
            productName: product.name || `Product ${product.barcode}`,
            brand: product.brand || "Unknown",
            category: product.category || "Unknown",
            size: product.size || "",
            unit: product.unit || "EA",
            barcode: product.barcode,
            quantities,
            quantity: getTotalQuantityAllUnits({ quantities } as InventoryItem),
            lastUpdated: new Date().toISOString(),
            productData: product,
            productGroup: directProductGroup || "",
            thaiDescription: product.description || "",
            scannedBarcodes: {
              [barcodeType]: product.barcode,
            },
          };

          const newInventory = [...inventory, newItem];
          setInventory(newInventory);
          saveInventory(newInventory);

          console.log("✅ Added new item:", newItem.productName);
          return true;
        }
      } catch (error) {
        console.error("❌ Error in addOrUpdateMultiUnitItem:", error);
        setError("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
        return false;
      }
    },
    [inventory, setInventory, saveInventory, setError, generateMaterialCode]
  );

  // ✅ Update specific unit quantity
  const updateUnitQuantity = useCallback(
    (
      materialCode: string,
      unit: "cs" | "dsp" | "ea",
      newQuantity: number
    ): boolean => {
      try {
        setError(null);

        if (newQuantity < 0) {
          setError("จำนวนสินค้าต้องไม่ติดลบ");
          return false;
        }

        const itemIndex = inventory.findIndex(
          (item) => item.materialCode === materialCode
        );

        if (itemIndex === -1) {
          setError("ไม่พบรายการสินค้าที่ต้องการแก้ไข");
          return false;
        }

        const item = inventory[itemIndex];
        const updatedQuantities = { ...item.quantities };

        if (newQuantity === 0) {
          delete updatedQuantities[unit];
        } else {
          updatedQuantities[unit] = newQuantity;
        }

        const updatedItem: InventoryItem = {
          ...item,
          quantities: updatedQuantities,
          quantity: getTotalQuantityAllUnits({
            ...item,
            quantities: updatedQuantities,
          }),
          lastUpdated: new Date().toISOString(),
        };

        const newInventory = [...inventory];
        newInventory[itemIndex] = updatedItem;
        setInventory(newInventory);
        saveInventory(newInventory);

        console.log(`✅ Updated ${unit} quantity for:`, item.productName);
        return true;
      } catch (error) {
        console.error("❌ Error updating unit quantity:", error);
        setError("เกิดข้อผิดพลาดในการแก้ไขจำนวนสินค้า");
        return false;
      }
    },
    [inventory, setInventory, saveInventory, setError]
  );

  // ✅ Update item quantity detail
  const updateItemQuantityDetail = useCallback(
    (materialCode: string, quantityDetail: QuantityDetail): boolean => {
      try {
        setError(null);

        const itemIndex = inventory.findIndex(
          (item) => item.materialCode === materialCode
        );

        if (itemIndex === -1) {
          setError("ไม่พบรายการสินค้าที่ต้องการแก้ไข");
          return false;
        }

        const item = inventory[itemIndex];
        const updatedQuantities: MultiUnitQuantities = {
          cs: quantityDetail.cs || 0,
          dsp: quantityDetail.dsp || 0,
          ea: quantityDetail.ea || 0,
        };

        // Remove zero quantities
        if (updatedQuantities.cs === 0) delete updatedQuantities.cs;
        if (updatedQuantities.dsp === 0) delete updatedQuantities.dsp;
        if (updatedQuantities.ea === 0) delete updatedQuantities.ea;

        const updatedItem: InventoryItem = {
          ...item,
          quantities: updatedQuantities,
          quantityDetail: {
            ...quantityDetail,
            lastModified: new Date().toISOString(),
          },
          quantity: getTotalQuantityAllUnits({
            ...item,
            quantities: updatedQuantities,
          }),
          lastUpdated: new Date().toISOString(),
        };

        const newInventory = [...inventory];
        newInventory[itemIndex] = updatedItem;
        setInventory(newInventory);
        saveInventory(newInventory);

        console.log("✅ Updated quantity detail for:", item.productName);
        return true;
      } catch (error) {
        console.error("❌ Error updating quantity detail:", error);
        setError("เกิดข้อผิดพลาดในการแก้ไขรายละเอียดจำนวนสินค้า");
        return false;
      }
    },
    [inventory, setInventory, saveInventory, setError]
  );

  // ✅ Remove item from inventory
  const removeItem = useCallback(
    (itemId: string): boolean => {
      try {
        setError(null);

        const newInventory = inventory.filter((item) => item.id !== itemId);
        setInventory(newInventory);
        saveInventory(newInventory);

        console.log("✅ Removed item:", itemId);
        return true;
      } catch (error) {
        console.error("❌ Error removing item:", error);
        setError("เกิดข้อผิดพลาดในการลบรายการสินค้า");
        return false;
      }
    },
    [inventory, setInventory, saveInventory, setError]
  );

  // ✅ Search items
  const searchItems = useCallback(
    (searchTerm: string): InventoryItem[] => {
      if (!searchTerm.trim()) return inventory;

      const term = searchTerm.toLowerCase().trim();
      return inventory.filter(
        (item) =>
          item.productName.toLowerCase().includes(term) ||
          item.materialCode.toLowerCase().includes(term) ||
          item.brand.toLowerCase().includes(term) ||
          item.barcode.includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    },
    [inventory]
  );

  return {
    // Core operations
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    updateItemQuantityDetail,
    removeItem,
    searchItems,

    // Finder methods
    findItemByMaterialCode,
    findItemByBarcode,

    // Utilities
    generateMaterialCode,
  };
};
